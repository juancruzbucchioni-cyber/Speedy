import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const INSTAGRAM_URL = 'https://www.instagram.com/juan.bucchioni';
const WHATSAPP_URL = 'https://wa.me/5493534128474?text=Hola%20Kazuty%20Parts%2C%20quiero%20consultar%20por%20productos.';

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuthStore();
  const displayName = profile?.username || user?.email?.split('@')[0] || 'Mi cuenta';
  const isAdminPanel = location.pathname === '/kazuty-control-8474';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 90);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-red-950/80 bg-black text-white shadow-[0_8px_28px_rgba(127,29,29,0.24)]">
      <div className={`mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 transition-all duration-300 lg:flex-row lg:items-center lg:justify-between ${isScrolled ? 'py-2' : 'py-3'}`}>
        <Link to="/" className="flex items-center" aria-label="Volver al inicio de Kazuty Parts">
          <img
            src="/branding/kazuty-logo.png"
            alt="Kazuty Parts"
            className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-12 md:h-14' : 'h-14 md:h-16'}`}
          />
        </Link>

        {!isAdminPanel && (
          <div className="order-3 flex flex-wrap items-center justify-center rounded-full border border-red-800/80 bg-zinc-950 px-5 py-2 text-xs font-bold text-white shadow-[0_0_18px_rgba(127,29,29,0.22)] md:order-none md:px-7 md:text-sm">
            <Link to="/" className="min-w-16 px-2 text-center transition-colors hover:text-red-400">Inicio</Link>
            <span className="text-red-900/80">|</span>
            <Link to="/offers" className="min-w-16 px-2 text-center transition-colors hover:text-red-400">Ofertas</Link>
            <span className="text-red-900/80">|</span>
            <Link to="/products" className="min-w-20 px-2 text-center transition-colors hover:text-red-400">Productos</Link>
            <span className="text-red-900/80">|</span>
            <Link to="/products" className="min-w-20 px-2 text-center transition-colors hover:text-red-400">Tendencia</Link>
            <span className="text-red-900/80">|</span>
            <Link to="/categories" className="min-w-20 px-2 text-center transition-colors hover:text-red-400">Categorias</Link>
            <span className="text-red-900/80">|</span>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="min-w-20 px-2 text-center transition-colors hover:text-red-400">Instagram</a>
            <span className="text-red-900/80">|</span>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="min-w-20 px-2 text-center transition-colors hover:text-red-400">Contacto</a>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 lg:justify-end">
          <form onSubmit={handleSearch} className="w-full min-w-[180px] max-w-[260px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar productos"
                className="h-11 w-full rounded-full border border-red-800/70 bg-zinc-950 px-5 pr-11 text-sm font-bold text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button type="submit" aria-label="Buscar productos" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-red-400">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {!isScrolled && user ? (
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hidden min-w-20 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-white transition-colors hover:bg-red-950/50 hover:text-red-300 md:flex">
                <User className="h-6 w-6" />
                <span>{displayName}</span>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-md border border-white/15 bg-black py-1 text-white shadow-lg">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-red-950/50" onClick={() => setIsMenuOpen(false)}>
                    Perfil
                  </Link>
                  <button onClick={handleSignOut} className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-red-950/50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : !isScrolled ? (
            <Link to="/auth" className="hidden min-w-20 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-white transition-colors hover:bg-red-950/50 hover:text-red-300 md:flex">
              <User className="h-6 w-6" />
              <span>Mi cuenta</span>
            </Link>
          ) : null}
          <Link to="/cart" className="relative flex min-w-20 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-white transition-colors hover:bg-red-950/50 hover:text-red-300">
            <ShoppingCart className={`${isScrolled ? 'h-6 w-6' : 'h-7 w-7'}`} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-black text-white">
                {itemCount}
              </span>
            )}
            <span>Mi carrito</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
