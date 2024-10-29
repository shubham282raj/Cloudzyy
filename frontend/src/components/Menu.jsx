import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { deleteContent, getContentBuffer } from "../api/github";

export default function Menu({
  data,
  path,
  setSubMenu,
  options = ["Download", "Delete"],
}) {
  const queryClient = useQueryClient();

  const menuOptions = [
    {
      name: "Download",
      mutation: useMutation({
        mutationKey: `Download-${data[0].html_url}`,
        mutationFn: () => getContentBuffer(data[0]),
      }),
    },
    {
      name: "Delete",
      mutation: useMutation({
        mutationKey: `Delete-${data[0].html_url}`,
        mutationFn: () => deleteContent(data),
        onSuccess: () => {
          queryClient.refetchQueries(`content-${path}`);
        },
      }),
    },
  ];

  return (
    <div className="absolute right-0 top-7 z-10 rounded-lg border bg-gray-500 px-3 py-1">
      {menuOptions
        .filter((menuOpt) => options.includes(menuOpt.name))
        .map((menuOpt) => {
          return (
            <button
              key={`menu-${menuOpt.name}`}
              onClick={(e) => {
                e.stopPropagation();
                menuOpt.mutation.mutate();
                setSubMenu(-1);
              }}
            >
              {menuOpt.name}
            </button>
          );
        })}
    </div>
  );
}
