// pages/index.js
'use client'
import { useAuth } from '@/context/authContext';
// import Link from 'next/link';

const NavBar = () => {
  const { user } = useAuth();

  return (
    <div className='flex right-0 fixed z-10 bg-white py-2 pr-10 border-b-2 border-violet-200 w-full items-end justify-end text-violet-800'>
        <div className='flex gap-8'>
            <h2>{user ? user.email: ''}</h2>
            <h2>{user ? user.role: ''}</h2>
        </div>
    </div>
  );
};

export default NavBar;