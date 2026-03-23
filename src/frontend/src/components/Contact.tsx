import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "motion/react";

const contactItems = [
  {
    icon: MapPin,
    label: "Location",
    lines: ["Industrial Zone, Main Road", "Your City, State 00000"],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: ["+91 88388 59742"],
  },
  {
    icon: Mail,
    label: "Email",
    lines: ["info@akffabrications.com", "quotes@akffabrications.com"],
  },
  {
    icon: Clock,
    label: "Hours",
    lines: ["Mon – Fri: 7:00 AM – 6:00 PM", "Sat: 8:00 AM – 2:00 PM"],
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-background relative">
      <div className="absolute inset-0 metal-grid opacity-30" />
      <div className="relative container mx-auto px-4">
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
              Reach Us
            </span>
            <div className="h-px w-12 bg-primary" />
          </div>
          <h2 className="font-display font-800 text-4xl md:text-5xl uppercase tracking-tight">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Ready to start your next project? Contact us for a free consultation
            and quote.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {contactItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border border-border p-6 text-center group hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-700 text-sm uppercase tracking-widest mb-2 text-muted-foreground">
                {item.label}
              </h3>
              {item.lines.map((line) => (
                <p
                  key={line}
                  className="text-sm text-foreground leading-relaxed"
                >
                  {line}
                </p>
              ))}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-primary p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="absolute inset-0 metal-grid opacity-20" />
          <div className="relative">
            <h3 className="font-display font-800 text-2xl md:text-3xl uppercase tracking-tight text-primary-foreground mb-4">
              Ready to Build Something Exceptional?
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Call us today or send an email to get started on your custom
              fabrication project.
            </p>
            <a
              href="tel:+918838859742"
              data-ocid="contact.primary_button"
              className="inline-flex items-center gap-2 bg-primary-foreground text-primary font-display font-700 uppercase tracking-widest px-8 py-3 text-sm hover:bg-primary-foreground/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
