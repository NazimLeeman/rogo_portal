import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { UploadIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { publicSupabase } from '../../api/SupabaseClient';
import { useFile } from '../../context/FileContext';
import { generateUniqueFileName } from '../../utils/helper';
import { Button } from '../ui/button';
import Text from '../ui/text';

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
  const { studentInfo, studentFiles, setFileData } = useFile();

  const navigate = useNavigate();

  const isMasters = studentFiles?.program === 'Masters';

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
    maxCount: 1,
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
      const { error: statusStepsError } = await publicSupabase
        .from('statusSteps')
        .insert([
          {
            filedetailsid: fileId,
            title: 'Documents submitted to RoGo',
            state: 0,
          },
          {
            filedetailsid: fileId,
            title: 'Pending documents verfication by RoGo',
            state: 1,
          },
        ])
        .select();

      if (statusStepsError) {
        return toast.error('Something went wrong');
      }

      navigate(`/file-details/${fileId}`);
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <Text variant="heading-md" className="mb-4">
        Documents
      </Text>
      <div className="grid grid-cols-2 gap-4">
        <Upload {...uploadProps(setFileList1)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            SSC certificate
          </Button>
        </Upload>
        <Upload {...uploadProps(setFileList2)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            SSC marksheet
          </Button>
        </Upload>
        <Upload {...uploadProps(setFileList3)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            HSC certificate
          </Button>
        </Upload>
        <Upload {...uploadProps(setFileList4)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            HSC marksheet
          </Button>
        </Upload>
        {isMasters && (
          <>
            <Upload {...uploadProps(setFileList5)}>
              <Button variant="outline">
                <UploadIcon className="h-4 w-4 mr-2" />
                Bachelor certificate
              </Button>
            </Upload>
            <Upload {...uploadProps(setFileList6)}>
              <Button variant="outline">
                <UploadIcon className="h-4 w-4 mr-2" />
                Bachelor marksheet
              </Button>
            </Upload>
          </>
        )}
      </div>
      <Button
        onClick={handleUpload}
        disabled={isDisabled || uploading}
        isLoading={uploading}
        loadingText="Uploading documents"
        className="mt-6"
      >
        Submit documents
      </Button>
    </div>
  );
};

export default UploadFeature;
