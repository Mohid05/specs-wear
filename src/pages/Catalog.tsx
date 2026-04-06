import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import PageHero from "@/components/PageHero";
import catalogHero from "@/assets/catalog-hero.png";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCat = searchParams.get("category") || "all";
  const initGender = searchParams.get("gender") || "all";
  
  const [category, setCategory] = useState(initCat);
  const [gender, setGender] = useState(initGender);
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading, error } = useProducts();
  
  // Diagnostic log for the user's console
  useEffect(() => {
    if (products.length > 0) {
      console.log("Catalog received products:", products);
    } else if (!isLoading && !error) {
      console.warn("Catalog received 0 products from Supabase.");
    }
  }, [products, isLoading, error]);

  // Sync state with URL params
  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
    setGender(searchParams.get("gender") || "all");
  }, [searchParams]);

  const updateFilters = (newCat: string, newGender: string) => {
    setCategory(newCat);
    setGender(newGender);
    
    const params = new URLSearchParams();
    if (newCat !== "all") params.set("category", newCat);
    if (newGender !== "all") params.set("gender", newGender);
    setSearchParams(params);
  };

  const filtered = products.filter((p) => {
    if (!p) return false;
    // Robust checks for missing or differently-cased fields
    const pCat = (p.category || "").toLowerCase();
    const pGender = (p.gender || "").toLowerCase();
    const pName = (p.name || "").toLowerCase();
    
    const matchCat = category === "all" || pCat === category.toLowerCase();
    const matchGender = gender === "all" || pGender === gender.toLowerCase();
    const matchSearch = pName.includes(search.toLowerCase());
    
    return matchCat && matchGender && matchSearch;
  });

  const cats = [
    { label: "All Categories", value: "all" },
    { label: "Frames", value: "frames" },
    { label: "Sunglasses", value: "sunglasses" },
  ];

  const genders = [
    { label: "All Genders", value: "all" },
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
  ];

  return (
    <div className="min-h-screen">
      <PageHero 
        title="Our Collection" 
        subtitle="Browse through our curated selection of premium frames and sunglasses" 
        image={catalogHero} 
      />
      
      <div className="container mx-auto px-4 py-12">

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2">
              {cats.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateFilters(c.value, gender)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === c.value ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 border-l border-border pl-4">
              {genders.map((g) => (
                <button
                  key={g.value}
                  onClick={() => updateFilters(category, g.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${gender === g.value ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={`skeleton-${i}`} className="animate-pulse flex flex-col gap-4">
              <div className="aspect-square w-full rounded-xl bg-card border border-border" />
              <div className="space-y-2">
                <div className="h-4 w-2/3 rounded bg-card" />
                <div className="h-4 w-1/3 rounded bg-card" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-16 text-center text-destructive flex flex-col items-center gap-4">
          <p>Error loading products. Please check your connection.</p>
          <button onClick={() => window.location.reload()} className="text-sm font-medium text-primary hover:underline">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No products found matching your criteria.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      </div>
    </div>
  );
}
