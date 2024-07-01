import {
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, theme } from 'antd';
import { Loader } from 'lucide-react';
import React from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { publicSupabase } from './api/SupabaseClient';
import MagicLogin from './component/Login/magicLogin';
import Sidebar from './component/ui/sidebar';
import { useFile } from './context/FileContext';
import { useAuth } from './hooks/useAuth';
import { useRole } from './hooks/useRole';
import Dashboard from './pages/dashboard';
import StudentFiles from './pages/studentFiles';
import { routes } from './routes';

function App() {
  const { userId, loading } = useAuth();
  // const [selectedNav, setSelectedNav] = useState<any>('1');
  const { selectedNav, setSelectedNav } = useFile();
  const { userRole } = useRole();
  // const { userIdPrivate } = useSupabase();
  // const { onboardingSaved } = useOnboarding();
  // const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(
  //   null
  // );
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { Header, Content, Sider } = Layout;

  const navLabels = ['Student Info', 'Student File'];

  const studentNavLabels = ['Home'];

  const logoutLabel = [
    {
      key: '5',
      icon: React.createElement(LogoutOutlined),
      label: 'Logout',
    },
  ];

  const items = [UserOutlined, VideoCameraOutlined].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: navLabels[index],
  }));

  const studentItems = [UserOutlined].map((icon, index) => ({
    key: String(index + 1),
    icon: React.createElement(icon),
    label: studentNavLabels[index],
  }));

  const menuItems = userRole === 'Admin' ? items : studentItems;

  const handleNavClick = (key: string) => {
    setSelectedNav(key);
  };

  const handleLogout = () => {
    Promise.all([publicSupabase.auth.signOut()])
      .then(() => {
        localStorage.clear();
        navigate('/');
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
  };

  const excludedPaths = ['/login', '/register'];

  const isPathExcluded = excludedPaths.some((path) =>
    location.pathname.startsWith(path),
  );

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (!userId && !isPathExcluded) {
    return <Navigate to="/login" replace />;
  }

  if (currentPath === '/login') {
    return <MagicLogin />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <Sidebar />
      <div className="min-h-screen sm:pl-60">
        <Routes>
          {routes
            .filter((route) => route.path !== '/login')
            .map(({ path, element }, key) => (
              <Route key={key} path={path} element={element} />
            ))}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/student-files" element={<StudentFiles />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
