import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { storeInfo } from "@/data/mockData";

export default function AdminSettings() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Store Settings</h1>
      <div className="mt-6 max-w-lg space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <label className="text-sm font-medium text-foreground">Store Name</label>
          <Input defaultValue="SPECS WEAR" className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Phone 1</label>
          <Input defaultValue={storeInfo.phone1} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Phone 2</label>
          <Input defaultValue={storeInfo.phone2} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input defaultValue={storeInfo.email} className="mt-1 bg-secondary border-border" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Address</label>
          <Textarea defaultValue={storeInfo.address} className="mt-1 bg-secondary border-border" rows={2} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">WhatsApp Number</label>
          <Input defaultValue={storeInfo.whatsapp} className="mt-1 bg-secondary border-border" />
        </div>
        <Button className="bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-90">Save Settings</Button>
      </div>
    </div>
  );
}
