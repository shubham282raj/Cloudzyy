import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { useMutation, useQueryClient } from "react-query";
import { logOut } from "../api/user";

export default function Navbar() {
  const { isLoggedIn, showToast } = useAppContext();
  const queryClient = useQueryClient();

  const links = isLoggedIn
    ? [
        { name: "Browse", url: "/browser", image: "/icons/search.svg" },
        { name: "Profile", url: "profile", image: "/icons/user.svg" },
        // { name: "Share", url: "share" },
      ]
    : [
        // { name: "Share", url: "share" },
        { name: "Register", url: "register", image: "/icons/user-plus.svg" },
        { name: "Sign In", url: "sign-in", image: "/icons/log-in.svg" },
      ];

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: logOut,
    mutationKey: "logout",
    onSuccess: () => {
      showToast("Signed Out");
      navigate("/");
      queryClient.invalidateQueries("validateToken");
    },
  });

  return (
    <div className="mb-5 flex h-16 items-center justify-between rounded-lg bg-gray-800 px-5">
      <Link
        to={isLoggedIn ? "/browser" : "/"}
        className="m-0 flex items-center gap-3 text-lg font-bold tracking-widest"
      >
        <img
          src="/favicon.svg"
          alt="logo"
          className="inline-block scale-[1.5]"
        />
        Cloudzyy
      </Link>
      <div className="m-0 flex flex-wrap items-center gap-1">
        {links.map((link, index) => {
          return (
            <Link
              key={`navbar-key-${link.url}-${index}`}
              to={link.url}
              className="rounded px-2 py-1 transition-all duration-200 hover:bg-gray-900"
            >
              {link.name}
              {link.image && (
                <img
                  src={link.image}
                  alt={link.name}
                  title={link.name}
                  className="ml-1 inline invert"
                />
              )}
            </Link>
          );
        })}
        {/* {isLoggedIn && (
          <button
            className="rounded px-2 py-1 transition-all duration-200 hover:bg-gray-900"
            onClick={() => mutation.mutate()}
          >
            Sign Out
            <img
              src="/icons/log-out.svg"
              alt="log out"
              title="Log Out"
              className="ml-1 inline invert"
            />
          </button>
        )} */}
      </div>
    </div>
  );
}
