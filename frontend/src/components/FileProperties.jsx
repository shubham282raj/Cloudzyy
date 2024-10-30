import React, { useState } from "react";

export default function FileProperties({ fileProp, showFileProp }) {
  const [copyFeedback, setCopyFeedback] = useState(""); // State for copy feedback

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  const handleCopy = (value) => {
    navigator.clipboard.writeText(
      typeof value === "object" ? JSON.stringify(value, null, 2) : value,
    );
    setCopyFeedback("Copied to clipboard!");

    setTimeout(() => {
      setCopyFeedback("");
    }, 3000);
  };

  return (
    <div className="absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-y-auto bg-black bg-opacity-20 px-3 backdrop-blur-md">
      <div className="max-w-screen-md">
        <div className="flex items-center justify-between">
          <h1 className="my-2 px-2 font-bold">Image Object Details</h1>
          <button
            className="mx-2 rounded-lg border-4 border-transparent transition-all hover:border-gray-800"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              showFileProp(undefined);
            }}
          >
            <img src="/icons/cross.svg" alt="" />
          </button>
        </div>
        {fileProp ? (
          <>
            <table>
              <tbody>
                {Object.entries(fileProp).map(([key, value]) =>
                  key === "_links" ? (
                    <></>
                  ) : (
                    <tr
                      key={`filedetail-${fileProp.path}-${key}`}
                      className="border"
                    >
                      <td className="break-words px-2 py-1.5 font-semibold">
                        {key.split("_").join(" ")}
                      </td>
                      <td className="line-clamp-2 break-all px-2 py-1.5">
                        {isValidUrl(value) ? (
                          <a
                            className="cursor-pointer break-all hover:underline"
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {value}
                          </a>
                        ) : typeof value === "object" ? (
                          JSON.stringify(value, null, 2)
                        ) : (
                          value
                        )}
                        {key === "size" &&
                          ` (${(value / 1048576).toFixed(2)} MB)`}
                      </td>
                      <td className="min-w-9">
                        <button
                          className=""
                          onClick={() => handleCopy(value)}
                          title="Click to copy"
                        >
                          <img
                            src="/icons/copy.svg"
                            alt="copy-btn"
                            className=""
                          />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <div className="mt-1 text-center text-green-500">
              {copyFeedback} &#8203;
            </div>
          </>
        ) : (
          <p>Something went wrong</p>
        )}
      </div>
    </div>
  );
}
