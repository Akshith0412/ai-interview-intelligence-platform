import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalInterviews: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get(
          "/dashboard/summary"
        );

        setSummary(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchSummary();
  }, []);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

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

              <h2 className="text-5xl font-semibold mt-4">
                {summary.averageScore}
              </h2>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;