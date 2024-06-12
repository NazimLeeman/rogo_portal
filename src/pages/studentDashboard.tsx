import React, { useEffect, useState } from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, Card, Layout, Menu, Modal, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../component/StudentForm/studentForm';
import { publicSupabase } from '../api/SupabaseClient';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { StudentFile, StudentInfo } from '../interface/studentInfo.interface';
import FileForm from '../component/StudentForm/fileForm';
import { useFile } from '../context/FileContext';
import SearchTable from '../component/Table/table';
import { useSupabase } from '../context/supabaseContext';

const { Option } = Select;

const navLabels = ['Student Info', 'Student File', 'Status', 'Payment'];

const logoutLabel = [
  {
    key: '5',
    icon: React.createElement(LogoutOutlined),
    label: 'Logout',
  },
];

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: navLabels[index],
}));

const StudentDashboard: React.FC = () => {
  // const [selectedNav, setSelectedNav] = useState<string | null>('1');
  // const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  // const [ studentFiles, setStudentFiles] = useState<StudentFile | null>(null);
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

  const { userEmail, setUserEmail } = useSupabase();
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
    getStudentInfo();
  }, []);

  // useEffect(() => {
  //   // This will log the updated studentInfo value whenever it changes
  //   console.log('from dashboard studentInfo:', studentInfo);
  // }, [studentInfo]);

  useEffect(() => {
    setSelectedStudent(null);
  }, [selectedNav]);

  const handleNavClick = (key: string) => {
    setSelectedNav(key);
  };

  const handleLogout = () => {
    Promise.all([publicSupabase.auth.signOut()])
      .then(() => {
        localStorage.clear();
        navigate('/');
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
  };

  // const onChange = (value: string) => {
  //   const student = students?.find(student => student.id === value) || null;
  //   setSelectedStudent(student);
  //   console.log("selected", student);
  // };

  const onBlur = () => {
    console.log('blur');
  };

  const onFocus = () => {
    console.log('focus');
  };

  const onSearch = (val: string) => {
    console.log('search:', val);
  };

  const getStudentInfo = async () => {
    try {
      const { data, error } = await publicSupabase
        .from('studentInfo')
        .select('*')
        .eq('email', userEmail);
      if (error) throw error;
      // setStudents(data[0]);
      // setLoading(false);
      // if(students?.id) {
      //   await getStudentFile();
      // }
      // console.log(userEmail);
      setStudentInfo((prevStudent) => {
        // If you expect a single StudentInfo object
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
      setStudentFiles(data[0]);
      // console.log('data', data[0]);
      // console.log('userEmail', userEmail);
    } catch (error) {
      console.error('ERROR: ', error);
    }
  };

  const filterOption: SelectProps<string>['filterOption'] = (input, option) => {
    // Ensure option and option.children are defined
    return (
      (option?.children as unknown as string)
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    );
  };

  const handleSudentFile = async (id: string) => {
    navigate('/agreement');
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
            <h1> Welcome to ROGO</h1>
            {studentInfo && studentInfo.student_files.length > 0 ? (
              <p>You have currently these files going on.</p>
            ) : (
              <p>You have currently no files going on.</p>
            )}
          </div>
          <div className="flex flex-col">
            {studentInfo !== null && <div className="p-2 ml-8"></div>}
            {studentFiles && (
              <div className="pl-10 pt-2">
                <Card
                  title={studentFiles.university_name}
                  // extra={<a href="#">More</a>}
                  style={{ width: 400 }}
                >
                  <p>Program: {studentFiles.program}</p>
                  <p>Subject: {studentFiles.subject}</p>
                  <p>Budget: {studentFiles.budget}</p>
                  <>
                    <Button
                      style={{
                        color: 'white',
                        background: 'purple',
                        border: 'none',
                      }}
                      className="mt-2"
                      onClick={() => handleSudentFile(studentFiles.student_id)}
                    >
                      Click here to proceed
                    </Button>
                    {/* {studentFile !== null && (
      <Modal
        title={<p>{studentFile.university_name}</p>}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        >
        <p>Program: {studentFile.program}</p>
        <p>Subject: {studentFile.subject}</p>
        <p>Budget: {studentFile.budget}</p>
      </Modal>            
      )} */}
                  </>
                </Card>
              </div>
            )}
            {/* <div className="p-8">
                    <p className="text-xl">Create a New Student Account</p>
                  </div>
                  <div>
                    <StudentForm />
                  </div> */}
            {/* <div style={{ padding: '2rem'}}>
                  Upload your necessary documents here:
                </div>
                <div style={{ alignItems: 'center', marginLeft: '2rem'}}><UploadFeature/></div> */}
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

export default StudentDashboard;
