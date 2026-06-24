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

  // Also need a JD upload form
  const [jdForm, setJdForm] = useState({
    company: "",
    role: "",
    jdText: "",
  });

  const [jdLoading, setJdLoading] =
    useState(false);

  const [jdSuccess, setJdSuccess] =
    useState(false);

  const handleJdChange = (e) => {
    setJdForm({
      ...jdForm,
      [e.target.name]: e.target.value,
    });
  };

  const uploadJD = async () => {
    setError("");

    if (
      !jdForm.company.trim() ||
      !jdForm.role.trim() ||
      !jdForm.jdText.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setJdLoading(true);

      await api.post(
        "/job-description/upload",
        jdForm
      );

      setJdSuccess(true);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "JD upload failed"
      );
    } finally {
      setJdLoading(false);
    }
  };

  const analyzeSkillGap = async () => {
    setError("");

    try {
      setLoading(true);

      const res =
        await api.post(
          "/analysis/skill-gap"
        );

      setResult(res.data);

    } catch (err) {
      setError(
        err.response?.data?.message ||
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
              Upload a job description, then compare your skills against it.
            </p>

          </div>

          {error && (
            <p className="text-red-500 mt-4">
              {error}
            </p>
          )}

          {/* Step 1 — Upload JD */}
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

            <h2 className="text-xl font-semibold mb-6">
              Step 1 — Upload Job Description
            </h2>

            <div className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="company"
                  placeholder="Company name"
                  value={jdForm.company}
                  onChange={handleJdChange}
                  className="
                  w-full
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  "
                />

                <input
                  type="text"
                  name="role"
                  placeholder="Role (e.g. AI Engineer)"
                  value={jdForm.role}
                  onChange={handleJdChange}
                  className="
                  w-full
                  bg-zinc-800
                  border
                  border-zinc-700
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  "
                />

              </div>

              <textarea
                name="jdText"
                placeholder="Paste the full job description here..."
                value={jdForm.jdText}
                onChange={handleJdChange}
                rows={8}
                className="
                w-full
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                outline-none
                resize-none
                "
              />

              <div className="flex items-center gap-4">

                <button
                  onClick={uploadJD}
                  disabled={jdLoading}
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
                  {jdLoading
                    ? "Uploading..."
                    : "Upload JD"
                  }
                </button>

                {jdSuccess && (
                  <span className="text-emerald-400">
                    ✓ JD uploaded successfully
                  </span>
                )}

              </div>

            </div>

          </div>

          {/* Step 2 — Analyze */}
          <div
            className="
            mt-6
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-8
            "
          >

            <h2 className="text-xl font-semibold mb-2">
              Step 2 — Analyze Skill Gap
            </h2>

            <p className="text-zinc-400 text-sm mb-6">
              Compares your resume skills against the most recently uploaded job description.
            </p>

            <button
              onClick={analyzeSkillGap}
              disabled={loading}
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
              {loading
                ? "Analyzing..."
                : "Analyze Skill Gap"
              }
            </button>

          </div>

          {/* Results */}
          {loading && (
            <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-zinc-400">
                Analyzing with AI + generating resource recommendations...
              </p>
              <p className="text-zinc-600 text-sm mt-2">
                This may take a few seconds to run semantic matching.
              </p>
            </div>
          )}

          {result && !loading && (

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

                <h3 className="mb-4 font-medium text-zinc-400">
                  Your Skills
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
                        text-sm
                        "
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

              <div className="mt-8">

                <h3 className="mb-4 font-medium text-red-400">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {result.missingSkills?.length === 0 ? (
                    <p className="text-emerald-400">
                      ✓ No missing skills — you meet all requirements!
                    </p>
                  ) : (
                    result.missingSkills?.map(
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
                          text-sm
                          "
                        >
                          {skill}
                        </span>
                      )
                    )
                  )}

                </div>

              </div>

              {result.recommendedResources &&
                Object.keys(result.recommendedResources).length > 0 && (

                  <div className="mt-8">

                    <h3 className="mb-4 font-medium text-blue-400">
                      Recommended Resources
                    </h3>

                    {Object.entries(
                      result.recommendedResources
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

                )}

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
                font-medium
                cursor-pointer
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