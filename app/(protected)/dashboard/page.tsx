import { Breadcrumb } from 'antd';

export default function DashboardLayout() {
  return (
    <div>
      <Breadcrumb
        style={{ margin: '16px 0' }}
        items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
      />
      <div>Dashboard</div>
    </div>
  );
}