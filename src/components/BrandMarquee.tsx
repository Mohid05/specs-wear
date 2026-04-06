import { motion } from "framer-motion";

const brands = [
  "Ray-Ban",
  "Gucci",
  "Tom Ford",
  "Mont Blanc",
  "Roberto Cavalli",
  "Carrera",
  "Esprit",
  "Oakley",
  "Prada",
  "Persol"
];

export default function BrandMarquee() {
  return (
    <section className="py-12 border-y border-border bg-background overflow-hidden relative">
      <div className="container mx-auto px-4 mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Authorized Dealer</span>
            <div className="h-px w-8 bg-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">Explore Top Brands</h2>
      </div>
      
      <div className="flex overflow-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-16 py-4 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span 
              key={i} 
              className="text-3xl md:text-5xl font-display font-bold text-foreground/20 hover:text-primary transition-colors cursor-default select-none tracking-tighter"
            >
              {brand}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
