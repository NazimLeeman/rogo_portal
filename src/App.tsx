import {
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
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
import { useFile } from './context/FileContext';
import { useAuth } from './hooks/useAuth';
import { useRole } from './hooks/useRole';
import Dashboard from './pages/dashboard';
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
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedNav ? [selectedNav] : []}
            onClick={(info) => handleNavClick(info.key)}
            items={menuItems}
          />
          <Menu
            theme="dark"
            mode="inline"
            items={logoutLabel}
            onClick={() => handleLogout()}
            style={{ position: 'absolute', bottom: 0, width: '100%' }}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: '24px 16px 0' }}>
            <div
              style={{
                padding: 24,
                minHeight: '80vh',
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                {routes
                  .filter((route) => route.path !== '/login')
                  .map(({ path, element }, key) => (
                    <Route key={key} path={path} element={element} />
                  ))}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
