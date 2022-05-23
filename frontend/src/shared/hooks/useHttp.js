import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "./useToast";

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notify] = useToast();
  const navigate = useNavigate();
  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = {},
      notifyMsg = null,
      navigateUrl = null
    ) => {
      setIsLoading(true);

      const httpAbortCtrl = new AbortController();
      activeHttpRequest.current.push(httpAbortCtrl);
      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortCtrl.signal,
        });

        const data = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          notify(data.message, "error");
          throw new Error(data.message);
        }

        if (notifyMsg) notify(notifyMsg, "success");
        setIsLoading(false);
        if(navigateUrl) navigate(navigateUrl);
        return data;
      } catch (error) {
        setError(error);
        notify(error, "error");
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return [isLoading, sendRequest, error, clearError];
};
