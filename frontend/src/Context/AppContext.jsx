import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Toast from "../components/Toast";
import { validateAuthToken } from "../api/user";

const AppContext = createContext(undefined);

export const AppContextProvider = ({ children }) => {
  const [toast, setToast] = useState(undefined);
  const { isSuccess } = useQuery("validateToken", validateAuthToken, {
    retry: false,
  });

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: isSuccess,
        showToast: (message, type = "SUCCESS") => setToast({ message, type }),
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
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
};
