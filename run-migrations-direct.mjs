// Direct migration script using fetch to Supabase REST API
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials
const SUPABASE_URL = 'https://vmpzvibmhlzkussqbcew.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcHp2aWJtaGx6a3Vzc3FiY2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTk3OTEsImV4cCI6MjA4MjE3NTc5MX0.9uI_Z6ikuCppq9H61KVTaKy5RyPr-KKv8CiBy1DEf_I';

async function executeSQLFile(filePath, migrationName) {
  console.log(`\n🔄 Preparing migration: ${migrationName}...`);

  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');

    // Clean the SQL (remove comments, keep only executable statements)
    const cleanSQL = sqlContent
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('--');
      })
      .join('\n');

    console.log(`📝 SQL Content:\n${cleanSQL}\n`);

    // Execute using Supabase REST API endpoint for SQL queries
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        sql: cleanSQL
      })
    });

    if (response.ok || response.status === 204) {
      console.log(`✅ Migration successful: ${migrationName}`);
      return true;
    } else {
      const errorText = await response.text();
      console.log(`⚠️  API response status: ${response.status}`);
      console.log(`⚠️  Response: ${errorText}`);
      console.log(`\n📋 Please run this SQL manually in Supabase SQL Editor:`);
      console.log(`   https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error executing ${migrationName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database migrations...');
  console.log(`📍 Target: ${SUPABASE_URL}\n`);

  const migrations = [
    {
      path: path.join(__dirname, 'supabase-migrations', 'add-hero-carousel-fields.sql'),
      name: 'Hero Carousel Fields'
    },
    {
      path: path.join(__dirname, 'supabase-migrations', 'add-transfer-time-to-destinations.sql'),
      name: 'Transfer Time'
    }
  ];

  console.log(`📦 Total migrations to run: ${migrations.length}\n`);

  let successCount = 0;

  for (const migration of migrations) {
    const success = await executeSQLFile(migration.path, migration.name);
    if (success) successCount++;
  }

  console.log('\n' + '='.repeat(60));
  if (successCount === migrations.length) {
    console.log('✨ All migrations completed successfully!');
    console.log('\n📝 What you can do now:');
    console.log('   ✓ Refresh your admin panel (/admin)');
    console.log('   ✓ Add a new destination with transfer time');
    console.log('   ✓ Upload hero carousel images from /admin/images');
  } else {
    console.log(`⚠️  ${migrations.length - successCount} migration(s) may need manual execution`);
    console.log('\n📋 Manual migration steps:');
    console.log('   1. Go to: https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql');
    console.log('   2. Copy the SQL from the migration files');
    console.log('   3. Execute in the SQL Editor');
  }
  console.log('='.repeat(60));
}

main();
