import React, { useState, useEffect } from "react";
import io from "socket.io-client";
// import ChatPopover from "../../Components/Chat-and-teacheraction/ChatProver";
import { useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/eye.svg";

interface PollOption {
  id: number;
  text: string;
  correct: boolean | null;
}

interface PollData {
  question: string;
  options: PollOption[];
}

interface Votes {
  [key: string]: number;
}

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const TeacherPollPage: React.FC = () => {
  const [pollQuestion, setPollQuestion] = useState<string>("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [votes, setVotes] = useState<Votes>({});
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePollCreated = (pollData: PollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
    };

    const handlePollResults = (updatedVotes: Votes) => {
      setVotes(updatedVotes);
      setTotalVotes(Object.values(updatedVotes).reduce((a, b) => a + b, 0));
    };

    socket.on("pollCreated", handlePollCreated);
    socket.on("pollResults", handlePollResults);

    return () => {
      socket.off("pollCreated", handlePollCreated);
      socket.off("pollResults", handlePollResults);
    };
  }, []);

  const calculatePercentage = (count: number): number => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  const askNewQuestion = () => {
    navigate("/teacher-home-page");
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button
        className="bg-[#8F64E1] text-white rounded-full px-6 py-2 float-right mb-4 flex items-center hover:opacity-90 transition-opacity"
        onClick={handleViewPollHistory}
      >
        <img src={eyeIcon} alt="View poll history" className="w-4 h-4 mr-2" />
        View Poll history
      </button>

      <div className="clear-both pt-8">
        <h3 className="text-2xl font-bold text-center mb-6">Poll Results</h3>

        {pollQuestion ? (
          <>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-6">
              <div className="p-6">
                <h6 className="bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white py-3 px-4 rounded text-left font-medium mb-4">
                  {pollQuestion}?
                </h6>
                <div className="space-y-4">
                  {pollOptions.map((option) => {
                    const percentage = Math.round(calculatePercentage(votes[option.text] || 0));
                    return (
                      <div
                        key={option.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{option.text}</span>
                          <span className="font-semibold text-gray-700">{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#7565d9] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                            role="progressbar"
                            aria-valuenow={votes[option.text] || 0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 text-right">
                          {votes[option.text] || 0} vote{(votes[option.text] || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <button
                className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-full px-6 py-3 hover:opacity-90 transition-opacity font-medium"
                onClick={askNewQuestion}
              >
                + Ask a new question
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-xl text-gray-600 font-medium">
              Waiting for the teacher to start a new poll...
            </div>
            <div className="text-sm text-gray-500 mt-2">
              The poll results will appear here once a question is asked.
            </div>
          </div>
        )}
        
        {/* <ChatPopover /> */}
      </div>
    </div>
  );
};

export default TeacherPollPage;