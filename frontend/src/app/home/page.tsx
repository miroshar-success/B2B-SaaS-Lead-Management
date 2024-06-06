// pages/index.js
// import Link from 'next/link';
import SideBar from '@/layout/SideBar';
import NavBar from '@/layout/Nav';

const HomePage = () => {
  return (
    <>
      <SideBar />
      <NavBar />
      <div className='relative h-[45em] flex flex-col items-center justify-center'>
        <div className=' flex flex-col items-center justify-center ml-[12.5rem] text-violet-800 font-bold text-6xl opacity-15'>
          <h1>Welcome to the B2B SaaS Lead Management Platform</h1>
          <p>Manage and enrich your leads with Reliable data.</p>
        </div>
      </div>
    </>
  );
};

export default HomePage;