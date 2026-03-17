import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/mockData";

export default function AdminMedia() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Media Library</h1>
        <Button size="sm" className="bg-gradient-gold text-primary-foreground gap-1.5"><Upload className="h-4 w-4" /> Upload</Button>
      </div>
      <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p) => (
          <div key={p.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
            <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">{p.name}.jpg</p>
          </div>
        ))}
      </div>
    </div>
  );
}
