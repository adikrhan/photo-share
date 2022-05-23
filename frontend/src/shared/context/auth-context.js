import { createContext } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    loggedInUser: {},
    login: () => {},
    logout: () => {},
    setProfileImage: () => {},
})