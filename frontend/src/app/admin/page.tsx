// pages/index.js
"use client"
import Link from 'next/link';
import SideBar from '@/layout/SideBar';
import NavBar from '@/layout/Nav';
import UserManagementPage from '../../components/user-management';
import CSVUploadPage from '../../components/csv-upload';
import { useState, MouseEvent } from 'react';

const Admin = () => {

    const [ isDashboard, setIsDashboard ] = useState<boolean>(true);
    const [ active, setActive] = useState<String>('dashboard');

    const handleClickDashboard = ( e: MouseEvent<HTMLButtonElement | HTMLLinkElement> ) => {
      e.preventDefault();
      setIsDashboard(true);
      setActive('dashboard')
    }
    const handleClickUserManagement = ( e: MouseEvent<HTMLButtonElement | HTMLLinkElement> ) => {
      e.preventDefault();
      setIsDashboard(false);
      setActive('usermanagement')
    }

  return (
    <>
      <SideBar />
      <NavBar />
      <div className='relative h-[45em] pt-8'>
        <div className='pl-[14em] pt-[2em]'>
          <div>
              <div className='flex justify-around items-center pb-[2em]'>
                  <button onClick={ e => handleClickDashboard(e) } className={`${ active === 'dashboard' ? 'border-b-2' : ''} px-20 py-2`}>Dashboard</button>
                  <button onClick={ e => handleClickUserManagement(e) } className={`${active === 'usermanagement' ?'border-b-2': ''} px-20 py-2`}>User Management</button>
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
    </>
  );
};

export default Admin;