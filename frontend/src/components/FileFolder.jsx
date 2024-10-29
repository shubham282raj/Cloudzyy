import React, { useState } from "react";
import Menu from "./Menu";

export default function FileFolder({
  data,
  selected,
  setSelected,
  setPath,
  subMenu,
  setSubMenu,
}) {
  const thisSelected = selected.some((item) => item.sha === data.sha);

  return (
    <div
      className={
        "flex h-52 w-40 cursor-pointer flex-col justify-between gap-2 rounded-lg border-2 bg-gray-800 px-3 py-5 " +
        (thisSelected ? "" : "border-gray-800")
      }
      onClick={() => {
        if (data.type == "file") {
          setSelected((prevSelected) => {
            // Check if the selected item already exists in the list by its `path` or `sha`
            const isSelected = prevSelected.some(
              (item) => item.sha === data.sha,
            );

            if (isSelected) {
              // If it exists, remove it
              return prevSelected.filter((item) => !(item.sha === data.sha));
            } else {
              // If it doesn't exist, add it to the list
              return [...prevSelected, { sha: data.sha, path: data.path }];
            }
          });
        } else {
          setPath(data.path);
        }
      }}
    >
      <div className="flex justify-end">
        {data.type == "file" ? (
          <button
            className="relative flex aspect-square h-7 flex-col items-center justify-evenly rounded-full hover:bg-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              setSubMenu((menu) => (menu == data.sha ? -1 : data.sha));
            }}
          >
            <div className="aspect-square w-1 rounded-full bg-white"></div>
            <div className="aspect-square w-1 rounded-full bg-white"></div>
            <div className="aspect-square w-1 rounded-full bg-white"></div>
            {subMenu == data.sha && <Menu />}
          </button>
        ) : (
          <div></div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <img
          src={data.type == "file" ? "icons/file.svg" : "icons/folder.svg"}
          alt=""
          className="w-12 invert"
        />
        <div>{data.name}</div>
      </div>
    </div>
  );
}
