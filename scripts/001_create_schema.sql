-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('operator', 'admin')),
  is_online BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  permissions JSONB DEFAULT '{}'::jsonb
);

-- Login Sessions
CREATE TABLE IF NOT EXISTS login_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  script_id TEXT,
  category TEXT CHECK (category IN ('habitacional', 'comercial', 'outros')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  attendance_types TEXT[],
  person_types TEXT[],
  description TEXT
);

-- Script Steps
CREATE TABLE IF NOT EXISTS script_steps (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  buttons JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  tabulations JSONB DEFAULT '[]'::jsonb,
  content_segments JSONB DEFAULT '[]'::jsonb,
  formatting JSONB DEFAULT '{}'::jsonb,
  alert JSONB
);

-- Tabulations
CREATE TABLE IF NOT EXISTS tabulations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Situations
CREATE TABLE IF NOT EXISTS service_situations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expanded BOOLEAN DEFAULT false
);

-- Channels
CREATE TABLE IF NOT EXISTS channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  seen_by TEXT[] DEFAULT '{}',
  recipients TEXT[] DEFAULT '{}',
  segments JSONB DEFAULT '[]'::jsonb
);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  recipients TEXT[] DEFAULT '{}'
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT REFERENCES quizzes(id) ON DELETE CASCADE,
  operator_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  operator_name TEXT,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Settings
CREATE TABLE IF NOT EXISTS chat_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  is_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  sender_name TEXT,
  sender_role TEXT,
  recipient_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  attachment JSONB,
  reply_to JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

-- Call Sessions
CREATE TABLE IF NOT EXISTS call_sessions (
  id TEXT PRIMARY KEY,
  operator_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  current_step_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tabulation_id TEXT REFERENCES tabulations(id) ON DELETE SET NULL,
  situation_id TEXT REFERENCES service_situations(id) ON DELETE SET NULL,
  channel_id TEXT REFERENCES channels(id) ON DELETE SET NULL,
  notes TEXT[] DEFAULT '{}'
);

-- Presentations
CREATE TABLE IF NOT EXISTS presentations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  slides JSONB DEFAULT '[]'::jsonb,
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_by_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  recipients TEXT[] DEFAULT '{}'
);

-- Presentation Progress
CREATE TABLE IF NOT EXISTS presentation_progress (
  id TEXT PRIMARY KEY,
  presentation_id TEXT REFERENCES presentations(id) ON DELETE CASCADE,
  operator_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  operator_name TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  marked_as_seen BOOLEAN DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE
);

-- Attendance Types
CREATE TABLE IF NOT EXISTS attendance_types (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Person Types
CREATE TABLE IF NOT EXISTS person_types (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE person_types ENABLE ROW LEVEL SECURITY;

-- Create Policies (Open for now to allow initial seeding and development, restrict later)
DROP POLICY IF EXISTS "Enable all access for all users" ON users;
CREATE POLICY "Enable all access for all users" ON users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON login_sessions;
CREATE POLICY "Enable all access for all users" ON login_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON products;
CREATE POLICY "Enable all access for all users" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON script_steps;
CREATE POLICY "Enable all access for all users" ON script_steps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON tabulations;
CREATE POLICY "Enable all access for all users" ON tabulations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON service_situations;
CREATE POLICY "Enable all access for all users" ON service_situations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON channels;
CREATE POLICY "Enable all access for all users" ON channels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON notes;
CREATE POLICY "Enable all access for all users" ON notes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON messages;
CREATE POLICY "Enable all access for all users" ON messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON quizzes;
CREATE POLICY "Enable all access for all users" ON quizzes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON quiz_attempts;
CREATE POLICY "Enable all access for all users" ON quiz_attempts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON chat_settings;
CREATE POLICY "Enable all access for all users" ON chat_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON chat_messages;
CREATE POLICY "Enable all access for all users" ON chat_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON call_sessions;
CREATE POLICY "Enable all access for all users" ON call_sessions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON presentations;
CREATE POLICY "Enable all access for all users" ON presentations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON presentation_progress;
CREATE POLICY "Enable all access for all users" ON presentation_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON attendance_types;
CREATE POLICY "Enable all access for all users" ON attendance_types FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for all users" ON person_types;
CREATE POLICY "Enable all access for all users" ON person_types FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for all tables
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE users; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE login_sessions; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE products; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE script_steps; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE tabulations; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE service_situations; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE channels; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE notes; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE messages; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE quizzes; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE quiz_attempts; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE chat_settings; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE call_sessions; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE presentations; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE presentation_progress; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE attendance_types; EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE person_types; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
