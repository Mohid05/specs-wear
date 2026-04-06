import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
}

export default function PageHero({ title, subtitle, image }: PageHeroProps) {
  return (
    <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden bg-[#0f172a]">
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 h-full w-full object-cover opacity-60" 
      />
      {/* Dark gradient overlay to ensure consistency and readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 via-transparent to-transparent" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
