import { useState, useEffect } from 'react';
import { useSupabase } from '../context/supabaseContext';

export const useRole = () => {
  //   const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  //   const [userIdPrivate, setUserIdPrivate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { publicSupabase, userId } = useSupabase();
  useEffect(() => {
    // Attempt to recover session from localStorage first

    const localRoleSession = localStorage.getItem('supabase.auth.role');
    const sessionRoleData = localRoleSession && JSON.parse(localRoleSession);
    const userRoleFromStorage = sessionRoleData?.role || null;
    const localAuthSession = localStorage.getItem('supabase.auth.token');
    const sessionAuthData = localAuthSession && JSON.parse(localAuthSession);
    const userIdFromStorage = sessionAuthData?.currentSession?.user?.id || null;
    if (userRoleFromStorage) {
      setUserRole(userRoleFromStorage);
      setLoading(false);
    }

    const getUserRole = async () => {
      const { data, error } = await publicSupabase
        .from('profiles')
        .select('role')
        .eq('id', userIdFromStorage)
        .single();

      if (error) {
        console.log('userId', userIdFromStorage);
        console.error('Error fetching session:', error.message);
      }

      //   if (data && data.role === 1) {
      //             setUserRole("Admin")
      //         } else {
      //             setUserRole("Student")
      //         }

      const session = data?.role === 1 ? 'Admin' : 'Student';

      const currentUserId = session;
      if (currentUserId) {
        localStorage.setItem(
          'supabase.auth.role',
          JSON.stringify({ currentRole: currentUserId }),
        );
      }
      setUserRole(currentUserId);
      setLoading(false);
    };

    if (!userRoleFromStorage && userId !== null) {
      getUserRole();
    }

    // const { data: authListener } = publicSupabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     const currentUserId = session?.user?.id || null;
    //     if (currentUserId) {
    //       localStorage.setItem(
    //         'supabase.auth.token',
    //         JSON.stringify({ currentSession: session }),
    //       );
    //     } else {
    //       localStorage.removeItem('supabase.auth.token');
    //     }
    //     setUserId(currentUserId);
    //     setLoading(false);
    //   },
    // );

    // return () => {
    //   authListener.subscription.unsubscribe();
    // };
  }, [userId]);

  //   const getUserRole = async () => {
  //     const { data, error } = await publicSupabase
  //       .from('profiles')
  //       .select('role')
  //       .eq('id', userId)
  //       .single();

  //     if (error) {
  //       console.error('Error fetching user role:', error);
  //     }

  //     if (data && data.role === 1) {
  //       setRole("Admin")
  //     } else {
  //       setRole("Student")
  //     }
  //   };

  return {
    userRole,
    loading,
    // userIdPrivate,
    // setUserIdPrivate
  };
};
