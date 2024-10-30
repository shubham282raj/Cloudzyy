import { useEffect, useState } from "react";

const Toast = ({ message, type, onClose }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1 / 5;
        } else {
          clearInterval(interval);
          return 100;
        }
      });
    }, 10);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose]);

  return (
    <div
      className={
        (type === "SUCCESS"
          ? "fixed bottom-4 right-4 z-50 max-w-md select-none rounded-md bg-gray-800 p-4"
          : "fixed bottom-4 right-4 z-50 max-w-md select-none rounded-md bg-gray-800 p-4") +
        " overflow-hidden"
      }
      onClick={onClose}
    >
      <div className="flex items-center justify-center">
        <span className="text-lg font-semibold">{String(message)}</span>
      </div>
      <div className="absolute bottom-0 left-0 mt-2 h-1 w-full bg-transparent">
        <div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Toast;
