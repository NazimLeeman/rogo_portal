import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Steps, theme, Form, Select, Input, Upload, UploadProps, UploadFile, Spin  } from 'antd';
import { useFile } from '../../context/FileContext';
import { publicSupabase } from '../../api/SupabaseClient';
import { useParams } from 'react-router-dom';
import { formatDate, highestState } from '../../utils/helper';
import { UploadOutlined } from '@ant-design/icons';
import { CheckOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

interface StepProps {
  statusType: 'payment' | 'fileStatus';
  fileId: string;
  // step:any
}


// let description = 'This is a description.';
const Step: React.FC<StepProps> = ({ statusType, fileId }) => {
  // const { fileId } = useParams();
  const { fileData, 
    setFileData, 
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
  // const [currentStatus, setCurrentStatus] = useState(0);
  const { Option } = Select;
const { TextArea } = Input;

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(fileId) {
      getFileStep(fileId)
      getPaymentStep(fileId)
    }
  },[fileId])

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
    
    const updateStatus = async (values: any) => {
      const state = currentStatus + 1;
      
      try {
        // Insert the new row
        const { data: insertData, error: insertError } = await publicSupabase
          .from('statusSteps')
          .insert({ title: values.status, description: values.note, state: state, filedetailsid: step[0].filedetailsid })
          .select();
    
        if (insertError) {
          console.log(insertError);
          toast.error("There was an error while updating status");
          return;
        }
        
        toast.success("Status updated successfully");
        
        // Retrieve rows that match the filedetailsid
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

    const updatePaymentStatus = async (values: any) => {
      const state = currentPaymentStatus + 1;
      
      try {
        // Insert the new row
        const { data: insertData, error: insertError } = await publicSupabase
          .from('paymentSteps')
          .insert({ title: values.status, description: values.note, state: state, filedetailsid: step[0].filedetailsid })
          .select();
    
        if (insertError) {
          console.log(insertError);
          toast.error("There was an error while updating status");
          return;
        }
        
        toast.success("Status updated successfully");
        
        // Retrieve rows that match the filedetailsid
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
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error("An unexpected error occurred");
      }
    };

  const next = () => {
    // updateStatus(true);
    showModal()
  };

  const nextPayment = () => {
    // updatePaymentStatus(true);
    showModal()
  };

  if (loading) {
    return <div><Spin /> Loading...</div>; 
  }

  if (!step || !paymentStep) {
    return <div>Loading...</div>;
  }

    const items = step.map((item:any) => ({ key: item.title, title: item.title, description: formatDate(item.createdAt) }));
    const paymentItems = paymentStep.map((item:any) => ({ key: item.title, title: item.title, description: formatDate(item.createdAt) }));

  const contentStyle: React.CSSProperties = {
    lineHeight: '100px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async (type:string) => {
    try {
        const values = await form.validateFields();
        setConfirmLoading(true);
        console.log('Form values:', { ...values, upload: fileList });
        if(type === "fileStatus") {
          await updateStatus(values);
        } else {
          await updatePaymentStatus(values);
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

  return (
    <>
      {statusType === 'fileStatus' && (
        <>
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
        <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={() => next()}>
              Add Status
            </Button>
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
        <div style={{ marginTop: 24 }}>
            <Button type="primary" onClick={() => nextPayment()}>
              Add Payment
            </Button>
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
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select placeholder="Select a status">
              <Option value="1st Installment">1st Installment</Option>
              <Option value="2nd Installment">2nd Installment</Option>
              <Option value="3rd Installment">3rd Installment</Option>
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
