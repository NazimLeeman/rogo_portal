import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Tooltip, Upload } from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useFile } from '../../context/FileContext';
import type { UploadProps } from 'antd';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { generateUniqueFileName } from '../../utils/helper';

interface UploadFile extends File {
  uid: string;
}

const UploadFeature = () => {
  const [fileList1, setFileList1] = useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);
  const [fileList3, setFileList3] = useState<UploadFile[]>([]);
  const [fileList4, setFileList4] = useState<UploadFile[]>([]);
  const [fileList5, setFileList5] = useState<UploadFile[]>([]);
  const [fileList6, setFileList6] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { studentInfo, studentFiles, fileData, setFileData } = useFile();

  const navigate = useNavigate();

  const isMasters = studentFiles?.program === 'masters';

  const fileNames = {
    fileList1: 'SSC Certificate',
    fileList2: 'SSC Marksheet',
    fileList3: 'HSC Certificate',
    fileList4: 'HSC Marksheet',
    fileList5: 'Bachelor Certificate',
    fileList6: 'Bachelor Marksheet',
  };

  const isDisabled = isMasters
    ? fileList1.length === 0 ||
      fileList2.length === 0 ||
      fileList3.length === 0 ||
      fileList4.length === 0 ||
      fileList5.length === 0 ||
      fileList6.length === 0
    : fileList1.length === 0 ||
      fileList2.length === 0 ||
      fileList3.length === 0 ||
      fileList4.length === 0;

  const handleBeforeUpload = (
    file: UploadFile,
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>,
  ) => {
    // const fileWithDisplayName = file as UploadFile & { displayName: string };
    // fileWithDisplayName.displayName = newName;
    setFileList((prevFileList) => [...prevFileList, file]);
    return false; // Prevent default upload behavior
  };

  const uploadFile = async (
    file: UploadFile,
    studentId: string | undefined,
  ) => {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    const uniqueFileName = generateUniqueFileName(file.name);
    console.log('uniquefile', uniqueFileName);

    const { data, error } = await publicSupabase.storage
      .from('avatars')
      .upload(`${studentId}/${uniqueFileName}`, file, { upsert: true });

    if (error) {
      console.error(`Attempt Error uploading ${uniqueFileName}:`, error);
      throw error;
    }

    console.log(`Attempt Successfully uploaded ${uniqueFileName}`);

    return data;
  };

  const handleUpload = async () => {
    setUploading(true);

    try {
      const uploadPromises = [
        ...fileList1.map((file) => uploadFile(file, studentInfo?.id)),
        ...fileList2.map((file) => uploadFile(file, studentInfo?.id)),
        ...fileList3.map((file) => uploadFile(file, studentInfo?.id)),
        ...fileList4.map((file) => uploadFile(file, studentInfo?.id)),
        ...(isMasters
          ? fileList5.map((file) => uploadFile(file, studentInfo?.id))
          : []),
        ...(isMasters
          ? fileList6.map((file) => uploadFile(file, studentInfo?.id))
          : []),
      ];

      await Promise.all(uploadPromises);

      setFileList1([]);
      setFileList2([]);
      setFileList3([]);
      setFileList4([]);
      if (isMasters) {
        setFileList5([]);
        setFileList6([]);
      }
      message.success('All files uploaded successfully.');
      onFinish();
    } catch (error) {
      console.error(error);
      message.error('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = (
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>,
  ): UploadProps => ({
    beforeUpload: (file) => handleBeforeUpload(file, setFileList),
    onRemove: (file) => {
      setFileList((prevFileList) =>
        prevFileList.filter((item) => item.uid !== file.uid),
      );
    },
    fileList:
      setFileList === setFileList1
        ? fileList1
        : setFileList === setFileList2
          ? fileList2
          : setFileList === setFileList3
            ? fileList3
            : setFileList === setFileList4
              ? fileList4
              : setFileList === setFileList5
                ? fileList5
                : fileList6,
  });

  const onFinish = async () => {
    try {
      const { data: fileDetailsData, error: fileDetailsError } =
        await publicSupabase
          .from('filedetails')
          .insert([
            {
              studentid: studentInfo?.id,
              studentfileid: studentFiles?.id,
              budget: studentFiles?.budget,
            },
          ])
          .select();

      if (fileDetailsError) {
        toast.error('Error while submitting file.');
        throw fileDetailsError;
      }
      const fileId = fileDetailsData[0].id;
      setFileData(fileDetailsData[0]);
      // Insert into statusSteps table
      const { data: statusStepsData, error: statusStepsError } =
        await publicSupabase
          .from('statusSteps')
          .insert([
            {
              filedetailsid: fileId,
              title: 'Docs Submitted to RoGo',
              state: 0,
            },
            {
              filedetailsid: fileId,
              title: 'Pending Docs Verfication by RoGo',
              state: 1,
            },
          ])
          .select();

      if (statusStepsError) {
        toast.error('Error while updating status.');
        throw statusStepsError;
      }
      toast.success('File submitted successfully');
      navigate(`/file-details/${fileId}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-16">
        <Upload {...uploadProps(setFileList1)}>
          <Button icon={<UploadOutlined />}>SSC Certificate</Button>
        </Upload>
        <Upload {...uploadProps(setFileList2)}>
          <Button icon={<UploadOutlined />}>SSC Marksheet</Button>
        </Upload>
        <Upload {...uploadProps(setFileList3)}>
          <Button icon={<UploadOutlined />}>HSC Certificate</Button>
        </Upload>
        <Upload {...uploadProps(setFileList4)}>
          <Button icon={<UploadOutlined />}>HSC Marksheet</Button>
        </Upload>
        {isMasters && (
          <>
            <Upload {...uploadProps(setFileList5)}>
              <Button icon={<UploadOutlined />}>Bachelor Certificate</Button>
            </Upload>
            <Upload {...uploadProps(setFileList6)}>
              <Button icon={<UploadOutlined />}>Bachelor Marksheet</Button>
            </Upload>
          </>
        )}
        {isDisabled ? (
          <Tooltip title="Please upload all required files.">
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={isDisabled}
              style={{ marginTop: 16 }}
            >
              Submit
            </Button>
          </Tooltip>
        ) : (
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={isDisabled}
            style={{ marginTop: 16 }}
          >
            Submit
          </Button>
        )}
      </div>
    </>
  );
};

export default UploadFeature;
