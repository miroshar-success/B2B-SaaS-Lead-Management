// pages/index.js
"use client"
import Link from 'next/link';
import SideBar from '@/layout/SideBar';
import NavBar from '@/layout/Nav';
import { useAuth } from '@/context/authContext';

const HomePage = () => {
  const { user } = useAuth();
  return (
    <>
    {
      user ? 
            <>
              <SideBar />
              <NavBar />
              <div className='relative h-[45em] flex flex-col items-center justify-center'>
                <div className=' flex flex-col items-center justify-center ml-[12.5rem] text-violet-800 font-bold text-6xl opacity-15'>
                  <h1>Welcome to the B2B SaaS Lead Management Platform</h1>
                  <p>Manage and enrich your leads with Reliable data. </p>
                </div>
              </div>
            </>
          : <div className='flex flex-col gap-3 items-center justify-center text-4xl h-screen opacity-15'>
              <h1>User not logged in</h1>
              <Link className='text-xl' href='/'>Go to Login page</Link>
          </div>
    }
    </>
  );
};

export default HomePage;