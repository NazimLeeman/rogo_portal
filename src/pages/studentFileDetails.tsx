import { Button } from '@/component/ui/button';
import { Checkbox } from '@/component/ui/checkbox';
import Text from '@/component/ui/text';
import { Form, Input, Modal, Select, Upload, UploadFile, UploadProps } from 'antd';
import { ChevronLeft, DownloadIcon, FileIcon, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import Step from '../component/Step/step';
import { useFile } from '../context/FileContext';
import { extractFilename, extractFilenameFromUrl } from '@/utils/helper';
import { toast } from 'sonner';

const StudentFileDetails: React.FC = () => {
  const { fileId } = useParams();
  const { step } = useFile();
  const [files, setFiles] = useState<any[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<any[]>([]);
  const [additionalFile, setAdditionalFile] = useState<any>({});
  const [userRole, setUserRole] = useState<any>('');
  // const [services, setServices] = useState<any>([]);
  const [servicesObj, setServicesObj] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
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

  const changeServiceCheck = (serviceCheck: any, check: boolean) => {

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
      setServicesObj(data[0].servicesobj);
      console.log('dataaaaaaaaaaaaaaaaaa',data[0].additionalFile)
      if(data[0].additionalFile) {
        setAdditionalFile(data[0].additionalFile)
      }
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
    const { data, error } = await publicSupabase
      .from('filedetails')
      .update({ servicesobj: updatedServices })
      .eq('id', fileId)
      .select();

    if (error) {
      console.log('error', error);
      throw new Error();
    }
    setServicesObj(updatedServices);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // const saveAddtionalFile = async (studentId:string) => {
  //   console.log('student id',studentId)
  //   const values = await form.validateFields();
  //   console.log('values',values)
  // }

  const saveAddtionalFile = async (studentId: string) => {
    console.log('student id', studentId)
    
    try {
      const values = await form.validateFields();
      console.log('values', values)
  
      const { upload, access } = values;
      const fileName = upload?.file?.name
      const additionalFile = upload
  
      if (additionalFile && additionalFile.file) {
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await publicSupabase.storage
          .from('avatars')
          .upload(`additionalFile/${studentId}/${additionalFile.file.name}`, additionalFile.file)
  
        if (uploadError) {
          throw uploadError
        }
  
        // Get public URL of the uploaded file
        const { data: urlData } = publicSupabase.storage
          .from('avatars')
          .getPublicUrl(`additionalFile/${studentId}/${additionalFile.file.name}`)
  
        // Update the filedetails column in the database
          const additionalFiles = [{[access]: urlData.publicUrl}];

        const { data, error } = await publicSupabase
          .from('filedetails')
          .update({ 
            additionalFile: additionalFiles
          })
          .eq('studentid', studentId)
  
        if (error) {
          toast.error('something went wrong')
          throw error
        }
  
        toast.success('File uploaded and database updated successfully')
      }
    } catch (error) {
      console.error('Error saving additional file:', error)
    }
  }

  const handleDocumentDelete = async (studentId: string) => {
    try {
      // List files in the student's folder
      const values = await form.validateFields();
      const fileName = values.status
      const originalName = extractFilename(fileName);
      // Delete the file
      const { data: deleteData, error: deleteError } = await publicSupabase.storage
        .from('avatars')
        .remove([`${studentId}/${originalName}`]);
  
      if (deleteError) {
        toast.error('error while deleting')
        throw deleteError;
      }

      const remainingFiles = files.filter((item: any) => {
        return item.name !== originalName; 
      });

      console.log('remaining files', remainingFiles);
      toast.success('successfully deleted file')
      setOpenDelete(false)
      setFiles(remainingFiles)
      signedUrls(remainingFiles)
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
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
            <>
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
            <div>
            {userRole === 'Admin' ? (
              <div className='flex flex-row space-x-4'>
              {/* <Button onClick={}>Add status</Button> */}
              <Button onClick={() => setOpenDelete(!openDelete)}>Delete Document</Button>
              </div>
            ) : null}
            <Modal
              title="Danger"
              open={openDelete}
              onOk={() => {
                handleDocumentDelete(studentId);
              }}
              confirmLoading={confirmLoading}
              onCancel={() => setOpenDelete(!openDelete)}
            >
              <Form form={form} layout="vertical">
              <Form.Item
                  name="status"
                  label={'Select the Document you want to delete!'}
                  rules={[
                    { required: true, message: 'Please enter an amount' },
                  ]}
                >
                  <Select style={{ width: '100%' }}>
                  {downloadUrl.map((item, index) => (
                    <Select.Option key={index} value={item.path || index.toString()}>
                      <div className="flex gap-4 items-center">
                        <span>{extractFilename(item.path)}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                </Form.Item>
              </Form>
            </Modal>
            </div>
            </>
          ) : (
            <Loader className="h-6 w-6 animate-spin" />
          )}
        </div>
        <div className="space-y-6">
          <Text variant="heading-lg" className="mb-4">
            Additional Files
          </Text>
          <div>
            {userRole === 'Admin' ? (
              <div className='flex flex-row space-x-4'>
              {/* <Button onClick={}>Add status</Button> */}
              <Button onClick={() => setOpenUpload(!openUpload)}>Add File</Button>
              </div>
            ) : null}
            {additionalFile.length > 0 ? (
              additionalFile.map((item:any, index:number) => (
                <div key={index} className="flex flex-col mt-2">
                  <img src={item.true} className='w-[300px]' alt="" />
                  <p>
                  {extractFilenameFromUrl(item.true)}
                  </p>
                </div>
              ))
            
          ) : (
            <Loader className="h-6 w-6 animate-spin" />
          )}
            <Modal
              title="Add Document"
              open={openUpload}
              onOk={() => {
                saveAddtionalFile(studentId);
              }}
              confirmLoading={confirmLoading}
              onCancel={() => setOpenUpload(!openUpload)}
            >
              <Form form={form} layout="vertical">
              <Form.Item name="upload">
                  <Upload
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    multiple={true}
                    >
                    <Button>Click to Upload</Button>
                  </Upload>
                </Form.Item>
                <Form.Item name="access">
                  <div className='flex flex-row space-x-2 items-center'>
                <Checkbox
                value={"true"}
                    />
                    <p>
                    Allow student to view this file
                    </p>
                  </div>
                </Form.Item>
              </Form>
            </Modal>
            </div>
          {/* {downloadUrl.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              <Form form={form} layout="vertical">
              <Form.Item name="upload">
                  <Upload
                    fileList={fileList}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    multiple={true}
                    >
                    <Button>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </div>
            
          ) : (
            <Loader className="h-6 w-6 animate-spin" />
          )} */}
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
