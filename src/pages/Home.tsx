import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Product, Testimonial } from '../types/supabase';
import ProductCard from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';

const DEFAULT_REVIEW_AVATAR = '/branding/avatar-placeholder.svg';

type ClientReview = {
  nombre: string;
  mensaje: string;
  foto: string;
};

export default function Home() {
  const [clientReviews, setClientReviews] = useState<ClientReview[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadReviews() {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('activo', true)
          .order('orden', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const normalized = (data as Testimonial[]).map((item) => ({
            nombre: item.nombre,
            mensaje: item.mensaje,
            foto: item.foto_url || DEFAULT_REVIEW_AVATAR,
          }));
          setClientReviews(normalized);
          return;
        }
      }

      try {
        const response = await fetch('/testimonials.json');
        if (!response.ok) throw new Error('No se pudo cargar testimonials.json');
        const data = await response.json();
        if (Array.isArray(data)) {
          setClientReviews(data);
          return;
        }
      } catch (error) {
        console.error('Error cargando reseñas de clientes:', error);
      }

      setClientReviews([
        {
          nombre: 'Cliente Speedy Repuestos',
          mensaje: 'Excelente atencion, me ayudaron a elegir justo lo que necesitaba.',
          foto: DEFAULT_REVIEW_AVATAR,
        },
      ]);
    }

    loadReviews();
  }, []);

  useEffect(() => {
    async function loadCatalog() {
      if (!isSupabaseConfigured) return;

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!productsError && productsData) {
        setAllProducts(productsData as Product[]);
      }

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name')
        .order('orden', { ascending: true })
        .order('created_at', { ascending: false });

      if (!categoriesError && categoriesData) {
        setAllCategories(categoriesData.map((c: { name: string }) => c.name));
      }
    }

    loadCatalog();
  }, []);

  const groupedProducts = useMemo(() => {
    const group = new Map<string, Product[]>();
    allProducts.forEach((product) => {
      const list = group.get(product.category) || [];
      list.push(product);
      group.set(product.category, list);
    });

    const orderedCategories = allCategories.length > 0
      ? allCategories
      : Array.from(group.keys());

    return orderedCategories
      .map((category) => ({
        category,
        products: [...(group.get(category) || [])].sort((a, b) =>
          a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        ),
      }))
      .filter((block) => block.products.length > 0);
  }, [allProducts, allCategories]);

  const categoriesWithProducts = groupedProducts.map((block) => block.category);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="relative overflow-hidden rounded-md border border-red-900/70 bg-black shadow-[0_0_36px_rgba(127,29,29,0.24)]">
        <div className="p-4 md:p-6">
          <div className="mb-4 rounded-2xl border border-red-600/80 bg-gradient-to-r from-red-950 via-red-700 to-red-600 px-4 py-3 text-center shadow-[0_0_28px_rgba(220,38,38,0.35)] md:px-6 md:py-4">
            <p className="text-lg font-black uppercase tracking-[0.28em] text-white md:text-2xl">
              Envios a todo el pais
            </p>
          </div>

          <Link
            to="/products"
            className="block overflow-hidden rounded-3xl border border-red-900/70 bg-zinc-950"
            aria-label="Ver productos Speedy Repuestos"
          >
            <img
              src="/branding/speedy-logo-final.png"
              alt="Speedy Repuestos para motos"
              className="h-[260px] w-full object-contain bg-black p-4 md:h-[420px] lg:h-[520px]"
            />
          </Link>

          <div className="mt-8 overflow-hidden">
            <div className="reviews-ticker-track flex items-center py-2">
              {[...clientReviews, ...clientReviews].map((review, index) => (
                <article
                  key={`${review.nombre}-${index}`}
                  className="review-ribbon-card mx-3 flex min-h-24 w-64 shrink-0 items-center justify-center px-5 py-4 text-center md:w-72"
                >
                  <div>
                    <p className="text-sm font-black uppercase text-white">{review.nombre}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-semibold text-white/90">{review.mensaje}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <FeaturedProducts />
      </div>

      <div className="mt-16 w-full">
        <h2 className="font-brand mb-8 text-3xl font-bold text-white">Todas las categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(categoriesWithProducts.length > 0
            ? categoriesWithProducts
            : ['Accesorios', 'Escapes', 'Plasticos', 'Transmision', 'Electronica', 'Frenos', 'Iluminacion', 'Indumentaria']
          ).map((categoria) => (
            <Link
              key={categoria}
              to={`/products?category=${encodeURIComponent(categoria)}`}
              className="font-brand rounded-md border border-red-900/60 bg-zinc-950 px-4 py-3 text-center font-semibold text-white transition-colors hover:border-red-500 hover:bg-red-950 hover:text-red-100"
            >
              {categoria}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full">
        <h2 className="font-brand mb-8 text-3xl font-bold text-white">Productos por categoria</h2>
        <div className="space-y-10">
          {groupedProducts.map((block) => (
            <div key={block.category}>
              <h3 className="font-brand mb-4 text-xl text-white md:text-2xl">{block.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {block.products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="block h-full"
                  >
                    <ProductCard product={product} onAddToCart={addItem} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 w-full">
        <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-zinc-950 p-6 text-center shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-red-300">Envios a todo el pais</p>
          <p className="mt-3 text-2xl font-black tracking-wide text-white">Contacto por WhatsApp</p>
          <p className="mt-3 text-gray-200">@speedyrepuestos</p>
          <p className="mt-2 text-gray-300">Seguinos para novedades, ingresos y promos.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.instagram.com/speedyrepuestos/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-red-800/70 px-6 py-3 font-bold text-white transition-colors hover:bg-red-950/60 hover:text-red-100"
            >
              Ir a Instagram
            </a>
            <a
              href="https://wa.me/5403534099785?text=Hola%20Speedy%20Repuestos%2C%20quiero%20hacer%20una%20consulta."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700"
            >
              Enviar mensaje directo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
