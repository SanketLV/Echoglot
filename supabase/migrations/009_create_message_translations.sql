-- Create message_translations table

CREATE TABLE public.message_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  target_lang TEXT NOT NULL,
  translated_content TEXT NOT NULL,
  engine TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(message_id, target_lang)
);

CREATE INDEX idx_message_translations_message_id ON public.message_translations(message_id);
