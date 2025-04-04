import { Link } from "react-router-dom";

const UnauthorizedMessage = () => {
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
      <p className="text-sm text-gray-500">
        Please sign in or register to continue.
      </p>
      {/* <div className="my-1">
        {[
          { name: "Sign In", url: "/login" },
          { name: "Register", url: "/register" },
        ].map((element) => (
          <Link
            to={element.url}
            className="mx-1 inline-block rounded bg-gray-800 px-4 py-2 transition-all duration-200 hover:bg-gray-700"
          >
            {element.name}
          </Link>
        ))}
      </div> */}
    </div>
  );
};

export default UnauthorizedMessage;
