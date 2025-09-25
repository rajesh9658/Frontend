import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import stopwatch from "../../assets/stopwatch.svg";
import stars from "../../assets/spark.svg";
import ChatPopover from "../../Components/Chat-and-teacheraction/ChatProver";
import { useNavigate } from "react-router-dom";

interface PollOption {
  id: number;
  text: string;
  correct: boolean | null;
}

interface PollData {
  _id: string;
  question: string;
  options: PollOption[];
  timer: number;
}

interface Votes {
  [key: string]: number;
}

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const StudentPollPage: React.FC = () => {
  const [votes, setVotes] = useState<Votes>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [pollQuestion, setPollQuestion] = useState<string>("");
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [pollId, setPollId] = useState<string>("");
  const [kickedOut, setKickedOut] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const username = sessionStorage.getItem("username");
      if (username) {
        socket.emit("submitAnswer", {
          username: username,
          option: selectedOption,
          pollId: pollId,
        });
        setSubmitted(true);
      } else {
        console.error("No username found in session storage!");
      }
    }
  };

  useEffect(() => {
    const handleKickedOut = () => {
      setKickedOut(true);
      sessionStorage.removeItem("username");
      navigate("/kicked-out");
    };

    socket.on("kickedOut", handleKickedOut);

    return () => {
      socket.off("kickedOut", handleKickedOut);
    };
  }, [navigate]);

  useEffect(() => {
    const handlePollCreated = (pollData: PollData) => {
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
      setVotes({});
      setSubmitted(false);
      setSelectedOption(null);
      setTimeLeft(pollData.timer);
      setPollId(pollData._id);
    };

    const handlePollResults = (updatedVotes: Votes) => {
      setVotes(updatedVotes);
    };

    socket.on("pollCreated", handlePollCreated);
    socket.on("pollResults", handlePollResults);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      socket.off("pollCreated", handlePollCreated);
      socket.off("pollResults", handlePollResults);
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current as number);
            setSubmitted(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, submitted]);

  const calculatePercentage = (count: number): number => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  if (kickedOut) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-bold text-red-600">You have been kicked out</div>
      </div>
    );
  }

  return (
    <>
      <ChatPopover />
      {pollQuestion === "" && timeLeft === 0 && (
        <div className="flex justify-center items-center min-h-screen w-full lg:w-3/4 mx-auto px-4">
          <div className="text-center w-full max-w-2xl">
            <button className="bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full px-4 py-2 text-sm mb-8 flex items-center justify-center mx-auto">
              <img src={stars} className="pr-1 w-4 h-4" alt="Intervue Poll" />
              Intervue Poll
            </button>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#500ECE]"></div>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              <b>Wait for the teacher to ask questions..</b>
            </h3>
          </div>
        </div>
      )}
      
      {pollQuestion !== "" && (
        <div className="max-w-2xl mx-auto mt-8 px-4 w-full lg:w-1/2">
          <div className="flex items-center mb-6">
            <h5 className="m-0 pr-5 text-lg font-semibold">Question</h5>
            <img
              src={stopwatch}
              width="20"
              height="20"
              alt="Stopwatch"
              className="w-4 h-4"
            />
            <span className="pl-2 text-red-500 font-medium">{timeLeft}s</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h6 className="bg-gradient-to-r from-[#343434] to-[#6E6E6E] text-white py-3 px-4 rounded text-left font-medium mb-4">
                {pollQuestion}?
              </h6>
              
              <div className="space-y-3">
                {pollOptions.map((option) => {
                  const isSelected = selectedOption === option.text;
                  const percentage = Math.round(calculatePercentage(votes[option.text] || 0));
                  const isDisabled = submitted || timeLeft === 0;

                  return (
                    <div
                      key={option.id}
                      className={`rounded-lg p-4 border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-[#7565d9] bg-purple-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      } ${
                        isDisabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                      }`}
                      onClick={() => {
                        if (!submitted && timeLeft > 0) {
                          handleOptionSelect(option.text);
                        }
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-left ${submitted ? 'font-semibold' : ''}`}>
                          {option.text}
                        </span>
                        {submitted && (
                          <span className="font-semibold text-gray-700">
                            {percentage}%
                          </span>
                        )}
                      </div>
                      
                      {submitted && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-[#7565d9] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                            role="progressbar"
                            aria-valuenow={votes[option.text] || 0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {!submitted && selectedOption && timeLeft > 0 && (
            <div className="flex justify-end items-center mt-4">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-full px-8 py-3 font-medium hover:opacity-90 transition-opacity duration-200 w-full md:w-auto"
              >
                Submit
              </button>
            </div>
          )}

          {submitted && (
            <div className="mt-8 text-center">
              <h6 className="text-gray-600 font-medium">
                Wait for the teacher to ask a new question...
              </h6>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StudentPollPage;