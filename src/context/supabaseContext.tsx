// import React, {
//     createContext,
//     useContext,
//     useState,
//     useEffect,
//     ReactNode,
//   } from "react";
//   import { SupabaseClient } from "@supabase/supabase-js";
//   import {
//     publicSupabase,
//     // initializePrivateSupabase,
//     // privateSupabase,
//     // userSession,
//     // getUserRole,
//   } from "../api/SupabaseClient";
  
//   interface ISupabaseContext {
//     // userIdPrivate: any;
//     // setUserIdPrivate: any;
//     publicSupabase: SupabaseClient;
//     // privateSupabase: SupabaseClient | null;
//     // initializePrivateSupabase: (url: string, anonKey: string) => void;
//     // userSession: () => Promise<any>;
//     // getUserRole: () => Promise<number>;
//   }
  
//   const SupabaseContext = createContext<ISupabaseContext>({
//     // userIdPrivate: "",
//     // setUserIdPrivate: "",
//     publicSupabase: publicSupabase,
//     // privateSupabase: privateSupabase,
//     // initializePrivateSupabase: initializePrivateSupabase,
//     // userSession: userSession,
//     // getUserRole: async () => 0,
//   });
  
//   export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({
//     children,
//   }) => {
//     const [privateClient, setPrivateClient] =
//       useState<SupabaseClient>(privateSupabase);
//     const [userIdPrivate, setUserIdPrivate] = useState(null);
//     useEffect(() => {
//       const projectUrl = localStorage.getItem("supabaseProjectUrl");
//       const anonKey = localStorage.getItem("supabaseAnonKey");
//       if (projectUrl && anonKey) {
//         initializePrivateSupabase(projectUrl, anonKey);
//       }
//     }, []);
  
//     const handleInitializePrivateSupabase = (url: string, anonKey: string) => {
//       initializePrivateSupabase(url, anonKey);
//       setPrivateClient(privateSupabase);
//     };
  
//     const value = {
//       userIdPrivate,
//       setUserIdPrivate,
//       publicSupabase,
//       privateSupabase: privateClient,
//       initializePrivateSupabase: handleInitializePrivateSupabase,
//       userSession: async () => {
//         return userSession();
//       },
//       getUserRole: async () => {
//         return await getUserRole();
//       },
//     };
//     return (
//       <SupabaseContext.Provider value={value}>
//         {children}
//       </SupabaseContext.Provider>
//     );
//   };
  
//   export const useSupabase = () => {
//     const context = useContext(SupabaseContext);
//     if (context === undefined) {
//       throw new Error("useSupabase must be used within a SupabaseProvider");
//     }
//     return context;
//   };
  