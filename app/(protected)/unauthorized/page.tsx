
"use client";

import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();
  const redirecHome = () => {
    router.push('/');
  }
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={redirecHome}>Back Home</Button>}
    />
  );
}
