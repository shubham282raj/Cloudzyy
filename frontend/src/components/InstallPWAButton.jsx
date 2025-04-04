import { useEffect, useState } from "react";

const InstallPWAButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if the user dismissed the prompt in the last 24 hours
    const lastDismissed = localStorage.getItem("pwaDismissedTimestamp");
    if (lastDismissed) {
      const elapsedTime = Date.now() - parseInt(lastDismissed, 10);
      const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (elapsedTime < oneDay) {
        setDismissed(true); // Hide the prompt for now
      }
    }

    const handleBeforeInstallPrompt = (event) => {
      // event.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(event); // Store event for later
    };

    const handleAppInstalled = () => {
      console.log("PWA Installed");
      setIsInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install");
    } else {
      console.log("User dismissed the install");
    }
    setDeferredPrompt(null);
  };

  const handleLaterClick = () => {
    setDismissed(true);
    localStorage.setItem("pwaDismissedTimestamp", Date.now().toString()); // Store the timestamp
  };

  if (isInstalled || dismissed || !deferredPrompt) return null; // Hide the button based on conditions

  return (
    <div className="pb-30 fixed inset-0 z-50 flex flex-col items-center justify-end bg-opacity-50 backdrop-blur-lg">
      <div className="mb-10 max-w-sm rounded-lg bg-gray-800 p-6 text-center shadow-lg">
        <h2 className="mb-2 text-lg font-semibold">
          Install as an App Instead
        </h2>
        <p className="mb-4 text-gray-400">
          Get a faster, offline-ready experience by installing this PWA.
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={handleInstallClick}
            className="bg-navbar-selected text-navbar-text w-32 rounded bg-gray-200 p-3 text-black shadow"
          >
            Install App
          </button>
          <button
            onClick={handleLaterClick}
            className="w-32 rounded bg-gray-700 p-3 text-white shadow"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWAButton;
