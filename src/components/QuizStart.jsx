import { useEffect, useState } from "react";
import reactLogo from "../assets/react.svg";

function QuizStart() {
  const [currentGame, setCurrentGame] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [currentGamePlaying, setCurrentGamePlaying] = useState(0);

  const getGameData = async () => {
    try {
      let res = await fetch(
        "https://raw.githubusercontent.com/aaronnech/Who-Wants-to-Be-a-Millionaire/master/questions.json"
      );
      let data = await res.json();
      setCurrentGame(data.games[0]?.questions);
    } catch (error) {
      console.error("Failed to fetch quiz data", error);
    }
  };

  useEffect(() => {
    getGameData();
  }, [currentGamePlaying]);

  const updateScore = (answer_index, el) => {
    if (currentQuestion >= maxQuestions) return;

    const correctAnswer = currentGame[currentQuestion].correct;
    if (answer_index === correctAnswer) {
      setPlayerScore((score) => score + 1);
      el.target.classList.add("correct");
    } else {
      el.target.classList.add("wrong");
    }

    setTimeout(() => {
      el.target.classList.remove("correct", "wrong");
      setCurrentQuestion((q) => q + 1);
    }, 1000);
  };

  const endGameScreen = () =>
    playerScore >= 6 ? (
      <>
        <div className="text-center p-4 text-white header-bg">
          <h2 className="text-2xl pb-1 border-b border-gray-500">
            Results: {playerScore}/10
          </h2>
          <h4 className="text-lg text-blue-600">
            You will get $8000 as your monthly salary.
          </h4>
        </div>
        <div className="p-6 header-bg text-white">
          <h2 className="font-bold text-lg">You Advanced To Next Round</h2>
          <p className="text-blue-500 text-xl mt-2">
            Results: {playerScore}/10
          </p>
          <p className="mt-2">What will you do?</p>
          <div className="flex flex-col md:flex-row gap-3 mt-4">
            <div className="py-2 px-5 bg-blue-600 rounded-xl cursor-pointer hover:bg-blue-700 transition">
              You will start a job the next week on Monday at 8AM.
            </div>
            <div className="py-2 px-5 bg-green-500 rounded-xl cursor-pointer hover:bg-green-600 transition">
              Good luck.
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="p-6 header-bg text-white">
        <h2 className="font-bold text-lg text-blue-600">You Did Not Advance</h2>
        <p className="text-xl text-blue-500 mt-1">Results: {playerScore}/10</p>
        <p className="mt-3">
          It seems like you are lacking in general knowledge... You are welcome
          to play again.
        </p>
        <div className="mt-4">
          <div
            className="py-2 px-5 bg-green-500 rounded-xl cursor-pointer hover:bg-green-600 transition inline-block"
            onClick={() => {
              setCurrentGamePlaying((val) => val + 1);
              setCurrentQuestion(0);
              setPlayerScore(0);
            }}
          >
            Play Again
          </div>
        </div>
      </div>
    );

  if (!currentGame.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-indigo-600">Loading quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4 py-6">
      {/* Header */}
      <div className="flex justify-center items-center gap-3 mb-4">
        <img src={reactLogo} className="w-24 md:w-32" alt="React logo" />
        <h1 className="text-2xl md:text-3xl text-indigo-600 text-center font-bold">
          React Job Questions
        </h1>
      </div>

      {/* Game or End Screen */}
      {currentQuestion < maxQuestions ? (
        <>
          <div className="text-center">
            <div className="text-lg md:text-xl text-indigo-800 font-semibold mb-2">
              Question {currentQuestion + 1} of {maxQuestions}
            </div>
            <div className="p-3 text-xl font-medium">
              {currentGame[currentQuestion]?.question}
            </div>

            <div className="mt-4 flex flex-col items-center space-y-3">
              {currentGame[currentQuestion]?.content.map((answer, index) => (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && updateScore(index, e)}
                  onClick={(el) => updateScore(index, el)}
                  className="w-full max-w-xl flex items-center border border-gray-300 rounded-2xl bg-indigo-950 text-white cursor-pointer hover:bg-indigo-800 transition"
                >
                  <div className="py-2 px-4 bg-gray-300 text-black font-bold text-lg rounded-l-2xl">
                    {index + 1}
                  </div>
                  <div className="py-2 px-4 font-medium">{answer}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Score Bar */}
          <div className="text-center mt-6 text-white px-3 bg-indigo-700 py-2 rounded-md shadow">
            <h2 className="text-lg md:text-xl">
              Current Score: {playerScore}/10
            </h2>
          </div>
        </>
      ) : (
        endGameScreen()
      )}
    </div>
  );
}

export default QuizStart;
