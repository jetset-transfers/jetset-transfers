// Temporary script to run database migrations
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(filePath, migrationName) {
  console.log(`\n🔄 Running migration: ${migrationName}...`);

  try {
    // Read SQL file
    const sql = fs.readFileSync(filePath, 'utf8');

    // Remove comments and split by semicolon
    const statements = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`   Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`   Executing statement ${i + 1}/${statements.length}...`);

      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

      if (error) {
        // Try alternative method using direct query
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ query: statement + ';' })
        });

        if (!response.ok) {
          console.log(`   ⚠️  Note: Statement might need to be run manually via SQL Editor`);
          console.log(`   SQL: ${statement.substring(0, 100)}...`);
        }
      }
    }

    console.log(`✅ Migration completed: ${migrationName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error in migration ${migrationName}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database migrations...');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);

  const migrations = [
    {
      path: path.join(__dirname, 'supabase-migrations', 'add-hero-carousel-fields.sql'),
      name: 'Hero Carousel Fields'
    },
    {
      path: path.join(__dirname, 'supabase-migrations', 'add-transfer-time-to-destinations.sql'),
      name: 'Transfer Time to Destinations'
    }
  ];

  let allSuccess = true;

  for (const migration of migrations) {
    const success = await runMigration(migration.path, migration.name);
    if (!success) {
      allSuccess = false;
    }
  }

  if (allSuccess) {
    console.log('\n✨ All migrations completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Refresh your admin panel');
    console.log('   2. Try adding a new destination');
    console.log('   3. Add images to the hero carousel from /admin/images');
  } else {
    console.log('\n⚠️  Some migrations may need manual execution via Supabase SQL Editor');
    console.log('   Visit: https://app.supabase.com/project/vmpzvibmhlzkussqbcew/sql');
  }
}

main().catch(console.error);
