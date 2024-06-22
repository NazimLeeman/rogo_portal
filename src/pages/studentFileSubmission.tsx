import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Layout, Select, Upload, theme } from 'antd';
import { useFile } from '../context/FileContext';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import UploadFeature from '../component/Upload/supabaseUpload';
import { publicSupabase } from '../api/SupabaseClient';
import toast from 'react-hot-toast';

const StudentFileSubmission: React.FC = () => {
  const {
    selectedNav,
    setSelectedNav,
    studentInfo,
    setStudentInfo,
    studentFiles,
    setStudentFiles,
  } = useFile();

  // useEffect(() => {
  //   // This will log the updated studentInfo value whenever it changes
  //   console.log('studentInfo:', studentInfo);
  // }, [studentInfo]);

  const formRef = useRef<any>(null);

  const initialValue = {
    first_name: studentInfo?.first_name,
    last_name: studentInfo?.last_name,
    email: studentInfo?.email,
    phone_number: studentInfo?.phone_number,
    university_name: studentFiles?.university_name,
    program: studentFiles?.program,
    subject: studentFiles?.subject,
    budget: studentFiles?.budget,
  };

  const { Option } = Select;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/agreement');
  };

  const onFinish = async (values: any) => {
    console.log('values', values);
    try {
      const { data: fileDetailsData, error: fileDetailsError } =
        await publicSupabase
          .from('filedetails')
          .insert([
            {
              studentid: studentInfo?.id,
              studentfileid: studentFiles?.id,
              budget: studentFiles?.budget
            },
          ])
          .select();

      if (fileDetailsError) {
        toast.error('Error while submitting file.');
        throw fileDetailsError;
      }
      const fileId = fileDetailsData[0].id;
      toast.success('File submitted successfully');
      navigate(`/file-details/${fileId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Button className="mb-8" onClick={handleBack}>
        Back
      </Button>
      <Form
        ref={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          first_name: initialValue.first_name,
          last_name: initialValue.last_name,
          email: initialValue.email,
          phone_number: initialValue.phone_number,
          university_name: studentFiles?.university_name,
          program: studentFiles?.program,
          subject: studentFiles?.subject,
          budget: studentFiles?.budget,
        }}
      >
        <h1>Info section</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input email!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input disabled />
          </Form.Item>
        </div>
        <h1>File section</h1>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}
        >
          <Form.Item
            label="Universtiy Name"
            name="university_name"
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Program"
            name="program"
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: 'Please input email!' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Budget"
            name="budget"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input disabled />
          </Form.Item>
        </div>
        <h1>Upload section</h1>
        <div
          style={{
            display: 'grid',
            paddingLeft: '200px',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            rowGap: '32px',
          }}
        >
          <UploadFeature />
        </div>
      </Form>
    </>
  );
};

export default StudentFileSubmission;
