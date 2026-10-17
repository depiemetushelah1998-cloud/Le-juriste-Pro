-- ==============================================================================
-- SCHÉMA SUPABASE & RLS POUR "LE JURISTE PRO"
-- À exécuter dans la console Supabase (SQL Editor)
-- ==============================================================================

-- 1. Création de la table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_expires_at TIMESTAMPTZ DEFAULT NULL,
  module_levels JSONB DEFAULT '{}'::jsonb,
  saved_quiz_positions JSONB DEFAULT '{}'::jsonb,
  user_stats JSONB DEFAULT '{"totalAnswered":0,"correctAnswered":0,"examsCompleted":0}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la table existe déjà, s'assurer que les nouvelles colonnes sont présentes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS module_levels JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS saved_quiz_positions JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_stats JSONB DEFAULT '{"totalAnswered":0,"correctAnswered":0,"examsCompleted":0}'::jsonb;


-- Activation de la sécurité au niveau des lignes (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Règles de Sécurité RLS
-- Les utilisateurs peuvent lire uniquement leur propre profil
CREATE POLICY "Users can read own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Les utilisateurs peuvent insérer leur propre profil
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent modifier leur propre profil
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- 3. Déclencheur automatique (Trigger) pour créer un profil à chaque inscription Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_expires_at)
  VALUES (new.id, new.email, NULL)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
