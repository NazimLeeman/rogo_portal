import React from 'react';
import './login.css';
import { Button, Checkbox, Form, Input } from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  email: string;
  password: string;
  remember?: string;
};


const Login: React.FC = () => {

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register'); 
  };

    const onFinish = async (values:FieldType) => {
        const { remember, ...userData } = values;
        console.log('values',userData)
      try {
        const {data, error} = await publicSupabase.auth.signInWithPassword(userData)
        if (error) {
          throw error;
        }
        if(data) {
          console.log('Successfully Logged In', data);
          navigate('/dashboard')
        }
      } catch (error:any) {
        console.error('Error inserting data:', error.message);
      }
    };
  
    const onFinishFailed = (errorInfo:any) => {
      console.log('Failed:', errorInfo);
    };
  
    return (
      <div className='hero'>
        <div>
            <img src="" alt="" />
           <h1> Welcome to ROGO</h1>
        </div>
      <div className='loginContainer'>
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
  
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
  
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
      </div>
      <div><p>Don't have a account?</p></div>
        <div className='register'>
          <Button type="primary" htmlType="submit" onClick={handleRegisterClick}>
              Register
            </Button>
        </div>
      </div>
    );
  };
  
export default Login;