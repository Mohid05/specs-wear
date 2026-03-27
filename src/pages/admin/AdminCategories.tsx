import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { ArrowRight, Package } from "lucide-react";

export default function AdminCategories() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['admin-products-for-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      return data;
    }
  });

  // Dynamically calculate category stats based on the live products
  const categoryStats = products.reduce((acc: Record<string, { total: number, active: number }>, product) => {
    const cat = product.category;
    if (!acc[cat]) {
      acc[cat] = { total: 0, active: 0 };
    }
    acc[cat].total++;
    if (!product.is_out_of_stock) {
      acc[cat].active++;
    }
    return acc;
  }, {});

  const categoryCards = Object.entries(categoryStats).map(([name, stats]) => {
    const s = stats as { total: number, active: number };
    return {
      name,
      total: s.total,
      active: s.active
    };
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Live Categories</h1>
      </div>
      <p className="mt-2 text-muted-foreground">Automatically synced with your database products.</p>
      
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-8 text-center text-muted-foreground">Loading categories from database...</div>
        ) : error ? (
          <div className="col-span-full py-8 text-center text-destructive whitespace-pre-wrap">Error connecting to database: {(error as any).message}</div>
        ) : categoryCards.length === 0 ? (
          <div className="col-span-full py-8 text-center text-muted-foreground">No products found in the database to build categories from.</div>
        ) : categoryCards.map((c) => (
          <Link 
            key={c.name} 
            to={`/admin/products?category=${c.name}`}
            className="group rounded-xl border border-border bg-card p-6 flex flex-col hover:border-primary transition-all shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="font-display text-xl font-bold text-foreground capitalize">{c.name}</h3>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Package className="h-5 w-5" />
              </div>
            </div>
            
            <div className="space-y-1 relative z-10">
              <p className="text-sm font-medium text-foreground">{c.total} Products Total</p>
              <p className="text-xs text-muted-foreground">{c.active} In Stock • {c.total - c.active} Out of Stock</p>
            </div>

            <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-primary opacity-80 group-hover:opacity-100 transition-opacity">
              View Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
            
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
              <Package className="h-32 w-32" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
