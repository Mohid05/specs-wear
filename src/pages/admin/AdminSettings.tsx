import { useState, useEffect } from "react";
import { storeInfo as defaultStoreInfo } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPass, setIsSavingPass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showAuthPass, setShowAuthPass] = useState(false);
  
  // Store info state
  const [storeInfo, setStoreInfo] = useState({
    emails: defaultStoreInfo.emails || ["specswear23@gmail.com"],
    phones: defaultStoreInfo.phones || ["0309 04 111 66", "0313 60 640 67"],
    address: defaultStoreInfo.address,
  });

  const handleAddField = (field: 'emails' | 'phones') => {
    if (storeInfo[field].length >= 2) return;
    setStoreInfo({ ...storeInfo, [field]: [...storeInfo[field], ""] });
  };

  const handleRemoveField = (field: 'emails' | 'phones', index: number) => {
    if (storeInfo[field].length <= 1) return;
    const newArr = [...storeInfo[field]];
    newArr.splice(index, 1);
    setStoreInfo({ ...storeInfo, [field]: newArr });
  };

  const handleUpdateField = (field: 'emails' | 'phones', index: number, value: string) => {
    const newArr = [...storeInfo[field]];
    newArr[index] = value;
    setStoreInfo({ ...storeInfo, [field]: newArr });
  };

  useEffect(() => {
    const savedInfo = localStorage.getItem("admin_store_info");
    if (savedInfo) {
      setStoreInfo({ ...defaultStoreInfo, ...JSON.parse(savedInfo) });
    }
  }, []);

  const handleSaveStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_store_info", JSON.stringify(storeInfo));
    toast.success("Store contact info updated successfully!");
    setIsEditingContact(false);
    // Instruct use to reload app to see changes globally
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleAuthenticateToEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    try {
      const adminEmail = localStorage.getItem("admin_email") || "admin@specswear.com";

      const { data: adminData, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', adminEmail)
        .single();
        
      if (fetchError || !adminData) {
        toast.error("Could not verify your identity. Is the database connected?");
        setIsAuthenticating(false);
        return;
      }

      if (adminData.password !== authPassword) {
        toast.error("Incorrect password.");
        setIsAuthenticating(false);
        return;
      }

      // Success
      setIsEditingContact(true);
      setShowAuthDialog(false);
      setAuthPassword("");
    } catch (err: any) {
      toast.error("Failed to authenticate: " + err.message);
    }
    
    setIsAuthenticating(false);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPass(true);

    try {
      const adminEmail = localStorage.getItem("admin_email") || "admin@specswear.com";

      const { data: adminData, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', adminEmail)
        .single();
        
      if (fetchError || !adminData) {
        toast.error("Could not verify your identity. Is the database connected?");
        setIsSavingPass(false);
        return;
      }

      if (adminData.password !== currentPassword) {
        toast.error("Current password is incorrect.");
        setIsSavingPass(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("New passwords do not match.");
        setIsSavingPass(false);
        return;
      }

      if (newPassword.length < 5) {
        toast.error("Password must be at least 5 characters.");
        setIsSavingPass(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('admin_users')
        .update({ password: newPassword })
        .eq('email', adminEmail);

      if (updateError) throw updateError;
      
      toast.success("Admin password updated successfully in the database!");
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error("Failed to update password: " + err.message);
    }
    
    setIsSavingPass(false);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold mb-4">Contact Information</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Update the contact details displayed in the footer and about section of the customer website.
        </p>

        {!showContactInfo ? (
          <Button onClick={() => setShowContactInfo(true)} variant="outline">
            View Contact Information
          </Button>
        ) : (
          <div className="space-y-6 md:p-2">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-medium">Store Contacts</h3>
               <Button onClick={() => setShowContactInfo(false)} variant="ghost" size="sm">Hide Contact Info</Button>
            </div>

            {!isEditingContact ? (
              <div className="space-y-4">
                <div className="bg-secondary/30 p-5 rounded-lg space-y-4 border border-border">
                  <div>
                    <span className="font-semibold text-sm text-foreground">Emails</span>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {storeInfo.emails.map((e, i) => <li key={`view-email-${i}`} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> {e}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-foreground">Phones</span>
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {storeInfo.phones.map((p, i) => <li key={`view-phone-${i}`} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> {p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-foreground">Address</span>
                    <p className="mt-1 text-sm text-muted-foreground flex items-start gap-2 max-w-sm"><div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 shrink-0" /> {storeInfo.address}</p>
                  </div>
                </div>

                {!showAuthDialog ? (
                  <Button onClick={() => setShowAuthDialog(true)} variant="outline">
                    Edit Contact Info
                  </Button>
                ) : (
                  <form onSubmit={handleAuthenticateToEdit} className="space-y-4 max-w-sm border border-border rounded-lg p-5 bg-secondary/20 fade-in zoom-in duration-200">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-destructive flex items-center gap-2">Security Verification required</label>
                      <p className="text-xs text-muted-foreground mb-2">Please verify your admin password to make changes.</p>
                      <div className="relative">
                        <Input 
                          type={showAuthPass ? "text" : "password"} 
                          placeholder="Your admin password"
                          value={authPassword} 
                          onChange={e => setAuthPassword(e.target.value)} 
                          required 
                        />
                        <button type="button" onClick={() => setShowAuthPass(!showAuthPass)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                          {showAuthPass ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Button type="submit" disabled={isAuthenticating}>
                        {isAuthenticating ? "Verifying..." : "Verify & Edit"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => {
                        setShowAuthDialog(false);
                        setAuthPassword("");
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveStoreInfo} className="space-y-4 border border-primary/20 rounded-lg p-5 bg-card/50 shadow-sm relative fade-in slide-in-from-bottom-2 duration-300">
                <div className="absolute top-0 right-0 bg-primary/10 text-primary text-xs px-2 py-1 rounded-bl-lg rounded-tr-lg font-medium">Edit Mode Active</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <label className="text-sm font-medium flex justify-between items-center">
                      Contact Emails
                      {storeInfo.emails.length < 2 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddField('emails')}>Add Email</Button>
                      )}
                    </label>
                    {storeInfo.emails.map((email, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={email} onChange={e => handleUpdateField('emails', i, e.target.value)} required />
                        {storeInfo.emails.length > 1 && (
                           <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveField('emails', i)} className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium flex justify-between items-center">
                      Contact Numbers
                      {storeInfo.phones.length < 2 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => handleAddField('phones')}>Add Number</Button>
                      )}
                    </label>
                    {storeInfo.phones.map((phone, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={phone} onChange={e => handleUpdateField('phones', i, e.target.value)} required />
                        {storeInfo.phones.length > 1 && (
                           <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveField('phones', i)} className="shrink-0"><Trash2 className="h-4 w-4" /></Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 md:col-span-2 mt-2 border-t border-border pt-6">
                    <label className="text-sm font-medium">Store Location (Address)</label>
                    <Input 
                      value={storeInfo.address} 
                      onChange={e => setStoreInfo({ ...storeInfo, address: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-6 border-t border-border mt-6">
                  <Button type="submit" className="bg-gradient-gold shadow-gold text-primary-foreground min-w-[140px]">
                    Save Contact Info
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setIsEditingContact(false)}>
                    Cancel Editing
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold mb-4">Security</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Manage your Admin Password to keep the dashboard secure.
        </p>
        
        {!isChangingPassword ? (
          <Button onClick={() => setIsChangingPassword(true)} variant="outline">
            Change Password
          </Button>
        ) : (
          <form onSubmit={handleSavePassword} className="space-y-4 max-w-sm border border-border rounded-lg p-5 bg-card">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <div className="relative">
                <Input 
                  type={showPass.current ? "text" : "password"} 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                  {showPass.current ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Input 
                  type={showPass.new ? "text" : "password"} 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                  {showPass.new ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <div className="relative">
                <Input 
                  type={showPass.confirm ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                  {showPass.confirm ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="destructive" disabled={isSavingPass}>
                {isSavingPass ? "Saving..." : "Confirm Change"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => {
                setIsChangingPassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
