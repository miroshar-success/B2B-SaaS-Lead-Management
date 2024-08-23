import { NavLink } from "react-router-dom";
import { useAuth } from "../context/Auth";
import {
  FaSignOutAlt,
  FaChartBar,
  FaTasks,
  FaUsers,
  FaUpload,
  FaArrowUp,
} from "react-icons/fa";

interface Props {
  isMenuVisible: boolean;
  onMenuToggle: () => void;
}

const sidebars = [
  {
    name: "OverView",
    icon: <FaChartBar />,
    path: "/",
  },
  {
    name: "Search",
    icon: <FaTasks />,
    path: "/search",
  },
  // {
  //   name: "Add User",
  //   icon: <FaUserPlus />,
  //   path: "/add-user",
  // },
];

const adminNavs = [
  {
    name: "Users",
    icon: <FaUsers />,
    path: "/users",
  },
  {
    name: "Upload",
    icon: <FaUpload />,
    path: "/upload",
  },
];

const SideBar: React.FC<Props> = ({ isMenuVisible, onMenuToggle }) => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <div
        className={`fixed md:relative z-30  w-full h-full md:w-60 border-r border-gray-300  transition-transform transform ${
          isMenuVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ height: "calc(100vh - 80px)", backgroundColor: "#f9fafc" }}
      >
        <div className="pt-5 px-4 relative h-full">
          {sidebars.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onMenuToggle}
              className={({ isActive }) =>
                `${
                  isActive
                    ? "text-white bg-primary rounded-md font-medium"
                    : "text-primary font-medium hover:bg-primary hover:bg-opacity-15"
                } flex items-center gap-5 text-md rounded mt-1 p-2`
              }
            >
              {item.icon}
              <span className=" capitalize tracking-wider md:pr-5">
                {item.name}
              </span>
            </NavLink>
          ))}
          {user?.role === "admin" &&
            adminNavs.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onMenuToggle}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? "text-white bg-primary rounded-md font-medium"
                      : "text-primary font-medium hover:bg-primary hover:bg-opacity-15"
                  } flex items-center gap-5 text-md rounded mt-1 p-2`
                }
              >
                {item.icon}
                <span className=" capitalize tracking-wider md:pr-5">
                  {item.name}
                </span>
              </NavLink>
            ))}
          <div className="rounded  my-1 p-2 text-white bg-green-500 ">
            <NavLink
              to="/plans"
              className="flex items-center gap-5  font-medium"
            >
              <FaArrowUp />
              <span className=" text-xs uppercase tracking-wider">
                Upgrade Plan
              </span>
            </NavLink>
          </div>
          <div className="rounded  my-1 p-3 py-3 ">
            <button
              className="flex items-center gap-5 text-red-500 font-medium"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span className=" text-xs uppercase tracking-wider">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
