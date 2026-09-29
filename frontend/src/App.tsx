import AppRoutes from './routes/AppRoutes';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  );
}
