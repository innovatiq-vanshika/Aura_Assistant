import { Suspense } from 'react';
import Dashboard from '@/components/dashboard';
import Loading from '@/components/loading';

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}