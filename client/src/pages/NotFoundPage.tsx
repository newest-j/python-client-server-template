import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="text-center">
      <p className="text-lg text-red-500">404</p>
      <h1 className="text-red-500">That page wandered off.</h1>
      <Link to="/">Go home</Link>
    </div>
  );
}

export default NotFoundPage;
