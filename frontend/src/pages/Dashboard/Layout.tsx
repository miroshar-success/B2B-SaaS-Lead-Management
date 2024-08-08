import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";
import { useEffect, useState } from "react";
import { DataProvider } from "../../context/DataContext";
import { useAuth } from "../../context/Auth";
import Loading from "../../components/Loading";

function Layout() {
  const { user, loading } = useAuth();
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/signin");
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="h-screen w-screen  flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const toggleMenuVisibility = () => {
    setMenuVisibility(!isMenuVisible);
  };
  return (
    <div className="h-screen overflow-hidden text-sm">
      <DataProvider navigate={navigate}>
        <NavBar onMenuToggle={toggleMenuVisibility} />
        <div className="flex h-full">
          <SideBar
            onMenuToggle={toggleMenuVisibility}
            isMenuVisible={isMenuVisible}
          />
          <div className="w-full md:w-[calc(100vw-240px)] h-[calc(100vh-65px)]">
            <Outlet />
          </div>
        </div>
      </DataProvider>
    </div>
  );
}

export default Layout;
