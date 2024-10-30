import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { deleteContent, getContentBuffer } from "../api/github";
import { useAppContext } from "../Context/AppContext";

export default function Menu({
  data,
  path,
  setSubMenu,
  options = ["Download", "Delete"],
}) {
  const queryClient = useQueryClient();

  const { setScreenLdr, showToast } = useAppContext();

  const menuOptions = [
    {
      name: "Download",
      mutation: useMutation({
        mutationKey: `Download-${data[0].html_url}`,
        mutationFn: () => getContentBuffer(data),
        onSettled: () => setScreenLdr(false),
        onSuccess: () => showToast("Download Started"),
        onError: () => showToast("Download Failed"),
      }),
    },
    {
      name: "Delete",
      mutation: useMutation({
        mutationKey: `Delete-${data[0].html_url}`,
        mutationFn: () => deleteContent(data),
        onSuccess: () => {
          queryClient.refetchQueries(`content-${path}`);
          showToast("Deleted");
        },
        onSettled: () => setScreenLdr(false),
        onError: () => showToast("Error Deleting"),
      }),
    },
  ];

  return (
    <div className="absolute right-0 top-7 z-10 flex flex-col gap-1 rounded-lg border bg-gray-600 px-3 py-1">
      {menuOptions
        .filter((menuOpt) => options.includes(menuOpt.name))
        .map((menuOpt) => {
          return (
            <div
              key={`menu-${menuOpt.name}`}
              onClick={(e) => {
                e.stopPropagation();
                setScreenLdr(true);
                menuOpt.mutation.mutate();
                setSubMenu(-1);
              }}
              className="cursor-pointer"
            >
              {menuOpt.name}
            </div>
          );
        })}
    </div>
  );
}
