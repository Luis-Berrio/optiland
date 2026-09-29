import { Link } from 'react-router-dom';
import { Package, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-16">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-lg text-primary">
            <Package className="h-5 w-5" />
            <span>Optiland</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Tu óptica de confianza. Encontramos la mejor solución para tu visión y estilo.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Productos</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/productos?categoriaId=1" className="hover:text-primary">Armazones</Link></li>
            <li><Link to="/productos?categoriaId=2" className="hover:text-primary">Lentes de Sol</Link></li>
            <li><Link to="/productos?categoriaId=3" className="hover:text-primary">Lentes de Contacto</Link></li>
            <li><Link to="/productos?categoriaId=4" className="hover:text-primary">Accesorios</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Mi cuenta</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login"       className="hover:text-primary">Ingresar</Link></li>
            <li><Link to="/registro"    className="hover:text-primary">Registrarse</Link></li>
            <li><Link to="/mis-pedidos" className="hover:text-primary">Mis pedidos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Bogotá, Colombia</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +57 300 000 0000</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@optiland.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Optiland. Todos los derechos reservados.
      </div>
    </footer>
  );
}
