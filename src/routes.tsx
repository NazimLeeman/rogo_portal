import MagicLogin from './component/Login/magicLogin';
import Register from './component/Register/register';
import Dashboard from './pages/dashboard';
import StudentFileSubmission from './pages/studentFileSubmission';
import StudentFileDetails from './pages/studentFileDetails';
import Agreement from './pages/agreement';
import FileRejection from './pages/fileRejection';

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
  {
    name: 'agreement',
    path: '/agreement',
    element: <Agreement />,
  },
  {
    name: 'file-rejection',
    path: '/file-rejection',
    element: <FileRejection />,
  }
];
