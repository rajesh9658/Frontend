import React, { useState} from "react";
import type { ChangeEvent } from "react";
import stars from "../../assets/spark.svg";
import eyeIcon from "../../assets/eye.svg";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

interface PollOption {
  id: number;
  text: string;
  correct: boolean | null;
}

interface PollData {
  question: string;
  options: PollOption[];
  timer: string;
  teacherUsername: string | null;
}

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const socket = io(apiUrl);

const TeacherLandingPage: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<PollOption[]>([{ id: 1, text: "", correct: null }]);
  const [timer, setTimer] = useState<string>("60");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleTimerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTimer(e.target.value);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectToggle = (index: number, isCorrect: boolean) => {
    const updatedOptions = [...options];
    updatedOptions[index].correct = isCorrect;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([
      ...options,
      { id: options.length + 1, text: "", correct: null },
    ]);
  };

  const validateForm = (): boolean => {
    if (question.trim() === "") {
      setError("Question cannot be empty");
      return false;
    }

    if (options.length < 2) {
      setError("At least two options are required");
      return false;
    }

    const optionTexts = options.map((option) => option.text.trim());
    if (optionTexts.some((text) => text === "")) {
      setError("All options must have text");
      return false;
    }

    const correctOptionExists = options.some(
      (option) => option.correct === true
    );
    if (!correctOptionExists) {
      setError("At least one correct option must be selected");
      return false;
    }

    setError("");
    return true;
  };

  const askQuestion = () => {
    if (validateForm()) {
      let teacherUsername = sessionStorage.getItem("username");
      let pollData: PollData = { question, options, timer, teacherUsername };
      socket.emit("createPoll", pollData);
      navigate("/teacher-poll");
    }
  };

  const handleViewPollHistory = () => {
    navigate("/teacher-poll-history");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-full px-6 py-2 float-right mb-4 flex items-center hover:opacity-90 transition-opacity"
        onClick={handleViewPollHistory}
      >
        <img src={eyeIcon} alt="View history" className="w-4 h-4 mr-2" />
        View Poll history
      </button>

      <div className="clear-both pt-4">
        <button className="bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full px-4 py-2 text-sm mb-4 flex items-center w-fit">
          <img src={stars} alt="Poll Icon" className="w-4 h-4 mr-1" /> 
          Intervue Poll
        </button>

        <h2 className="text-3xl font-bold mb-2">
          Let's <strong>Get Started</strong>
        </h2>
        <p className="text-lg mb-2">
          <b>Teacher: </b>
          {username}
        </p>
        <p className="text-gray-600 mb-6">
          You'll have the ability to create and manage polls, ask questions, and
          monitor your students' responses in real-time.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between items-center pb-3">
            <label htmlFor="question" className="text-lg font-medium">
              Enter your question
            </label>
            <select
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 w-auto"
              value={timer}
              onChange={handleTimerChange}
            >
              <option value="60">60 seconds</option>
              <option value="30">30 seconds</option>
              <option value="90">90 seconds</option>
            </select>
          </div>
          <input
            type="text"
            id="question"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#7565d9]"
            onChange={handleQuestionChange}
            maxLength={100}
            placeholder="Type your question..."
          />
          <div className="text-right text-gray-500 mt-1">
            {question.length}/100
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center pb-3">
            <label className="text-lg font-medium">Edit Options</label>
            <label className="text-lg font-medium">Is it correct?</label>
          </div>
          {options.map((option, index) => (
            <div key={option.id} className="flex items-center mb-4 gap-3">
              <span className="bg-gradient-to-r from-[#8F64E1] to-[#4E377B] rounded-full w-8 h-8 flex items-center justify-center text-white text-sm font-medium">
                {index + 1}
              </span>
              <input
                type="text"
                className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7565d9]"
                placeholder="Option text..."
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={option.correct === true}
                    onChange={() => handleCorrectToggle(index, true)}
                    className="w-4 h-4 text-[#7565d9] focus:ring-[#7565d9] border-gray-300"
                    required
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={option.correct === false}
                    onChange={() => handleCorrectToggle(index, false)}
                    className="w-4 h-4 text-[#7565d9] focus:ring-[#7565d9] border-gray-300"
                    required
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="text-[#8F64E1] border border-[#7565d9] rounded-lg px-6 py-2 hover:bg-[#8F64E1] hover:text-white transition-colors mb-8"
          onClick={addOption}
        >
          + Add More option
        </button>
      </div>
      
      <hr className="my-6" />
      
      <button
        className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white rounded-full px-8 py-3 float-right hover:opacity-90 transition-opacity font-medium"
        onClick={askQuestion}
      >
        Ask Question
      </button>
    </div>
  );
};

export default TeacherLandingPage;