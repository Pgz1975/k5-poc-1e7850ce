import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X, LogOut, User, Sparkles, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setAvatarUrl(profileData.avatar_url);
      }

      // Fetch role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleData) {
        setUserRole(roleData.role);
      }
    };

    fetchUserData();
  }, [user]);

  // Role-based navigation
  const getNavItems = (): NavItem[] => {
    const homeItem: NavItem = { label: t("Inicio", "Home"), href: "/" };
    
    if (userRole === "student") {
      return [
        homeItem,
        { label: t("Mi Panel", "My Dashboard"), href: "/student-dashboard", icon: GraduationCap },
        { label: t("Actividades", "Activities"), href: "/activities", icon: Sparkles },
      ];
    }
    
    // Teacher and family only see home
    if (userRole === "teacher" || userRole === "family") {
      return [homeItem];
    }
    
    // Default for non-authenticated users
    return [
      homeItem,
      { label: t("Estudiantes", "Students"), href: "#students" },
      { label: t("Maestros", "Teachers"), href: "#teachers" },
      { label: t("Familias", "Families"), href: "#families" },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-soft">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl bg-gradient-hero bg-clip-text text-transparent">
            LecturaPR
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isInternalLink = item.href.startsWith('/') && !item.href.startsWith('/#');
            
            return isInternalLink ? (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors flex items-center gap-2"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-gradient-hero text-white text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || t("Usuario", "User")}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {t("Mi Perfil", "My Profile")}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("Salir", "Sign Out")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" className="hidden md:flex" asChild>
              <a href="/auth">
                {t("Ingresar", "Sign In")}
              </a>
            </Button>
          )}
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card/95 backdrop-blur">
          <nav className="container flex flex-col gap-4 py-4 px-4">
            {navItems.map((item) => {
              const isInternalLink = item.href.startsWith('/') && !item.href.startsWith('/#');
              
              return isInternalLink ? (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2 flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
            {user && (
              <a
                href="/profile"
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                {t("Mi Perfil", "My Profile")}
              </a>
            )}
            {user ? (
              <Button size="sm" className="w-full mt-2 gap-2" onClick={signOut} variant="outline">
                <LogOut className="h-4 w-4" />
                {t("Salir", "Sign Out")}
              </Button>
            ) : (
              <Button size="sm" className="w-full mt-2" asChild>
                <a href="/auth">
                  {t("Ingresar", "Sign In")}
                </a>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
