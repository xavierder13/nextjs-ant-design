import { Breadcrumb } from 'antd';
import ProtectedLayout from "@/components/ProtectedLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout permission="user-list">
      <div>
        <Breadcrumb
          style={{ margin: '16px 0' }}
          items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
        />
        <div>Dashboard</div>
      </div>
    </ProtectedLayout>
  );
}
