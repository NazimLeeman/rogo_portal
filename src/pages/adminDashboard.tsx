import React, { useEffect, useState } from 'react';
import { Button, Card, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../component/StudentForm/studentForm';
import { publicSupabase } from '../api/SupabaseClient';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { StudentInfo } from '../interface/studentInfo.interface';
import FileForm from '../component/StudentForm/fileForm';
import { useFile } from '../context/FileContext';
import SearchTable from '../component/Table/table';
import toast from 'react-hot-toast';

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
    setStep
  } = useFile();

  const navigate = useNavigate();

  useEffect(() => {
    getStudentsInfo();
  }, []);

  useEffect(() => {
    setSelectedStudent(null);
  }, [selectedNav]);


  const onChange = (value: string) => {
    console.log(value)
    const student = students?.find((student) => student.id === value) || null;
    setSelectedStudent(student);
    handleSudentFile(value)
    console.log('selected', student);
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

  const getStudentInfo = async (id: string, fileId: string) => {
    try {
      console.log('from getStudentInfo id',id)
      console.log('from getStudentInfo fileId',fileId)
      const { data, error } = await publicSupabase
        .from('studentInfo')
        .select('*')
        .eq('id', id);
      if (error) throw error;
      console.log(data)
      if (data && data.length > 0) {
        setStudentInfo(data[0]);
        navigate(`/file-details/${fileId}`);
      } else {
        console.error('No student info found');
      }
    } catch (error) {
      console.error('ERROR: ', error);
      setLoading(false);
    }
  };

  const getFileStep = async (fileId: string) => {
    try {
      console.log('from getStudentInfo fileId',fileId)
      const { data, error } = await publicSupabase
        .from('steps')
        .select('*')
        .eq('filedetailsid', fileId);
      if (error) throw error;
      console.log(data)
      setCurrentStatus(data[0].state)
      console.log('file step', currentStatus)
      setStep(data);
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
      console.log(StudentFile);
      setSelectedStudentFile(StudentFile);
      setOpen(true);
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const handleStudentFileDetails = async (id: string, student_id:string) => {
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
      const fileId = fileDetailsData[0].id;
      console.log('file Dataaaaaaaaaaaaaaaaa',fileDetailsData)
      setFileData(fileDetailsData[0])
      // if(fileDetailsData[0].fileStatus === "Pending") {
      //   setCurrentStatus(0)
      // } else if (fileDetailsData[0].fileStatus === "In Progress") {
      //   setCurrentStatus(1)
      // } else {
      //   setCurrentStatus(2)
      // }
      getFileStep(fileId);
      getStudentInfo(student_id, fileId);
      console.log('file iddddddddd',fileId)
      
    } catch (error) {
      toast.error("This file hasn't been submitted by the Student")
      console.log(error);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        minHeight: '80vh',
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      {selectedNav === '1' && (
        <div>
          <div className="text-xl">
            <h1> Welcome to ROGO PORTAL</h1>
          </div>
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
                  <div className='flex flex-row justify-center items-center gap-6'>
                    {selectedStudentFile && selectedStudentFile.length > 0 && selectedStudentFile.map((studentFile, index) => 
                      <Card
                      key={index}
                      title={studentFile.university_name}
                      style={{ width: 400, margin: '10px 0' }}
                    >
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
                        onClick={() => handleStudentFileDetails(studentFile.id, studentFile.student_id)}
                      >
                        Click here to proceed
                      </Button>
                    </Card>
                    )}
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
      )}
      {selectedNav === '2' && (
        <div>
          <div>
            <div>
              <p className="text-xl">Search Student File</p>
            </div>
            <SearchTable />
          </div>
          <div className="p-5">
            <p className="text-xl">Create a New Student File</p>
            <span>
              You need to create a student account before creating a file.
            </span>
          </div>
          <FileForm />
        </div>
      )}
      {selectedNav === '3' && <div>Content for Nav 3</div>}
      {selectedNav === '4' && <div>Content for Nav 4</div>}
    </div>
  );
};

export default AdminDashboard;
