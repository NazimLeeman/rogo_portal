import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { StudentInfo } from "../interface/studentInfo.interface";

interface FileContextType {
    students: StudentInfo[] | null;
    setStudents: React.Dispatch<React.SetStateAction<StudentInfo[] | null>>;
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

    return (
        <FileContext.Provider value={{
            students,
            setStudents
        }}>
            {children}
        </FileContext.Provider>
    )
}