import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initCat = searchParams.get("category") || "all";
  const initGender = searchParams.get("gender") || "all";
  
  const [category, setCategory] = useState(initCat);
  const [gender, setGender] = useState(initGender);
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading, error } = useProducts();

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
    const matchCat = category === "all" || p.category === category;
    const matchGender = gender === "all" || p.gender === gender;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-foreground">Our Catalog</h1>
      <p className="mt-2 text-muted-foreground">Browse our premium eyewear collection</p>

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
        <div className="mt-16 flex justify-center text-muted-foreground">Loading products...</div>
      ) : error ? (
        <div className="mt-16 text-center text-destructive">Error loading products.</div>
      ) : filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No products found.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
