import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { useEffect } from "react";

export default function Home() {
  const { isLoggedIn, showToast } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/browser");
  }, [isLoggedIn]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-1 px-4 py-10 text-center">
      <h2 className="mb-2 text-2xl font-bold">Welcome to Cloudzyy 🚀</h2>
      <p className="mb-2 text-gray-400">
        Cloudzyy lets you turn your GitHub repo into your personal cloud.
      </p>
      <p className="mb-4 text-gray-400">
        Register using your GitHub repository and access token, and manage your
        files online — add, delete, and store anything with ease.
      </p>

      <div className="my-1">
        {(isLoggedIn
          ? [{ name: "Browse", url: "/browser" }]
          : [
              { name: "Sign In", url: "/sign-in" },
              { name: "Register", url: "/register" },
            ]
        ).map(({ name, url }) => (
          <Link
            key={url}
            to={url}
            className="mx-1 inline-block rounded bg-gray-800 px-4 py-2 transition-all duration-200 hover:bg-gray-700"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
