import { Link } from "react-router-dom";
import { Eye, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useProductImage } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { data: fetchedImage, isLoading: imageLoading } = useProductImage(product.id);
  const displayImage = product.image || fetchedImage;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-md shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-gold h-full"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary w-full">
        {imageLoading && !product.image ? (
          <Skeleton className="h-full w-full" />
        ) : displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-secondary text-muted-foreground transition-transform duration-700 group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-40 mb-2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span className="uppercase text-[10px] font-bold tracking-widest opacity-60">No Image</span>
          </div>
        )}
        
        {/* Glassmorphism Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <span className="flex transform items-center gap-2 rounded-full bg-primary/95 backdrop-blur-md px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-gold scale-95 transition-transform duration-500 group-hover:scale-100">
            <Eye className="h-4 w-4" /> Quick View
          </span>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
          <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-sm shadow-sm ring-1 ring-border/50">
            {product.category}
          </span>
          {product.is_out_of_stock && (
            <span className="rounded-full bg-destructive/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-destructive-foreground backdrop-blur-sm shadow-sm ring-1 ring-destructive/20">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 bg-gradient-to-b from-transparent to-background/50">
        <h3 className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">{product.name}</h3>
        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-xl font-bold text-primary tracking-tight">Rs. {product.price.toLocaleString()}</p>
            {!product.is_out_of_stock && product.stock_quantity !== undefined && (
              <p className="text-[10px] text-muted-foreground font-medium mt-1">{product.stock_quantity} left in stock</p>
            )}
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (product.is_out_of_stock) return;
              addToCart(product);
              toast.success(`${product.name} added to cart!`);
            }}
            disabled={product.is_out_of_stock}
            className={`relative z-30 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              product.is_out_of_stock 
                ? "bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50" 
                : "bg-secondary hover:bg-primary text-foreground hover:text-primary-foreground hover:shadow-lg hover:-translate-y-1"
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
