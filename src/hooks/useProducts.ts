import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/data/mockData';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products-list-metadata'],
    queryFn: async () => {
      console.log("Fetching products from Supabase (metadata only)...");
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, category, gender, description, specs, created_at, stock_quantity, is_out_of_stock, is_featured')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error("Supabase fetch error:", error);
        throw new Error(error.message);
      }
      return (data || []) as Product[];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const useProductImage = (id: string | number) => {
  return useQuery({
    queryKey: ['product-image', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('image')
        .eq('id', Number(id))
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      return data.image as string;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // Cache image for an hour
  });
};

export const useProduct = (id: string | number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      // Exclude 'image' from the main fetch to ensure fast loading even with old Base64 data
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, category, gender, description, specs, created_at, stock_quantity, is_out_of_stock')
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
