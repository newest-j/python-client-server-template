import { Navigate, Outlet, useLocation } from "react-router-dom";
import { currentUser } from "../services/userService";
import { useState, useEffect } from "react";

function ProtectedRoute() {
  const [user, setUser] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function checkUser() {
      try {
        const userId = await currentUser.getCurrentUserId();
        setUser(userId);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }}></Navigate>;
  }

  return <Outlet />;
}

export default ProtectedRoute;
