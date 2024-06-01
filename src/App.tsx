import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { routes } from './routes';
import { useAuth } from "./hooks/useAuth";
// import { privateSupabase } from "./api/SupabaseClient";
// import { useSupabase } from "./context/supabaseContext";
// import { useOnboarding } from './context/onboardingContext';

function App() {
  const { userId, loading } = useAuth();
  // const { userIdPrivate } = useSupabase();
  // const { onboardingSaved } = useOnboarding();
  // const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
  //   null
  // );
  const location = useLocation();

  const excludedPaths = [
    "/login",
    "/register"
  ];

  const isPathExcluded = excludedPaths.some((path) => 
    location.pathname.startsWith(path)
  )

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (
  //   !isPathExcluded &&
  //   onboardingComplete === false &&
  //   onboardingSaved === false
  // ) {
  //   return <Navigate to="/register" replace />;
  // }

  if (!userId && !isPathExcluded) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Routes>
        {routes.map(({ path, element }, key) => (
          <Route key={key} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
