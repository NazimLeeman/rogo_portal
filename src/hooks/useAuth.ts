import { useState, useEffect } from 'react';
import { useSupabase } from '../context/supabaseContext';
import { Session } from '@supabase/supabase-js';

export const useAuth = () => {
  // const [userId, setUserId] = useState<string | null>(null);
  //   const [userIdPrivate, setUserIdPrivate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { publicSupabase, userId, setUserId, userEmail, setUserEmail } = useSupabase();
  useEffect(() => {
    // Attempt to recover session from localStorage first
    
    const localSession = localStorage.getItem('supabase.auth.token');
    const sessionData = localSession && JSON.parse(localSession);
    const userIdFromStorage = sessionData?.currentSession?.user?.id || null;
    const userEmailFromStorage = sessionData?.currentSession?.user?.user_metadata?.email || null;
    if (userIdFromStorage) {
      setUserEmail(userEmailFromStorage)
      setUserId(userIdFromStorage);
      setLoading(false);
      }
      
      const fetchSession = async () => {
        const { data, error } = await publicSupabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error.message);
          }

      const session = (data.session as Session) || null;

      const currentUserId = session?.user?.id || null;
      if (currentUserId) {
        localStorage.setItem(
          'supabase.auth.token',
          JSON.stringify({ currentSession: session }),
        );
      }
      setUserId(currentUserId);
      setLoading(false);
    };

    if (!userIdFromStorage) {
      fetchSession();
    }

    const { data: authListener } = publicSupabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUserId = session?.user?.id || null;
        if (currentUserId) {
          localStorage.setItem(
            'supabase.auth.token',
            JSON.stringify({ currentSession: session }),
          );
        } else {
          localStorage.removeItem('supabase.auth.token');
        }
        setUserId(currentUserId);
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    userId,
    loading,
    // userIdPrivate,
    // setUserIdPrivate
  };
};
