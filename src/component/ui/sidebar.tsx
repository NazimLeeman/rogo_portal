import {
  FileTextIcon,
  LayoutDashboard,
  Loader,
  LogOut,
  Menu,
  TicketIcon,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Protect from './protect';
import { publicSupabase } from '@/api/SupabaseClient';

const externalLinks = [
  {
    name: 'Buy Air Tickets',
    href: 'https://travel.russianonthego.info/',
    icon: <TicketIcon width={18} />,
  },
];

export default function Sidebar() {
  // const pathname = usePathname();
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const links = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard width={18} />,
      role: null,
    },
    {
      name: 'Student Files',
      href: '/student-files',
      icon: <FileTextIcon width={18} />,
      role: 'Admin',
    },
  ] as const;

  const handleLogout = () => {
    setLoggingOut(true);
    Promise.all([publicSupabase.auth.signOut()])
      .then(() => {
        localStorage.clear();
        navigate('/');
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
  };

  // useEffect(() => {
  //   // hide sidebar on path change
  //   setShowSidebar(false);
  // }, [pathname]);

  return (
    <>
      <div className="fixed right-5 top-7 z-20 flex items-center gap-4 sm:hidden">
        <button className="" onClick={() => setShowSidebar(!showSidebar)}>
          <Menu width={20} />
        </button>
      </div>
      <div
        className={`transform ${
          showSidebar ? 'w-full translate-x-0' : '-translate-x-full'
        } fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0`}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <NavLink
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg p-1.5"
            >
              <img
                src="/logo-icon.svg"
                alt="Russian On The Go"
                className="h-10 w-auto"
              />
            </NavLink>
          </div>
          <div className="grid gap-1">
            {links.map(({ name, href, icon, role }) => (
              <Protect key={href} role={role}>
                <NavLink
                  to={href}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 ${
                      isActive
                        ? 'bg-stone-200 text-black dark:bg-stone-700'
                        : ''
                    } rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800`
                  }
                >
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </NavLink>
              </Protect>
            ))}
          </div>
        </div>
        <div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />

          <div className="grid gap-1">
            {externalLinks.map(({ name, href, icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
              >
                <div className="flex items-center space-x-3">
                  {icon}
                  <span className="text-sm font-medium">{name}</span>
                </div>
                <p>↗</p>
              </a>
            ))}
          </div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          <button
            className="rounded-lg flex items-center w-full space-x-3 px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
            onClick={handleLogout}
          >
            {loggingOut ? (
              <Loader width={18} className="animate-spin" />
            ) : (
              <LogOut width={18} />
            )}
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
