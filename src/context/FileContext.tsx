import { createContext, useState, useContext, ReactNode } from "react";
import { StudentFile, StudentInfo } from "../interface/studentInfo.interface";

interface FileContextType {
    students: StudentInfo[] | null;
    setStudents: React.Dispatch<React.SetStateAction<StudentInfo[] | null>>;
    studentsFile: StudentFile[] | null;
    setStudentsFile: React.Dispatch<React.SetStateAction<StudentFile[] | null>>;
    selectedNav: string | null;
    setSelectedNav: React.Dispatch<React.SetStateAction<string | null>>;
  }

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFile = (): FileContextType => {
    const context = useContext(FileContext);
    if (context === undefined) {
      throw new Error("useFile must be used within a FileProvider");
    }
    return context;
  };

interface FileProviderProps {
    children: ReactNode;
  }

export const FileProvider = ({children}: FileProviderProps) => {
    const [students, setStudents] = useState<StudentInfo[] | null>([]);
    const [studentsFile, setStudentsFile] = useState<StudentFile[] | null>([]);
    const [selectedNav, setSelectedNav] = useState<string | null>('1');

    return (
        <FileContext.Provider value={{
            students,
            setStudents,
            studentsFile,
            setStudentsFile,
            selectedNav,
            setSelectedNav
        }}>
            {children}
        </FileContext.Provider>
    )
}