import React, { useState } from "react";
import { useQuery } from "react-query";
import { getContent } from "../api/github";
import FileFolder from "../components/FileFolder";
import Menu from "../components/Menu";
import DragAndDrop from "../components/DragAndDrop";
import { useAppContext } from "../Context/AppContext";
import { ScreenLoader } from "../components/Loader";

export default function Browse() {
  const { isLoggedIn } = useAppContext();

  const [path, setPath] = useState("");

  const [selected, setSelected] = useState([]);
  const [subMenu, setSubMenu] = useState(-1);

  const [showHidden, setShowHidden] = useState(false);

  const [showUpload, setShowUpload] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryFn: async () => getContent(path || ""),
    queryKey: `content-${path}`,
    onSuccess: (data) => {
      console.log(data);
      setSelected([]);
      data.sort((a, b) => {
        if (a.type === b.type) return 0;
        return a.type === "file" ? 1 : -1;
      });
    },
    onError: () => {
      setPath("");
    },
  });

  if (!isLoggedIn) return <p>Unauthorized</p>;
  if (isLoading) return <ScreenLoader />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="mb-3 flex justify-between gap-2 rounded-lg bg-gray-800 px-3 py-2">
        <div className="flex flex-grow">
          <button
            className="mr-2 flex aspect-square flex-shrink-0 flex-grow-0 items-center justify-center rounded-lg border bg-slate-900 disabled:bg-slate-800 disabled:opacity-50"
            disabled={path == ""}
            title="Go Back"
            onClick={() => {
              setSelected([]);
              setPath((path) => path.substring(0, path.lastIndexOf("/")));
            }}
          >
            <img src="icons/uparrow.svg" alt="go_back" className="h-3/4" />
          </button>
          <div className="flex gap-2" title={path == "" ? "Root" : path}>
            <div className="flex-shrink-0 font-semibold">Current Path:</div>
            <div className="line-clamp-1 flex-shrink flex-grow-0 break-all">
              {path == "" ? "Root" : path}
            </div>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center justify-center gap-3">
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
                  <Menu
                    data={selected}
                    setSubMenu={setSubMenu}
                    path={path}
                    options={["Delete", "Download"]}
                  />
                )}
              </button>
            </div>
          )}

          <button
            title="Show/Hide Hidden Files"
            onClick={() => setShowHidden((v) => !v)}
          >
            {showHidden ? (
              <img src="/icons/openEye.svg" alt="addFile" className="" />
            ) : (
              <img src="/icons/closedEye.svg" alt="addFile" className="" />
            )}
          </button>
          <button title="Add File" onClick={() => setShowUpload((v) => !v)}>
            <img src="/icons/addFile.svg" alt="addFile" className="" />
          </button>
        </div>
      </div>
      {showUpload && <DragAndDrop setShowUpload={setShowUpload} path={path} />}
      <div className="my-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {data.map((value, index) =>
          String(value.name).startsWith("hiddenChunks-") ? (
            showHidden ? (
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
            ) : null
          ) : (
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
          ),
        )}
      </div>
    </div>
  );
}
