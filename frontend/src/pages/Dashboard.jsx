import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalInterviews: 0,
    averageScore: 0,
  });

  const [progress, setProgress] = useState(null);

  const [activeTab, setActiveTab] =
    useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, progressRes] =
          await Promise.allSettled([
            api.get("/dashboard/summary"),
            api.get("/dashboard/progress"),
          ]);

        if (
          summaryRes.status === "fulfilled"
        ) {
          setSummary(summaryRes.value.data);
        }

        if (
          progressRes.status === "fulfilled"
        ) {
          setProgress(progressRes.value.data);
        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-zinc-950 p-10">

        <div className="max-w-6xl mx-auto">

          <div>

            <h1 className="text-5xl font-semibold tracking-tight">
              Interview Intelligence
            </h1>

            <p className="text-zinc-400 mt-2">
              Track progress, identify skill gaps,
              and improve interview readiness.
            </p>

          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mt-8">

            <button
              onClick={() =>
                setActiveTab("overview")
              }
              className={`
                px-5
                py-2.5
                rounded-xl
                font-medium
                transition-all
                duration-200
                cursor-pointer
                ${
                  activeTab === "overview"
                    ? "bg-white text-black"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }
              `}
            >
              Overview
            </button>

            <button
              onClick={() =>
                setActiveTab("progress")
              }
              className={`
                px-5
                py-2.5
                rounded-xl
                font-medium
                transition-all
                duration-200
                cursor-pointer
                ${
                  activeTab === "progress"
                    ? "bg-white text-black"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }
              `}
            >
              Progress
            </button>

          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

              <div
                className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-8
                "
              >

                <p className="text-zinc-400">
                  Total Interviews
                </p>

                <h2 className="text-5xl font-semibold mt-4">
                  {summary.totalInterviews}
                </h2>

              </div>

              <div
                className="
                bg-zinc-900
                border
                border-zinc-800
                rounded-2xl
                p-8
                "
              >

                <p className="text-zinc-400">
                  Average Score
                </p>

                <h2 className={`text-5xl font-semibold mt-4 ${getScoreColor(summary.averageScore)}`}>
                  {summary.averageScore}
                  <span className="text-xl text-zinc-500">/10</span>
                </h2>

              </div>

            </div>

          )}

          {/* Progress Tab */}
          {activeTab === "progress" && (

            <div className="mt-8">

              {!progress ? (

                <div
                  className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-2xl
                  p-8
                  text-center
                  "
                >
                  <p className="text-zinc-400">
                    Loading progress data...
                  </p>
                </div>

              ) : (

                <>

                  {/* Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div
                      className="
                      bg-zinc-900
                      border
                      border-zinc-800
                      rounded-2xl
                      p-8
                      "
                    >

                      <p className="text-zinc-400">
                        Total Interviews
                      </p>

                      <h2 className="text-5xl font-semibold mt-4">
                        {progress.totalInterviews}
                      </h2>

                    </div>

                    <div
                      className="
                      bg-zinc-900
                      border
                      border-zinc-800
                      rounded-2xl
                      p-8
                      "
                    >

                      <p className="text-zinc-400">
                        Average Score
                      </p>

                      <h2 className={`text-5xl font-semibold mt-4 ${getScoreColor(progress.averageScore)}`}>
                        {progress.averageScore}
                        <span className="text-xl text-zinc-500">/10</span>
                      </h2>

                    </div>

                  </div>

                  {/* Skills Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                    {/* Weakest Skills */}
                    <div
                      className="
                      bg-zinc-900
                      border
                      border-zinc-800
                      rounded-2xl
                      p-8
                      "
                    >

                      <h3 className="text-lg font-semibold text-red-400 mb-4">
                        ↓ Weakest Skills
                      </h3>

                      {progress.weakestSkills?.length > 0 ? (
                        <div className="space-y-3">
                          {progress.weakestSkills.map(
                            (skill, index) => (
                              <div
                                key={skill}
                                className="
                                flex
                                items-center
                                gap-3
                                "
                              >

                                <span
                                  className="
                                  w-6
                                  h-6
                                  flex
                                  items-center
                                  justify-center
                                  bg-red-950
                                  border
                                  border-red-900
                                  rounded-full
                                  text-xs
                                  text-red-400
                                  "
                                >
                                  {index + 1}
                                </span>

                                <span>{skill}</span>

                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-zinc-500">
                          No data yet. Complete interviews to track skills.
                        </p>
                      )}

                    </div>

                    {/* Strongest Skills */}
                    <div
                      className="
                      bg-zinc-900
                      border
                      border-zinc-800
                      rounded-2xl
                      p-8
                      "
                    >

                      <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                        ↑ Strongest Skills
                      </h3>

                      {progress.strongestSkills?.length > 0 ? (
                        <div className="space-y-3">
                          {progress.strongestSkills.map(
                            (skill, index) => (
                              <div
                                key={skill}
                                className="
                                flex
                                items-center
                                gap-3
                                "
                              >

                                <span
                                  className="
                                  w-6
                                  h-6
                                  flex
                                  items-center
                                  justify-center
                                  bg-emerald-950
                                  border
                                  border-emerald-900
                                  rounded-full
                                  text-xs
                                  text-emerald-400
                                  "
                                >
                                  {index + 1}
                                </span>

                                <span>{skill}</span>

                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-zinc-500">
                          No data yet. Complete interviews to track skills.
                        </p>
                      )}

                    </div>

                  </div>

                </>

              )}

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default Dashboard;