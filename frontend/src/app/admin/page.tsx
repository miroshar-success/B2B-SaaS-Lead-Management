// pages/index.js
"use client"
import SideBar from '@/layout/SideBar';
import NavBar from '@/layout/Nav';
import UserManagementPage from '../../components/user-management';
import CSVUploadPage from '../../components/csv-upload';
import { useState, MouseEvent, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User } from '@/context/authContext2';

const Admin = () => {

    const [ isDashboard, setIsDashboard ] = useState<boolean>(true);
    const [ active, setActive] = useState<String>('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();
    const router = useRouter();




    useEffect(() => {
      
      if (!isLoggedIn && !user ) {
        router.push('/');
        return;
      }
  
      fetchUsers();
    }, [user, isLoggedIn]);

    const fetchUsers = async () => {
      try {
        // console.log(isLoggedIn);
        const response = await axios.get('http://127.0.0.1:5000/api/users/', { withCredentials: true});
        const data =  response.data;
        // console.log(data); 
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.response?.data?.message || 'Failed to fetch users');
      }
    };

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
                  <UserManagementPage users={users} />
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