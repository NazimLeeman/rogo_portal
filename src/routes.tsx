import { Navigate } from 'react-router-dom';
import Login from './component/Login/login';
import MagicLogin from './component/Login/magicLogin';
import Register from './component/Register/register';
import Dashboard from './pages/dashboard';
import StudentDashboard from './pages/studentDashboard';
import StudentFileSubmission from './pages/studentFileSubmission';
import StudentFileDetails from './pages/studentFileDetails';

export const routes = [
  // {
  //   name: 'Login',
  //   path: '/login',
  //   element: <Login />,
  // },
  {
    name: 'Login',
    path: '/login',
    element: <MagicLogin />,
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />,
  },
  {
    name: 'dashboard',
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    name: 'file-submission',
    path: '/file-submission',
    element: <StudentFileSubmission />,
  },
  {
    name: 'file-details',
    path: '/file-details/:fileId',
    element: <StudentFileDetails />,
  },
];
