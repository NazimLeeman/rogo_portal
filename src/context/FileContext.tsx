import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { StudentFile, StudentInfo } from '../interface/studentInfo.interface';

interface FileContextType {
  //For Admin
  students: StudentInfo[] | null;
  setStudents: React.Dispatch<React.SetStateAction<StudentInfo[] | null>>;
  studentsFile: StudentFile[] | null;
  setStudentsFile: React.Dispatch<React.SetStateAction<StudentFile[] | null>>;
  selectedNav: string | null;
  setSelectedNav: React.Dispatch<React.SetStateAction<string | null>>;

  //For Student
  studentInfo: StudentInfo | null;
  setStudentInfo: React.Dispatch<React.SetStateAction<StudentInfo | null>>;
  studentFiles: StudentFile | null;
  setStudentFiles: React.Dispatch<React.SetStateAction<StudentFile | null>>;

  fileData: any;
  setFileData: any;
  currentStatus: any;
  setCurrentStatus: any;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFile = (): FileContextType => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFile must be used within a FileProvider');
  }
  return context;
};

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider = ({ children }: FileProviderProps) => {
  const [students, setStudents] = useState<StudentInfo[] | null>([]);
  const [studentsFile, setStudentsFile] = useState<StudentFile[] | null>([]);
  const [selectedNav, setSelectedNav] = useState<string | null>('1');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [studentFiles, setStudentFiles] = useState<StudentFile | null>(null);
  const [fileData, setFileData] = useState<any[]>();
  const [currentStatus, setCurrentStatus] = useState<any>(0);

  return (
    <FileContext.Provider
      value={{
        students,
        setStudents,
        studentsFile,
        setStudentsFile,
        selectedNav,
        setSelectedNav,
        studentInfo,
        setStudentInfo,
        studentFiles,
        setStudentFiles,
        fileData,
        setFileData,
        currentStatus,
        setCurrentStatus
      }}
    >
      {children}
    </FileContext.Provider>
  );
};
