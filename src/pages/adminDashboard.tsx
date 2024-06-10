import React, { useEffect, useState } from 'react';
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Card, Layout, Menu, Modal, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../component/StudentForm/studentForm';
import { publicSupabase } from '../api/SupabaseClient';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { StudentInfo } from '../interface/studentInfo.interface';
import FileForm from '../component/StudentForm/fileForm';
import { useFile } from '../context/FileContext';
import SearchTable from '../component/Table/table';

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

const AdminDashboard: React.FC = () => {
  // const [selectedNav, setSelectedNav] = useState<string | null>('1');
  // const [students, setStudents] = useState<StudentInfo[] | null>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(null);
  const [selectedStudentFile, setSelectedStudentFile] = useState<any[] | null>(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { students, setStudents, selectedNav, setSelectedNav } = useFile();

  const navigate = useNavigate();

  useEffect(() => {
    getStudentInfo();
  }, []);

  useEffect(() => {
    setSelectedStudent(null)
  },[selectedNav])

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

  const onChange = (value: string) => {
    const student = students?.find(student => student.id === value) || null;
    setSelectedStudent(student);
    console.log("selected", student);
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

  const getStudentInfo = async () => {
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

  const filterOption: SelectProps<string>['filterOption'] = (input, option) => {
    // Ensure option and option.children are defined
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
      // setStudents(StudentInfo);
      // setLoading(false);
      if (error) throw error;
      console.log(StudentFile)
      setSelectedStudentFile(StudentFile)
      setOpen(true);
    } catch (error) {
      console.error('ERROR: ', error);
      // setLoading(false);
    }
  }

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
                <div className='flex flex-col'>
                  <div className="p-8">
                    <p className="text-xl">Search an Existing Student Account</p>
                  </div>
                  {students !== null && (
                    <div className='p-2 ml-8'>
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
                    <div className='pl-10 pt-2'>
    <Card title={selectedStudent.email} 
    // extra={<a href="#">More</a>} 
    style={{ width: 400 }}>
      <p>Currently {selectedStudent.first_name} has {selectedStudent.student_files.length > 0 ? selectedStudent.student_files.length : "no"} student file ongoing.</p>
    {selectedStudent.student_files.length > 0 && (
      <>
      <button className='mt-2 hover:text-[#0000FF]'
      onClick={() => handleSudentFile(selectedStudent.id)}>Click here to see in details.</button> 
      {selectedStudentFile !== null && (
      <Modal
        title={<p>{selectedStudentFile[0].university_name}</p>}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        >
        <p>Program: {selectedStudentFile[0].program}</p>
        <p>Subject: {selectedStudentFile[0].subject}</p>
        <p>Budget: {selectedStudentFile[0].budget}</p>
      </Modal>            
      )}
        </>
    )}
    </Card>
                    </div>
                  )}
                  <div className="p-8">
                    <p className="text-xl">Create a New Student Account</p>
                  </div>
                  <div>
                    <StudentForm />
                  </div>
                  {/* <div style={{ padding: '2rem'}}>
                  Upload your necessary documents here:
                </div>
                <div style={{ alignItems: 'center', marginLeft: '2rem'}}><UploadFeature/></div> */}
                </div>
              </div>
            )}
            {selectedNav === '2' && <div>
              <div>
              <div>
                    <p className="text-xl">Search Student File</p>
                  </div>
                <SearchTable/>
              </div>
            <div className="p-5">
                    <p className="text-xl">Create a New Student File</p>
                    <span>You need to create a student account before creating a file.</span>
                  </div>
              <FileForm/>
              </div>}
            {selectedNav === '3' && <div>Content for Nav 3</div>}
            {selectedNav === '4' && <div>Content for Nav 4</div>}
          </div>
  );
};

export default AdminDashboard;
