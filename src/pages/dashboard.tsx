import React, { useEffect, useState } from 'react';
import AdminDashboard from './adminDashboard';
import StudentDashboard from './studentDashboard';
import { useRole } from '../hooks/useRole';
import { useSupabase } from '../context/supabaseContext';
import { useAuth } from '../hooks/useAuth';


const Dashboard: React.FC = () => {
  const { userRole, userEmail } = useRole();

  console.log('userEmail',userEmail)

  return (
    <>{userRole === 'Admin' ? <AdminDashboard /> : <StudentDashboard />}</>
  );
};

export default Dashboard;
