import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const metadata = {
  title: 'Log In – EasyFITA',
  description: 'Log in to your EasyFITA account.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}
