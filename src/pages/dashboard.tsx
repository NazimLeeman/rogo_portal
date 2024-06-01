import React, { useState } from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  InboxOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import UploadFeature from '../component/Upload/upload';
import StudentForm from '../component/StudentForm/studentForm';
import { publicSupabase } from '../api/SupabaseClient';

const { Header, Content, Footer, Sider } = Layout;

const navLabels = ['Students', 'Status', 'Info', 'Payment'];

const logoutLabel = [{
  key: '5',
  icon: React.createElement(LogoutOutlined),
  label: 'Logout'
}]

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: navLabels[index],
}));

const Dashboard: React.FC = () => {
  const [selectedNav, setSelectedNav] = useState<string | null>('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (key: string) => {
    setSelectedNav(key);
    // Optionally, you can add additional logic here to display different content based on the selected navigation item
  };

  const handleLogout = () => {
    Promise.all([publicSupabase.auth.signOut()])
      .then(() => {
        localStorage.clear();
        navigate("/");
      })
      .catch(error => {
        console.error("Error during sign out:", error);
      });
  };

  return (
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
          items={items}
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
            {selectedNav === '1' && (
              <div>
                <div className="text-xl">
                  <h1> Welcome to ROGO PORTAL</h1>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="p-8">
                    <p className="text-xl">Create a New Student File</p>
                  </div>
                  <div>
                    <StudentForm />
                  </div>
                  {/* <div style={{ padding: '2rem'}}>
                  Upload your necessary documents here:
                </div>
                <div style={{ alignItems: 'center', marginLeft: '2rem'}}><UploadFeature/></div> */}
                </div>
              </div>
            )}
            {selectedNav === '2' && <div>Content for Nav 2</div>}
            {selectedNav === '3' && <div>Content for Nav 3</div>}
            {selectedNav === '4' && <div>Content for Nav 4</div>}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Rogo Portal ©{new Date().getFullYear()} Created by Runtime Terror Squad
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
