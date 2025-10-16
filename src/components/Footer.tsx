import { BookOpen, Mail, Phone } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">LecturaPR</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Plataforma educativa bilingüe para el desarrollo de la lectura.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#students" className="text-muted-foreground hover:text-primary transition-colors">Estudiantes</a></li>
              <li><a href="#teachers" className="text-muted-foreground hover:text-primary transition-colors">Maestros</a></li>
              <li><a href="#families" className="text-muted-foreground hover:text-primary transition-colors">Familias</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Ayuda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacidad</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Términos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>soporte@lecturapr.edu</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1-800-EDU-PRDE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} Departamento de Educación de Puerto Rico. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
