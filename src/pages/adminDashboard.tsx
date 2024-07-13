import type { SelectProps } from 'antd';
import { Button, Card, Select, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { publicSupabase } from '../api/SupabaseClient';
import StudentForm from '../component/StudentForm/studentForm';
import { useFile } from '../context/FileContext';
import { StudentInfo } from '../interface/studentInfo.interface';
import Text from '@/component/ui/text';

const { Option } = Select;

const AdminDashboard: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(
    null,
  );
  const [selectedStudentFile, setSelectedStudentFile] = useState<any[] | null>(
    null,
  );
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const {
    students,
    setStudents,
    selectedNav,
    setSelectedNav,
    fileData,
    setFileData,
    studentInfo,
    setStudentInfo,
    currentStatus,
    setCurrentStatus,
    step,
    setStep,
    paymentStep,
    setPaymentStep,
    currentPaymentStatus,
    setPaymentCurrentStatus,
    setStudentFiles,
  } = useFile();

  const navigate = useNavigate();

  useEffect(() => {
    getStudentsInfo();
  }, []);

  useEffect(() => {
    setSelectedStudent(null);
  }, [selectedNav]);

  const onChange = (value: string) => {
    const student = students?.find((student) => student.id === value) || null;
    setSelectedStudent(student);
    handleSudentFile(value);
  };

  const onBlur = () => {
    console.log('blur');
  };

  const onFocus = () => {
    console.log('focus');
  };

  const onSearch = (val: string) => {
    console.log('search:', val);
  };

  const getStudentsInfo = async () => {
    try {
      const { data: StudentInfo, error } = await publicSupabase
        .from('studentInfo')
        .select('*');
      setStudents(StudentInfo);
      setLoading(false);
      if (error) throw error;
    } catch (error) {
      console.error('ERROR: ', error);
      setLoading(false);
    }
  };

  const getStudentInfo = async (id: string, fileId: string, fileStatus: string) => {
    try {
      const { data, error } = await publicSupabase
        .from('studentInfo')
        .select('*')
        .eq('id', id);
      if (error) throw error;
      if (data && data.length > 0) {
        setStudentInfo(data[0]);
        

        if(fileStatus === 'Rejected') {
          navigate('/file-rejection')
        } else {
          navigate(`/file-details/${fileId}`);
        }
      } else {
        console.error('No student info found');
      }
    } catch (error) {
      console.error('ERROR: ', error);
      setLoading(false);
    }
  };

  const filterOption: SelectProps<string>['filterOption'] = (input, option) => {
    return (
      (option?.children as unknown as string)
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  };

  const handleSudentFile = async (id: string) => {
    try {
      const { data: StudentFile, error } = await publicSupabase
        .from('studentFile')
        .select('*')
        .eq('student_id', id);
      if (error) throw error;
      console.log('from student file', StudentFile);
      setSelectedStudentFile(StudentFile);
      setOpen(true);
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const handleStudentFileDetails = async (id: string, student_id: string) => {
    try {
      const { data: fileDetailsData, error: fileDetailsError } =
        await publicSupabase
          .from('filedetails')
          .select()
          .eq('studentfileid', id);

      if (fileDetailsError) {
        toast.error('Error while opening file.');
        throw fileDetailsError;
      }
      if (fileDetailsData && fileDetailsData?.length > 0) {
        const fileId = fileDetailsData[0].id;
        setFileData(fileDetailsData[0]);
        const fileStatus = fileDetailsData[0].fileStatus
        await getStudentInfo(student_id, fileId, fileStatus);
      } else {
        selectedStudentInfo(student_id, id);
        // navigate('/agreement');
      }
    } catch (error) {
      toast.error("This file hasn't been submitted by the Student");
      console.log(error);
    }
  };

  const selectedStudentInfo = async (
    studentId: string,
    studentFileId: string,
  ) => {
    try {
      const { data: studentInfo, error: studentInfoError } =
        await publicSupabase.from('studentInfo').select().eq('id', studentId);

      if (studentInfoError) throw new Error();

      if (studentInfo) {
        console.log('student info', studentInfo);
        setStudentInfo(studentInfo[0]);
        const { data: studentFile, error: studentFileError } =
          await publicSupabase
            .from('studentFile')
            .select()
            .eq('id', studentFileId);

        if (studentFileError) throw new Error();
        console.log('student file', studentFile);
        setStudentFiles(studentFile[0]);
        navigate('/agreement');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="flex max-w-screen-xl flex-col space-y-12 px-8 py-14 md:py-8">
      <Text variant="heading-2xl">RoGo Dashboard</Text>
      <div className="flex flex-col">
        <div className="p-8">
          <p className="text-xl">Search an Existing Student Account</p>
        </div>
        {students !== null && (
          <div className="p-2 ml-8">
            <Select
              showSearch
              style={{ width: 400 }}
              placeholder="nazim@gmail.com"
              optionFilterProp="children"
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={filterOption}
            >
              {students.map((student) => (
                <Option key={student.id} value={student.id}>
                  {student.email}
                </Option>
              ))}
            </Select>
          </div>
        )}
        {selectedStudent && (
          <div className="pl-10 pt-2">
            <p>
              Currently {selectedStudent.first_name} has{' '}
              {selectedStudent.student_files.length > 0
                ? selectedStudent.student_files.length
                : 'no'}{' '}
              student file ongoing.
            </p>
            <div className="flex flex-row justify-center items-center gap-6">
              {selectedStudentFile &&
                selectedStudentFile.length > 0 &&
                selectedStudentFile.map((studentFile, index) => (
                  <Card
                    key={index}
                    title={studentFile.university_name}
                    style={{ width: 400, margin: '10px 0' }}
                  >
                    <p>Course: {studentFile.course}</p>
                    <p>Program: {studentFile.program}</p>
                    <p>Subject: {studentFile.subject}</p>
                    <p>Budget: {studentFile.budget}</p>
                    <Button
                      style={{
                        color: 'white',
                        background: '#1677ff',
                        border: 'none',
                      }}
                      className="mt-2"
                      onClick={() => {
                        setStudentFiles(studentFile)
                        handleStudentFileDetails(
                          studentFile.id,
                          studentFile.student_id,
                        )
                      }
                      }
                    >
                      Click here to proceed
                    </Button>
                  </Card>
                ))}
            </div>
          </div>
        )}
        <div className="p-8">
          <p className="text-xl">Create a New Student Account</p>
        </div>
        <div>
          <StudentForm />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
