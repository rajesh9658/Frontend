import React, { useState } from "react";
import type { FormEvent } from "react";
import stars from "../../assets/spark.svg";
import { useNavigate } from "react-router-dom";

const StudentLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");

  const handleStudentLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (name.trim()) {
      try {
        sessionStorage.setItem("username", name);
        navigate("/poll-question");
      } catch (error) {
        console.error("Error logging in student:", error);
        alert("Error connecting to the server. Please try again.");
      }
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full lg:w-1/2 mx-auto px-4">
      <div className="text-center w-full max-w-2xl">
        <button className="bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full px-4 py-2 text-sm mb-8 flex items-center justify-center mx-auto">
          <img src={stars} className="pr-1 w-4 h-4" alt="sparkle icon" />
          Intervue Poll
        </button>
        
        <h3 className="text-2xl font-bold mb-4">
          Let's <b>Get Started</b>
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          If you're a student, you'll be able to{" "}
          <b className="text-black">submit your answers</b>, participate in
          live polls, and see how your responses compare with your classmates
        </p>
        
        <form onSubmit={handleStudentLogin} className="w-full max-w-md mx-auto">
          <div className="mb-4">
            <p className="text-left text-gray-700 font-medium mb-2">Enter your Name</p>
            <input
              type="text"
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-full px-8 py-3 font-medium hover:opacity-90 transition-opacity duration-200 w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLandingPage;