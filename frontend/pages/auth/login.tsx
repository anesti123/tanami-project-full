// pages/auth/login.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../../features/auth/LoginForm';
import Link from 'next/link'; // Import Link component from Next.js

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <LoginForm />
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{' '}
          <Link href="/auth/register" className="text-blue-600">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
