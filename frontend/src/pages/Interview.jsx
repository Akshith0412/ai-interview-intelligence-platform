import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Interview() {

  const [profile, setProfile] =
    useState(null);

  const [jobDescriptions, setJobDescriptions] =
    useState([]);

  const [selectedJdId, setSelectedJdId] =
    useState("");

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

  const [evaluating, setEvaluating] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [dataLoading, setDataLoading] =
    useState(true);

  // Fetch candidate profile and job descriptions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        const [profileRes, jdRes] =
          await Promise.allSettled([
            api.get("/resume/profile"),
            api.get("/job-description/list"),
          ]);

        if (
          profileRes.status === "fulfilled"
        ) {
          setProfile(
            profileRes.value.data.profile ||
            profileRes.value.data
          );
        }

        if (
          jdRes.status === "fulfilled"
        ) {
          const jds =
            jdRes.value.data.jobDescriptions ||
            jdRes.value.data ||
            [];
          setJobDescriptions(jds);

          if (jds.length > 0) {
            setSelectedJdId(jds[0]._id);
          }
        }

      } catch (err) {
        console.log(err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateInterview = async () => {
    setError("");
    setFeedback(null);

    if (!profile) {
      setError(
        "No candidate profile found. Please upload your resume first."
      );
      return;
    }

    if (!selectedJdId) {
      setError(
        "No job description selected. Please upload a JD first."
      );
      return;
    }

    try {
      setLoading(true);

      const res =
        await api.post(
          "/interview/generate",
          {
            candidateProfileId:
              profile._id,
            jobDescriptionId:
              selectedJdId,
          }
        );

      setSession(res.data);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Interview generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const submitAndEvaluate = async () => {
    setError("");

    if (!selectedQuestion) {
      setError(
        "Please select a question first"
      );
      return;
    }

    if (!answer.trim()) {
      setError(
        "Please enter an answer"
      );
      return;
    }

    try {
      // Step 1: Submit answer
      setSubmitting(true);

      await api.post(
        "/interview/answer",
        {
          sessionId:
            session.sessionId,
          question:
            selectedQuestion,
          answer,
        }
      );

      setSubmitting(false);

      // Step 2: Evaluate
      setEvaluating(true);

      const res =
        await api.post(
          "/interview/evaluate",
          {
            sessionId:
              session.sessionId,
            question:
              selectedQuestion,
            answer,
          }
        );

      setFeedback(res.data);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Evaluation failed"
      );
    } finally {
      setSubmitting(false);
      setEvaluating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8)
      return "text-emerald-400";
    if (score >= 5)
      return "text-yellow-400";
    return "text-red-400";
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
            Generate personalized questions and receive AI feedback.
          </p>

          {error && (
            <p className="text-red-500 mt-4">
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

              {dataLoading ? (

                <p className="text-zinc-400">
                  Loading your profile & job descriptions...
                </p>

              ) : (

                <>

                  {!profile && (
                    <p className="text-yellow-400 mb-4">
                      ⚠ No resume profile found. Please upload
                      your resume first from the Resume page.
                    </p>
                  )}

                  {jobDescriptions.length === 0 && (
                    <p className="text-yellow-400 mb-4">
                      ⚠ No job descriptions found. Please upload
                      a JD first from the Skill Gap page.
                    </p>
                  )}

                  {profile && (
                    <div className="mb-6">

                      <p className="text-zinc-400 text-sm mb-1">
                        Candidate Profile
                      </p>

                      <div
                        className="
                        bg-zinc-800
                        border
                        border-zinc-700
                        rounded-xl
                        px-4
                        py-3
                        "
                      >
                        <p className="font-medium">
                          {profile.skills?.slice(0, 8).join(", ")}
                          {profile.skills?.length > 8 &&
                            ` +${profile.skills.length - 8} more`
                          }
                        </p>

                        <p className="text-zinc-400 text-sm mt-1">
                          {profile.experienceLevel || "Experience not specified"}
                          {" · "}
                          {profile.projects?.length || 0} projects
                        </p>
                      </div>

                    </div>
                  )}

                  {jobDescriptions.length > 0 && (
                    <div className="mb-6">

                      <p className="text-zinc-400 text-sm mb-1">
                        Select Job Description
                      </p>

                      <select
                        value={selectedJdId}
                        onChange={(e) =>
                          setSelectedJdId(
                            e.target.value
                          )
                        }
                        className="
                        w-full
                        bg-zinc-800
                        border
                        border-zinc-700
                        px-4
                        py-3
                        rounded-xl
                        "
                      >
                        {jobDescriptions.map(
                          (jd) => (
                            <option
                              key={jd._id}
                              value={jd._id}
                            >
                              {jd.role} at {jd.company}
                            </option>
                          )
                        )}

                      </select>

                    </div>
                  )}

                  <button
                    onClick={
                      generateInterview
                    }
                    disabled={
                      loading ||
                      !profile ||
                      jobDescriptions.length === 0
                    }
                    className="
                    px-6
                    py-3
                    bg-white
                    text-black
                    rounded-xl
                    font-medium
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    cursor-pointer
                    "
                  >
                    {
                      loading
                        ? "Generating Questions..."
                        : "Generate Interview"
                    }
                  </button>

                </>

              )}

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

              <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-semibold">
                  Interview: {session.targetRole}
                </h2>

                {session.missingSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {session.missingSkills.map(
                      skill => (
                        <span
                          key={skill}
                          className="
                          px-2
                          py-1
                          text-xs
                          bg-red-950
                          border
                          border-red-900
                          rounded-full
                          "
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                )}

              </div>

              <div className="space-y-4">

                {session.questions.map(
                  (
                    question,
                    index
                  ) => (

                    <div
                      key={index}
                      onClick={() => {
                        setSelectedQuestion(
                          question
                        );
                        setFeedback(null);
                        setAnswer("");
                      }}
                      className={`
                        p-5
                        rounded-xl
                        cursor-pointer
                        border
                        transition-all
                        duration-200
                        ${
                          selectedQuestion ===
                          question
                            ? "border-white bg-zinc-800"
                            : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                        }
                      `}
                    >

                      <h3 className="font-medium text-zinc-400">
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
                    Your Answer
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
                    placeholder="Type your answer here..."
                    className="
                    mt-6
                    w-full
                    h-40
                    bg-zinc-800
                    border
                    border-zinc-700
                    rounded-xl
                    p-4
                    outline-none
                    resize-none
                    "
                  />

                  <button
                    onClick={submitAndEvaluate}
                    disabled={
                      submitting ||
                      evaluating ||
                      !answer.trim()
                    }
                    className="
                    mt-4
                    px-6
                    py-3
                    bg-white
                    text-black
                    rounded-xl
                    font-medium
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    cursor-pointer
                    "
                  >
                    {
                      submitting
                        ? "Submitting..."
                        : evaluating
                          ? "Evaluating with AI..."
                          : "Submit & Evaluate"
                    }
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

              <div className="flex items-center gap-4 mb-6">

                <h2 className="text-3xl font-semibold">
                  Score:
                </h2>

                <span className={`text-5xl font-bold ${getScoreColor(feedback.score)}`}>
                  {feedback.score}
                  <span className="text-xl text-zinc-500">/10</span>
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div
                  className="
                  bg-emerald-950/30
                  border
                  border-emerald-900/50
                  rounded-xl
                  p-5
                  "
                >

                  <h3 className="font-semibold text-emerald-400 mb-3">
                    ✓ Strengths
                  </h3>

                  <ul className="space-y-2">
                    {feedback.strengths?.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-zinc-300 text-sm"
                        >
                          • {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

                <div
                  className="
                  bg-red-950/30
                  border
                  border-red-900/50
                  rounded-xl
                  p-5
                  "
                >

                  <h3 className="font-semibold text-red-400 mb-3">
                    ✗ Weaknesses
                  </h3>

                  <ul className="space-y-2">
                    {feedback.weaknesses?.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-zinc-300 text-sm"
                        >
                          • {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

                <div
                  className="
                  bg-blue-950/30
                  border
                  border-blue-900/50
                  rounded-xl
                  p-5
                  "
                >

                  <h3 className="font-semibold text-blue-400 mb-3">
                    💡 Suggestions
                  </h3>

                  <ul className="space-y-2">
                    {feedback.suggestions?.map(
                      (item, index) => (
                        <li
                          key={index}
                          className="text-zinc-300 text-sm"
                        >
                          • {item}
                        </li>
                      )
                    )}
                  </ul>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Interview;