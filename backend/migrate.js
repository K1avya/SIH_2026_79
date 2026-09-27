const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:SIH-2026-140@db.lpegmwrbdixvwwjfhhuo.supabase.co:5432/postgres';

async function runMigration() {
  console.log('Connecting to Supabase Postgres...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected successfully to database!');

    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing schema.sql migration...');
    await client.query(sql);
    console.log('Migration executed successfully!');

    // Check created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\nVerified tables in public schema:');
    res.rows.forEach(r => console.log(` - ${r.table_name}`));

  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
