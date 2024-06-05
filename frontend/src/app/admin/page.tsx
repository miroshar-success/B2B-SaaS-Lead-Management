// pages/index.js
"use client"
import Link from 'next/link';
import SideBar from '@/layout/SideBar';
import NavBar from '@/layout/Nav';
import UserManagementPage from '../../components/user-management';
import CSVUploadPage from '../../components/csv-upload';
import { useState } from 'react';

const Admin = () => {

    const [ isDashboard, setIsDashboard ] = useState<boolean>(true);

  return (
    <div>
      <SideBar />
      <NavBar />
      <div className='pl-[14em] pt-[2em]'>
        <div>
            <div className='flex justify-around items-center pb-[2em]'>
                <button onClick={() => setIsDashboard(true)}>Dashboard</button>
                <button onClick={() => setIsDashboard(false)}>User Management</button>
            </div>
        </div>
        <>
            {
                !isDashboard ? (
                    <UserManagementPage />
                ) : (
                    <CSVUploadPage />
                )
            }
        </>
      </div>
    </div>
  );
};

export default Admin;