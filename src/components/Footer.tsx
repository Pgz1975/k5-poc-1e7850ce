import { BookOpen, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">FluenxIA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(
                "Plataforma de fluidez bilingüe impulsada por inteligencia artificial.",
                "Bilingual fluency platform powered by artificial intelligence."
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("Enlaces Rápidos", "Quick Links")}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#students" className="text-muted-foreground hover:text-primary transition-colors">{t("Estudiantes", "Students")}</a></li>
              <li><a href="#teachers" className="text-muted-foreground hover:text-primary transition-colors">{t("Maestros", "Teachers")}</a></li>
              <li><a href="#families" className="text-muted-foreground hover:text-primary transition-colors">{t("Familias", "Families")}</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">{t("Recursos", "Resources")}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("Ayuda", "Help")}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("Privacidad", "Privacy")}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t("Términos", "Terms")}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t("Contacto", "Contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>soporte@fluenxia.com</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>1-800-EDU-PRDE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} {t(
              "Departamento de Educación de Puerto Rico. Todos los derechos reservados.",
              "Puerto Rico Department of Education. All rights reserved."
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};
