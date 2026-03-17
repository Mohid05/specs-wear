import { products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProducts() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
        <Button size="sm" className="bg-gradient-gold text-primary-foreground gap-1.5"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>
      <div className="mt-6 overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Image</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3"><img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" /></td>
                <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-3 capitalize text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-primary font-medium">Rs. {p.price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="text-muted-foreground hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
