import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { getConfig } from '../config';

const config = getConfig();

// Public Client to manage users.
export const publicSupabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey,
);

// Private Client, initialize for each company.
export let privateSupabase: SupabaseClient;
export let currentUserEmail: string;
export let currentPassword: string;
export const initializePrivateSupabase = (url: string, anonKey: string) => {
  privateSupabase = createClient(url, anonKey);
};

export const userSession = async () => {
  const data = await privateSupabase.auth.getSession();
  if (data) {
    return data;
  }
};

export const getCurrentUser = async (
  client: SupabaseClient,
): Promise<User | null> => {
  const {
    data: { session },
  } = await client.auth.getSession();
  return session?.user || null;
};

export const fetchPrivateSetup = async (email: string) => {
  return await publicSupabase
    .from('private_projects')
    .select('project_url, anon_key')
    .contains('project_emails', [email])
    .single();
};

export const publicSignIn = async (email: string, password: string) => {
  return await publicSupabase.auth.signInWithPassword({ email, password });
};

export const privateSignIn = async (email: string, password: string) => {
  currentUserEmail = email;
  currentPassword = password;
  return await privateSupabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const getUserRole = async (): Promise<number> => {
  const user = await getCurrentUser(privateSupabase);
  const { data, error } = await privateSupabase
    .from('profiles')
    .select('role:roles(id)')
    .eq('id', user?.id)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
  }

  if (data && data.role) {
    const role = data.role as any;
    return role.id;
  }

  return 0;
};
