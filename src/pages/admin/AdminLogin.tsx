import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpecsLogo from "@/components/SpecsLogo";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ email: "", password: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="flex flex-col items-center mb-6">
          <SpecsLogo className="scale-125" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Admin Login</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input placeholder="Email" type="email" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} className="bg-secondary border-border" />
          <Input placeholder="Password" type="password" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} className="bg-secondary border-border" />
          <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90">Sign In</Button>
        </form>
      </div>
    </div>
  );
}
