import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeInfo as fallbackInfo } from "@/data/mockData";
import { useStoreInfo } from "@/contexts/StoreInfoContext";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const { storeInfo: liveStoreInfo } = useStoreInfo();
  const storeInfo = liveStoreInfo || fallbackInfo;
  const { addToCart } = useCart();
  const { data: product, isLoading, error } = useProduct(id ?? "");

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="font-display text-2xl text-muted-foreground">Loading product details...</h1>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Product not found</h1>
        <Link to="/catalog" className="mt-4 text-primary hover:underline">← Back to Catalog</Link>
      </div>
    );
  }

  const productUrl = window.location.href;
  const whatsappMsg = encodeURIComponent(`SPECS WEAR - Catalog Inquiry\n\nI'm interested in the following product:\nProduct: ${product.name}\nReference: ${productUrl}\n\nKindly provide more details regarding this item.`);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/catalog" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover aspect-square" />
          ) : (
            <div className="h-full w-full aspect-square flex items-center justify-center bg-secondary flex-col gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground opacity-30"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              <span className="uppercase text-sm tracking-widest font-semibold text-muted-foreground opacity-50">No Image Provided</span>
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">{product.category}</span>
            {product.is_out_of_stock ? (
              <span className="inline-block rounded-full bg-red-600/10 px-2.5 py-0.5 text-xs font-semibold text-red-600">
                Out of Stock
              </span>
            ) : product.stock_quantity !== undefined && (
              <span className="inline-block rounded-full bg-green-600/10 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                {product.stock_quantity} in stock
              </span>
            )}
          </div>
          <h1 className="mt-2 font-display text-4xl font-bold text-foreground">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold text-primary">Rs. {product.price.toLocaleString()}</p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="mt-8">
            <h3 className="font-display text-lg font-semibold text-foreground">Specifications</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {product.specs.map((s) => (
                <div key={s.label} className="rounded-lg border border-border bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button 
              size="lg" 
              disabled={product.is_out_of_stock}
              className="flex-1 bg-primary text-primary-foreground shadow-sm gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to cart!`);
              }}
            >
              <ShoppingCart className="h-5 w-5" /> {product.is_out_of_stock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <a href={`https://wa.me/${storeInfo.whatsapp}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" variant="outline" className="w-full border-primary/30 text-foreground hover:bg-[#15a349] hover:text-white hover:border-[#15a349] gap-2 transition-colors">
                <MessageCircle className="h-5 w-5" /> WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
