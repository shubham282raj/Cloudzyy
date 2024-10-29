import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const links = [
    { name: "Home", url: "" },
    { name: "Browse", url: "browse" },
    { name: "Login", url: "login" },
  ];

  return (
    <div className="mb-5 flex h-16 items-center justify-between rounded-lg bg-gray-800 px-5 shadow-md shadow-gray-950">
      <div className="m-0">Logo</div>
      <div className="m-0 flex gap-3">
        {links.map((link, index) => {
          return (
            <Link key={`navbar-key-${link.url}-${index}`} to={link.url}>
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
