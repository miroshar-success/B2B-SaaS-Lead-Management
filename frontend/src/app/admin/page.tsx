// pages/index.js
// import Link from 'next/link';
import SideBar from '@/layout/SideBar';
import NavBar from '@/layout/Nav';

const Admin = () => {
  return (
    <div>
      <SideBar />
      <NavBar />
      <div className='pl-[14em] pt-[3em]'>
        <h1>This is the B2B SaaS Admin Page</h1>
        <p>Manage and enrich your leads with reliable data.</p>
      </div>
    </div>
  );
};

export default Admin;