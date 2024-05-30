import Login from './component/Login/login';
import Register from './component/Register/register';
import Dashboard from './pages/dashboard';

export const routes = [
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
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
];
