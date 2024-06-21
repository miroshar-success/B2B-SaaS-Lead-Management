// pages/admin/user-management.tsx
"use client"
import { useAuth } from '@/context/authContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User } from '@/context/authContext2';
import { useEffect, useState } from 'react';

export interface User2 {
  _id: string;
  email: string;
  role: string;
}


interface UserManagementPageProps {
  users: User2[];
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ users }) => {
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useAuth();
  // const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User2 | null>(null);

  const getCookie = (name: string) => {
    if (typeof document !== 'undefined') {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    return null;
  };

  // Check if the component is running in a browser environment
  const isBrowser = typeof window !== 'undefined';
  const router = isBrowser ? useRouter() : null; // Conditionally use useRouter


  const openEditModal = (user: User2) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (user: User2) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
  };

  const handleRoleChange = async (newRole: string) => {
    if (selectedUser && isBrowser && router) {
      try {
        // Make API call to update user role
        await axios.put(`https://b2b-saas-lead-mangement-3.onrender.com/api/users/${selectedUser._id}/role`, { role: newRole }, {
          withCredentials: true,
        });
        // Update UI or refresh data as needed
        closeEditModal();
        router.refresh();
        window.location.reload();
      } catch (error) {
        console.error('Error updating user role', error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser && isBrowser && router) {
      try {
        // Make API call to delete user by ID
        await axios.delete(`https://b2b-saas-lead-mangement-3.onrender.com/api/users/${selectedUser._id}`, {
          withCredentials: true,
        });
        // Update UI or refresh data as needed
        closeDeleteModal();
        router.refresh();
        window.location.reload();
      } catch (error) {
        console.error('Error deleting user', error);
      }
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Users</h1>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openEditModal(user)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Role Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>
            <p className="mb-4">Change role for {selectedUser?.email}</p>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                defaultValue={selectedUser?.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeEditModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRoleChange(selectedUser?.role || '')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete {selectedUser?.email}?</p>
            <div className="flex justify-end">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagementPage;
