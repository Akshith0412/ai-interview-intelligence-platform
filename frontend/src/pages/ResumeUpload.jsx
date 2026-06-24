import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ResumeUpload() {

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Load existing profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setFetchingProfile(true);
        const res = await api.get("/resume/profile");
        setProfile(res.data.profile);
      } catch (err) {
        // 404 just means no profile yet — not an error
        if (err.response?.status !== 404) {
          console.error(err);
        }
      } finally {
        setFetchingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError("Select a PDF resume file first.");
      return;
    }

    setError("");
    setUploadSuccess(false);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.post(
        "/resume/upload",
        formData
      );

      setProfile(res.data.profile);
      setUploadSuccess(true);
      setFile(null);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Resume upload failed"
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
              Resume Analysis
            </h1>
            <p className="text-zinc-400 mt-2">
              Upload your resume to generate an AI candidate profile.
            </p>
          </div>

          {error && (
            <p className="text-red-500 mt-4">
              {error}
            </p>
          )}

          {/* Existing Profile Card */}
          {fetchingProfile ? (

            <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <p className="text-zinc-400">
                Loading your profile...
              </p>
            </div>

          ) : profile ? (

            <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

              <div className="flex items-start justify-between">

                <div>
                  <span className="text-xs font-medium px-2 py-1 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-full">
                    ✓ Profile Active
                  </span>
                  <h2 className="text-3xl font-semibold mt-3">
                    {profile.name || "Your Profile"}
                  </h2>
                  <p className="text-zinc-400 mt-1">
                    {profile.experienceLevel || "Experience level not specified"}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/skill-gap")}
                  className="
                  px-5
                  py-2.5
                  bg-white
                  text-black
                  rounded-xl
                  font-medium
                  cursor-pointer
                  text-sm
                  "
                >
                  Use this profile →
                </button>

              </div>

              {/* Skills */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                  Skills ({profile.skills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map(skill => (
                    <span
                      key={skill}
                      className="
                      px-3
                      py-1.5
                      bg-zinc-800
                      rounded-full
                      text-sm
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              {profile.projects?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                    Projects ({profile.projects.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.projects.map((project, index) => (
                      <div
                        key={index}
                        className="bg-zinc-800 p-4 rounded-xl"
                      >
                        <h4 className="font-semibold">
                          {project.name}
                        </h4>
                        <p className="text-zinc-400 text-sm mt-1">
                          {project.description}
                        </p>
                        {project.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.technologies.map(t => (
                              <span
                                key={t}
                                className="text-xs px-2 py-0.5 bg-zinc-700 rounded-full"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          ) : null}

          {/* Upload Section */}
          <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

            <h2 className="text-xl font-semibold mb-1">
              {profile ? "Re-upload Resume" : "Upload Resume"}
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              {profile
                ? "Uploading a new resume will replace your current profile."
                : "Upload a PDF resume to extract your skills and projects."
              }
            </p>

            {uploadSuccess && (
              <p className="text-emerald-400 mb-4">
                ✓ Resume processed — profile updated successfully.
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap">

              <label className="
                flex
                items-center
                gap-3
                px-5
                py-3
                bg-zinc-800
                border
                border-zinc-700
                rounded-xl
                cursor-pointer
                hover:border-zinc-500
                transition-colors
              ">
                <span className="text-zinc-400 text-sm">
                  {file ? file.name : "Choose PDF file"}
                </span>
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setError("");
                  }}
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={loading || !file}
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
                  ? "Processing..."
                  : "Upload & Analyze"
                }
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default ResumeUpload;