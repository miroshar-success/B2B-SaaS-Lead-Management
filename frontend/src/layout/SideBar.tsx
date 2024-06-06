// pages/index.js
"use client";
import Link from 'next/link';
import { GoHome } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { TbDoorExit } from "react-icons/tb";
import { MouseEvent, useState } from 'react';

const SideBar = () => {
  const [ isActive, setIsActive ] = useState<String>('home');

  const handleClickHome = ( e: MouseEvent<HTMLButtonElement | HTMLLinkElement> ) => {
    e.preventDefault();
    setIsActive('home');
  }
  const handleClickAdmin = ( e: MouseEvent<HTMLButtonElement | HTMLLinkElement> ) => {
    e.preventDefault();
    setIsActive('admin');
  }
  const handleClickLogout = ( e: MouseEvent<HTMLButtonElement | HTMLLinkElement> ) => {
    e.preventDefault();
    setIsActive('logout')
  }


  return (
    <div className='flex flex-col fixed w-[13em] pb-20 h-screen border-r-2 z-20 border-violet-200 gap-5 items-center justify-center bg-white'>
        <div></div>
        <button onClick={(e) => handleClickHome(e)}>
          <Link href="/home" className={`flex gap-6 items-center justify-start px-10 py-2 rounded-lg  ${ isActive === 'home' ? 'bg-violet-400 text-white' : 'text-violet-800'} hover:bg-violet-400 hover:text-white hover:scale-105 delay-75`}>
            <GoHome size={22} />
              Home
          </Link>
        </button>
        <button onClick={(e) => handleClickAdmin(e)}>
          <Link href="/admin" className={`flex gap-6 items-center justify-start px-10 py-2 rounded-lg  ${ isActive === 'admin' ? 'bg-violet-400 text-white' : 'text-violet-800'} hover:bg-violet-400 hover:text-white hover:scale-105 delay-75`}>
            <FaRegUserCircle size={22} />
            Admin
          </Link>
        </button>
        <button onClick={e => handleClickLogout(e)}>
          <Link href="/" className={`flex gap-6 items-center justify-start px-10 py-2 rounded-lg ${ isActive === 'logout' ? 'bg-violet-400 text-white' : 'text-violet-800'} hover:bg-violet-400 hover:text-white hover:scale-105 delay-75`}>
            <TbDoorExit size={22} />
            Logout
          </Link>
        </button>
    </div>
  );
};

export default SideBar;