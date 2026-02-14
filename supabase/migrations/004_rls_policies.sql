-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Users table policies
-- ============================================

-- Users can read their own row
CREATE POLICY "users_select_own"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own row
CREATE POLICY "users_update_own"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- User preferences table policies
-- ============================================

-- Users can read their own preferences
CREATE POLICY "user_preferences_select_own"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "user_preferences_insert_own"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "user_preferences_update_own"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Contacts table policies
-- ============================================

-- Users can read their own contacts
CREATE POLICY "contacts_select_own"
  ON public.contacts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own contacts
CREATE POLICY "contacts_insert_own"
  ON public.contacts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own contacts
CREATE POLICY "contacts_update_own"
  ON public.contacts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own contacts
CREATE POLICY "contacts_delete_own"
  ON public.contacts
  FOR DELETE
  USING (auth.uid() = user_id);
