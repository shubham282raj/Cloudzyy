import React, { useState } from "react";

export default function FileFolder({ data, selected, setSelected, setPath }) {
  const thisSelected = selected.includes(data.html_url);

  return (
    <div
      className={
        "flex h-44 w-40 cursor-pointer flex-col justify-between gap-2 rounded-lg bg-gray-800 px-3 py-5 " +
        (thisSelected ? "border-2" : "")
      }
      onClick={() => {
        if (data.type == "file") {
        } else {
          setPath(data.path);
        }
      }}
    >
      <div className="flex justify-between">
        {data.type == "file" ? (
          <>
            <button
              className="aspect-square h-6 rounded-full border-4"
              style={{ borderColor: thisSelected ? "white" : "#6b7280" }}
              onClick={() => {
                setSelected((prevSelected) => {
                  if (prevSelected.includes(data.html_url)) {
                    return prevSelected.filter((url) => url !== data.html_url);
                  } else {
                    return [...prevSelected, data.html_url];
                  }
                });
              }}
            ></button>
            <button className="flex aspect-square h-6 flex-col justify-evenly">
              <div className="ml-auto mr-1.5 aspect-square w-1 rounded-full bg-white"></div>
              <div className="ml-auto mr-1.5 aspect-square w-1 rounded-full bg-white"></div>
              <div className="ml-auto mr-1.5 aspect-square w-1 rounded-full bg-white"></div>
            </button>
          </>
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
