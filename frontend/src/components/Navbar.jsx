import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";
import { useMutation, useQueryClient } from "react-query";
import { logOut } from "../api/user";

export default function Navbar() {
  const { isLoggedIn, showToast } = useAppContext();
  const queryClient = useQueryClient();

  const links = isLoggedIn
    ? [
        { name: "Home", url: "" },
        { name: "Browse", url: "browse" },
      ]
    : [
        { name: "Home", url: "" },
        { name: "Register", url: "register" },
        { name: "Login", url: "login" },
      ];

  const mutation = useMutation({
    mutationFn: logOut,
    mutationKey: "logout",
    onSuccess: () => {
      showToast("Signed Out");
      queryClient.invalidateQueries("validateToken");
    },
  });

  return (
    <div className="mb-5 flex h-16 items-center justify-between rounded-lg bg-gray-800 px-5">
      <div className="m-0">Logo</div>
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
