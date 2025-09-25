import React from "react";
import { Navigate } from "react-router-dom";

interface StudentProtectedRouteProps {
  children: React.ReactElement;
}

const StudentProtectedRoute: React.FC<StudentProtectedRouteProps> = ({ children }) => {
  const username = sessionStorage.getItem("username");

  if (!username) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default StudentProtectedRoute;