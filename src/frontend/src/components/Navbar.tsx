import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a
          href="#home"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-800 text-lg tracking-widest uppercase text-foreground">
            AKF <span className="text-primary">FABRICATIONS</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid="nav.link"
              className="text-sm font-body font-600 tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            data-ocid="nav.button"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-body font-600 tracking-wider uppercase text-xs px-5"
          >
            {isLoggingIn
              ? "Logging in..."
              : isAuthenticated
                ? "Logout"
                : "Admin Login"}
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen((v) => !v)}
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background/98 backdrop-blur-md border-b border-border px-4 pb-4"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid="nav.link"
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-body font-600 tracking-wider uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              data-ocid="nav.button"
              className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoggingIn
                ? "Logging in..."
                : isAuthenticated
                  ? "Logout"
                  : "Admin Login"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
