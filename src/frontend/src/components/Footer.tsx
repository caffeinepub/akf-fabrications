import { Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-card border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-800 text-base tracking-widest uppercase">
              AKF <span className="text-primary">FABRICATIONS</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {["Home", "Services", "Work", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-body uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground text-center">
            © {year} AKF Fabrications. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground/50 tracking-widest uppercase">
            Built with Precision. Forged with Purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
