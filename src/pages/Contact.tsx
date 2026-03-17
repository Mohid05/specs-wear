import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { storeInfo } from "@/data/mockData";

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you soon via WhatsApp or email." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-foreground">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">Get in touch — we'd love to hear from you</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-8">
          <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-secondary border-border" />
          <Input placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-secondary border-border" />
          <Input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-secondary border-border" />
          <Textarea placeholder="Your Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="bg-secondary border-border" />
          <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground shadow-gold gap-2 hover:opacity-90"><Send className="h-4 w-4" /> Send Message</Button>
        </form>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="font-display text-xl font-bold text-foreground">Prefer WhatsApp?</h3>
            <p className="mt-2 text-muted-foreground">Chat directly with us for quick inquiries about products, pricing, or appointments.</p>
            <a href={`https://wa.me/${storeInfo.whatsapp}?text=Hello%20SPECS%20WEAR!`} target="_blank" rel="noopener noreferrer" className="mt-4 block">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 gap-2"><MessageCircle className="h-4 w-4" /> Chat on WhatsApp</Button>
            </a>
          </div>
          <div className="rounded-xl border border-border bg-card p-8">
            <h3 className="font-display text-xl font-bold text-foreground">Visit Our Store</h3>
            <p className="mt-2 text-muted-foreground">{storeInfo.address}</p>
            <p className="mt-1 text-muted-foreground">Mon – Sat: 10 AM – 9 PM | Sunday: 12 PM – 7 PM</p>
            <p className="mt-1 text-muted-foreground">{storeInfo.phone1} | {storeInfo.phone2}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
