import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Layout, Select, Upload, theme } from 'antd';
import { useFile } from '../context/FileContext';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import props from '../component/Upload/upload';
import { useParams } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import { Steps } from 'antd';
import Step from '../component/Step/step';

// let description = 'This is a description.';
// const Step: React.FC = () => {
//   return (
//     <Steps
//       direction="vertical"
//       current={1}
//       items={[
//         {
//           title: 'Pending',
//           description,
//         },
//         {
//           title: 'Wating',
//           description,
//         },
//         {
//           title: 'Waiting',
//           description,
//         },
//       ]}
//     />
//   );
// };

const StudentFileDetails: React.FC = () => {
  const {
    selectedNav,
    setSelectedNav,
    studentInfo,
    setStudentInfo,
    studentFiles,
    setStudentFiles,
    fileData,
    setFileData,
  } = useFile();
  const { fileId } = useParams();

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
    navigate('/file-submission');
  };

  const onFinish = async (values: any) => {
    console.log('values', values);
  };

  const fetchFileDetails = async () => {
    try {
      const { data, error } = await publicSupabase
        .from('filedetails')
        .select('*')
        .eq('id', fileId);

      if (error) {
        throw error;
      }

      console.log(data);
      setFileData(data);
    } catch (error) {
      console.error('Error fetching file details:', error);
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
      <div>
        <p className="mb-4">Status Timeline</p>
        <Step />
      </div>
    </>
  );
};

export default StudentFileDetails;
