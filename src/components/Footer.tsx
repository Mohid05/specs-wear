import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, ArrowUp } from "lucide-react";
import { storeInfo } from "@/data/mockData";
import SpecsLogo from "@/components/SpecsLogo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="h-1 bg-blue-accent" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <SpecsLogo className="mb-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{storeInfo.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Premium eyewear collection — frames, sunglasses, and professional eye care services in Lahore.</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-1 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-bold text-foreground">{storeInfo.owner}</p>
                <p className="text-xs text-muted-foreground">{storeInfo.ownerTitle}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quick Links</h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              {[
                { to: "/catalog", label: "Catalog" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy", label: "Privacy Policy" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="flex items-center gap-2 transition-colors hover:text-primary">
                  <span className="h-px w-3 bg-border transition-all group-hover:w-5 group-hover:bg-primary" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Contact</h4>
            <div className="flex flex-col gap-4 text-sm text-muted-foreground">
              <span className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{storeInfo.address}</span>
              {storeInfo.phones?.map((phone, i) => (
                <span key={`f-phone-${i}`} className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" />{phone}</span>
              ))}
              {storeInfo.emails?.map((email, i) => (
                <span key={`f-email-${i}`} className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" />{email}</span>
              ))}
            </div>
          </div>

          {/* Hours & Map */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Business Hours</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> Mon – Sat: 10 AM – 9 PM</span>
              <span className="ml-7">Sunday: 12 PM – 7 PM</span>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border border-border">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250.30746216104185!2d74.19025585434322!3d31.387091370237027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3918ff1cffc322f7%3A0x4269f3fed1fb47!2sServaid%20Pharmacy!5e1!3m2!1sen!2s!4v1774650029367!5m2!1sen!2s" width="600" height="200" style={{ border: '0' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SPECS WEAR. All rights reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Back to Top <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
