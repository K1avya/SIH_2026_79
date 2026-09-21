const { Client } = require('pg');

const poolerUrl = 'postgresql://postgres.lpegmwrbdixvwwjfhhuo:SIH-2026-140@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString: poolerUrl,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  await client.connect();
  console.log('Connected to DB via pooler');

  const triggers = await client.query(`
    SELECT t.tgname, c.relname, p.proname
    FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_proc p ON p.oid = t.tgfoid
    WHERE c.relname IN ('users', 'profiles');
  `);
  console.log('Triggers:', JSON.stringify(triggers.rows, null, 2));

  const funcs = await client.query(`
    SELECT routine_name, routine_definition
    FROM information_schema.routines
    WHERE routine_name = 'handle_new_user';
  `);
  console.log('handle_new_user function:', JSON.stringify(funcs.rows, null, 2));

  const cols = await client.query(`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles';
  `);
  console.log('Profiles columns:', cols.rows.map(c => c.column_name));

  const constraints = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE conrelid = 'public.profiles'::regclass;
  `);
  console.log('Profiles constraints:', JSON.stringify(constraints.rows, null, 2));

  await client.end();
}

check().catch(console.error);
