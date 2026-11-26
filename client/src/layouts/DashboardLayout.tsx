import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../store/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import Swal from "sweetalert2";
import { authuser } from "../services/authService";
import { toast } from "react-toastify";
function DashboardLayout() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const alert = await Swal.fire({
      title: "Are you sure?",
      text: "You’ll be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out",
      cancelButtonText: "Cancel",
    });
    if (!alert.isConfirmed) return false;
    try {
      const result = await authuser.logout();
      if (result) {
        dispatch(logout());
        toast.success(result);
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Log out failed");
    }
  };

  return (
    <>
      <section>
        <div>{user?.name?.toUpperCase()}</div>
        <div>
          <strong>{user?.name}</strong>
          <strong>{user?.email}</strong>
        </div>

        <button onClick={handleLogout}>Log Out </button>
      </section>

      <section>
        <Outlet />
      </section>
    </>
  );
}
export default DashboardLayout;
