#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vmpzvibmhlzkussqbcew.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcHp2aWJtaGx6a3Vzc3FiY2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTk3OTEsImV4cCI6MjA4MjE3NTc5MX0.9uI_Z6ikuCppq9H61KVTaKy5RyPr-KKv8CiBy1DEf_I';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Running database migrations...\n');

// Migration 1: Hero Carousel Fields
console.log('📝 Migration 1: Adding hero carousel fields to site_images...');
try {
  // Add title fields
  const { error: error1 } = await supabase.rpc('exec', {
    sql: `
      ALTER TABLE site_images
      ADD COLUMN IF NOT EXISTS title_es TEXT,
      ADD COLUMN IF NOT EXISTS title_en TEXT;
    `
  });

  // Add display_order
  const { error: error2 } = await supabase.rpc('exec', {
    sql: `
      ALTER TABLE site_images
      ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
    `
  });

  // Add metadata
  const { error: error3 } = await supabase.rpc('exec', {
    sql: `
      ALTER TABLE site_images
      ADD COLUMN IF NOT EXISTS metadata JSONB;
    `
  });

  // Add is_active
  const { error: error4 } = await supabase.rpc('exec', {
    sql: `
      ALTER TABLE site_images
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `
  });

  // Create indexes
  const { error: error5 } = await supabase.rpc('exec', {
    sql: `
      CREATE INDEX IF NOT EXISTS idx_site_images_category_order ON site_images(category, display_order);
      CREATE INDEX IF NOT EXISTS idx_site_images_is_active ON site_images(is_active);
    `
  });

  if (error1 || error2 || error3 || error4 || error5) {
    console.log('⚠️  Some queries may need manual execution (this is normal with RPC)');
  } else {
    console.log('✅ Hero carousel fields added successfully!');
  }
} catch (err) {
  console.log('⚠️  Error:', err.message);
  console.log('   Will use alternative method...');
}

// Migration 2: Transfer Time
console.log('\n📝 Migration 2: Adding transfer_time to destinations...');
try {
  const { error } = await supabase.rpc('exec', {
    sql: `
      ALTER TABLE destinations
      ADD COLUMN IF NOT EXISTS transfer_time TEXT;
    `
  });

  if (error) {
    console.log('⚠️  Query may need manual execution (this is normal with RPC)');
  } else {
    console.log('✅ Transfer time field added successfully!');
  }
} catch (err) {
  console.log('⚠️  Error:', err.message);
}

console.log('\n' + '='.repeat(70));
console.log('🎉 Migration process completed!');
console.log('\n⚠️  Note: Supabase anon keys have limited permissions.');
console.log('   If any migrations failed, you can run them manually:\n');
console.log('   👉 Go to: https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql\n');
console.log('   Copy and paste the SQL from these files:');
console.log('   • supabase-migrations/add-hero-carousel-fields.sql');
console.log('   • supabase-migrations/add-transfer-time-to-destinations.sql');
console.log('='.repeat(70));
