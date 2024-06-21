// pages/index.js
"use client"
import SideBar from '@/layout/SideBar';
import NavBar from '@/layout/Nav';
import UserManagementPage, { User2 } from '../../components/user-management';
import CSVUploadPage from '../../components/csv-upload';
import { useState, MouseEvent, useEffect } from 'react';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { User } from '@/context/authContext2';
import Link from 'next/link';



const Admin = () => {

    const [ isDashboard, setIsDashboard ] = useState<boolean>(true);
    const [ active, setActive] = useState<String>('dashboard');
    const [users, setUsers] = useState<User2[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();
    const [loggedUser, setLoggedUser] = useState<string | null>(null);
    const router = useRouter();


    const notAllowed = user?.role === 'user';

    useEffect(() => {
      
      const getLoggedUser = () => {
        if (typeof window !== 'undefined') {
          const user = window.localStorage.getItem('user');
          setLoggedUser(user);
        }
      };
  
      getLoggedUser();

  
      fetchUsers();
    }, []);

    const fetchUsers = async () => {
      try {
        // console.log(isLoggedIn);
        const response = await axios.get('https://b2b-saas-lead-mangement-3.onrender.com/api/users/', { withCredentials: true});
        const data =  response.data;
        // console.log(data); 
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || 'Failed to fetch users');
        } else {
          setError('An unexpected error occurred');
        }
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
    {loggedUser && !notAllowed ? <>
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
    </> : <>
       <div className='flex flex-col gap-3 items-center justify-center text-4xl h-screen opacity-15'>
          <h1>User not allowed access</h1>
          <Link className='text-xl' href='/'>Go to Login page</Link>
      </div>
    </>
    }
    </>
  );
};

export default Admin;