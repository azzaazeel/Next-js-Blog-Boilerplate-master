import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';

const RegisterPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login');
  }, [router]);

  return (
    <Main
      meta={
        <Meta
          title="Registration Disabled"
          description="New registrations are currently closed"
        />
      }
    >
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registration Closed
        </h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          We are not accepting new registrations at this time. You will be
          automatically redirected to the login page.
        </p>
        <div className="animate-pulse text-sm font-medium text-blue-600">
          Redirecting to Sign In...
        </div>
      </div>
    </Main>
  );
};

export default RegisterPage;
