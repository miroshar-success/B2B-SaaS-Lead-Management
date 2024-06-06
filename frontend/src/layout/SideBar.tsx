// pages/index.js
import Link from 'next/link';
import { GoHome } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { TbDoorExit } from "react-icons/tb";

const SideBar = () => {
  return (
    <div className='flex flex-col fixed w-[13em] pb-20 h-screen border-r-2 z-20 border-violet-200 gap-5 items-center justify-center bg-white'>
        <div></div>
        <Link href="/home" className='flex gap-6 items-center justify-start px-10 py-2 rounded-lg text-violet-800 hover:bg-violet-400 hover:text-white hover:scale-105 delay-75'>
           <GoHome size={22} />
            Home
        </Link>
        <Link href="/admin" className='flex gap-6 items-center justify-start px-10 py-2 rounded-lg text-violet-800 hover:bg-violet-400 hover:text-white hover:scale-105 delay-75'>
          <FaRegUserCircle size={22} />
          Admin
        </Link>
        <Link href="/" className='flex gap-6 items-center justify-start px-10 py-2 rounded-lg text-violet-800 hover:bg-violet-400 hover:text-white hover:scale-105 delay-75'>
          <TbDoorExit size={22} />
          Logout
        </Link>
    </div>
  );
};

export default SideBar;