import React from "react";
import Menu from "./Menu";
import { useAppContext } from "../Context/AppContext";
import useGithub from "../api/useGithub";

export default function FileFolder({
  data,
  selected,
  setSelected,
  path,
  setPath,
  subMenu,
  setSubMenu,
}) {
  const { showToast, setScreenLdr } = useAppContext();
  const { downloadBufferContent } = useGithub();

  const thisSelected = selected.some((item) => item.html_url === data.html_url);

  return (
    <div
      className={
        "flex h-52 cursor-pointer flex-col justify-between gap-2 rounded-lg border-2 bg-gray-900 px-3 py-5 transition-colors hover:bg-gray-800 " +
        (thisSelected ? "" : "border-gray-800")
      }
      title={data.name}
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
          setSelected([]);
          setPath(data.path);
        }
      }}
    >
      <div className="flex justify-end gap-1">
        {data.type ? (
          <>
            {!String(data.name).endsWith(".chunkdata") && (
              <>
                <button
                  title="Copy URL"
                  onClick={async (e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(data.download_url);
                    showToast("Copied to Clipboard");
                  }}
                  className="flex aspect-square h-7 flex-col items-center justify-evenly rounded-md border border-transparent hover:border-slate-600"
                >
                  <img src="icons/copy.svg" alt="download btn" className="" />
                </button>
              </>
            )}
            <button
              title="Download"
              // to={data.download_url}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  setScreenLdr(true);
                  await new Promise((resolve) => setTimeout(resolve, 10));
                  await downloadBufferContent([data]);
                } catch (error) {
                  console.error(error);
                } finally {
                  setScreenLdr(false);
                }
                // const fileBlob = await fetch(data.url).then((res) =>
                //   res.blob(),
                // );
                // const fileBlobUrl = URL.createObjectURL(fileBlob);

                // const fileDownloadLink = document.createElement("a");
                // fileDownloadLink.href = fileBlobUrl;
                // fileDownloadLink.download = data.name;
                // document.body.appendChild(fileDownloadLink);
                // fileDownloadLink.click();
                // fileDownloadLink.remove();
                // URL.revokeObjectURL(fileBlobUrl); // Clean up
                showToast("Downloaded");
              }}
              className="flex aspect-square h-7 flex-col items-center justify-evenly rounded-md border border-transparent hover:border-slate-600"
            >
              <img
                src="icons/download.svg"
                alt="download btn"
                className="invert"
              />
            </button>
            <button
              className="relative flex aspect-square h-7 flex-col items-center justify-evenly rounded-md border border-transparent hover:border-slate-600"
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
              {subMenu == data.html_url &&
                (String(data.name).endsWith(".chunkdata") ? (
                  <Menu
                    data={[data]}
                    setSubMenu={setSubMenu}
                    path={path}
                    options={["Download", "Delete", "Details"]}
                  />
                ) : (
                  <Menu data={[data]} setSubMenu={setSubMenu} path={path} />
                ))}
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
          className="w-14"
        />
        <div className="line-clamp-1 w-full break-words text-center">
          {data.name}
        </div>
      </div>
    </div>
  );
}
