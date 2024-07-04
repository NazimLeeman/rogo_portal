import { cn, formatCurrency } from '@/utils';
import { UploadOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { CircleCheckIcon, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { publicSupabase } from '../../api/SupabaseClient';
import { useFile } from '../../context/FileContext';
import { useRole } from '../../hooks/useRole';
import { extractFilenameFromUrl, formatDate, generateRandomId, highestState } from '../../utils/helper';
import { Alert, AlertTitle } from '../ui/alert';
import { Skeleton } from '../ui/skeleton';
import Text from '../ui/text';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface StepProps {
  statusType: 'payment' | 'fileStatus';
  fileId: string;
}

const checkForDuplicateFileNames = (fileLists: UploadFile[][]) => {
  const allFileNames = fileLists.flat().map(file => file.name);
  const uniqueFileNames = new Set(allFileNames);
  
  if (allFileNames.length !== uniqueFileNames.size) {
    const duplicates = allFileNames.filter((name, index) => allFileNames.indexOf(name) !== index);
    toast.error(`Duplicate file names found: ${duplicates.join(', ')}. Please rename these files before uploading.`)
    throw new Error(`Duplicate file names found: ${duplicates.join(', ')}. Please rename these files before uploading.`);
  }
};

const Step: React.FC<StepProps> = ({ statusType, fileId }) => {
  const {
    currentStatus,
    setCurrentStatus,
    step,
    setStep,
    currentPaymentStatus,
    setPaymentCurrentStatus,
    paymentStep,
    setPaymentStep,
  } = useFile();
  const { Option } = Select;
  const { TextArea } = Input;
  const { userRole } = useRole();

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(true);

  const [, setDownloadUrl] = useState<any[]>([]);
  const [, setDownloadPaymentUrl] = useState<any[]>([]);
  const [budget, setBudget] = useState<any>({});

  useEffect(() => {
    if (fileId) {
      const fetchData = async () => {
        try {
          await getFileStep(fileId),
            await getPaymentStep(fileId),
            await getStatusSteps(fileId);
          await getPaymentSteps(fileId);
          await getBudget(fileId);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  const getFileStep = async (fileId: string) => {
    try {
      const { data, error } = await publicSupabase
        .from('statusSteps')
        .select('*')
        .eq('filedetailsid', fileId);
      if (error) throw error;
      const currentStatusState = highestState(data);
      setCurrentStatus(currentStatusState);
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
      setPaymentCurrentStatus(currentPaymentState);
      setPaymentStep(data);
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const getStatusSteps = async (fileId: string) => {
    const { data, error } = await publicSupabase.storage
      .from('statusSteps') // Replace 'avatars' with your bucket name
      .list(`${fileId}/`);

    if (error) {
      throw error;
    }
    signedStepsUrls(data);
    // setFiles(data);
    return data || [];
  };

  const getPaymentSteps = async (fileId: string) => {
    const { data, error } = await publicSupabase.storage
      .from('paymentSteps') // Replace 'avatars' with your bucket name
      .list(`${fileId}/`);

    if (error) {
      throw error;
    }
    signedPaymentUrls(data);
    // setFiles(data);
    return data || [];
  };

  const signedStepsUrls = async (resultData: any) => {
    if (resultData.length < 1) {
      // toast.error('No File Found')
      throw new Error();
    }
    const name = resultData.map((item: any) => {
      return `${fileId}/${item.name}`;
    });
    const { data, error } = await publicSupabase.storage
      .from('statusSteps')
      .createSignedUrls(name, 60, { download: true });

    if (error) {
      throw error;
    }
    setDownloadUrl(data);
  };

  const signedPaymentUrls = async (resultData: any) => {
    if (resultData.length < 1) {
      // toast.error('No Payment Attachment File Found')
      throw new Error();
    }
    const name = resultData.map((item: any) => {
      return `${fileId}/${item.name}`;
    });
    const { data, error } = await publicSupabase.storage
      .from('paymentSteps')
      .createSignedUrls(name, 60, { download: true });

    if (error) {
      throw error;
    }
    setDownloadPaymentUrl(data);
  };

  const updateStatus = async (values: any, fileUrls: any) => {
    const state = currentStatus + 1;
    console.log('values', values);
    try {
      const { error: insertError } = await publicSupabase
        .from('statusSteps')
        .insert({
          title: values.status,
          content: fileUrls,
          notes: values.notes,
          state: state,
          filedetailsid: step[0].filedetailsid,
        })
        .select();

      if (insertError) {
        console.log(insertError);
        toast.error('There was an error while updating status');
        return;
      }

      toast.success('Status updated successfully');

      const { data: selectData, error: selectError } = await publicSupabase
        .from('statusSteps')
        .select()
        .eq('filedetailsid', step[0].filedetailsid);

      if (selectError) {
        console.log(selectError);
        toast.error('There was an error while fetching steps');
        return;
      }

      setCurrentStatus(state);
      setStep(selectData);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const updatePaymentStatus = async (values: any, fileUrls: any) => {
    const state = currentPaymentStatus + 1;
    console.log('from updateeeeeeeeee', values);
    const operation = 'debit';

    try {
      const { error: insertError } = await publicSupabase
        .from('paymentSteps')
        .insert({
          title: values.status,
          content: fileUrls,
          notes: values.notes,
          state: state,
          filedetailsid: step[0].filedetailsid,
        })
        .select();

      if (insertError) {
        console.log(insertError);
        toast.error('There was an error while updating status');
        return;
      }

      toast.success('Status updated successfully');

      const { data: selectData, error: selectError } = await publicSupabase
        .from('paymentSteps')
        .select()
        .eq('filedetailsid', step[0].filedetailsid);

      if (selectError) {
        console.log(selectError);
        toast.error('There was an error while fetching steps');
        return;
      }

      setPaymentCurrentStatus(state);
      setPaymentStep(selectData);
      updateBudget(values.status, operation);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const getBudget = async (fileId: string) => {
    const { data, error } = await publicSupabase
      .from('filedetails')
      .select('budget')
      .eq('id', fileId);
    if (error) {
      console.log('error', error);
      throw new Error();
    }
    setBudget(data[0]);
  };

  const updateBudget = async (payment: any, operation:string) => {
    let newRemainingBalance;
    if (operation === 'debit') {
      newRemainingBalance = budget.budget - payment;
    } else {
      newRemainingBalance = budget.budget + payment
    }
    const { data, error } = await publicSupabase
      .from('filedetails')
      .update({ budget: newRemainingBalance })
      .eq('id', fileId)
      .select();
    if (error) {
      console.log('error', error);
      throw new Error();
    }
    setBudget(data[0]);
  };

  const next = () => {
    showModal();
  };

  const nextPayment = async () => {
    showModal();
  };

  const deletePayment = () => {
    showDeleteModal()
  }

  if (loading) {
    return <Loader className="h-6 w-6 animate-spin" />;
  }

  if (!step || !paymentStep) {
    return <Loader className="h-6 w-6 animate-spin" />;
  }

  const items = step.map((item: any) => ({
    key: item.title,
    title: item.title,
    content: item.content,
    subTitle: item.notes,
    description: formatDate(item.createdAt),
    id: item.id
  }));

  const paymentItems = paymentStep.map((item: any) => ({
    key: item.title,
    title: item.title,
    content: item.content,
    subTitle: item.notes,
    description: formatDate(item.createdAt),
    id: item.id
  }));

  const showModal = () => {
    setOpen(true);
  };

  const showDeleteModal = () => {
    setOpenDelete(true)
  }

  const handleOk = async (type: string) => {
    try {
      const bucketName = type === 'fileStatus' ? 'statusSteps' : 'paymentSteps';
      const values = await form.validateFields();
      setConfirmLoading(true);
      console.log('Form values:', { ...values, upload: fileList });

      try {
        checkForDuplicateFileNames([fileList]);
      } catch (error) {
        setConfirmLoading(false);
        // The error message is already shown by the toast in checkForDuplicateFileNames
        return; // Exit the function early if duplicates are found
      }
  

      const uploadPromises = fileList
        .filter((file) => file.originFileObj)
        .map((file) =>
          uploadFileToSupabase(bucketName, file.originFileObj as File),
        );
      const uploadResults = await Promise.all(uploadPromises);

      const fileUrls = uploadResults.filter((result) => result !== null);

      if (type === 'fileStatus') {
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

  const handleDelete = async (type: string) => {
    console.log('type',type)
    const tableName = type === 'status' ? 'statusSteps' : 'paymentSteps';
    const values = await form.validateFields();
    const id = values.status
    console.log('values',values)
    const {data, error} = await publicSupabase
      .from(tableName)
      .delete()
      .eq('id',id)
      .select();

    if(error) {
      toast.error('error while deleting')
      console.log('error', error)
    }

    if(data && data?.length > 0) {
      updateSteps(tableName,data,id)
    } else {
      toast.error('something went wrong')
      setOpenDelete(false)
    }
  }

  const updateSteps = (tableName:string,data:any, id:string) => {
    if(tableName === 'statusSteps') {
      toast.success('Successfully Deleted Status')
      setOpenDelete(false)
      const updatedStatusItems = step.filter((item:any) => item.id !== id)
      setStep(updatedStatusItems)
    } else {
      toast.success('Successfully Deleted Payment')
      setOpenDelete(false)
      const payment = Number(data[0].title)
      let operation = 'credit'
      updateBudget(payment,operation)
      const updatedPaymentItems = paymentStep.filter((item:any) => item.id !== id)
      setPaymentStep(updatedPaymentItems)
    }
  }

  const handleCancel = () => {
    setOpen(false);
    setOpenDelete(false)
    form.resetFields();
    setFileList([]);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadFileToSupabase = async (bucketName: string, file: File) => {
    // const fileExt = file.name.split('.').pop();
    // const fileName = `${generateRandomId()}.${fileExt}`;
    // const filePath = `${fileId}/${fileName}`;
    const filePath = `${fileId}/${file.name}`;

    const { error } = await publicSupabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    const { data: publicUrlData } = publicSupabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
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
          <div className="relative mt-6 flex flex-col gap-6">
            {(() => {
              const totalItems = items.length;
              const reversedItems = [...items].reverse().map((item, index) => {
                const isCompleted = index > totalItems - 1 - currentStatus;
                return (
                  <div className="flex gap-4 items-start" key={index}>
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-2xl text-muted-foreground">
                      <CircleCheckIcon
                        className={cn('h-4 w-4 z-10', {
                          'text-primary': !isCompleted,
                        })}
                      />
                    </div>
                    <div className="-mt-0.5 space-y-2">
                      <div>
                        <Text variant="heading-md" as="h3">
                          {item?.title}
                        </Text>
                        <Text
                          className="text-muted-foreground"
                          variant="body-sm"
                        >
                          {item?.description}
                        </Text>
                      </div>
                      <Text className="text-muted-foreground">
                        {item?.subTitle}
                      </Text>
                      {item.content && item.content.length > 0 && (
                        <div>
                          {item.content.map(
                            (contentItem: any, contentIndex: any) => (
                              <div key={contentIndex}>
                                <a
                                  href={contentItem}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm"
                                >
                                  {extractFilenameFromUrl(contentItem)}
                                </a>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              });
              return reversedItems;
            })()}
            <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-100" />
          </div>
          <div style={{ marginTop: 24 }}>
            {userRole === 'Admin' ? (
              <div className='flex flex-row space-x-4'>
              <Button onClick={() => next()}>Add status</Button>
              <Button onClick={() => deletePayment()}>Delete Status</Button>
              </div>
            ) : null}

            <Modal
              title="Danger"
              open={openDelete}
              onOk={() => {
                handleDelete('status');
              }}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form form={form} layout="vertical">
              <Form.Item
                  name="status"
                  label={'Select the status you want to delete!'}
                  rules={[
                    { required: true, message: 'Please enter an amount' },
                  ]}
                >
                  <Select style={{ width: '100%' }}>
                  {[...items].reverse().map((item, index) => (
                    <Select.Option key={index} value={item.id || index.toString()}>
                      <div className="flex gap-4 items-center">
                        <span>{item?.title}</span>
                        <span>{item?.description}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Title"
              open={open}
              onOk={() => {
                handleOk('fileStatus');
              }}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[
                    { required: true, message: 'Please select a status' },
                  ]}
                >
                  <Select placeholder="Select a status">
                    <Option value="Pending docuemnts verfication by RoGo">
                      Pending docuemnts verfication by RoGo
                    </Option>
                    <Option value="Documents accepted by RoGo">
                      Documents accepted by RoGo
                    </Option>
                    <Option value="Documents rejected by RoGo">
                      Documents rejected by RoGo
                    </Option>
                    <Option value="Enrolled to the adaptation course">
                      Enrolled to the adaptation course
                    </Option>
                    <Option value="File opened">File opened</Option>
                    <Option value="Sent for translation">
                      Sent for translation
                    </Option>
                    <Option value="Document translated">
                      Document translated
                    </Option>
                    <Option value="Applied to the university">
                      Applied to the university
                    </Option>
                    <Option value="Approved by the university">
                      Approved by the university
                    </Option>
                    <Option value="Rejected by the university">
                      Rejected by the university
                    </Option>
                    <Option value="University agreement signed">
                      University agreement signed
                    </Option>
                    <Option value="Awaiting for admission test">
                      Awaiting for admission test
                    </Option>
                    <Option value="Awaiting for admission">
                      Awaiting for admission
                    </Option>
                    <Option value="Admission test passed">
                      Admission test passed
                    </Option>
                    <Option value="Admission test failed">
                      Admission test failed
                    </Option>
                    <Option value="Tuition fee paid">Tuition fee paid</Option>
                    <Option value="Awaiting invitation">
                      Awaiting invitation
                    </Option>
                    <Option value="Invitation received">
                      Invitation received
                    </Option>
                    <Option value="Finalizating documents for visa application">
                      Finalizating documents for visa application
                    </Option>
                    <Option value="Finalized documents for visa application">
                      Finalized documents for visa application
                    </Option>
                    <Option value="Applied for the visa">
                      Applied for the visa
                    </Option>
                    <Option value="Awaiting for visa approval">
                      Awaiting for visa approval
                    </Option>
                    <Option value="Visa approved">Visa approved</Option>
                    <Option value="Visa rejected">Visa rejected</Option>
                    <Option value="Arrived in Russia">Arrived in Russia</Option>
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
                    <Button>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </>
      )}
      {statusType === 'payment' && (
        <>
          {budget?.budget ? (
            <Alert>
              <AlertTitle>
                {formatCurrency(budget.budget)} yet to be paid
              </AlertTitle>
            </Alert>
          ) : (
            <Skeleton className="w-full h-[44px]" />
          )}
          <div className="relative mt-6 flex flex-col gap-6">
            {(() => {
              const reversedItems = [...paymentItems]
                .reverse()
                .map((item, index) => {
                  return (
                    <div className="flex gap-4 items-start" key={index}>
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-2xl">
                        <CircleCheckIcon className="h-4 w-4 z-10" />
                      </div>
                      <div className="-mt-0.5 space-y-2">
                        <div>
                          <Text variant="heading-md" as="h3">
                            {formatCurrency(item?.title)}
                          </Text>
                          <Text
                            className="text-muted-foreground"
                            variant="body-sm"
                          >
                            {item?.description}
                          </Text>
                        </div>
                        <Text className="text-muted-foreground">
                          {item?.subTitle}
                        </Text>
                        {item.content && item.content.length > 0 && (
                          <div>
                            {item.content.map(
                              (contentItem: any, contentIndex: any) => (
                                <div key={contentIndex}>
                                  <a
                                    href={contentItem}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm"
                                  >
                                     {extractFilenameFromUrl(contentItem)}
                                  </a>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                });

              return reversedItems;
            })()}
            <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-100" />
          </div>

          <div style={{ marginTop: 24 }}>
            {userRole === 'Admin' ? (
              <div className='flex flex-row space-x-4'>
              <Button onClick={() => nextPayment()}>Add payment</Button>
              <Button onClick={() => deletePayment()}>Delete payment</Button>
              </div>
            ) : null}

            <Modal
              title="Danger"
              open={openDelete}
              onOk={() => {
                handleDelete('payment');
              }}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form form={form} layout="vertical">
              <Form.Item
                  name="status"
                  label={'Select the payment you want to delete!'}
                  rules={[
                    { required: true, message: 'Please enter an amount' },
                  ]}
                >
                  <Select style={{ width: '100%' }}>
                  {[...paymentItems].reverse().map((item, index) => (
                    <Select.Option key={index} value={item.id || index.toString()}>
                      <div className="flex gap-4 items-center">
                        <span>{formatCurrency(item?.title)}</span>
                        <span>{item?.description}</span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Title"
              open={open}
              onOk={() => {
                handleOk('payment');
              }}
              confirmLoading={confirmLoading}
              onCancel={handleCancel}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="status"
                  label={`${budget.budget} BDT stills needs to cleared`}
                  rules={[
                    { required: true, message: 'Please enter an amount' },
                  ]}
                >
                  <InputNumber style={{ width: '100%' }} />
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
                    <Button>Click to Upload</Button>
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
