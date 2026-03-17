import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, Package, Tags, MessageSquare, Image, Settings, Users, Menu, X, LogOut } from "lucide-react";
import SpecsLogo from "@/components/SpecsLogo";

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: Tags },
  { label: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
  { label: "Media", path: "/admin/media", icon: Image },
  { label: "Settings", path: "/admin/settings", icon: Settings },
  { label: "Users", path: "/admin/users", icon: Users },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/admin"><SpecsLogo /></Link>
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {adminLinks.map((l) => (
            <Link key={l.path} to={l.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === l.path ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <LogOut className="h-4 w-4" /> Back to Site
          </Link>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-background/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center gap-4 border-b border-border px-4 lg:px-6">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
          <h2 className="font-display text-lg font-semibold text-foreground">Admin Panel</h2>
        </header>
        <main className="flex-1 p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
