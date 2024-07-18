'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import '@/app/globals.css';
import Button from "@/app/components/Button";
import ParticlesComponent from "@/app/config/particles-config";
import PasswordVisibility from "@/app/components/PasswordVisibility";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
          callbackUrl: '/'
        });

        if (result?.error) {
          setFieldError('password', 'Incorrect password');
          toast.error('Incorrect password', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
            })
        } else {
          toast.success('Successfully signed in', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide,
            });
          router.push('/');
        }
      } catch (error) {
        console.error("Error signing in:", error);
        setFieldError('password', 'An unexpected error occurred');
        toast.error('An unexpected error occurred'), {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Slide,
          };
      } finally {
        setSubmitting(false);
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
        <div className="flex gap-4 items-center rounded-2xl w-[800px] max-sm:w-3/4 bg-gray-800 shadow-md p-6">
          <div className="w-full">

            <h2 className="mb-4 text-2xl font-bold leading-9 tracking-tight text-white">
              Sign in
            </h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="mt-2">
                <input
                  placeholder="Email address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-primary1 transition ease-in-out duration-150"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="relative">
                <input
                  placeholder="Password"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  className="bg-gray-700 w-full text-gray-200 border-0 rounded-md p-2 mb-3 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-primary1 transition ease-in-out duration-150"
                />
                <PasswordVisibility showPassword={showPassword} setShowPassword={setShowPassword} />
                <div className="flex items-center justify-between text-[14px]">
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                  ) : null}
                  <div onClick={() => router.push('/auth/forgotPassword')} className="cursor-pointer font-semibold text-primary1">
                    Forgot password?
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  Sign in
                </Button>
              </div>
            </form>

            <div className="mt-3">
              <Button
                onClick={() => signIn('google', { redirect: true, callbackUrl: '/' })}
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
              Not a member?{' '}
              <button onClick={() => router.push('signup')} className="font-semibold leading-6 text-primary1 ">
                Sign Up
              </button>
            </p>

          </div>
          <div className='max-sm:hidden'>
            <img
              src="https://i.ibb.co/ZTT26r1/e7165502b2a1cf61fa81b20e02bad088.gif"
              alt="logo"
              className="w-[600px] rounded-lg"
            />
          </div>
        </div>
      </main>
      <ToastContainer/>
    </>
  );
}