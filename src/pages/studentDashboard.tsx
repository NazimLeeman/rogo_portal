import React, { useEffect, useState } from 'react';
import { theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import type { SelectProps } from 'antd';
import { StudentInfo } from '../interface/studentInfo.interface';
import FileForm from '../component/StudentForm/fileForm';
import { useFile } from '../context/FileContext';
import SearchTable from '../component/Table/table';
import { useRole } from '../hooks/useRole';
import Text from '@/component/ui/text';
import { Loader } from 'lucide-react';
import { Card } from '@/component/ui/card';
import { Button } from '@/component/ui/button';
import { formatCurrency } from '@/utils';
import { Skeleton } from '@/component/ui/skeleton';

const StudentDashboard: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(
    null,
  );
  const [selectedStudentFile, setSelectedStudentFile] = useState<any[] | null>(
    null,
  );
  // const [userEmail, setUserEmail] = useState<string | null>("")
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { userEmail } = useRole();
  const [isUserEmailAvailable, setIsUserEmailAvailable] = useState(false);
  const [studentFilesArr, setStudentFilesArr] = useState<any>([]);

  // const { userEmail, setUserEmail } = useSupabase();
  const {
    selectedNav,
    setSelectedNav,
    studentInfo,
    setStudentInfo,
    studentFiles,
    setStudentFiles,
  } = useFile();

  const navigate = useNavigate();

  useEffect(() => {
    if (userEmail && !isUserEmailAvailable) {
      getStudentInfo();
      setIsUserEmailAvailable(true);
    }
  }, [userEmail]);

  const getStudentInfo = async () => {
    try {
      const { data, error } = await publicSupabase
        .from('studentInfo')
        .select('*')
        .eq('email', userEmail);
      if (error) throw error;

      setStudentInfo((prevStudent) => {
        console.log('prev student', prevStudent);
        if (data[0]?.id) {
          getStudentFile(data[0].id);
        }
        return data[0];
      });
      setLoading(false);
    } catch (error) {
      console.error('ERROR: ', error);
      setLoading(false);
    }
  };

  const getStudentFile = async (id: any) => {
    try {
      // console.log('data', id);
      const { data, error } = await publicSupabase
        .from('studentFile')
        .select('*')
        .eq('student_id', id);
      if (error) throw error;
      console.log('student file', data);
      setStudentFilesArr(data);
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const checkFileStatus = async (id: string) => {
    try {
      const { data, error } = await publicSupabase
        .from('filedetails')
        .select('*')
        .eq('studentfileid', id);

      if (error) {
        console.log('error', error);
      }
      console.log('data', data);
      if (data && data?.length > 0) {
        navigate(`/file-details/${data[0].id}`);
      } else {
        navigate('/agreement');
      }
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  };

  const handleSudentFile = async (files: any) => {
    checkFileStatus(files.id);
    setStudentFiles(files);
  };

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 px-8 py-14 md:py-8">
      <Text variant="heading-2xl">RoGo Dashboard</Text>
      <div className="space-y-4">
        <Text variant="heading-lg">Your files</Text>
        {studentFilesArr && studentFilesArr.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentFilesArr.map((studentFiles: any, index: any) => (
              <Card
                title={studentFiles.university_name}
                className="p-4 space-y-4"
                key={index}
              >
                <Text variant="heading-md" className="mb-2">
                  {studentFiles.university_name}
                </Text>
                <div>
                  <Text>Course: {studentFiles.course}</Text>
                  <Text>Program: {studentFiles.program}</Text>
                  <Text>Subject: {studentFiles.subject}</Text>
                  <Text>Payment: {formatCurrency(studentFiles.budget)} </Text>
                </div>
                <Button
                  onClick={() => handleSudentFile(studentFiles)}
                  size="sm"
                >
                  View File
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-[198px]" />
            <Skeleton className="h-[198px]" />
            <Skeleton className="h-[198px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
