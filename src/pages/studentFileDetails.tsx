import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxProps,
} from 'antd';
import { useFile } from '../context/FileContext';
import { useNavigate } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import Step from '../component/Step/step';

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
    signedUrls(data)
    setFiles(data);
    return data || [];
};

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

  return (
    <>
      <Button className="mb-8" onClick={handleBack}>
        Back
      </Button>
      <div className='flex flex-row justify-between px-12'>
      <div className="space-y-6 w-2/4">       
      <div className="space-y-6">
        <p className="text-xl">Status Timeline</p>
        <Step statusType="fileStatus" />
      </div>
      <div className="space-y-6">
        <p className="text-xl">Services got from ROGO</p>
        <Checkbox onChange={onChange}>Admission</Checkbox>
        <Checkbox onChange={onChange}>Application</Checkbox>
      </div>
      <div className="space-y-6">
        <p className="text-xl">Payment History</p>
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
