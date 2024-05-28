type Config = {
    supabaseAnonKey: string;
    supabaseUrl: string;
  };
  
  export const getConfig = (): Config => {
    const {
      VITE_REACT_APP_SUPABASE_ANON_KEY,
      VITE_REACT_APP_SUPABASE_URL
    } = import.meta.env;
  
    if (!VITE_REACT_APP_SUPABASE_ANON_KEY || !VITE_REACT_APP_SUPABASE_URL) {
      throw new Error("One or more required environment variables are not defined.");
    }
  
    return {
      supabaseAnonKey: VITE_REACT_APP_SUPABASE_ANON_KEY,
      supabaseUrl: VITE_REACT_APP_SUPABASE_URL,
    };
  };
  