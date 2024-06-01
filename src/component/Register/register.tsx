import React from 'react';
// import './register.css';
import { Button, Form, Input, Select } from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useNavigate } from 'react-router-dom';

type RegisterFieldType = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFieldType) => {
    console.log('values', values);
    const { email, password, confirmPassword, firstName, lastName, role } =
      values;
    if (password !== confirmPassword) {
      console.error('Passwords do not match!');
      return;
    }

    try {
      // Register user with Supabase
      const { data, error } = await publicSupabase.auth.signUp({
        email: email!,
        password: password!,
      });

      console.log(error, data);

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('User registered successfully:', data);

        // Insert additional user data including role into custom table
        const { error: insertError } = await publicSupabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            role: role, // Insert role
          });

        if (insertError) {
          throw insertError;
        }

        console.log('Additional user data inserted successfully');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Error registering user:', error.message);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div>
        <h1 className="text-xl"> Complete your registeration seamlessly </h1>
      </div>
      <div className="w-[40vw] text-center p-16">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
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

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The new password that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: 'Please input your first name!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: 'Please input your last name!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="manager">Manager</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
