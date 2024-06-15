// pages/admin/user-management.tsx
"use client"
import { useAuth } from '@/context/authContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User } from '@/context/authContext2';
import { useEffect, useState } from 'react';

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: 'admin' | 'user' | 'super_admin';
// }

interface UserManagementPageProps {
  users: User[];
}


const UserManagementPage: React.FC<UserManagementPageProps>  = ({users}) => {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();
  
  const getCookie = (name: string) => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    return null;
  };
  
  // Usage
  const authToken = getCookie('token');
  console.log(`${authToken}`);
  

  return (
    <>
      <div>
        <h1>Users</h1>
        <table>
          <thead>
            <tr>
              {/* <th>Name</th> */}
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email}>
                {/* <td>{`${user.firstName} ${user.lastName}`}</td> */}
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {/* Add actions for editing or deleting users */}
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>  
    </>
  );
};

export default UserManagementPage;