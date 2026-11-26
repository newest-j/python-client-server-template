import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRouter from "./router";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeButton={false}
      />

      <AppRouter />
    </>
  );
}

export default App;
