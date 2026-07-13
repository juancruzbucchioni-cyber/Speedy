import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/speedyrepuestos/';
const WHATSAPP_URL = 'https://wa.me/5403534099785?text=Hola%20Speedy%20Repuestos%2C%20quiero%20hacer%20una%20consulta.';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black pt-12 pb-6 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="font-brand text-2xl font-black">SPEEDY REPUESTOS</p>
            <p className="mt-3 max-w-sm text-sm text-gray-200">
              Envios a todo el pais. Repuestos, accesorios y soluciones para motos.
            </p>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold text-white hover:text-gray-300 transition-colors">
              <Instagram className="h-5 w-5" />
              @speedyrepuestos
            </a>
          </div>

          <div>
            <h3 className="font-brand mb-4 text-lg font-semibold text-white">Categorías</h3>
            <ul className="space-y-2 text-gray-200">
              <li><Link to="/products?category=Repuestos" className="hover:text-white hover:underline">Repuestos</Link></li>
              <li><Link to="/products?category=Accesorios" className="hover:text-white hover:underline">Accesorios</Link></li>
              <li><Link to="/products?category=Cascos%20e%20indumentaria" className="hover:text-white hover:underline">Cascos e indumentaria</Link></li>
              <li><Link to="/products?category=Cubiertas%20y%20c%C3%A1maras" className="hover:text-white hover:underline">Cubiertas y cámaras</Link></li>
              <li><Link to="/products?category=Aceites%20y%20lubricantes" className="hover:text-white hover:underline">Aceites y lubricantes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-brand mb-4 text-lg font-semibold text-white">Contacto</h3>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start"><MapPin className="mr-2 mt-0.5 h-5 w-5 text-white" /><span>Envios a todo el pais</span></li>
              <li className="flex items-center"><Phone className="mr-2 h-5 w-5 text-white" /><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">Contacto por WhatsApp</a></li>
              <li className="flex items-center"><Instagram className="mr-2 h-5 w-5 text-white" /><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-white hover:underline">@speedyrepuestos</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-white/10 pt-6 md:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-200 md:justify-start">
            <span>© {new Date().getFullYear()} Speedy Repuestos. Todos los derechos reservados.</span>
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-200 hover:text-white hover:underline">Privacidad</Link>
            <Link to="/terms" className="text-sm text-gray-200 hover:text-white hover:underline">Términos</Link>
            <Link to="/sitemap" className="text-sm text-gray-200 hover:text-white hover:underline">Mapa del sitio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
