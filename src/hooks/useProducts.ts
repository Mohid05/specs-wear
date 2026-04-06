import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/data/mockData';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products-list'],
    queryFn: async () => {
      console.log("Fetching products from Supabase...");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error);
        throw new Error(error.message);
      }
      console.log("Fetched products count:", data?.length || 0, data);
      return (data || []) as Product[];
    },
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });
};

export const useProduct = (id: string | number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data as Product;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
