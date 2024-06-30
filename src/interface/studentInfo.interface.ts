// studentInfo interface
export interface StudentInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number | null;
  student_files: string[];
}

// studentFile interface
export interface StudentFile {
  id: string;
  university_name: string;
  program: 'bachelors' | 'masters' | 'phd';
  subject: string;
  budget: number;
  student_id: string;
}
