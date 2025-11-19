-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Application specific user data)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Can be linked to auth.users.id
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('operator', 'admin')),
    is_online BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    permissions JSONB DEFAULT '{}'::jsonb
);

-- Script Steps
CREATE TABLE IF NOT EXISTS public.script_steps (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    content TEXT,
    "order" INTEGER,
    buttons JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    product_id TEXT,
    tabulations JSONB DEFAULT '[]'::jsonb,
    content_segments JSONB DEFAULT '[]'::jsonb,
    formatting JSONB DEFAULT '{}'::jsonb,
    alert JSONB
);

-- Tabulations
CREATE TABLE IF NOT EXISTS public.tabulations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Situations
CREATE TABLE IF NOT EXISTS public.service_situations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expanded BOOLEAN DEFAULT false
);

-- Channels
CREATE TABLE IF NOT EXISTS public.channels (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    contact TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id TEXT REFERENCES public.users(id),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    content TEXT,
    created_by TEXT,
    created_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    seen_by TEXT[] DEFAULT '{}',
    recipients TEXT[] DEFAULT '{}',
    segments JSONB DEFAULT '[]'::jsonb
);

-- Quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    question TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb,
    correct_answer TEXT,
    created_by TEXT,
    created_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    scheduled_date TIMESTAMPTZ,
    recipients TEXT[] DEFAULT '{}'
);

-- Quiz Attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    quiz_id TEXT REFERENCES public.quizzes(id),
    operator_id TEXT REFERENCES public.users(id),
    operator_name TEXT,
    selected_answer TEXT,
    is_correct BOOLEAN,
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    sender_id TEXT REFERENCES public.users(id),
    sender_name TEXT,
    sender_role TEXT,
    recipient_id TEXT,
    content TEXT,
    attachment JSONB,
    reply_to JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT false
);

-- Chat Settings
CREATE TABLE IF NOT EXISTS public.chat_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    is_enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    script_id TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    attendance_types TEXT[] DEFAULT '{}',
    person_types TEXT[] DEFAULT '{}',
    description TEXT
);

-- Attendance Types
CREATE TABLE IF NOT EXISTS public.attendance_types (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Person Types
CREATE TABLE IF NOT EXISTS public.person_types (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Presentations
CREATE TABLE IF NOT EXISTS public.presentations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    description TEXT,
    slides JSONB DEFAULT '[]'::jsonb,
    created_by TEXT,
    created_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    recipients TEXT[] DEFAULT '{}'
);

-- Presentation Progress
CREATE TABLE IF NOT EXISTS public.presentation_progress (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    presentation_id TEXT REFERENCES public.presentations(id),
    operator_id TEXT REFERENCES public.users(id),
    operator_name TEXT,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    marked_as_seen BOOLEAN DEFAULT false,
    completion_date TIMESTAMPTZ
);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.script_steps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tabulations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_situations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quizzes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_attempts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_types;
ALTER PUBLICATION supabase_realtime ADD TABLE public.person_types;
ALTER PUBLICATION supabase_realtime ADD TABLE public.presentations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.presentation_progress;

-- Create RLS Policies (Permissive for now to match current behavior, but enabled)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.users FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.script_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.script_steps FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.tabulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.tabulations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.service_situations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.service_situations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.channels FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.notes FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.quizzes FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.chat_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.chat_settings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.products FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.attendance_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.attendance_types FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.person_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.person_types FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.presentations FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.presentation_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all access for all users" ON public.presentation_progress FOR ALL USING (true) WITH CHECK (true);
