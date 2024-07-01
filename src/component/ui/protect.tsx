import { useRole } from '@/hooks/useRole';
import { ReactNode } from 'react';

export default function Protect({
  role,
  children,
}: {
  role: string | null;
  children: ReactNode;
}) {
  const { userRole } = useRole();

  if (!role) return children;

  if (userRole === role) return children;

  return null;
}
