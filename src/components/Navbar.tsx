import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/mockData";
import SpecsLogo from "@/components/SpecsLogo";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Catalog", path: "/catalog" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const WHATSAPP_URL = `https://wa.me/${storeInfo.whatsapp}?text=Hello%20SPECS%20WEAR!`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80" : "bg-transparent"}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20">
        <Link to="/" className="flex items-center gap-2">
          <SpecsLogo />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${pathname === l.path ? "text-primary" : "text-foreground/70"}`}
            >
              {l.label}
              {pathname === l.path && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 border-l border-border pl-8">
            <Link to="/checkout" className="relative group p-2">
              <ShoppingCart className="h-5 w-5 text-foreground/70 transition-colors group-hover:text-primary" />
              {cartCount > 0 && (
                <span className="absolute 0 right-0 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <Link to="/checkout" className="relative p-2">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute 0 right-0 h-4 w-4 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="text-foreground p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((l) => (
              <Link key={l.path} to={l.path} onClick={() => setOpen(false)} className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary ${pathname === l.path ? "bg-secondary text-primary" : "text-foreground/70"}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
