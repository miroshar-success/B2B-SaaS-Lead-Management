import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import Loading from "./Loading";
import { ReactNode } from "react";

const AdminRoute: React.FC<{ element: ReactNode }> = ({ element }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="bg-primary flex flex-col gap-10 justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (user && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default AdminRoute;
