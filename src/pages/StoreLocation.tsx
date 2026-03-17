import { MapPin, Navigation, Phone, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/mockData";

export default function StoreLocation() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-foreground">Store Location</h1>
      <p className="mt-2 text-muted-foreground">Visit us at our store in Lahore</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-border">
          <iframe title="SPECS WEAR Store Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.0!2d74.35!3d31.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEyLjAiTiA3NMKwMjEnMDAuMCJF!5e0!3m2!1sen!2spk!4v1700000000000" width="100%" height="450" style={{ border: 0 }} loading="lazy" />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /> Address</h3>
            <p className="mt-3 text-muted-foreground">{storeInfo.address}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Phone className="h-5 w-5 text-primary" /> Contact</h3>
            <p className="mt-3 text-muted-foreground">{storeInfo.phone1}</p>
            <p className="text-muted-foreground">{storeInfo.phone2}</p>
            <p className="mt-1 text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4 text-primary" />{storeInfo.email}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Hours</h3>
            <p className="mt-3 text-muted-foreground">Mon – Sat: 10:00 AM – 9:00 PM</p>
            <p className="text-muted-foreground">Sunday: 12:00 PM – 7:00 PM</p>
          </div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=31.52,74.35" target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-gradient-gold text-primary-foreground shadow-gold gap-2 hover:opacity-90 mt-2">
              <Navigation className="h-4 w-4" /> Get Directions
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
