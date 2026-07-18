import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '../types/supabase';
import { supabase } from '../lib/supabase';

interface ProductGalleryProps {
  productId: string;
  mainImage: string;
  selectedColor?: string;
}

function normalizeColor(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function extractImageUrl(value: string) {
  return value.match(/(https?:\/\/\S+|\/\S+)/i)?.[1]?.trim() || '';
}

export default function ProductGallery({ productId, mainImage, selectedColor }: ProductGalleryProps) {
  const cleanMainImage = extractImageUrl(mainImage);
  const [images, setImages] = useState<string[]>([]);
  const [imageRows, setImageRows] = useState<ProductImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string>(cleanMainImage);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchProductImages() {
      setLoading(true);

      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('is_primary', { ascending: false })
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching product images:', error);
        setImageRows([]);
        setImages(cleanMainImage ? [cleanMainImage] : []);
        setCurrentIndex(0);
        setCurrentImage(cleanMainImage);
      } else if (data && data.length > 0) {
        const rows = (data as ProductImage[])
          .map((image) => ({ ...image, image_url: extractImageUrl(image.image_url) }))
          .filter((image) => image.image_url);
        const imageUrls = rows.map((img) => img.image_url);
        const mergedImages = imageUrls.includes(cleanMainImage) || !cleanMainImage
          ? imageUrls
          : [cleanMainImage, ...imageUrls];
        setImageRows(rows);
        setImages(mergedImages);
        setCurrentIndex(0);
        setCurrentImage(mergedImages[0] || cleanMainImage);
      } else {
        setImageRows([]);
        setImages(cleanMainImage ? [cleanMainImage] : []);
        setCurrentIndex(0);
        setCurrentImage(cleanMainImage);
      }

      setLoading(false);
    }

    if (productId) {
      fetchProductImages();
    } else {
      setImageRows([]);
      setImages(cleanMainImage ? [cleanMainImage] : []);
      setCurrentIndex(0);
      setCurrentImage(cleanMainImage);
      setLoading(false);
    }
  }, [productId, cleanMainImage]);

  useEffect(() => {
    if (!selectedColor || imageRows.length === 0) return;

    const selected = normalizeColor(selectedColor);
    const matchingImage = imageRows.find((image) => image.color && normalizeColor(image.color) === selected);

    if (!matchingImage) return;

    const index = images.findIndex((image) => image === matchingImage.image_url);
    if (index === -1) return;

    setCurrentIndex(index);
    setCurrentImage(images[index]);
  }, [selectedColor, imageRows, images]);

  useEffect(() => {
    const handleKeyNavigation = (event: KeyboardEvent) => {
      if (images.length <= 1) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const newIndex = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(newIndex);
        setCurrentImage(images[newIndex]);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const newIndex = (currentIndex + 1) % images.length;
        setCurrentIndex(newIndex);
        setCurrentImage(images[newIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [images, currentIndex]);

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setCurrentImage(images[index]);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 sm:h-80 md:h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <img
          src={currentImage}
          alt="Producto"
          className="h-64 w-full object-contain sm:h-80 md:h-96"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex max-w-full justify-start gap-2 overflow-x-auto p-2 sm:mt-4 sm:justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 transition-all sm:h-16 sm:w-16 ${
                currentIndex === index
                  ? 'border-primary scale-110'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
