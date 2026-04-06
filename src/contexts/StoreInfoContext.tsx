import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface StoreInfo {
  phones: string[];
  emails: string[];
  address: string;
  whatsapp: string;
  owner: string;
  ownerTitle: string;
  tagline: string;
}

const defaultStoreInfo: StoreInfo = {
  phones: ["0309 04 111 66", "0313 60 640 67"],
  emails: ["specswear23@gmail.com"],
  address: "Servaid Pharmacy, Plaza No 7, Shaheen Commercial, Opposite Bahria International Hospital, Lahore.",
  whatsapp: "923090411166",
  owner: "Ahmad Shahzad",
  ownerTitle: "Proprietor",
  tagline: "SPECS WEAR | SEE CLEAR",
};

interface StoreInfoContextType {
  storeInfo: StoreInfo;
  isLoading: boolean;
  refresh: () => Promise<void>;
  updateStoreInfo: (newInfo: StoreInfo) => Promise<boolean>;
}

const StoreInfoContext = createContext<StoreInfoContextType | undefined>(undefined);

export function StoreInfoProvider({ children }: { children: React.ReactNode }) {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(defaultStoreInfo);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStoreInfo = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'store_info')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Row not found, this is okay, we'll use defaults
          console.warn("Store info not found in DB, using defaults.");
        } else {
          throw error;
        }
      } else if (data?.value) {
        setStoreInfo(data.value as StoreInfo);
      }
    } catch (err) {
      console.error("Error fetching store info:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreInfo();
  }, []);

  const updateStoreInfo = async (newInfo: StoreInfo) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key: 'store_info', value: newInfo });

      if (error) throw error;
      
      setStoreInfo(newInfo);
      return true;
    } catch (err: any) {
      toast.error("Failed to update store info: " + err.message);
      return false;
    }
  };

  return (
    <StoreInfoContext.Provider value={{ storeInfo, isLoading, refresh: fetchStoreInfo, updateStoreInfo }}>
      {children}
    </StoreInfoContext.Provider>
  );
}

export function useStoreInfo() {
  const context = useContext(StoreInfoContext);
  if (context === undefined) {
    throw new Error("useStoreInfo must be used within a StoreInfoProvider");
  }
  return context;
}
