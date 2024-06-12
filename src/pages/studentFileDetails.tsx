import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxProps,
  Form,
  Input,
  Layout,
  Select,
  Upload,
  theme,
} from 'antd';
import { useFile } from '../context/FileContext';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import props from '../component/Upload/upload';
import { useParams } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import { Steps } from 'antd';
import Step from '../component/Step/step';

// interface FileObject {
//   name: string;
//   size: number;
//   type: string;
//   url: string;
//   // Add more properties if needed
// }

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
  // const { fileId } = useParams();
  const [files, setFiles] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<any>();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/file-submission');
  };

  useEffect(() => {
    getFilesForStudent()
  },[])

  // const onFinish = async (values: any) => {
  //   console.log('values', values);
  // };

  // const fetchFileDetails = async () => {
  //   try {
  //     const { data, error } = await publicSupabase
  //       .from('filedetails')
  //       .select('*')
  //       .eq('id', fileId);

  //     if (error) {
  //       throw error;
  //     }

  //     console.log(data);
  //     setFileData(data);
  //   } catch (error) {
  //     console.error('Error fetching file details:', error);
  //   }
  // };

  // const onFinishFailed = (errorInfo: any) => {
  //   console.log('Failed:', errorInfo);
  // };

  const onChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  const getFilesForStudent = async () => {
    const { data, error } = await publicSupabase.storage
        .from('avatars') // Replace 'avatars' with your bucket name
        .list(`${studentInfo?.id}/`);

    if (error) {
        throw error;
    }
    console.log('data from avatars',data)
    setFiles(data);
    return data || [];
};

const getFileUrl = (studentId:any, fileName:string) => {
  const publicUrl = publicSupabase.storage.from('avatars').getPublicUrl(`${studentId}/${fileName}`, {download: true});
  return publicUrl.data.publicUrl;
}

  return (
    <>
      <Button className="mb-8" onClick={handleBack}>
        Back
      </Button>
      <div className='flex flex-row justify-between px-12'>
      <div className="space-y-6">       
      <div className="space-y-6">
        <p className="text-xl">Status Timeline</p>
        <Step statusType="fileStatus" />
      </div>
      <div className="space-y-6">
        <p className="text-xl">Serives got from ROGO</p>
        <Checkbox onChange={onChange}>Admission</Checkbox>
        <Checkbox onChange={onChange}>Application</Checkbox>
      </div>
      <div className="space-y-6">
        <p className="text-xl">Status Timeline</p>
        <Step statusType="payment" />
      </div>
      </div>
      <div>
      <p className="text-xl">Documents</p>
      {files.length > 0 ? (
    <ul>
      {files.map((file) => (
        <li key={file.name}>
          <a href={getFileUrl(studentInfo?.id,file.name)} download={file.name} target="_blank" rel="noopener noreferrer">
            {file.name}
          </a>
        </li>
      ))}
    </ul>
  ) : (
    <p>No files available</p>
  )}
      </div>
      </div>
    </>
  );
};

export default StudentFileDetails;
