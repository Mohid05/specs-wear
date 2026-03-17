import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

const users = [
  { id: 1, name: "Ahmad Shahzad", email: "ahmad@specswear.pk", role: "Admin" },
  { id: 2, name: "Staff User", email: "staff@specswear.pk", role: "Staff" },
];

export default function AdminUsers() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">User Management</h1>
        <Button size="sm" className="bg-gradient-gold text-primary-foreground gap-1.5"><Plus className="h-4 w-4" /> Add User</Button>
      </div>
      <div className="mt-6 overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{u.role}</span></td>
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
