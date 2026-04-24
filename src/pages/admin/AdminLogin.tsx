import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpecsLogo from "@/components/SpecsLogo";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Sun, Moon, ShieldCheck, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import heroBanner from "@/assets/hero-blue.png";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBanner} alt="Admin Background" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      </div>

      {/* Top Nav Controls */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors backdrop-blur-sm bg-background/30 px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Website
        </Link>
      </div>
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-20">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all duration-300 text-foreground/80 hover:bg-primary/20 hover:text-primary backdrop-blur-sm bg-background/30 border border-border/50 shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-8 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-card/40 relative"
        >
          {/* Subtle glow effect top edge */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 rounded-full bg-primary/10 p-3 ring-1 ring-primary/20">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <SpecsLogo className="scale-110 mb-2" variant="card" isInverse={theme === "dark"} />
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">Secure access to store management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email</label>
              <Input 
                placeholder="admin@specswear.com" 
                type="email" 
                value={creds.email} 
                onChange={(e) => setCreds({ ...creds, email: e.target.value })} 
                className="bg-background/50 border-white/10 h-12 px-4 focus-visible:ring-primary/50" 
              />
            </div>
            <div className="space-y-1 text-left relative">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <Input 
                  placeholder="••••••••" 
                  type={showPass ? "text" : "password"} 
                  value={creds.password} 
                  onChange={(e) => setCreds({ ...creds, password: e.target.value })} 
                  className="bg-background/50 border-white/10 h-12 px-4 focus-visible:ring-primary/50 pr-10" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-muted-foreground hover:text-primary transition-colors">
                  {showPass ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                </button>
              </div>
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full h-12 mt-4 bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90 font-bold tracking-wide transition-all duration-300">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <Lock className="h-4 w-4" /> Secure Sign In
                </div>
              )}
            </Button>
          </form>

          {/* Footer Text */}
          <div className="mt-8 text-center border-t border-white/5 pt-4">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} SPECS WEAR. Authorized personnel only.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

