import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { deleteContent } from "../api/github";

export default function Menu({ data, path, setSubMenu }) {
  const queryClient = useQueryClient();

  const menuOptions = [
    {
      name: "Download",
    },
    {
      name: "Delete",
      mutation: useMutation({
        mutationKey: `Delete-${data.sha}`,
        mutationFn: () => {
          deleteContent(data.path, data.sha);
          queryClient.refetchQueries(`content-${path}`);
        },
      }),
    },
  ];

  return (
    <div className="absolute right-0 top-7 z-10 rounded-lg border bg-gray-500 px-3 py-1">
      {menuOptions.map((menuOpt) => {
        return (
          <button
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
