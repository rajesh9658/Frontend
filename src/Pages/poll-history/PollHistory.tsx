import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backIcon from "../../assets/back.svg";

interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
}

interface ApiResponse {
  data: Poll[];
}

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

// const socket = io(apiUrl);

const PollHistoryPage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getPolls = async () => {
      const username = sessionStorage.getItem("username");

      try {
        const response = await axios.get<ApiResponse>(`${apiUrl}/polls/${username}`);
        setPolls(response.data.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    getPolls();
  }, []);

  const calculatePercentage = (count: number, totalVotes: number): number => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const handleBack = () => {
    navigate("/teacher-home-page");
  };

  let questionCount = 0;

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 w-full lg:w-1/2">
      <div className="mb-6 text-left">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200 mb-2"
        >
          <img 
            src={backIcon} 
            alt="Back to home" 
            width={25}
            className="cursor-pointer mr-2"
          />
          View <b className="ml-1">Poll History</b>
        </button>
      </div>
      
      {polls.length > 0 ? (
        polls.map((poll) => {
          const totalVotes = poll.options.reduce(
            (sum, option) => sum + option.votes,
            0
          );

          return (
            <div key={poll._id} className="mb-6">
              <div className="text-gray-600 pb-3 text-lg font-medium">
                Question {++questionCount}
              </div>
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
                <div className="p-6">
                  <h6 className="bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-4 rounded text-white text-left font-medium mb-4">
                    {poll.question}?
                  </h6>
                  <div className="space-y-4">
                    {poll.options.map((option) => {
                      const percentage = Math.round(calculatePercentage(option.votes, totalVotes));
                      return (
                        <div
                          key={option._id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">{option.text}</span>
                            <span className="font-semibold text-gray-700">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                              role="progressbar"
                              aria-valuenow={percentage}
                              aria-valuemin={0}
                              aria-valuemax={100}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 text-right">
                            {option.votes} vote{option.votes !== 1 ? 's' : ''}
                          </div>
                        </div>
                      );
                    })}
                    <div className="text-sm text-gray-600 text-right pt-2 border-t border-gray-200">
                      Total votes: {totalVotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-xl font-medium mb-2">No polls found</div>
          <div className="text-sm">You haven't created any polls yet.</div>
        </div>
      )}
    </div>
  );
};

export default PollHistoryPage;