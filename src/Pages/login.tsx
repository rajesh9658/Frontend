import React, { useState } from "react";
import stars from "../assets/spark.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type UserRole = "student" | "teacher" | null;

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const navigate = useNavigate();

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const continueToPoll = async () => {
    if (selectedRole === "teacher") {
      try {
        const teacherlogin = await axios.post(`${apiUrl}/teacher-login`);
        sessionStorage.setItem("username", teacherlogin.data.username);
        navigate("/teacher-home-page");
      } catch (error) {
        console.error("Teacher login failed:", error);
        alert("Teacher login failed. Please try again.");
      }
    } else if (selectedRole === "student") {
      navigate("/student-home-page");
    } else {
      alert("Please select a role.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-4xl w-full mx-4 text-center">
        <button className="btn bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full px-4 py-2 text-sm mb-8 flex items-center justify-center mx-auto">
          <img src={stars} className="pr-1 w-4 h-4" alt="sparkle icon" />
          Intervue Poll
        </button>

        <div className="h-981px w-103px">
          <h3 className="text-2xl font-bold mb-4">
            Welcome to the <b>Live Polling System</b>
          </h3>

          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
          <div
            className={`flex-1 max-w-md p-6 bg-white rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === "student"
                ? "border-purple-600 shadow-md"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => selectRole("student")}
          >
            <p className="text-xl font-medium mb-2">I'm a Student</p>
            <span className="text-gray-600 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </span>
          </div>

          <div
            className={`flex-1 max-w-md p-6 bg-white rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              selectedRole === "teacher"
                ? "border-purple-600 shadow-md"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => selectRole("teacher")}
          >
            <p className="text-xl font-medium mb-2">I'm a Teacher</p>
            <span className="text-gray-600 text-sm">
              Submit answers and view live poll results in real-time.
            </span>
          </div>
        </div>

        <button
          className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-full px-8 py-3 font-medium hover:opacity-90 transition-opacity duration-200"
          onClick={continueToPoll}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
