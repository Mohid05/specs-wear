import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, storeInfo } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Product not found</h1>
        <Link to="/catalog" className="mt-4 text-primary hover:underline">← Back to Catalog</Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in ${product.name} (Rs. ${product.price.toLocaleString()}) from SPECS WEAR.`);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/catalog" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover aspect-square" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">{product.category}</span>
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
              className="flex-1 bg-primary text-primary-foreground shadow-sm gap-2 hover:opacity-90"
              onClick={() => {
                addToCart(product);
                toast.success(`${product.name} added to cart!`);
              }}
            >
              <ShoppingCart className="h-5 w-5" /> Add to Cart
            </Button>
            <a href={`https://wa.me/${storeInfo.whatsapp}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="lg" variant="outline" className="w-full border-primary/30 text-foreground hover:bg-primary/10 gap-2">
                <MessageCircle className="h-5 w-5" /> WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
