import React from 'react';
import AdminDashboard from './adminDashboard';
import StudentDashboard from './studentDashboard';
import { useRole } from '../hooks/useRole';



const Dashboard: React.FC = () => {
  const { userRole } = useRole();

  return (
    <>{userRole === 'Admin' ? <AdminDashboard /> : <StudentDashboard />}</>
  );
};

export default Dashboard;
