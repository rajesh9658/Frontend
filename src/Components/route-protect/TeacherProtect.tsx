import React from "react";
import { Navigate } from "react-router-dom";

interface TeacherProtectedRouteProps {
  children: React.ReactNode;
}

const TeacherProtectedRoute: React.FC<TeacherProtectedRouteProps> = ({ children }) => {
  const username = sessionStorage.getItem("username");

  if (!username || !username.startsWith("teacher")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default TeacherProtectedRoute;