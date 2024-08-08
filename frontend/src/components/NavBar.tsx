import { FaBars, FaProjectDiagram, FaUser } from "react-icons/fa";
import { useAuth } from "../context/Auth";
import { Link } from "react-router-dom";

interface Props {
  onMenuToggle: () => void;
}
const NavBar: React.FC<Props> = ({ onMenuToggle }) => {
  const { user } = useAuth();
  return (
    <div className="w-full h-16 flex justify-between items-end px-0 sticky top-0 z-50 bg-primary">
      <div className="h-16 w-full flex justify-between items-center bg-primary md:px-5">
        <div className="flex justify-center items-center">
          <button
            className="flex items-center justify-center mx-6 md:hidden text-white"
            onClick={onMenuToggle}
          >
            <FaBars />
          </button>
          <FaProjectDiagram color="white" />
          <p className="text-gray-100 uppercase tracking-widest text-md font-medium mx-2">
            Logo
          </p>
        </div>
        <Link to="/profile" className="flex items-center mx-4">
          <div className="rounded-full w-8 h-8 flex justify-center  items-center border shadow-md">
            <FaUser color="white" />
          </div>
          <div className="px-2">
            <p className="capitalise tracking-wider font-regular text-sm text-gray-100">
              {user?.firstName}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
