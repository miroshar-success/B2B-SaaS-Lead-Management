// src/pages/Users.tsx
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { axiosInstance } from "../../context/Auth";
import { User } from "../../type/user";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container relative h-[calc(100vh-190px)] w-screen  mx-auto p-4">
      <div className="text-xl md:text-3xl font-bold mb-4">Users</div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-10 items-center mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border p-2 rounded"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute top-2 right-2 text-gray-500" />
          </div>
        </div>
      </div>
      <div className="min-h-full w-full overflow-x-auto">
        <table className="min-w-full  bg-white ">
          <thead className="border ">
            <tr className="">
              <th className="cursor-pointer p-2 w-5"></th>
              <th className="cursor-pointer p-2">
                <div className="flex items-center gap-2">Email</div>
              </th>
              {/* Add other headers as needed */}
            </tr>
          </thead>
          <tbody className="border">
            {users.map((lead, index) => (
              <tr key={index} className="border p-2">
                <td className="p-2 ">
                  <input type="checkbox" className="mr-2" />
                  {/* <Link className="whitespace-nowrap text-blue-400" to="#">
                    {lead.firstName.value + " " + lead.lastName.value}
                  </Link> */}
                </td>
                <td className="p-2">{lead.email}</td>
                {/* Add other fields as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
