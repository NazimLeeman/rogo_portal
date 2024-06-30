import React from 'react';
// import './login.css';
import { Button, Checkbox, Form, Input } from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type FieldType = {
  email: string;
};

const MagicLogin: React.FC = () => {
  const navigate = useNavigate();

  // const handleRegisterClick = () => {
  //   navigate('/register');
  // }; 

  const onFinish = async (values: FieldType) => {
    try {
      const { data, error } = await publicSupabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: 'https://rogo-portal-two.vercel.app/',
          // emailRedirectTo: 'http://localhost:5173',
          // shouldCreateUser: false,
        },
      });
      if (error) {
        toast.error(error.message);
        throw error;
      }
      toast.success('Email sent successfully');
    } catch (error: any) {
      console.error('Error inserting data:', error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <h1 className="text-xl pl-16"> Welcome to ROGO</h1>
      </div>
      <div className="flex flex-col w-[40vw] p-8">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login with a magic link
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MagicLogin;
