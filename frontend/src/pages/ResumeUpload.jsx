import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ResumeUpload() {

  const navigate = useNavigate();

  const [file, setFile] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [profile, setProfile] =
    useState(null);

  const [error, setError] =
  useState("");


  const handleUpload = async () => {

    if (!file) {
      alert("Select a resume first");
      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "resume",
        file
      );

      const res =
        await api.post(
          "/resume/upload",
          formData
        );

      setProfile(
        res.data.profile
      );

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
              Upload your resume and generate
              an AI candidate profile.
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

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
            />

            <button
              onClick={handleUpload}
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
                  ? "Processing..."
                  : "Upload Resume"
              }
            </button>

          </div>

          {profile && (

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
                {profile.name}
              </h2>

              <p className="text-zinc-400 mt-2">
                {profile.experienceLevel}
              </p>

              <div className="mt-8">

                <h3 className="text-xl font-medium mb-4">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {profile.skills?.map(
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

                <h3 className="text-xl font-medium mb-4">
                  Projects
                </h3>

                {profile.projects?.map(
                  (project, index) => (

                    <div
                      key={index}
                      className="
                      bg-zinc-800
                      p-5
                      rounded-xl
                      mb-4
                      "
                    >

                      <h4 className="font-semibold">
                        {project.name}
                      </h4>

                      <p className="text-zinc-400 mt-2">
                        {project.description}
                      </p>

                    </div>

                  )
                )}

              </div>

              <button
                onClick={() =>
                  navigate("/skill-gap")
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
                Continue →
              </button>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default ResumeUpload;