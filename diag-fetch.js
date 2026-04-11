
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : null;
const supabaseAnonKey = keyMatch ? keyMatch[1].trim() : null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

async function testFetch() {
  console.log('Fetching product data via REST API...');
  const endpoint = `${supabaseUrl}/rest/v1/products?select=id,name,image&order=id.asc`;
  
  try {
    const response = await fetch(endpoint, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });

    if (!response.ok) {
        console.error('Error:', response.status, await response.text());
        return;
    }

    const data = await response.json();
    console.log(`Found ${data.length} products.`);
    
    const sizes = data.map(p => ({
      id: p.id,
      name: p.name,
      sizeKB: p.image ? Math.round(p.image.length / 1024) : 0
    })).sort((a, b) => b.sizeKB - a.sizeKB);

    console.log('Top 10 largest products:');
    sizes.slice(0, 10).forEach(s => {
      console.log(`${s.name} (ID: ${s.id}): ${s.sizeKB} KB`);
    });

    const totalSizeKB = sizes.reduce((acc, s) => acc + s.sizeKB, 0);
    console.log(`Total payload size: ${Math.round(totalSizeKB / 1024)} MB`);

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testFetch();
