CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  notifications_enabled BOOLEAN DEFAULT true,
  auto_translate BOOLEAN DEFAULT true,
  default_input_lang TEXT DEFAULT 'en',
  default_output_lang TEXT DEFAULT 'es',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
