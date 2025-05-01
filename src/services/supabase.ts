import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qdjenqohslglkrcarirf.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkamVucW9oc2xnbGtyY2FyaXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MDk0MTEsImV4cCI6MjA2MDI4NTQxMX0.pXnfoYOXyvCLWE5RZy5TNUS7wLw3WF6lLsSuGLbKDI0';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if a user is an admin
export const isAdmin = async (user: any) => {
  if (!user) return false;

  // Since we're only using Supabase for admin authentication,
  // any authenticated Supabase user is considered an admin
  return true;
};
