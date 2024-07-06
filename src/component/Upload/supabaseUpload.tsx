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

const checkForDuplicateFileNames = (fileLists: UploadFile[][]) => {
  const allFileNames = fileLists.flat().map(file => file.name);
  const uniqueFileNames = new Set(allFileNames);
  
  if (allFileNames.length !== uniqueFileNames.size) {
    const duplicates = allFileNames.filter((name, index) => allFileNames.indexOf(name) !== index);
    toast.error(`Duplicate file names found: ${duplicates.join(', ')}. Please rename these files before uploading.`)
    throw new Error(`Duplicate file names found: ${duplicates.join(', ')}. Please rename these files before uploading.`);
  }
};

const UploadFeature = ({changedValues}:any) => {
  const [fileList1, setFileList1] = useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);
  const [fileList3, setFileList3] = useState<UploadFile[]>([]);
  const [fileList4, setFileList4] = useState<UploadFile[]>([]);
  const [fileList5, setFileList5] = useState<UploadFile[]>([]);
  const [fileList6, setFileList6] = useState<UploadFile[]>([]);
  const [fileList7, setFileList7] = useState<UploadFile[]>([]);
  const [fileList8, setFileList8] = useState<UploadFile[]>([]);
  const [fileList9, setFileList9] = useState<UploadFile[]>([]);
  const [fileList10, setFileList10] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { studentInfo, studentFiles, setFileData } = useFile();

  const navigate = useNavigate();

  const isMasters = studentFiles?.program === 'Masters';
  const isPhd = studentFiles?.program === 'PhD'

  const isDisabled = isMasters
    ? fileList1.length === 0 ||
      fileList2.length === 0 ||
      fileList3.length === 0 ||
      fileList4.length === 0 ||
      fileList5.length === 0 ||
      fileList6.length === 0 ||
      fileList7.length === 0 ||
      fileList8.length === 0
    : isPhd
    ? fileList1.length === 0 ||
      fileList2.length === 0 ||
      fileList3.length === 0 ||
      fileList4.length === 0 ||
      fileList5.length === 0 ||
      fileList6.length === 0 ||
      fileList7.length === 0 ||
      fileList8.length === 0 ||
      fileList9.length === 0 ||
      fileList10.length === 0
    : fileList1.length === 0 ||
      fileList2.length === 0 ||
      fileList3.length === 0 ||
      fileList4.length === 0 ||
      fileList5.length === 0 ||
      fileList6.length === 0;

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
    passport?: string,
    photo?: string,
  ) => {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    const uploadPath = passport 
      ? `${studentId}/${passport}/${file.name}` 
      : photo 
        ? `${studentId}/${photo}/${file.name}` 
        : `${studentId}/${file.name}`;

    const { data, error } = await publicSupabase.storage
      .from('avatars')
      .upload(uploadPath, file, { upsert: true });

    if (error) {
      console.error(`Attempt Error uploading ${file.name}:`, error);
      throw error;
    }

    console.log(`Attempt Successfully uploaded ${file.name}`);

    return data;
  };

  const handleUpload = async () => {
    setUploading(true);

    const allFileLists = [
      fileList1, fileList2, fileList3, fileList4, fileList5, fileList6,
      ...(isMasters || isPhd ? [fileList7, fileList8] : []),
      ...(isPhd ? [fileList9, fileList10] : []),
    ];

    try {

      checkForDuplicateFileNames(allFileLists);
      const passport = 'passport';
      const photo = 'photo';

      const uploadPromises = [
        ...fileList1.map((file) => uploadFile(file, studentInfo?.id, passport)),
        ...fileList2.map((file) => uploadFile(file, studentInfo?.id, photo)),
        ...fileList3.map((file) => uploadFile(file, studentInfo?.id)),
        ...fileList4.map((file) => uploadFile(file, studentInfo?.id)),
        ...fileList5.map((file) => uploadFile(file, studentInfo?.id)),
        ...fileList6.map((file) => uploadFile(file, studentInfo?.id)),
        ...(isMasters || isPhd
          ? fileList7.map((file) => uploadFile(file, studentInfo?.id))
          : []),
        ...(isMasters || isPhd
          ? fileList8.map((file) => uploadFile(file, studentInfo?.id))
          : []),
        ...(isPhd
          ? fileList9.map((file) => uploadFile(file, studentInfo?.id))
          : []),
        ...(isPhd
          ? fileList10.map((file) => uploadFile(file, studentInfo?.id))
          : []),
      ];

      await Promise.all(uploadPromises);

      await handleUpdate()
      await onFinish();
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
                : setFileList === setFileList6
                ? fileList6
                : setFileList === setFileList7
                  ? fileList7
                  : setFileList === setFileList8
                  ? fileList8
                    : setFileList === setFileList9
                    ? fileList9
                    : fileList10,
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

  const handleUpdate = async () => {
    if (Object.keys(changedValues).length > 0) {
      console.log('changed values',changedValues)
      const studentInfoFields = ['firstName', 'lastName', 'email', 'phone'];
    const studentFilesFields = ['university', 'program', 'subject', 'payment'];

    const studentInfoUpdates:any = {};
    const studentFilesUpdates:any = {};

    Object.entries(changedValues).forEach(([key, value]) => {
      if (studentInfoFields.includes(key)) {
        const dbKey = key === 'firstName' ? 'first_name' : 
                      key === 'lastName' ? 'last_name' : 
                      key === 'phone' ? 'phone_number' : key;
        studentInfoUpdates[dbKey] = value;
      } else if (studentFilesFields.includes(key)) {
        const dbKey = key === 'university' ? 'university_name' : 
                      key === 'payment' ? 'budget' : key;
        studentFilesUpdates[dbKey] = value;
      }
    });
    
    try {
      if (Object.keys(studentInfoUpdates).length > 0) {
        const { data: studentInfoData, error: studentInfoError } = await publicSupabase
          .from('studentInfo')
          .update(studentInfoUpdates)
          .eq('id', studentInfo?.id) 
          .select();

        if (studentInfoError) throw studentInfoError;
        console.log('Updated studentInfo:', studentInfoData);
      }

      if (Object.keys(studentFilesUpdates).length > 0) {
        const { data: studentFilesData, error: studentFilesError } = await publicSupabase
          .from('studentFile')
          .update(studentFilesUpdates)
          .eq('id', studentFiles?.id) 
          .select();

        if (studentFilesError) throw studentFilesError;
        console.log('Updated studentFiles:', studentFilesData);
      }

      console.log('All updates completed successfully');
    } catch (error) {
      console.error('Error updating data:', error);
    }
    }
  };

  return (
    <>
    <div>
      <Text variant="heading-md" className="mb-4">
        Photos
      </Text>
      <div className="grid grid-cols-2 gap-4">
      <Upload {...uploadProps(setFileList1)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            Passport
          </Button>
        </Upload>
        <Upload {...uploadProps(setFileList2)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            Photo
          </Button>
        </Upload>
      </div>
    </div>      
    <div>
      <Text variant="heading-md" className="mb-4">
        Documents
      </Text>
      <div className="grid grid-cols-2 gap-4">
        <Upload {...uploadProps(setFileList3)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            SSC certificate
          </Button>
        </Upload>
        <Upload {...uploadProps(setFileList4)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            SSC marksheet
          </Button>
        </Upload>
        <Upload {...uploadProps(setFileList5)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            HSC certificate
          </Button>
        </Upload>
        <Upload {...uploadProps(setFileList6)}>
          <Button variant="outline">
            <UploadIcon className="h-4 w-4 mr-2" />
            HSC marksheet
          </Button>
        </Upload>
        {isMasters && (
          <>
            <Upload {...uploadProps(setFileList7)}>
              <Button variant="outline">
                <UploadIcon className="h-4 w-4 mr-2" />
                Bachelor certificate
              </Button>
            </Upload>
            <Upload {...uploadProps(setFileList8)}>
              <Button variant="outline">
                <UploadIcon className="h-4 w-4 mr-2" />
                Bachelor marksheet
              </Button>
            </Upload>
          </>
        )}
        {isPhd && (
  <>
    <Upload {...uploadProps(setFileList7)}>
      <Button variant="outline">
        <UploadIcon className="h-4 w-4 mr-2" />
        Bachelor certificate
      </Button>
    </Upload>
    <Upload {...uploadProps(setFileList8)}>
      <Button variant="outline">
        <UploadIcon className="h-4 w-4 mr-2" />
        Bachelor marksheet
      </Button>
    </Upload>
    <Upload {...uploadProps(setFileList9)}>
      <Button variant="outline">
        <UploadIcon className="h-4 w-4 mr-2" />
        Master's certificate
      </Button>
    </Upload>
    <Upload {...uploadProps(setFileList10)}>
      <Button variant="outline">
        <UploadIcon className="h-4 w-4 mr-2" />
        Master's marksheet
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
    </>
  );
};

export default UploadFeature;
