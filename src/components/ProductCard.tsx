import { Link } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-gold"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold">
            <Eye className="h-4 w-4" /> Quick View
          </span>
        </div>
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary backdrop-blur-sm">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-primary">Rs. {product.price.toLocaleString()}</p>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              toast.success(`${product.name} added to cart!`);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
