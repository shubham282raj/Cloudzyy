import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "react-query";
import { postContent } from "../api/github";
import { CircularLoader2 } from "./Loader";

const DragAndDrop = ({ setShowUpload, path }) => {
  const [files, setFiles] = useState([]);

  const uploadPathRef = useRef(0);
  useEffect(() => {
    uploadPathRef.current = path;
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postContent,
    mutationKey: "upload-file",
    onSuccess: () => {
      setFiles([]);
      setShowUpload(false);
      queryClient.refetchQueries(`content-${path}`);
    },
  });

  const handleUpload = () => {
    const uploadPath = uploadPathRef.current;
    mutation.mutate({ files, uploadPath });
  };

  return (
    <div className="my-3 flex">
      <div className="flex-grow">
        <div className="flex flex-shrink-0 justify-center gap-1">
          <div className="mb-1 flex items-center rounded-lg bg-gray-800 px-3">
            {path == "" ? "Root" : path} /
          </div>
          <input
            type="text"
            placeholder="..."
            className="mb-1 flex-grow rounded-lg bg-gray-800 px-2 py-1"
            onChange={(e) => {
              if (path == "") uploadPathRef.current = e.target.value;
              else uploadPathRef.current = `${path}/${e.target.value}`;
            }}
          />
        </div>
        <div
          {...getRootProps()}
          className={
            "rounded-lg border-2 border-dashed border-gray-700 px-2 py-10 text-center transition-colors " +
            (isDragActive ? "bg-gray-700" : "bg-gray-800")
          }
        >
          <input {...getInputProps()} />
          {files.length != 0 && (
            <div className="mx-auto flex flex-col gap-2">
              {files.map((file) => (
                <div className="flex justify-between gap-1">
                  <img
                    src="/icons/file.svg"
                    alt={`file-${file.name}`}
                    className=""
                  />
                  <div className="line-clamp-1 flex-grow">{file.name}</div>
                  <div className="w-fit flex-shrink-0">
                    {(file.size / 1048576).toFixed(2)} MBs
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFiles((prevFiles) =>
                        prevFiles.filter(
                          (thisFile) => thisFile.name !== file.name,
                        ),
                      );
                    }}
                    className="flex-shrink-0"
                  >
                    <img
                      src="icons/cross.svg"
                      alt="individual-cross"
                      className=""
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          {files.length != 0 && (
            <div className="my-10 border-t-2 border-dashed"></div>
          )}
          <div className="mx-auto w-fit rounded-lg px-2 py-1">
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : files.length == 0 ? (
              <p>Drag and drop files here, or click to select files</p>
            ) : (
              <p>Add more</p>
            )}
          </div>
        </div>
      </div>
      <div className="ml-1 flex flex-shrink-0 flex-col items-center justify-evenly rounded-lg bg-gray-800">
        <button
          onClick={() => {
            setFiles([]);
            setShowUpload(false);
          }}
        >
          <img src="/icons/cross.svg" alt="cross" className="" />
        </button>
        <button
          onClick={handleUpload}
          disabled={mutation.isLoading || files.length == 0}
          className="disabled:opacity-40"
        >
          {mutation.isLoading ? (
            <CircularLoader2 />
          ) : (
            <img src="/icons/tick.svg" alt="upload" className="" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DragAndDrop;
