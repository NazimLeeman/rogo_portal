import React, { useEffect, useState } from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Card, Layout, Menu, Modal, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useFile } from '../../context/FileContext';

const { Option } = Select;

const { Header, Content, Footer, Sider } = Layout;

const navLabels = ['Student Info', 'Student File', 'Status', 'Payment'];

const logoutLabel = [
  {
    key: '5',
    icon: React.createElement(LogoutOutlined),
    label: 'Logout',
  },
];

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

const StudentSidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

//   const {
//     token: { colorBgContainer, borderRadiusLG },
//   } = theme.useToken();

  const { selectedNav, setSelectedNav } = useFile();

  const navigate = useNavigate();

//   useEffect(() => {
//     getStudentInfo();
//   }, []);

//   useEffect(() => {
//     setSelectedStudent(null)
//   },[selectedNav])

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

  // const onChange = (value: string) => {
  //   const student = students?.find(student => student.id === value) || null;
  //   setSelectedStudent(student);
  //   console.log("selected", student);
  // };

  const onBlur = () => {
    console.log('blur');
  };

  const onFocus = () => {
    console.log('focus');
  };

  const onSearch = (val: string) => {
    console.log('search:', val);
  };

  const handleSudentFile = async (id: string) => {
    // navigate('/')
  }

  return (
    // <Layout style={{ minHeight: '100vh' }}>
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
     //</Layout> 
  );
};

export default StudentSidebar;
