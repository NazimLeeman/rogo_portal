export interface FirstDataSource {
    budget: number;
    id: string;
    program: string;
    student_id: string;
    subject: string;
    university_name: string;
    studentInfo?:{
        email:string,
        first_name:string,
        last_name:string,
        id:string,
        phone_number: string
    }
  }
  
  export interface SecondDataSource {
    content: any[];
    createdAt: string;
    description: string | null;
    filedetails: {
      additionalFile: string | null;
      budget: number;
      created_at: string;
      fileStatus: string;
      id: string;
      notes: string | null;
      payment: string | null;
      services: string[];
      servicesobj: { [key: string]: boolean };
      stepid: string | null;
      studentfileid: string;
      studentid: string;
    };
    filedetailsid: string;
    id: string;
    notes: string | null;
    state: number;
    title: string;
  }

  export interface CombinedDataSource {
    // Properties from the first data source
    budget: number;
    id: string;
    program: string;
    student_id: string;
    subject: string;
    university_name: string;
    studentInfo?:{
        email:string,
        first_name:string,
        last_name:string,
        id:string,
        phone_number: string
    }
  
    // Properties from the second data source
    content?: any[];
    createdAt?: string;
    description?: string | null;
    filedetails?: {
      additionalFile: string | null;
      budget: number;
      created_at: string;
      fileStatus: string;
      id: string;
      notes: string | null;
      payment: string | null;
      services: string[];
      servicesobj: { [key: string]: boolean };
      stepid: string | null;
      studentfileid: string;
      studentid: string;
    };
    filedetailsid?: string;
    secondId?: string;  // Renamed from 'id' to avoid conflict
    notes?: string | null;
    state?: number;
    title?: string;
  }