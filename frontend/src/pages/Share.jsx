import React, { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getData, shareData } from "../api/share";
import { useAppContext } from "../Context/AppContext";

export default function Share() {
  const { setScreenLdr, showToast, isLoggedIn } = useAppContext();

  let shareTextRef = useRef("");
  let getCodeRef = useRef("");

  const [text, setText] = useState("");

  const mutation = useMutation({
    mutationKey: `Sharing`,
    mutationFn: async (data) => {
      setScreenLdr(true);
      if (data.trim() === "") throw new Error("Empty Data"); // Trim to avoid spaces-only input
      return await shareData(data);
    },
    onSuccess: (res) => showToast(`Key: ${res}`),
    onError: (res) => showToast(res.message || res),
    onSettled: () => setScreenLdr(false),
  });

  const getDataMutation = useMutation({
    mutationKey: `GetData`,
    mutationFn: async (key) => {
      setScreenLdr(true);
      if (key.trim() === "") throw new Error("Empty Code");
      return await getData(key);
    },
    onSuccess: (res) => {
      navigator.clipboard.writeText(res);
      setText(res); // Set the response text with line breaks
      showToast(`Copied to clipboard`);
    },
    onError: (res) => showToast(res.message || res),
    onSettled: () => setScreenLdr(false),
  });

  return (
    <div className="mx-auto flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <textarea
          className="h-28 resize-y rounded-lg border p-2"
          onChange={(e) => {
            shareTextRef.current = e.target.value;
          }}
          placeholder="Enter text to share (supports multiline)"
        ></textarea>
        <button
          className="mx-auto w-32 rounded-lg border p-2 hover:bg-gray-800"
          onClick={() => {
            mutation.mutate(shareTextRef.current);
          }}
        >
          Share
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          className="rounded-lg border p-2"
          onChange={(e) => {
            getCodeRef.current = e.target.value;
          }}
          placeholder="Enter code to retrieve text"
        />
        <button
          className="mx-auto w-32 rounded-lg border p-2 hover:bg-gray-800"
          onClick={() => {
            getDataMutation.mutate(getCodeRef.current);
          }}
        >
          Get
        </button>
      </div>
      {text && (
        <div className="flex flex-col gap-2">
          <div>Response</div>
          <div
            className="rounded-lg border p-2"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {typeof text === "object" ? JSON.stringify(text, null, 2) : text}
          </div>
        </div>
      )}
    </div>
  );
}
