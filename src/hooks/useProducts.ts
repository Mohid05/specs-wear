import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/data/mockData';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data as Product[];
    },
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
  });
};
