'use client';

import { auth, db } from '@/app/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import '@/app/globals.css';
import { signIn } from 'next-auth/react';
import Button from '@/app/components/Button';
import ParticlesComponent from '@/app/config/particles-config';
import PasswordVisibility from '@/app/components/PasswordVisibility';
import { doc, setDoc } from 'firebase/firestore';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    passwordAgain: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Password confirmation is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordAgain: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;

        // Save the user's name in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: values.name,
          email: values.email,
        });

        router.push('/auth/signin');
      } catch (error: any) {
        console.error(error);
      }
    }
  });

  // Memoize the particles configuration to prevent re-initialization on input change
  const memoizedParticlesConfig = useMemo(() => <ParticlesComponent />, []);

  return (
    <>
      {memoizedParticlesConfig}
      <main className='z-10 relative flex flex-col gap-10 justify-center items-center h-screen mx-20 max-sm:mx-auto'>
        <div>
          <img 
            src="https://i.ibb.co/FnPQjw0/bgless.png" 
            alt="logo" 
            className="w-30 h-20"
          />
        </div>
        <div className="flex gap-4 items-center rounded-2xl w-auto max-sm:w-3/4 bg-gray-800 shadow-md p-6">
          <div className="w-full">
            <h2 className="mb-4 text-2xl font-bold leading-9 tracking-tight text-white">
              Welcome
            </h2>
            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div className="mt-2">
                <input
                  placeholder='Enter your name'
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-primary1 transition ease-in-out duration-150"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.name}</div>
                ) : null}
              </div>

              <div className="mt-2">
                <input
                  placeholder='Enter your email'
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-primary1 transition ease-in-out duration-150"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="mt-2 relative">
                <input
                  placeholder='Enter your password'
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password"
                  required
                  className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-primary1 transition ease-in-out duration-150"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <PasswordVisibility showPassword={showPassword} setShowPassword={setShowPassword} />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.password}</div>
                ) : null}
              </div>

              <div className="mt-2 relative">
                <input
                  placeholder='Enter your password again'
                  id="passwordAgain"
                  name="passwordAgain"
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password"
                  required
                  className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-primary1 transition ease-in-out duration-150"
                  value={formik.values.passwordAgain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <PasswordVisibility showPassword={showPassword} setShowPassword={setShowPassword} />
                {formik.touched.passwordAgain && formik.errors.passwordAgain ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.passwordAgain}</div>
                ) : null}
              </div>

              <div>
                <Button
                  type='submit'
                  disabled={!(formik.isValid && formik.dirty)}
                >
                  Sign Up
                </Button>
              </div>
            </form>

            <div className="mt-3">
              <Button 
                onClick={() => signIn('google', {redirect: true, callbackUrl: '/'})}
                className='flex items-center justify-center gap-3'
              > 
                <h1>Continue with Google</h1>
                <img 
                  src="https://i.ibb.co/tB5KZT5/google-icon-logo-symbol-free-png.webp" 
                  alt="logo" 
                  className="w-6 h-6"
                />
              </Button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-400">
              Already a member?{' '}
              <button onClick={() => router.push('signin')} className="font-semibold leading-6 text-primary1">
                Sign In
              </button>
            </p>
          </div>

          <div className='max-sm:hidden'>
            <img 
              src="https://i.ibb.co/jvSfDcX/324401aa18cc80c55f338dcd4674cb80.gif" 
              alt="logo" 
              className="w-[700px] rounded-lg"
            />
          </div>
        </div>
      </main>
    </>
  );
}
