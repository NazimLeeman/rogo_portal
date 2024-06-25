import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxProps,
  Form,
  Input,
  Modal,
  Spin,
} from 'antd';
import { useFile } from '../context/FileContext';
import { useNavigate, useParams } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import { PlusOutlined } from '@ant-design/icons';
import Step from '../component/Step/step';
import toast from 'react-hot-toast';

const StudentFileDetails: React.FC = () => {
  const { fileId } = useParams();
  const {
    step,
  } = useFile();
  const [files, setFiles] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<any[]>([]);
  const [ userRole, setUserRole] = useState<any>("")
  const [services, setServices] = useState<any>([]);
  const [servicesObj, setServicesObj] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [form] = Form.useForm();
  
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

  // useEffect(() => {
  //   getUserRole()
  //   getFilesForStudent()
  //   getStudentId()
  // },[])
  useEffect(() => {
    const fetchData = async () => {
      getUserRole();
      await getStudentId();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      if (studentId) {
        try {
          await getFilesForStudent(studentId);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      }
    };
    fetchFiles();
  }, [studentId]);

  const onChange: CheckboxProps['onChange'] = (e) => {
    const checkValue = e.target.checked
    console.log(`checked = ${checkValue}`);
  };

  const changeServiceCheck = (serviceCheck:any, check:boolean) => {
    console.log('service',serviceCheck)
    console.log('check',check)
    console.log('services obj',servicesObj)
    const newServicesObj = { ...servicesObj };
  
  if (serviceCheck in newServicesObj) {
    newServicesObj[serviceCheck] = !check;
  }

  console.log('new services obj', newServicesObj);
  updateServiceCheck(newServicesObj)
  }

  const updateServiceCheck = async(newServicesObj:any) => {
    const {data,error} = await publicSupabase
      .from('filedetails')
      .update({ servicesobj: newServicesObj })
      .eq('id',fileId)
      .select();

  if (error) {
    console.error('Error updating service check:', error);
    return null;
  }
  setServicesObj(data[0].servicesobj)
  console.log('update service check',data) 
  }

  const addNewService = () => {
    // setServices([...services, `New Service ${services.length + 1}`]);
    showModal()
  };

  const showModal = () => {
    setOpen(true);
  };

  const getFilesForStudent = async (studentId:string) => {
    const { data, error } = await publicSupabase.storage
        .from('avatars') // Replace 'avatars' with your bucket name
        .list(`${studentId}/`);

    if (error) {
        throw error;
    }
    console.log('data',data)
    signedUrls(data)
    setFiles(data);
    return data || [];
};

const signedUrls = async(resultData:any) => {
  if(resultData.length < 1) {
    // toast.error('No File Found')
    throw new Error
  }
  const name = resultData.map((item:any) => {
    return `${studentId}/${item.name}`
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

const getStudentId = async() => {
  try {
  const {data, error} = await publicSupabase
  .from('filedetails')
  .select()
  .eq('id',fileId);
  if(error) {
    console.log('error', error)
  throw new Error
  }
  console.log('from file detailssssssss',data[0])
  console.log('services obj',data[0].servicesobj)
  setServicesObj(data[0].servicesobj)
  setServices(data[0].services)
  setStudentId(data[0].studentid)
  } catch(error) {
    console.log(error)
  }
}

const updateServices = async() => {
  const values = await form.validateFields();
  // const newService = {[values.service]: false}
  const updatedServices = {...servicesObj, [values.service]: false};
  console.log('valuesssssssssssssssssssssssssssssssssss', updatedServices)
  const {data, error} = await publicSupabase
    .from('filedetails')
    .update({servicesobj: updatedServices})
    .eq('id',fileId)
    .select();

    if(error) {
      console.log('error',error)
      throw new Error
    }
    console.log('new servicesssssssssssssssssss',data)
    setServicesObj(updatedServices)
    setOpen(false)
}

const handleCancel = () => {
  setOpen(false);
  form.resetFields();
};

  return (
    <>
      <Button className="mb-8" onClick={handleBack}>
        Back
      </Button>
      <div className='flex flex-row justify-between px-12'>
      <div className="space-y-6 w-2/4">       
      <div className="space-y-6">
        <p className="text-xl">Status Timeline</p>
        { fileId && step !== undefined ? (
        <Step fileId={fileId} statusType="fileStatus" />
        ): (
          <div></div>
        )}
      </div>
      <div className="space-y-6">
        <div>
      <p className="text-xl">Services got from ROGO</p>
      {Object.keys(servicesObj).map((service:any,index:number) => (
        <Checkbox className='mt-4' checked={servicesObj[service]} key={index} onChange={() => {changeServiceCheck(service, servicesObj[service])}}>
        {service}
      </Checkbox>
      ))}
      {/* {services.map((service:any, index:any) => (
        <Checkbox className='mt-4' key={index} onChange={onChange}>
          {service}
        </Checkbox>
      ))} */}
    </div>
      <Button 
        type="dashed" 
        style={{maxWidth: "300px"}}
        onClick={addNewService} 
        block 
        icon={<PlusOutlined />}
      >
        Add Service
      </Button>
      <Modal
            title="Add Service"
            open={open}
            onOk={updateServices}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            <Form form={form} layout="vertical">
          <Form.Item
            name="service"
            label="Serivce"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Input/>
          </Form.Item>
        </Form>
          </Modal>
    </div>
      <div className="space-y-6">
        <p className="text-xl">Payment History</p>
        { fileId && (
        <Step fileId={fileId} statusType="payment" />
        )}
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
             {/* {userRole === "Admin" && ( */}
              <a href={file.signedUrl} rel="noopener noreferrer">
        Download
      </a>
            {/* )}    */}
           </li>
          ))}
        </ul>
        </div>
  ) : (
    <div><Spin /> Please wait...</div>
  )}
      </div>
      </div>
    </>
  );
};

export default StudentFileDetails;
