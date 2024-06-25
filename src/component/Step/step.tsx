import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Steps, theme, Form, Select, Input, Upload, UploadProps, UploadFile, Spin, InputNumber  } from 'antd';
import { useFile } from '../../context/FileContext';
import { publicSupabase } from '../../api/SupabaseClient';
import { displaySubtitle, formatDate, generateRandomId, highestState } from '../../utils/helper';
import { UploadOutlined } from '@ant-design/icons';
import { CheckOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { useRole } from '../../hooks/useRole';

interface StepProps {
  statusType: 'payment' | 'fileStatus';
  fileId: string;
  // step:any
}


// let description = 'This is a description.';
const Step: React.FC<StepProps> = ({ statusType, fileId }) => {
  const { 
    currentStatus, 
    setCurrentStatus, 
    step, 
    setStep, 
    currentPaymentStatus, 
    setPaymentCurrentStatus,
    paymentStep, 
    setPaymentStep
   } = useFile();
  const { token } = theme.useToken();
  const { Option } = Select;
const { TextArea } = Input;
const { userRole } = useRole();

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);

  const [downloadUrl, setDownloadUrl] = useState<any[]>([]);
  const [downloadPaymentUrl, setDownloadPaymentUrl] = useState<any[]>([]);
  const [budget, setBudget] = useState<any>({});

  useEffect(() => {
    if (fileId) {
      const fetchData = async () => {
        try {
          await getFileStep(fileId),
          await getPaymentStep(fileId),
          await getStatusSteps(fileId)
          await getPaymentSteps(fileId)
          await getBudget(fileId)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [fileId]);

  const getFileStep = async (fileId: string) => {
    try {
      const { data, error } = await publicSupabase
        .from('statusSteps')
        .select('*')
        .eq('filedetailsid', fileId);
      if (error) throw error;
      const currentStatusState = highestState(data);
      setCurrentStatus(currentStatusState)
      setStep(data);
    } catch (error) {
      console.error('ERROR: ', error);
    } finally {
      setLoading(false); 
    }
  };

  const getPaymentStep = async (fileId: string) => {
    try {
      const { data, error } = await publicSupabase
        .from('paymentSteps')
        .select('*')
        .eq('filedetailsid', fileId);
      if (error) throw error;
      const currentPaymentState = highestState(data);
      setPaymentCurrentStatus(currentPaymentState)
      setPaymentStep(data);
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const getStatusSteps = async (fileId:string) => {
    console.log('fileId',fileId)
    const { data, error } = await publicSupabase.storage
        .from('statusSteps') // Replace 'avatars' with your bucket name
        .list(`${fileId}/`);
  
    if (error) {
        throw error;
    }
    signedStepsUrls(data)
    // setFiles(data);
    return data || [];
  };

  const getPaymentSteps = async (fileId:string) => {
    console.log('fileId',fileId)
    const { data, error } = await publicSupabase.storage
        .from('paymentSteps') // Replace 'avatars' with your bucket name
        .list(`${fileId}/`);
  
    if (error) {
        throw error;
    }
    signedPaymentUrls(data)
    // setFiles(data);
    return data || [];
  };

  const signedStepsUrls = async(resultData:any) => {
    if(resultData.length < 1) {
      // toast.error('No File Found')
      throw new Error
    }
    const name = resultData.map((item:any) => {
      return `${fileId}/${item.name}`
    })
    const { data, error } = await publicSupabase
    .storage
    .from('statusSteps')
    .createSignedUrls(name, 60, { download: true}) 
  
    if(error) {
      throw error;
    }
    setDownloadUrl(data)
    console.log('signedddddd Stepsssssssss urls', data)
  } 
  
  const signedPaymentUrls = async(resultData:any) => {
    if(resultData.length < 1) {
      // toast.error('No Payment Attachment File Found')
      throw new Error
    }
    const name = resultData.map((item:any) => {
      return `${fileId}/${item.name}`
    })
    const { data, error } = await publicSupabase
    .storage
    .from('paymentSteps')
    .createSignedUrls(name, 60, { download: true}) 
  
    if(error) {
      throw error;
    }
    setDownloadPaymentUrl(data)
    console.log('signedddddd paymentttttttttt urls', data)
  } 
    
    const updateStatus = async (values: any, fileUrls:any) => {
      const state = currentStatus + 1;
      console.log('values',values)
      try {
        const { data: insertData, error: insertError } = await publicSupabase
          .from('statusSteps')
          .insert({ title: values.status, content:fileUrls, notes: values.notes, state: state, filedetailsid: step[0].filedetailsid })
          .select();
    
        if (insertError) {
          console.log(insertError);
          toast.error("There was an error while updating status");
          return;
        }
        
        toast.success("Status updated successfully");
        
        const { data: selectData, error: selectError } = await publicSupabase
          .from('statusSteps')
          .select()
          .eq('filedetailsid', step[0].filedetailsid);
    
        if (selectError) {
          console.log(selectError);
          toast.error("There was an error while fetching steps");
          return;
        }
    
        setCurrentStatus(state);
        setStep(selectData);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error("An unexpected error occurred");
      }
    };

    const updatePaymentStatus = async (values: any, fileUrls:any) => {
      const state = currentPaymentStatus + 1;
      console.log('from updateeeeeeeeee',values)
      
      try {
        const { data: insertData, error: insertError } = await publicSupabase
          .from('paymentSteps')
          .insert({ title: values.status, content:fileUrls, notes: values.notes, state: state, filedetailsid: step[0].filedetailsid })
          .select();
    
        if (insertError) {
          console.log(insertError);
          toast.error("There was an error while updating status");
          return;
        }
        
        toast.success("Status updated successfully");
        
        const { data: selectData, error: selectError } = await publicSupabase
          .from('paymentSteps')
          .select()
          .eq('filedetailsid', step[0].filedetailsid);
    
        if (selectError) {
          console.log(selectError);
          toast.error("There was an error while fetching steps");
          return;
        }
    
        setPaymentCurrentStatus(state);
        setPaymentStep(selectData);
        updateBudget(values.status)
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error("An unexpected error occurred");
      }
    };

    const getBudget = async(fileId:string) => {
      const {data, error} = await publicSupabase
        .from('filedetails')
        .select("budget")
        .eq('id',fileId);
      if(error) {
        console.log('error', error)
        throw new Error
      }
      console.log('budgetttttttttttt',data[0])
      setBudget(data[0])
    }

    const updateBudget = async(payment:any) => {
      const newRemainingBalance = budget.budget - payment
      console.log('newRemainingBalance', newRemainingBalance)
      const {data, error} = await publicSupabase
        .from('filedetails')
        .update({ budget: newRemainingBalance }) 
        .eq('id',fileId)
        .select();
      if(error) {
        console.log('error', error)
        throw new Error
      }
      console.log('budgetttttttttttt',data[0])
      setBudget(data[0])
    }

  const next = () => {
    showModal()
  };

  const nextPayment = async() => {
    showModal()
  };

  if (loading) {
    return <div><Spin /> Loading...</div>; 
  }

  if (!step || !paymentStep) {
    return <div>Loading...</div>;
  }

    const items = step.map((item:any) => ({ key: item.title, title: item.title, content:item.content, subTitle:item.notes, description: formatDate(item.createdAt) }));
    const paymentItems = paymentStep.map((item:any) => ({ key: item.title, title: item.title, content:item.content, subTitle: item.notes, description: formatDate(item.createdAt) }));
    console.log('paymentItems',paymentItems)
  const contentStyle: React.CSSProperties = {
    lineHeight: '100px',
    textAlign: 'center',
    color: 'black',
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    width: 600
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async (type:string) => {
    try {
        let bucketName = type === "fileStatus" ? "statusSteps" : "paymentSteps";
        const values = await form.validateFields();
        setConfirmLoading(true);
        console.log('Form values:', { ...values, upload: fileList });
        
        const uploadPromises = fileList
        .filter(file => file.originFileObj)
        .map(file => 
          uploadFileToSupabase(bucketName, file.originFileObj as File)
        );
        const uploadResults = await Promise.all(uploadPromises);
        
        // // Add the upload results to the form values
        // const updatedValues = {
        //   ...values,
        //   uploadedFiles: uploadResults.filter(result => result !== null),
        // };
        const fileUrls = uploadResults.filter(result => result !== null);
        console.log('fileUrls',fileUrls)
        if(type === "fileStatus") {
          await updateStatus(values, fileUrls);
        } else {
          await updatePaymentStatus(values, fileUrls);
        }
        setOpen(false);
        setConfirmLoading(false);
        form.resetFields();
        setFileList([]);
    } catch (info) {
        console.log('Validate Failed:', info);
    }
};

  const handleCancel = () => {
    setOpen(false);
    form.resetFields();
    setFileList([]);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadFileToSupabase = async (bucketName: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${generateRandomId()}.${fileExt}`;
    const filePath = `${fileId}/${fileName}`;

    const { data, error } = await publicSupabase.storage
        .from(bucketName)
        .upload(filePath, file, {upsert: true});

    if (error) {
        console.error('Error uploading file:', error);
        return null;
    }

    const { data: publicUrlData } = publicSupabase.storage.from(bucketName).getPublicUrl(filePath);
    const publicURL = publicUrlData?.publicUrl;

    if (!publicURL) {
        console.error('Error getting public URL');
        return null;
    }
    console.log('File uploaded:', publicURL);

    return publicURL;
};

  return (
    <>
      {statusType === 'fileStatus' && (
        <>
        <div className='flex'>
        {(() => {
        const totalItems = items.length;
        const reversedItems = [...items].reverse().map((item, index) => {
          const stepNumber = totalItems - index;
          const isCompleted = index > totalItems - 1 - currentStatus;

          return {
            ...item,
            icon: isCompleted ? (
              <div className="custom-step-icon completed">
                <CheckOutlined />
              </div>
            ) : (
              <div className="custom-step-icon">
                <div className='ant-steps-item-icon'>
                <h1 className='text-white text-md'>{stepNumber}</h1>
                </div>
              </div>
            ),
            description: (
              <>
                <div>{item.description}</div>
                {item.content && item.content.length > 0 && (
                  <div className="ant-steps-item-description">
                    {item.content.map((contentItem:any, contentIndex:any) => (
                      <div key={contentIndex}>
                        <a href={contentItem} target="_blank" rel="noopener noreferrer">
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          };
        });

        const reversedCurrentStatus = items.length - 1 - currentStatus;

        return (
          <Steps 
            current={reversedCurrentStatus} 
            items={reversedItems} 
            direction="vertical"
          />
        );
      })()}
      {/* <div style={contentStyle}>
      <div>
      <p className="text-xl">Attachments</p>
      {downloadUrl.length > 0 ? (
      <div >
        <ul className='grid grid-cols-2 gap-6'>
          {downloadUrl.map((file:any) => (
            <li key={file.path}>
              <a href={file.signedUrl} rel="noopener noreferrer">
        Download
      </a>
           </li>
          ))}
        </ul>
        </div>
  ) : (
    <div><Spin /> Please wait...</div>
  )}
      </div>
      </div> */}
      </div>
        <div style={{ marginTop: 24 }}>
            {/* <Button type="primary" onClick={() => next()}>
              Add Status
            </Button> */}
            {userRole === 'Admin' ? (
  <Button type="primary" onClick={() => next()}>
    Add Status
  </Button>
) : (
  <div></div>
)}
            <Modal
            title="Title"
            open={open}
            onOk={() => {handleOk("fileStatus")}}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            {/* <p>{modalText}</p> */}
            <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select a status">
              <Option value="Submitted">Submitted</Option>
              <Option value="In Progess">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} placeholder="Optional notes" />
          </Form.Item>

          <Form.Item name="upload" label="Upload File">
          <Upload 
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false} // Prevent auto upload
              multiple={true}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
          </Modal>
        </div>
        </>
      )}
      {statusType === 'payment' && (
        <>
        <div>{budget.budget} BDT Still remainging</div>
        <div className='flex'>
        {(() => {
        const totalItems = paymentItems.length;
        const reversedItems = [...paymentItems].reverse().map((item, index) => {
          const stepNumber = totalItems - index;
          const isCompleted = index > totalItems - 1 - currentPaymentStatus;

          return {
            ...item,
            icon: isCompleted ? (
              <div className="custom-step-icon completed">
                <CheckOutlined />
              </div>
            ) : (
              <div className="custom-step-icon">
                <div className='ant-steps-item-icon'>
                <h1 className='text-white text-md'>{stepNumber}</h1>
                </div>
              </div>
            ),
            description: (
              <>
                <div>{item.description}</div>
                {item.content && item.content.length > 0 && (
                  <div className="ant-steps-item-description">
                    {item.content.map((contentItem:any, contentIndex:any) => (
                      <div key={contentIndex}>
                        <a href={contentItem} target="_blank" rel="noopener noreferrer">
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )
          };
        });

        const reversedCurrentStatus = paymentItems.length - 1 - currentPaymentStatus;

        return (
          <Steps 
          current={reversedCurrentStatus} 
          items={reversedItems} 
          direction="vertical"
          />
        );
      })()}
      {/* <div style={contentStyle}> */}
      {/* <div>
      <p className="text-xl">Attachments</p>
      {downloadPaymentUrl.length > 0 ? (
      <div >
        <ul className='grid grid-cols-2 gap-6'>
          {downloadPaymentUrl.map((file:any) => (
            <li key={file.path}>
              <a href={file.signedUrl} rel="noopener noreferrer">
        Download
      </a>
           </li>
          ))}
        </ul>
        </div>
  ) : (
    <div>No Attachments currently</div>
  )}
      </div> */}
      {/* </div> */}
      </div>
        <div style={{ marginTop: 24 }}>
        {userRole === 'Admin' ? (  <Button type="primary" onClick={() => nextPayment()}>
              Add Payment
            </Button>
          ) : (
  <div></div>
)}
            <Modal
            title="Title"
            open={open}
            onOk={() => {handleOk("payment")}}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
            {/* <p>{modalText}</p> */}
            <Form form={form} layout="vertical">
          <Form.Item
            name="status"
            label={`${budget.budget} BDT stills needs to cleared`}
            rules={[{ required: true, message: 'Please enter an amount' }]}
          >
            <InputNumber style={{ width: '100%' }}/>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} placeholder="Optional notes" />
          </Form.Item>

          <Form.Item name="upload" label="Upload File">
          <Upload 
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false} 
              multiple={true}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
          </Modal>
        </div>
        </>
      )}
    </>
  );
};

export default Step;
