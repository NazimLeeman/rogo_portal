import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Layout, Select, Upload, theme } from 'antd';
import { useFile } from '../context/FileContext';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import props from '../component/Upload/upload';
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
        setStudentFiles 
    } = useFile();

    useEffect(() => {
      // This will log the updated studentInfo value whenever it changes
      console.log('studentInfo:', studentInfo);
    }, [studentInfo]);

    // let initialValue = {};

    const formRef = useRef<any>(null);

    // if(studentInfo) {
         const initialValue = {
            first_name: studentInfo?.first_name,
            last_name: studentInfo?.last_name,
            email: studentInfo?.email,
            phone_number: studentInfo?.phone_number,
            university_name: studentFiles?.university_name,
            program: studentFiles?.program,
            subject: studentFiles?.subject,
            budget: studentFiles?.budget
        }
    // }

    useEffect(() => {
      console.log('initial', initialValue)
    })

  const { Option } = Select;

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard')
  }

  const onFinish = async (values:any) => {
    console.log('values', values);
    try {

      const { data: fileDetailsData, error: fileDetailsError } = await publicSupabase
    .from('filedetails')
  .insert([
    {
      studentid: studentInfo?.id,
    studentfileid: studentFiles?.id
      }
    ])
    .select(); 

    if (fileDetailsError) {
      toast.error("Error while submitting file.")
      throw fileDetailsError;
    }
    const fileId = fileDetailsData[0].id;
      toast.success('File submitted successfully');
    navigate(`/file-details/${fileId}`)

    } catch(error) {
      console.log(error)
    }
    
  };

//   const postStudentInfo = async (userData) => {
//     try {
//       console.log('user',userData)
//       const { data, error } = await publicSupabase
//         .from('studentInfo')
//         .insert({
//           first_name: userData.first_name,
//           last_name: userData.last_name,
//           email: userData.email,
//           phone_number: userData.phone_number
//         });
//       if (error) {
//         toast.error("Error while creating StudentInfo")
//         throw error;
//       } 
//       toast.success("Successfully created StudentInfo");
//       formRef.current.resetFields();
//     } catch (error) {
//       console.error('ERROR: ', error);
//     }
//   };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

    return (
        <>
        <Button className='mb-8' onClick={handleBack}>Back</Button>
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
            budget: studentFiles?.budget
        }}
      >
          <h1>Info section</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
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
        {/* <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item> */}
        </div>
        <h1>File section</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <Form.Item 
          label="Universtiy Name"
          name="university_name"
          rules={[{ required: true, message: 'Please input first name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
        label="Program"
        name="program"
          rules={[{ required: true, message: 'Please input last name!' }]}
          >
          <Input />
        </Form.Item>
        <Form.Item 
        label="Subject"
        name="subject"
          rules={[{ required: true, message: 'Please input email!' }]}
        >
          <Input />
        </Form.Item>    
        <Form.Item
          label="Budget"
          name="budget"
          rules={[{ required: true, message: 'Please input phone number!' }]}
        >
          <Input />
        </Form.Item>
        </div>
        <h1>Upload section</h1>
        <div style={{ display: 'grid', paddingLeft: '200px',  gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', rowGap: '40px' }}>
        <UploadFeature />
        </div>
        <Form.Item className='pl-60 pt-8' >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> 
      </Form>
    </>
    )
}

export default StudentFileSubmission;