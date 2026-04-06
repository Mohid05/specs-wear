import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpecsLogo from "@/components/SpecsLogo";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Sun, Moon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const lastActivity = parseInt(localStorage.getItem("adminLastActivity") || "0");
    const now = Date.now();
    const isActiveSession = !!lastActivity && now - lastActivity < 300 * 1000;

    if (isAdmin && isActiveSession) {
      navigate("/admin", { replace: true });
      return;
    }

    if (isAdmin && !isActiveSession) {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("admin_email");
      localStorage.removeItem("adminLastActivity");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', creds.email)
        .single();

      if (error || !data) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (data.password === creds.password) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("admin_email", data.email);
        localStorage.setItem("adminLastActivity", Date.now().toString());
        toast.success("Login successful");
        navigate("/admin");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative">
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Website
      </Link>
      <div className="absolute top-6 right-6 md:top-8 md:right-8">
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
      </div>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col items-center mb-6">
          <SpecsLogo className="scale-125" variant="card" isInverse={theme === "dark"} />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Admin Login</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input placeholder="Email" type="email" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} className="bg-secondary border-border" />
          <div className="relative">
            <Input placeholder="Password" type={showPass ? "text" : "password"} value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} className="bg-secondary border-border" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
              {showPass ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
            </button>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90">
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
