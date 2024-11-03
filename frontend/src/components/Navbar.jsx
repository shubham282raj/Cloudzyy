import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { useMutation, useQueryClient } from "react-query";
import { logOut } from "../api/user";

export default function Navbar() {
  const { isLoggedIn, showToast } = useAppContext();
  const queryClient = useQueryClient();

  const links = isLoggedIn
    ? [{ name: "Profile", url: "profile" }]
    : [
        { name: "Register", url: "register" },
        { name: "Login", url: "login" },
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
        to="/"
        className="m-0 flex items-center gap-3 text-lg font-bold tracking-widest"
      >
        <img
          src="favicon.svg"
          alt="logo"
          className="inline-block scale-[1.5]"
        />
        Cloudzyy
      </Link>
      <div className="m-0 flex items-center gap-3">
        {links.map((link, index) => {
          return (
            <Link key={`navbar-key-${link.url}-${index}`} to={link.url}>
              {link.name}
            </Link>
          );
        })}
        {isLoggedIn && (
          <button onClick={() => mutation.mutate()}>Sign Out</button>
        )}
      </div>
    </div>
  );
}
