// pages/index.js
import Link from 'next/link';

const SideBar = () => {
  return (
    <div className='flex flex-col fixed w-[13em] pb-20 h-screen border-r-2 items-center justify-between'>
        <div></div>
        <Link href="/home">Home</Link>
        <Link href="/admin">Admin</Link>
        <Link href="/">Logout</Link>
    </div>
  );
};

export default SideBar;