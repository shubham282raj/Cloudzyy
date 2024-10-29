import React from "react";

export default function Menu() {
  const menuOptions = [
    {
      name: "Download",
    },
    {
      name: "Get Link",
    },
  ];

  return (
    <div className="absolute right-0 top-7 z-10 rounded-lg border bg-gray-500 px-3 py-1">
      {menuOptions.map((menuOpt) => {
        return <div>{menuOpt.name}</div>;
      })}
    </div>
  );
}
