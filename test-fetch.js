
const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetch() {
  console.log('Testing product fetch (WITHOUT image)...');
  const start = Date.now();
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, category, gender, stock_quantity, is_out_of_stock')
      .order('id', { ascending: true });

    const end = Date.now();
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      console.log(`Fetched ${data.length} products (no image) in ${end - start}ms`);
    }

    console.log('Testing product fetch (WITH image)...');
    const start2 = Date.now();
    const { data: data2, error: error2 } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    const end2 = Date.now();
    if (error2) {
      console.error('Error fetching products (with image):', error2);
    } else {
      console.log(`Fetched ${data2.length} products (with image) in ${end2 - start2}ms`);
      if (data2.length > 0) {
        const imageSize = data2[0].image ? data2[0].image.length : 0;
        console.log(`First product image size: ${Math.round(imageSize / 1024)} KB`);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testFetch();
