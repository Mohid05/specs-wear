import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Shield, Eye, Award, Users } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { testimonials, storeInfo } from "@/data/mockData";
import { useProducts } from "@/hooks/useProducts";
import BrandMarquee from "@/components/BrandMarquee";
import heroBanner from "@/assets/hero-blue.png";
import framesImg from "@/assets/frames-cat.png";
import sunglassesImg from "@/assets/top-view-sunglasses-floating-water.webp";
import menImg from "@/assets/men-cat.png";
import womenImg from "@/assets/women-cat.png";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { icon: Users, value: "5,000+", label: "Happy Customers" },
  { icon: Award, value: "15+", label: "Years Experience" },
  { icon: Shield, value: "100%", label: "Genuine Products" },
  { icon: Eye, value: "50+", label: "Brand Collection" },
];

export default function Index() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const { data: products = [], isLoading } = useProducts();
  const featured = products.some(p => p.is_featured) 
    ? products.filter(p => p.is_featured).slice(0, 4) 
    : products.slice(0, 4);
  const nextTestimonial = () => setTestimonialIdx((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[testimonialIdx];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <img src={heroBanner} alt="SPECS WEAR Hero" className="absolute inset-0 h-full w-full object-cover" />
        {/* Soft blue-ish overlays for the new theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/40 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="container relative z-10 px-4 py-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px w-12 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Premium Eyewear Since 2010
              </span>
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.1] md:text-7xl lg:text-8xl">
              <span className="text-gradient-gold">See Clear.</span>
              <br />
              <span className="text-white">Look Sharp.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#f0f8ff]">
              Discover premium frames & sunglasses crafted for style and comfort at Lahore's most trusted optical store.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/catalog">
                <Button size="lg" className="bg-gradient-gold text-primary-foreground shadow-gold gap-2 hover:opacity-90 text-base px-8 py-6">
                  Browse Collection <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-primary/30 text-foreground hover:bg-primary/10 hover:text-primary px-8 py-6 text-base">
                  Book Appointment
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="relative z-10 -mt-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-2xl md:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2 bg-card px-6 py-8">
                <s.icon className="h-6 w-6 text-primary" />
                <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-xs text-muted-foreground text-center">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <BrandMarquee />

      {/* Categories with images */}
      <AnimatedSection className="container mx-auto px-4 py-24">
        <div className="text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Collections</span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">Explore Our Range</h2>
          <p className="mt-3 text-muted-foreground">Handpicked styles for every personality</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            { title: "Frames", desc: "Prescription & fashion frames for every face shape", filter: "category=frames", image: framesImg, count: "200+ Styles" },
            { title: "Sunglasses", desc: "UV-protected stylish shades for every occasion", filter: "category=sunglasses", image: sunglassesImg, count: "150+ Styles" },
            { title: "Men's Eyewear", desc: "Sophisticated styles exclusively for men", filter: "gender=men", image: menImg, count: "180+ Styles" },
            { title: "Women's Eyewear", desc: "Elegant and chic frames for modern women", filter: "gender=women", image: womenImg, count: "220+ Styles" }
          ].map((cat, i) => (
            <motion.div
              key={cat.filter}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Link
                to={`/catalog?${cat.filter}`}
                className="group relative block overflow-hidden rounded-2xl border border-border"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={cat.image} alt={cat.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="mb-2 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">{cat.count}</span>
                  <h3 className="font-display text-3xl font-bold text-foreground transition-colors group-hover:text-primary">{cat.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{cat.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                    Shop Now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <section className="border-y border-border bg-card/50 py-24">
        <AnimatedSection className="container mx-auto px-4">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-px w-8 bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Best Sellers</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">Featured Products</h2>
              <p className="mt-3 text-muted-foreground">Our most popular picks this season</p>
            </div>
            <Link to="/catalog" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">
              View All Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className={`grid gap-6 sm:grid-cols-2 ${featured.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} justify-center`}>
            {isLoading ? (
              <div className="col-span-4 text-center text-muted-foreground py-12">Loading featured products...</div>
            ) : (
              featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))
            )}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/catalog" className="text-sm font-medium text-primary hover:underline">View All Collection →</Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Testimonials */}
      <AnimatedSection className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto mb-3 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Testimonials</span>
              <div className="h-px w-8 bg-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-5xl">What Our Customers Say</h2>
          </div>

          <div className="mx-auto mt-14 max-w-4xl relative flex items-center group">
            <button
              onClick={prevTestimonial}
              className="absolute -left-4 md:-left-12 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-background/80 outline outline-1 outline-border text-foreground backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground hover:outline-primary opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>

            <div className="w-full max-w-2xl mx-auto">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl border border-border bg-card p-10 text-center"
              >
                {/* Decorative quote */}
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-display text-6xl text-primary/20">"</span>
                <div className="mb-5 flex justify-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-5 w-5 fill-primary text-primary" />)}
                </div>
                <p className="text-lg leading-relaxed italic text-foreground">{t.text}</p>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <p className="mt-2 font-display text-lg font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Verified Customer</p>
                </div>
              </motion.div>
              <div className="mt-8 flex justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextTestimonial}
              className="absolute -right-4 md:-right-12 z-10 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-background/80 outline outline-1 outline-border text-foreground backdrop-blur-sm transition-all hover:bg-primary hover:text-primary-foreground hover:outline-primary opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>
      </AnimatedSection>


    </>
  );
}
