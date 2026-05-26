import { Navigate } from "react-router-dom";
import { getLocalStorage } from "../helpers/local-storage";

const ProtectedRoute = ({ children }) => {
  const usuario = getLocalStorage("taskapp_user");
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;