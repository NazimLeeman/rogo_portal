import { Button } from '@/component/ui/button';
import { Checkbox } from '@/component/ui/checkbox';
import Text from '@/component/ui/text';
import { Form, Input, Modal } from 'antd';
import { ChevronLeft, DownloadIcon, FileIcon, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import Step from '../component/Step/step';
import { useFile } from '../context/FileContext';
import { extractFilename } from '@/utils/helper';

const StudentFileDetails: React.FC = () => {
  const { fileId } = useParams();
  const { step } = useFile();
  const [files, setFiles] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<any>('');
  // const [services, setServices] = useState<any>([]);
  const [servicesObj, setServicesObj] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const getUserRole = () => {
    const localRoleSession = localStorage.getItem('supabase.auth.role');
    const sessionRoleData = localRoleSession && JSON.parse(localRoleSession);
    const userRoleFromStorage = sessionRoleData?.currentRole || null;
    setUserRole(userRoleFromStorage);
  };

  const handleBack = () => {
    navigate('/dashboard');
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

  // const onChange: CheckboxProps['onChange'] = (e) => {
  //   const checkValue = e.target.checked
  //   console.log(`checked = ${checkValue}`);
  // };

  const changeServiceCheck = (serviceCheck: any, check: boolean) => {
    console.log('service', serviceCheck);
    console.log('check', check);
    console.log('services obj', servicesObj);

    if (userRole === 'Admin') {
      const newServicesObj = { ...servicesObj };

      if (serviceCheck in newServicesObj) {
        newServicesObj[serviceCheck] = !check;
      }

      console.log('new services obj', newServicesObj);
      updateServiceCheck(newServicesObj);
    } else {
      console.log('User does not have permission to change service check');
    }
  };

  const updateServiceCheck = async (newServicesObj: any) => {
    const { data, error } = await publicSupabase
      .from('filedetails')
      .update({ servicesobj: newServicesObj })
      .eq('id', fileId)
      .select();

    if (error) {
      console.error('Error updating service check:', error);
      return null;
    }
    setServicesObj(data[0].servicesobj);
    console.log('update service check', data);
  };

  const addNewService = () => {
    // setServices([...services, `New Service ${services.length + 1}`]);
    showModal();
  };

  const showModal = () => {
    setOpen(true);
  };

  const getFilesForStudent = async (studentId: string) => {
    const { data, error } = await publicSupabase.storage
      .from('avatars') // Replace 'avatars' with your bucket name
      .list(`${studentId}/`);

    if (error) {
      throw error;
    }
    console.log('data', data);
    signedUrls(data);
    setFiles(data);
    return data || [];
  };

  const signedUrls = async (resultData: any) => {
    if (resultData.length < 1) {
      // toast.error('No File Found')
      throw new Error();
    }
    const name = resultData.map((item: any) => {
      return `${studentId}/${item.name}`;
    });
    const { data, error } = await publicSupabase.storage
      .from('avatars')
      .createSignedUrls(name, 60, { download: true });

    if (error) {
      throw error;
    }
    setDownloadUrl(data);
    console.log('signedddddd urls', data);
  };

  const getStudentId = async () => {
    try {
      const { data, error } = await publicSupabase
        .from('filedetails')
        .select()
        .eq('id', fileId);
      if (error) {
        console.log('error', error);
        throw new Error();
      }
      console.log('from file detailssssssss', data[0]);
      console.log('services obj', data[0].servicesobj);
      setServicesObj(data[0].servicesobj);
      // setServices(data[0].services)
      setStudentId(data[0].studentid);
    } catch (error) {
      console.log(error);
    }
  };

  const updateServices = async () => {
    const values = await form.validateFields();
    // const newService = {[values.service]: false}
    const updatedServices = { ...servicesObj, [values.service]: false };
    console.log('valuesssssssssssssssssssssssssssssssssss', updatedServices);
    const { data, error } = await publicSupabase
      .from('filedetails')
      .update({ servicesobj: updatedServices })
      .eq('id', fileId)
      .select();

    if (error) {
      console.log('error', error);
      throw new Error();
    }
    console.log('new servicesssssssssssssssssss', data);
    setServicesObj(updatedServices);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <div className="flex max-w-screen-md mx-auto flex-col space-y-6 px-8 py-14 md:py-8">
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-max"
          onClick={handleBack}
          size="sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col gap-12">
        <div className="space-y-12">
          <div className="space-y-6">
            <Text variant="heading-lg">Process timeline</Text>
            {fileId && step !== undefined ? (
              <Step fileId={fileId} statusType="fileStatus" />
            ) : null}
          </div>

          <div className="space-y-6">
            <div>
              <Text variant="heading-lg" className="mb-6">
                Received services
              </Text>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(servicesObj).map((service: any, index: number) => (
                  <div className="flex items-center space-x-2" key={index}>
                    <Checkbox
                      id={service}
                      checked={servicesObj[service]}
                      onCheckedChange={() => {
                        changeServiceCheck(service, servicesObj[service]);
                      }}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {userRole === 'Admin' ? (
              <Button onClick={addNewService}>Add service</Button>
            ) : null}

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
                  rules={[
                    { required: true, message: 'Please select a status' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </div>
          <div className="space-y-6">
            <Text variant="heading-lg" className="mb-4">
              Payment history
            </Text>
            {fileId && <Step fileId={fileId} statusType="payment" />}
          </div>
        </div>
        <div className="space-y-6">
          <Text variant="heading-lg" className="mb-4">
            Documents
          </Text>
          {downloadUrl.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {downloadUrl.map((file: any) => (
                <div key={file.path} className="space-y-2">
                  <div className="w-full h-60 border rounded-md">
                    <Image src={file.signedUrl} />
                  </div>
                  <a
                    href={file.signedUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="block"
                  >
                    <Button size="sm" variant="ghost">
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      {extractFilename(file.path)}
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <Loader className="h-6 w-6 animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};

function Image({ src }: { src: string }) {
  const [isImage, setIsImage] = useState(true);

  if (!isImage) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-md flex justify-center items-center">
        <FileIcon />
      </div>
    );
  }

  return (
    <img
      src={src}
      className="h-full w-full object-contain object-center"
      onError={() => {
        setIsImage(false);
      }}
    />
  );
}

export default StudentFileDetails;
