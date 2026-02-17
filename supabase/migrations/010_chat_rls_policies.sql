-- RLS policies for chat tables

-- conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_select_member"
  ON public.conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_members.conversation_id = conversations.id
        AND conversation_members.user_id = auth.uid()
    )
  );

-- conversation_members
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversation_members_select_own"
  ON public.conversation_members
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "conversation_members_insert_own"
  ON public.conversation_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "conversation_members_update_own"
  ON public.conversation_members
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_member"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_members.conversation_id = messages.conversation_id
        AND conversation_members.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_member"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversation_members
      WHERE conversation_members.conversation_id = messages.conversation_id
        AND conversation_members.user_id = auth.uid()
    )
  );

-- message_translations
ALTER TABLE public.message_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_translations_select_member"
  ON public.message_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages
      JOIN public.conversation_members
        ON conversation_members.conversation_id = messages.conversation_id
      WHERE messages.id = message_translations.message_id
        AND conversation_members.user_id = auth.uid()
    )
  );
