import React, { useState, useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useNavigate } from 'react-router-dom';
import { StudentInfo } from '../../interface/studentInfo.interface';
import toast from 'react-hot-toast';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const StudentForm: React.FC = () => {
  //   const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const formRef = useRef<any>(null);

  const { Option } = Select;

  const navigate = useNavigate();

  const onFinish = async (values: StudentInfo) => {
    const { email, ...userData } = values;
    console.log('values', values);
    try {
      const { data, error } = await publicSupabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: 'https://lk.russianonthego.info/dashboard',
          // emailRedirectTo: 'http://localhost:5173/dashboard',
        },
      });
      if (error) {
        throw error;
      }
      if (data) {
        console.log('Successfully send email', data);
        postStudentInfo(values);
      }
    } catch (error: any) {
      console.error('Error inserting data:', error);
    }
  };

  const postStudentInfo = async (userData: StudentInfo) => {
    try {
      console.log('user', userData);
      const { data, error } = await publicSupabase.from('studentInfo').insert({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone_number: userData.phone_number,
      });
      if (error) {
        toast.error('Error while creating StudentInfo');
        throw error;
      }
      toast.success('Successfully created StudentInfo');
      formRef.current.resetFields();
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="USD">$</Option>
        <Option value="BDT">৳</Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      {/* <Checkbox
        checked={componentDisabled}
        onChange={(e) => setComponentDisabled(e.target.checked)}
      >
        Form disabled
      </Checkbox> */}
      <Form
        ref={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        // disabled={componentDisabled}
        style={{ maxWidth: 600 }}
      >
        {/* <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
          <Checkbox>Checkbox</Checkbox>
        </Form.Item> */}
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'Please input first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: 'Please input last name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input email!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phone_number"
          rules={[{ required: true, message: 'Please input phone number!' }]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item label="Program">
          <Select>
            <Select.Option value="honors">Honors</Select.Option>
            <Select.Option value="masters">Masters</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="budget"
          label="Budget"
        >
          <InputNumber addonAfter={suffixSelector} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item> */}
        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default StudentForm;
