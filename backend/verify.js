const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lpegmwrbdixvwwjfhhuo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZWdtd3JiZGl4dnd3amZoaHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MjkxMzEsImV4cCI6MjEwNTQwNTEzMX0.KCivauv0Ekgm4DToiypX0QqqxIE8ErKtCTrlaOg21vc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyTables() {
  console.log('Verifying Supabase database schema & seed data...\n');

  const tables = [
    { name: 'assessment_questions', expectedMin: 10 },
    { name: 'topics', expectedMin: 10 },
    { name: 'books', expectedMin: 5 },
    { name: 'resources', expectedMin: 5 },
    { name: 'achievements', expectedMin: 8 },
    { name: 'quiz_questions', expectedMin: 4 },
    { name: 'platform_settings', expectedMin: 1 },
    { name: 'profiles', expectedMin: 0 },
    { name: 'assessment_attempts', expectedMin: 0 },
    { name: 'learning_path_items', expectedMin: 0 },
    { name: 'quiz_attempts', expectedMin: 0 },
    { name: 'user_achievements', expectedMin: 0 },
    { name: 'tutor_conversations', expectedMin: 0 },
    { name: 'tutor_messages', expectedMin: 0 },
    { name: 'saved_circuits', expectedMin: 0 },
  ];

  const results = [];

  for (const t of tables) {
    try {
      const { data, error, count } = await supabase
        .from(t.name)
        .select('*', { count: 'exact', head: false });

      if (error) {
        results.push({ table: t.name, status: 'ERROR', error: error.message, count: 0 });
      } else {
        const rowCount = data ? data.length : 0;
        results.push({
          table: t.name,
          status: 'OK',
          count: rowCount,
          sample: rowCount > 0 ? data[0].id || data[0].name || data[0].title : null,
        });
      }
    } catch (e) {
      results.push({ table: t.name, status: 'EXCEPTION', error: e.message, count: 0 });
    }
  }

  console.log('Verification Results:');
  console.table(results);
}

verifyTables();
