import { Building2, Cpu, Flame, HardHat, Layers, Wrench } from "lucide-react";
import { motion } from "motion/react";

const services = [
  {
    icon: Layers,
    title: "Steel Fabrication",
    description:
      "Custom structural and architectural steel fabrication to exact specifications, built for strength and longevity.",
  },
  {
    icon: Wrench,
    title: "Custom Metalwork",
    description:
      "Bespoke metalwork solutions for unique projects — gates, railings, frames, and decorative elements crafted to perfection.",
  },
  {
    icon: Building2,
    title: "Structural Steel",
    description:
      "Heavy-duty structural steel for commercial and industrial buildings, ensuring maximum load-bearing capacity.",
  },
  {
    icon: Flame,
    title: "Welding Services",
    description:
      "Expert MIG, TIG, and stick welding using certified techniques for permanent, reliable joints.",
  },
  {
    icon: Cpu,
    title: "CNC Cutting",
    description:
      "Precision CNC plasma and laser cutting for intricate shapes and high-volume production runs with micron-level accuracy.",
  },
  {
    icon: HardHat,
    title: "Industrial Installations",
    description:
      "On-site installation and erection of fabricated steel structures by our experienced installation crew.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 bg-background">
      <div className="absolute inset-0 metal-grid opacity-50" />
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-primary font-body text-xs tracking-[0.3em] uppercase font-600">
              What We Do
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="font-display font-800 text-4xl md:text-5xl uppercase tracking-tight">
            Our <span className="text-primary">Services</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            From raw steel to finished structure — we deliver industrial
            fabrication solutions that stand the test of time.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative bg-card border border-border hover:border-primary/50 p-6 transition-all duration-300 hover:shadow-orange"
            >
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-700 text-lg uppercase tracking-wide mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
