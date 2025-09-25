import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/login";
import TeacherLandingPage from "./Pages/teacher-landing/TeacherLandingPage";
import StudentLandingPage from "./Pages/student-landing/StudentLandingPage";
import StudentPollPage from "./Pages/student-poll/StudentPollPage";
import TeacherPollPage from "./Pages/teacher-poll/TeacherPollPage";
import PollHistoryPage from "./Pages/poll-history/PollHistory";
import TeacherProtectedRoute from "./Components/route-protect/TeacherProtect";
import StudentProtectedRoute from "./Components/route-protect/StudentProtect";
import type { RouteConfig } from "./types/router";

const routes: RouteConfig[] = [
  { path: "/", element: <LoginPage /> },
  { 
    path: "/teacher-home-page", 
    element: <TeacherLandingPage />,
    protected: true,
    role: 'teacher'
  },
  { path: "/student-home-page", element: <StudentLandingPage /> },
  { 
    path: "/poll-question", 
    element: <StudentPollPage />,
    protected: true,
    role: 'student'
  },
  { 
    path: "/teacher-poll", 
    element: <TeacherPollPage />,
    protected: true,
    role: 'teacher'
  },
  { 
    path: "/teacher-poll-history", 
    element: <PollHistoryPage />,
    protected: true,
    role: 'teacher'
  },
];

const App: React.FC = () => {
  const renderRoute = (route: RouteConfig) => {
    if (route.protected && route.role === 'teacher') {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <TeacherProtectedRoute>
              {route.element}
            </TeacherProtectedRoute>
          }
        />
      );
    }
    
    if (route.protected && route.role === 'student') {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <StudentProtectedRoute>
              {route.element}
            </StudentProtectedRoute>
          }
        />
      );
    }
    
    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(renderRoute)}
      </Routes>
    </BrowserRouter>
  );
};

export default App;