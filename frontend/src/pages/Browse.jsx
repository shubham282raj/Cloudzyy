import React, { useState } from "react";
import { useQuery } from "react-query";
import { getContent } from "../api/github";
import FileFolder from "../components/FileFolder";
import Menu from "../components/Menu";
import DragAndDrop from "../components/DragAndDrop";

export default function Browse() {
  const [path, setPath] = useState("");

  const [selected, setSelected] = useState([]);
  const [subMenu, setSubMenu] = useState(-1);

  const [showUpload, setShowUpload] = useState(true);

  const { data, isLoading, error } = useQuery({
    queryFn: () => getContent(path || ""),
    queryKey: `content-${path}`,
    onSuccess: (data) => {
      setSelected([]);
      if (data.message == "Forced Root") setPath("");
      data.content.data.sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "file" ? 1 : -1;
      });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="mb-3 flex justify-between rounded-lg bg-gray-800 px-3 py-2">
        <div className="flex">
          <button
            className="mr-2 flex aspect-square items-center justify-center rounded-lg border bg-slate-900 disabled:bg-slate-800 disabled:opacity-50"
            disabled={path == ""}
            onClick={() => {
              setPath((path) => path.substring(0, path.lastIndexOf("/")));
            }}
          >
            <img
              src="icons/uparrow.svg"
              alt="go_back"
              className="h-3/4 invert"
            />
          </button>
          <div className="flex gap-2">
            <div className="font-bold">Current Path:</div>
            <div>{path == "" ? "Root" : path}</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          {selected.length != 0 && (
            <div className="flex gap-2">
              <div>{selected.length} Selected</div>
              <button
                className="relative flex aspect-square h-6 flex-col items-center justify-evenly rounded-full hover:bg-gray-900"
                onClick={() => {
                  setSubMenu((menu) => (menu == 0 ? -1 : 0));
                }}
              >
                <div className="aspect-square w-1 rounded-full bg-white"></div>
                <div className="aspect-square w-1 rounded-full bg-white"></div>
                <div className="aspect-square w-1 rounded-full bg-white"></div>
                {subMenu == 0 && (
                  <Menu data={selected} setSubMenu={setSubMenu} path={path} />
                )}
              </button>
            </div>
          )}

          <button onClick={() => setShowUpload((v) => !v)}>
            <img src="/icons/addFile.svg" alt="addFile" className="invert" />
          </button>
        </div>
      </div>
      {showUpload && <DragAndDrop setShowUpload={setShowUpload} path={path} />}
      <div className="my-3 grid grid-cols-3 gap-3">
        {data.content.data.map((value, index) => (
          <FileFolder
            key={`file-folder-${value.html_url}`}
            data={value}
            selected={selected}
            setSelected={setSelected}
            path={path}
            setPath={setPath}
            subMenu={subMenu}
            setSubMenu={setSubMenu}
          />
        ))}
      </div>
      {/* <div>{JSON.stringify(selected)}</div> */}
    </div>
  );
}
