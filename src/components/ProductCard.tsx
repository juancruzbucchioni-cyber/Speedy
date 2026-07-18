import { ShoppingCart } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatProductPrice } from '../lib/currency';
import { useCartStore } from '../store/cartStore';
import { CartState } from '../types/cart';
import { Product } from '../types/supabase';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const cartItems = useCartStore((state: CartState) => state.items);
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const isOnRequest = product.price <= 0;

  useEffect(() => {
    const cartItem = cartItems.find((item: { product_id: string }) => item.product_id === product.id);
    setIsInCart(Boolean(cartItem));
  }, [cartItems, product.id]);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOnRequest) {
      const message = `Hola Speedy Repuestos, quiero consultar por ${product.name}. Modelo de moto: _____.`;
      window.open(`https://wa.me/5403534099785?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    const existingItem = cartItems.find((item: { product_id: string }) => item.product_id === product.id);
    if (existingItem) {
      useCartStore.getState().updateQuantity(existingItem.id, existingItem.quantity + 1);
      return;
    }

    onAddToCart(product);
  };

  const openProductDetail = () => {
    navigate(`/products/${product.id}`);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductDetail();
    }
  };

  return (
    <div
      onClick={openProductDetail}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`Ver detalle de ${product.name}`}
      className="product-sale-card group flex h-full cursor-pointer flex-col will-change-transform"
    >
      <div className="relative overflow-hidden rounded-t-[28px] bg-zinc-900">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-52 w-full object-contain p-3 transition-transform duration-500 ease-in-out group-hover:scale-105 sm:h-56 sm:p-4 lg:h-64"
          loading="lazy"
          decoding="async"
        />
        {!isOnRequest && product.stock <= 5 && product.stock > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-red-950 px-3 py-2 text-xs font-black uppercase text-red-100">
            Quedan {product.stock}
          </div>
        )}
        {!isOnRequest && product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white">
              Sin stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col border-t border-white/15 p-4 text-center sm:p-5">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-300">
          {product.category}
        </p>
        <h3 className="min-h-12 text-lg font-bold leading-tight text-white sm:min-h-14 sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-3 line-clamp-2 flex-grow text-sm text-gray-300">
          {product.description}
        </p>
        <div className="mt-4">
          <p className="break-words text-2xl font-black leading-none text-white sm:text-3xl">
            {formatProductPrice(Math.round(product.price))}
          </p>
        </div>
        <div className="mt-auto pt-5">
          <button
            onClick={handleAddToCart}
            disabled={!isOnRequest && product.stock === 0}
            className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-black uppercase transition-all duration-300 active:scale-95 sm:py-3 ${
              product.stock > 0 || isOnRequest
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'cursor-not-allowed bg-gray-500/60 text-gray-300'
            }`}
            aria-label={isOnRequest ? 'Consultar por WhatsApp' : product.stock > 0 ? (isInCart ? 'Actualizar carrito' : 'Agregar al carrito') : 'Sin stock'}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>{isOnRequest ? 'Consultar por WhatsApp' : product.stock > 0 ? (isInCart ? 'Listo' : 'Agregar al carrito') : 'Sin stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
