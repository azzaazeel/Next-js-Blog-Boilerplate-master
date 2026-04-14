import React, { useState, ReactElement } from 'react';

import { useRouter } from 'next/router';

import { Meta } from '../../layout/Meta';
import { authClient, useSession } from '../../lib/auth-client';
import { Main } from '../../templates/Main';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const recaptchaRef = React.useRef<any>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Redirect if already logged in
  React.useEffect(() => {
    if (session) {
      router.replace('/admin/dashboard');
    }
  }, [session, router]);

  if (isPending || session) {
    return null; // Or a loading spinner
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Trigger invisible recaptha
    let token = captchaToken;
    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    if (!isLocal) {
        if (!token && recaptchaRef.current) {
            token = await recaptchaRef.current.executeAsync();
        }

        if (!token) {
            setError('ReCAPTCHA verification failed. Please try again.');
            return;
        }
    } else {
        token = 'dev-token'; // Fake token for local bypass
    }

    const { error: signUpError } = await authClient.signIn.email({
      email,
      password,
      fetchOptions: {
        headers: {
          'x-recaptcha-token': token || ''
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message || 'Invalid credentials');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white border rounded shadow-sm">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            placeholder="Your password"
            required
          />
        </div>
        <div className="flex justify-center mb-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded border border-red-100">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded font-bold hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          Login
        </button>
      </form>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main meta={<Meta title="Login" description="Login to your account" />}>
      {page}
    </Main>
  );
};

export default LoginPage;
