import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  return (

    <div
      className="
      flex
      items-center
      justify-between
      px-10
      py-5
      border-b
      border-zinc-800
      bg-zinc-950
      "
    >

      <h1
        className="
        text-xl
        font-semibold
        "
      >
        Interview Intelligence
      </h1>

      <div
        className="
        flex
        gap-6
        items-center
        "
      >

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/upload">
          Resume
        </Link>

        <Link to="/skill-gap">
          Skill Gap
        </Link>

        <Link to="/interview">
          Interview
        </Link>

        <button
          onClick={logout}
          className="
          px-4
          py-2
          border
          border-zinc-700
          rounded-lg
          "
        >
          Logout
        </button>

      </div>

    </div>

  );
}

export default Navbar;