import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Toast from "../components/Toast";
import { validateAuthToken } from "../api/user";
import { ScreenLoader } from "../components/Loader";
import FileProperties from "../components/FileProperties";

const AppContext = createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const [toast, setToast] = useState(undefined);
  const { isSuccess, isLoading: validateTokenLoading } = useQuery(
    "validateToken",
    validateAuthToken,
    {
      retry: false,
    },
  );

  const [screenLdr, setScreenLdr] = useState(false);
  const [loaderTxt, setLoaderTxt] = useState("");

  const [fileProp, showFileProp] = useState(undefined);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isSuccess,
        isLoginLoading: validateTokenLoading,
        showToast: (message, type = "SUCCESS") => setToast({ message, type }),
        setScreenLdr: setScreenLdr,
        showFileProp: showFileProp,
        loaderTxt: loaderTxt,
        setLoaderTxt: setLoaderTxt,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}

      {screenLdr && <ScreenLoader />}

      {fileProp && (
        <FileProperties fileProp={fileProp} showFileProp={showFileProp} />
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
