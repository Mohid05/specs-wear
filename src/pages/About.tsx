import { Target, Eye, Heart } from "lucide-react";
import { storeInfo } from "@/data/mockData";
import SpecsLogo from "@/components/SpecsLogo";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-foreground">About SPECS WEAR</h1>
      <p className="mt-2 text-muted-foreground">Your trusted optical partner in Lahore</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Our Story</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            SPECS WEAR was founded with a simple mission — to provide high-quality, stylish eyewear at affordable prices. Located at Shaheen Commercial, opposite Bahria International Hospital in Lahore, we have been serving thousands of satisfied customers with premium frames, sunglasses, and professional eye care services.
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We believe that everyone deserves to see clearly and look great while doing it. Our curated collection features the latest trends from top international brands alongside our exclusive in-house designs.
          </p>
        </div>

        {/* Owner card - styled EXACTLY like the business card */}
        <div className="overflow-hidden rounded-md shadow-lg font-sans max-w-lg mx-auto lg:mx-0 w-full" style={{ aspectRatio: "1.7/1" }}>
          <div className="flex h-full w-full">
            {/* Dark side */}
            <div className="flex w-[55%] flex-col bg-[#1E293B] p-4 sm:p-6 md:p-8 relative text-gray-300" style={{ backgroundImage: "radial-gradient(#334155 1px, transparent 1px)", backgroundSize: "4px 4px" }}>
              <div className="flex flex-col mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-6 w-3 bg-primary" />
                  <h3 className="font-sans text-lg sm:text-xl font-medium tracking-wide text-gray-200">AHMAD SHAHZAD</h3>
                </div>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest ml-5">PROPRIETOR</p>
              </div>

              <div className="mt-auto mb-4 flex flex-col gap-2 text-[10px] sm:text-xs">
                <div className="flex items-start gap-2">
                  <span className="text-primary">📞</span>
                  <div className="flex flex-col leading-tight">
                    <span>{storeInfo.phone1}</span>
                    <span>{storeInfo.phone2}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">✉️</span>
                  <span>{storeInfo.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">📍</span>
                  <span className="leading-snug opacity-90 max-w-[90%]">Servaid Pharmacy, Plaza No 7, Shaheen commercial, Opposite Bahria International Hospital, Lahore.</span>
                </div>
              </div>
            </div>

            {/* Blue thin divider */}
            <div className="w-1.5 bg-[#1D70B8] h-full" />

            {/* Yellow side */}
            <div className="flex w-[45%] flex-col items-center justify-center bg-primary p-4 relative">
              <SpecsLogo addTagline={true} variant="card" className="scale-75 sm:scale-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission / Vision */}
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: Target, title: "Our Mission", text: "To make premium eyewear accessible to everyone in Pakistan through quality products, expert guidance, and exceptional service." },
          { icon: Eye, title: "Our Vision", text: "To become Pakistan's most trusted and innovative optical retail brand, setting new standards in eye care and fashion eyewear." },
          { icon: Heart, title: "Our Values", text: "Quality, transparency, customer satisfaction, and a genuine passion for helping people see the world clearly and beautifully." },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-gold">
            <item.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
