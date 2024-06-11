import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { publicSupabase } from '../../api/SupabaseClient';
import { useFile } from '../../context/FileContext';
import { UploadFile as AntdUploadFile } from 'antd/lib/upload/interface';
import type { UploadProps } from 'antd';

interface UploadFile extends File {
  uid: string; // Optional field to store a unique identifier for the file
}

const UploadFeature = () => {
  const [fileList1, setFileList1] = useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);
  const [fileList3, setFileList3] = useState<UploadFile[]>([]);
  const [fileList4, setFileList4] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { studentInfo } = useFile();

  const handleBeforeUpload = (
    file: UploadFile,
    setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>,
  ) => {
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

    const { data, error } = await publicSupabase.storage
      .from('avatars') // replace with your bucket name
      .upload(`${studentId}/${file.name}`, file);

    if (error) {
      throw error;
    }

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
      ];

      await Promise.all(uploadPromises);

      setFileList1([]);
      setFileList2([]);
      setFileList3([]);
      setFileList4([]);
      message.success('All files uploaded successfully.');
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
            : fileList4,
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-20">
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
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={
            fileList1.length === 0 &&
            fileList2.length === 0 &&
            fileList3.length === 0 &&
            fileList4.length === 0
          }
          style={{ marginTop: 16 }}
        >
          Upload
        </Button>
      </div>
    </>
  );
};

export default UploadFeature;
