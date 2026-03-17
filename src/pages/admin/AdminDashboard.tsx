import { Package, MessageSquare, Users, TrendingUp } from "lucide-react";
import { adminStats } from "@/data/mockData";

const stats = [
  { label: "Total Products", value: adminStats.totalProducts, icon: Package, color: "text-primary" },
  { label: "Inquiries", value: adminStats.totalInquiries, icon: MessageSquare, color: "text-primary" },
  { label: "Monthly Visitors", value: adminStats.monthlyVisitors, icon: TrendingUp, color: "text-primary" },
  { label: "Pending Orders", value: adminStats.pendingOrders, icon: Users, color: "text-primary" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
