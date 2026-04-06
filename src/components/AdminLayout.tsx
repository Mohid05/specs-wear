import { Link, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, Package, Tags, MessageSquare, Image, Settings, Users, Menu, X, LogOut, ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import SpecsLogo from "@/components/SpecsLogo";

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: Tags },
  { label: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Fetch unread inquiries list (unified with Dashboard for cache sync)
  const { data: unreadInquiries = [] } = useQuery({
    queryKey: ['admin-unread-count'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('status', 'unread');
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  const unreadCount = unreadInquiries.length;

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (!isAdmin) return;
    
    const IDLE_TIMEOUT = 300000; // 5 minutes
    
    const resetTimer = () => {
      localStorage.setItem("adminLastActivity", Date.now().toString());
    };

    const checkIdle = () => {
      const lastActivity = parseInt(localStorage.getItem("adminLastActivity") || "0");
      const now = Date.now();
      
      if (now - lastActivity >= IDLE_TIMEOUT) {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminLastActivity");
        navigate("/admin/login");
        toast.info("Logged out due to 5 minutes of inactivity");
      }
    };

    // Initial set
    resetTimer();

    // Check every 10 seconds while tab is open
    const intervalId = setInterval(checkIdle, 10000);

    // Also check when tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkIdle();
      }
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("click", resetTimer);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("click", resetTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-[var(--footer-bg)] transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link to="/admin"><SpecsLogo isInverse /></Link>
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(false)}><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {adminLinks.map((l) => (
            <Link key={l.path} to={l.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname === l.path ? "bg-primary text-primary-foreground" : "text-[var(--footer-foreground-muted)] hover:bg-white/5 hover:text-[var(--footer-foreground-bright)]"}`}>
              <div className="flex items-center gap-3">
                <l.icon className="h-4 w-4" /> {l.label}
              </div>
              {l.label === "Inquiries" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                  {unreadCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border p-3 flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--footer-foreground-muted)] hover:bg-white/5 hover:text-[var(--footer-foreground-bright)] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Website
          </Link>
          <button onClick={() => {
            handleLogout();
            navigate("/admin/login");
          }} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-background/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></button>
            <h2 className="font-display text-lg font-semibold text-foreground">Admin Panel</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors duration-200 text-muted-foreground hover:bg-secondary hover:text-primary"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <Link to="/admin/inquiries" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-card" />
              )}
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
