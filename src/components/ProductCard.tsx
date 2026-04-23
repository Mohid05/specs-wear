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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-gold"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
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
          <div className="h-full w-full flex items-center justify-center bg-secondary text-muted-foreground uppercase text-xs font-bold tracking-widest transition-transform duration-700 group-hover:scale-110">
            No Image
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold">
            <Eye className="h-4 w-4" /> Quick View
          </span>
        </div>
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary backdrop-blur-sm">
          {product.category}
        </span>
        {product.is_out_of_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm shadow-sm">
            Out of Stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-5">
        <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">{product.name}</h3>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-lg font-bold text-primary">Rs. {product.price.toLocaleString()}</p>
            {!product.is_out_of_stock && product.stock_quantity !== undefined && (
              <p className="text-[10px] text-muted-foreground font-medium">{product.stock_quantity} left in stock</p>
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
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              product.is_out_of_stock 
                ? "bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50" 
                : "bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
