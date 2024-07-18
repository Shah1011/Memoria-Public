'use client';

import { useState, useMemo } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '@/app/firebase';
import '@/app/globals.css';
import ParticlesComponent from '@/app/config/particles-config';
import Button from '@/app/components/Button';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); 

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your email, link sent!");
    } catch (error) {
      setMessage("Failed to send email. Please try again.");
    }
  };

  const memoizedParticlesConfig = useMemo(() => <ParticlesComponent />, []);

  return (
    <>
      {memoizedParticlesConfig}
      <div className="z-10 relative flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link href='/auth/signin'>
          <img
            className="mx-auto h-20 w-30"
            src="https://i.ibb.co/FnPQjw0/bgless.png"
            alt="Your Company"
          />
          </Link>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
            Forgot Password
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-5">
            <div className="mt-2">
              <input
                placeholder='Enter Email'
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-primary1 transition ease-in-out duration-150"
              />
            </div>

            <div>
              <Button
                onClick={() => resetPassword()}
                disabled={!email}
              >
                Send Forgot Password Email
              </Button>
            </div>

            {message && (
              <div className="mt-4 text-center text-white">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
