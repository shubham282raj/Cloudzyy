import React, { useState } from "react";
import Menu from "./Menu";

export default function FileFolder({
  data,
  selected,
  setSelected,
  path,
  setPath,
  subMenu,
  setSubMenu,
}) {
  const thisSelected = selected.some((item) => item.html_url === data.html_url);

  return (
    <div
      className={
        "flex h-52 cursor-pointer flex-col justify-between gap-2 rounded-lg border-2 bg-gray-800 px-3 py-5 " +
        (thisSelected ? "" : "border-gray-800")
      }
      onClick={() => {
        if (data.type == "file") {
          setSelected((prevSelected) => {
            const isSelected = prevSelected.some(
              (item) => item.html_url === data.html_url,
            );

            if (isSelected) {
              return prevSelected.filter(
                (item) => !(item.html_url === data.html_url),
              );
            } else {
              return [...prevSelected, data];
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
              setSubMenu((menu) =>
                menu == data.html_url ? -1 : data.html_url,
              );
            }}
          >
            <div className="aspect-square w-1 rounded-full bg-white"></div>
            <div className="aspect-square w-1 rounded-full bg-white"></div>
            <div className="aspect-square w-1 rounded-full bg-white"></div>
            {subMenu == data.html_url && (
              <Menu data={[data]} setSubMenu={setSubMenu} path={path} />
            )}
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
