import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

const categories = [
  { id: 1, name: "Frames", productCount: 28, status: "Active" },
  { id: 2, name: "Sunglasses", productCount: 20, status: "Active" },
];

export default function AdminCategories() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Categories</h1>
        <Button size="sm" className="bg-gradient-gold text-primary-foreground gap-1.5"><Plus className="h-4 w-4" /> Add Category</Button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {categories.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">{c.name}</h3>
              <p className="text-sm text-muted-foreground">{c.productCount} products</p>
              <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{c.status}</span>
            </div>
            <div className="flex gap-2">
              <button className="text-muted-foreground hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
              <button className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
