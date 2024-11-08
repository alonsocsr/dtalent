import { UserProvider } from '../context/UserContext';
import DashboardLayout from '@/components/DashboardLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </UserProvider>
  );
}