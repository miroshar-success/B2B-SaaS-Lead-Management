"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

interface CardProps {}

const Login: React.FC<CardProps> = () => {
  const [showLogin, setShowLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { user, setUser, isLoggedIn, setIsLoggedIn, login, register } = useAuth();

  const router = useRouter();

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isSignUp) {
      try {
        const loggedIn = await login({ email, password});
        if (loggedIn){
          setIsLoggedIn(true);
          toast.success('Login successful!');
          router.push('/home'); // Navigate to the home page
        } else {
          toast.error('invalid email or password!')
          setError('Failed to log in. Please check your credentials.');
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      if (confirmPassword !== newPassword) {
        setError('Passwords do not match. Please try again.');
      } else {
        try {
          const created = await register({ email, newPassword });
          if(created){
            setIsSignUp(false);
            toast.success('Registration successful!');
          } else {
            toast.error('User already exists');
            setError('Failed to sign up. Please try again.');
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    // Add Google sign-in logic here
  };

  const handleMicrosoftSignIn = () => {
    // Add Microsoft sign-in logic here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-600 text-white">
      <div className="bg-white text-gray-800 rounded-lg shadow-md p-8 max-w-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <h1 className="text-3xl font-bold mb-4">Apollo.io</h1>
        <h2 className="text-xl mb-6">{isSignUp ? 'Sign Up' : 'Log In'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {isSignUp ? (
            <>
              <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full mb-4 px-4 py-2 rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full mb-4 px-4 py-2 rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </>
          ) : (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full mb-4 px-4 py-2 rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          )}
          {error && <span className='text-xs text-red-500'>{error}</span>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        {!isSignUp && (
          <div className="flex justify-between items-center mt-4 flex-wrap">
            <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-2">
              Forgot your password?
            </a>
          </div>
        )}
        <div className="text-center mt-4">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                Log In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                Sign Up
              </button>
            </span>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
