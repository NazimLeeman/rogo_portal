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
  const [downloadUrl, setDownloadUrl] = useState<any[]>([]);
  const [ userRole, setUserRole] = useState<any>("")
  
  
  const navigate = useNavigate();

  const getUserRole = () => {
    const localRoleSession = localStorage.getItem('supabase.auth.role');
    const sessionRoleData = localRoleSession && JSON.parse(localRoleSession);
    const userRoleFromStorage = sessionRoleData?.currentRole || null;
    console.log('sessionRole', sessionRoleData)
    console.log('userRoleeeeeeeeeee', userRoleFromStorage)
    setUserRole(userRoleFromStorage)
  }

  const handleBack = () => {
    if(userRole === 'Admin') {
      navigate('/dashboard')
    } else {
      navigate('/file-submission');
    }
  };

  useEffect(() => {
    getUserRole()
    getFilesForStudent()
  },[])

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
    console.log('listtttttttttt', studentInfo?.id)
    console.log('data from avatars',data)
    signedUrls(data)
    setFiles(data);
    return data || [];
};

const getFileUrl = (studentId:any, fileName:string) => {
  const publicUrl = publicSupabase.storage.from('avatars').getPublicUrl(`${studentId}/${fileName}`, {download: true});
  return publicUrl.data.publicUrl;
}

const signedUrls = async(resultData:any) => {
  const name = resultData.map((item:any) => {
    return `${studentInfo?.id}/${item.name}`
  })
  const { data, error } = await publicSupabase
  .storage
  .from('avatars')
  .createSignedUrls(name, 60, { download: true}) 

  if(error) {
    throw error;
  }
  setDownloadUrl(data)
  console.log('signedddddd urls', data)
} 

//https://hjepyfajiikqdtdwcert.supabase.co/storage/v1/object/public/avatars/f3556710-58a1-4f42-9a53-cd1826ff575c/Screenshot%20from%202024-06-05%2011-03-39.png
//https://hjepyfajiikqdtdwcert.supabase.co/storage/v1/object/sign/avatars/f3556710-58a1-4f42-9a53-cd1826ff575c/Screenshot%20from%202024-06-05%2011-03-39.png

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
      {downloadUrl.length > 0 ? (
      <div >
        <ul className='grid grid-cols-2 gap-6'>
          {downloadUrl.map((file:any) => (
            <li key={file.path}>
             <img src={file.signedUrl} style={{ width:"300px", height:"150px"}} />
             {userRole === "Admin" && (
              <a href={file.signedUrl} rel="noopener noreferrer">
        Download
      </a>
             )}   
           </li>
          ))}
        </ul>
        </div>
  ) : (
    <p>No files available</p>
  )}
      </div>
      </div>
    </>
  );
};

export default StudentFileDetails;
