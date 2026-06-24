import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";


function SkillGap() {

  const navigate = useNavigate();

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

    const [error, setError] =
  useState("");

  

  const analyzeSkillGap = async () => {

    try {

      setLoading(true);

      const res =
        await api.post(
          "/analysis/skill-gap",
          {
            targetRole: role,
          }
        );

      setResult(res.data);

    } catch (error) {

      setError(
  error.response?.data?.message ||
  "Analysis failed"
);

    } finally {

      setLoading(false);

    }

  };

return (
  <>
    <Navbar />

    <div className="min-h-screen bg-zinc-950 p-10">

      <div className="max-w-6xl mx-auto">

        <div>

          <h1 className="text-5xl font-semibold">
            Skill Gap Analysis
          </h1>

          <p className="text-zinc-400 mt-2">
            Compare your skills against your target role.
          </p>

        </div>

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

        {error && (

  <p
    className="
    text-red-500
    mb-4
    "
  >
    {error}
  </p>

)}

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
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
            onClick={analyzeSkillGap}
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
                ? "Analyzing..."
                : "Analyze"
            }
          </button>

        </div>

        {result && (

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

            <h2 className="text-2xl font-semibold">
              {result.targetRole}
            </h2>

            <div className="mt-8">

              <h3 className="mb-4 font-medium">
                Current Skills
              </h3>

              <div className="flex flex-wrap gap-2">

                {result.currentSkills?.map(
                  skill => (
                    <span
                      key={skill}
                      className="
                      px-3
                      py-2
                      bg-zinc-800
                      rounded-full
                      "
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>

            <div className="mt-8">

              <h3 className="mb-4 font-medium">
                Missing Skills
              </h3>

              <div className="flex flex-wrap gap-2">

                {result.missingSkills?.map(
                  skill => (
                    <span
                      key={skill}
                      className="
                      px-3
                      py-2
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

              <div className="mt-8">

  <h3 className="mb-4 font-medium">
    Recommended Resources
  </h3>

  {Object.entries(
    result.recommendedResources || {}
  ).map(
    ([skill, resources]) => (

      <div
        key={skill}
        className="mb-6"
      >

        <h4 className="text-lg font-semibold mb-3">
          {skill}
        </h4>

        {resources.map(
          (resource, index) => (

            <div
              key={index}
              className="
              bg-zinc-800
              p-4
              rounded-xl
              mb-3
              "
            >

              <h5 className="font-medium">
                {resource.title}
              </h5>

              <p className="text-zinc-400 text-sm mt-1">
                {resource.description}
              </p>

              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="
                text-blue-400
                text-sm
                mt-2
                inline-block
                "
              >
                Open Resource →
              </a>

            </div>

          )
        )}

      </div>

    )
  )}

</div>

            </div>

            <button
              onClick={() =>
                navigate("/interview")
              }
              className="
              mt-8
              px-6
              py-3
              bg-white
              text-black
              rounded-xl
              "
            >
              Generate Interview →
            </button>

          </div>

        )}

      </div>

    </div>
  </>
);
}

export default SkillGap;