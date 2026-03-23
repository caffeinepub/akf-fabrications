import { Button } from "@/components/ui/button";
import { ArrowDown, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-fabrication.dim_1920x1080.jpg"
          alt="AKF Fabrications workshop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="absolute inset-0 metal-grid" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-primary" />
            <span className="text-primary font-body text-xs tracking-[0.3em] uppercase font-600">
              Est. 2010 — Premium Steel Work
            </span>
            <div className="h-px w-16 bg-primary" />
          </div>

          {/* Main Title */}
          <h1 className="font-display font-800 text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight leading-none mb-4">
            <span className="block text-foreground">AKF</span>
            <span className="block text-primary accent-glow">FABRICATIONS</span>
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-body text-lg md:text-2xl text-muted-foreground mt-6 mb-10 max-w-2xl mx-auto tracking-wide"
          >
            Built with Precision.{" "}
            <span className="text-primary font-600">Forged with Purpose.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              data-ocid="hero.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-700 tracking-widest uppercase px-8 py-6 text-sm shadow-orange"
            >
              <a href="#work">
                View Our Work
                <ChevronRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-ocid="hero.secondary_button"
              className="border-foreground/30 text-foreground hover:border-primary hover:text-primary font-display font-700 tracking-widest uppercase px-8 py-6 text-sm"
            >
              <a href="#contact">Get a Quote</a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
          >
            <ArrowDown className="w-4 h-4 text-primary" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
