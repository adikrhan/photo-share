import { useState, useEffect, useCallback } from "react";

let logoutTimer;

const useAuth = () => {
  const [tokenExpDate, setTokenExpDate] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState({});

  const login = useCallback(async (userData, expDate = null) => {
    const tokenExpDate =
      expDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setIsLoggedIn(true);
    setLoggedInUser({
      name: userData.name,
      userId: userData.userId,
      image: userData.image || "",
      token: userData.token,
    });
    setTokenExpDate(tokenExpDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        name: userData.name,
        userId: userData.userId,
        image: userData.image,
        token: userData.token,
        expDate: tokenExpDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("userData");
  }, []);

  const setProfileImage = useCallback((img) => {
    setLoggedInUser((prevState) => {
      return { ...prevState, image: img };
    });
  });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData && storedData.token) {
      if (new Date(storedData.expDate) > new Date()) {
        login(
          {
            name: storedData.name,
            userId: storedData.userId,
            image: storedData.image,
            token: storedData.token,
          },
          new Date(storedData.expDate)
        );
      } else {
        localStorage.removeItem("userData");
      }
    }
  }, [login]);

  useEffect(() => {
    if (loggedInUser && loggedInUser.token && tokenExpDate) {
      logoutTimer = setTimeout(
        logout,
        tokenExpDate.getTime() - new Date().getTime()
      );
    } else {
      clearTimeout(logoutTimer);
    }

    return () => {
      clearTimeout(logoutTimer);
    };
  }, [loggedInUser, logout, tokenExpDate]);

  return {isLoggedIn, loggedInUser, login, logout, setProfileImage};
};

export default useAuth;
