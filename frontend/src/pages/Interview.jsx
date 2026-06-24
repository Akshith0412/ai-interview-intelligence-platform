import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Interview() {
  const [role, setRole] =
    useState("AI Engineer");

  const [session, setSession] =
    useState(null);

  const [selectedQuestion, setSelectedQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [feedback, setFeedback] =
    useState(null);

    const [error, setError] =
  useState("");

  const [loading, setLoading] =
  useState(false);

  const generateInterview = async () => {
    setError("");
    try {
        setLoading(true);
      const res =
        await api.post(
          "/interview/generate",
          {
            targetRole: role,
          }
        );

      setSession(res.data);

    } catch (error) {
      setError(
  error.response?.data?.message ||
  "Interview generation failed"
);
    }finally{
        setLoading(false);
    }
  };

  const evaluate = async () => {
    setError("");

    if (!selectedQuestion) {
      alert(
        "Please select a question first"
      );
      return;
    }

    if (!answer.trim()) {
      alert(
        "Please enter an answer"
      );
      return;
    }

    try {

      const res =
        await api.post(
          "/interview/evaluate",
          {
            sessionId:
              session.sessionId,

            question:
              selectedQuestion,

            answer,

            targetRole:
              session.targetRole,
          }
        );

      setFeedback(
        res.data
      );
      setAnswer("");

    } catch (error) {
      setError(
  error.response?.data?.message ||
  "Evaluation failed"
);
    }
  };

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-zinc-950 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-semibold">
          Mock Interview
        </h1>

        <p className="text-zinc-400 mt-2">
          Practice and receive AI feedback.
        </p>
        {error && (

  <p
    className="
    text-red-500
    mt-4
    "
  >
    {error}
  </p>

)}

        {!session && (

          <div
            className="
            mt-10
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-8
            "
          >

            <select
              value={role}
              onChange={(e) =>
                setRole(
                  e.target.value
                )
              }
              className="
              bg-zinc-800
              border
              border-zinc-700
              px-4
              py-3
              rounded-xl
              "
            >

              <option>
                AI Engineer
              </option>

              <option>
                Backend Engineer
              </option>

              <option>
                Software Engineer
              </option>

            </select>

            <button
              onClick={
                generateInterview
              }
              disabled={loading}
              className="
              ml-4
              px-6
              py-3
              bg-white
              text-black
              rounded-xl
              "
            >
              {
    loading
      ? "Generating..."
      : "Generate Interview"
  }
            </button>

          </div>

        )}

        {session && (

          <div
            className="
            mt-10
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-8
            "
          >

            <h2 className="text-2xl font-semibold mb-6">
              Interview Questions
            </h2>

            <div className="space-y-4">

              {session.questions.map(
                (
                  question,
                  index
                ) => (

                  <div
                    key={index}
                    onClick={() =>
                      setSelectedQuestion(
                        question
                      )
                    }
                    className={`
                      p-5
                      rounded-xl
                      cursor-pointer
                      border
                      ${
                        selectedQuestion ===
                        question
                          ? "border-white bg-zinc-800"
                          : "border-zinc-800 bg-zinc-900"
                      }
                    `}
                  >

                    <h3 className="font-medium">
                      Question {index + 1}
                    </h3>

                    <p className="mt-2">
                      {question}
                    </p>

                  </div>

                )
              )}

            </div>

            {selectedQuestion && (

              <div className="mt-10">

                <h3 className="text-xl font-semibold">
                  Selected Question
                </h3>

                <p className="mt-3 text-zinc-300">
                  {selectedQuestion}
                </p>

                <textarea
                  value={answer}
                  onChange={(e) =>
                    setAnswer(
                      e.target.value
                    )
                  }
                  placeholder="Type your answer..."
                  className="
                  mt-6
                  w-full
                  h-40
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  p-4
                  "
                />

                <button
                  onClick={evaluate}
                  disabled={!selectedQuestion}
                  className="
                    mt-4    
                    px-6
                    py-3
                    bg-white
                    text-black
                    rounded-xl
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    "

                >
                  Evaluate Answer
                </button>

              </div>

            )}

          </div>

        )}

        {feedback && (

          <div
            className="
            mt-8
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-8
            "
          >

            <h2 className="text-3xl font-semibold">
              Score: {feedback.score}
            </h2>

            <div className="mt-6">

              <h3 className="font-semibold">
                Strengths
              </h3>

              <ul className="mt-2 space-y-2">

                {feedback.strengths?.map(
                  (item, index) => (
                    <li key={index}>
                      • {item}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="mt-6">

              <h3 className="font-semibold">
                Weaknesses
              </h3>

              <ul className="mt-2 space-y-2">

                {feedback.weaknesses?.map(
                  (item, index) => (
                    <li key={index}>
                      • {item}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="mt-6">

              <h3 className="font-semibold">
                Suggestions
              </h3>

              <ul className="mt-2 space-y-2">

                {feedback.suggestions?.map(
                  (item, index) => (
                    <li key={index}>
                      • {item}
                    </li>
                  )
                )}

              </ul>

            </div>

          </div>

        )}

      </div>

        </div>
  </>
  );
}

export default Interview;