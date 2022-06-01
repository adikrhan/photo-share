import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, Fragment } from "react";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';

import { AuthContext } from "./shared/context/auth-context";
import useAuth from "./shared/hooks/useAuth";
import Landing from "./landing/Landing";
import Header from "./shared/components/Header/Header";
import Signup from "./user/pages/Signup";
import Users from "./user/pages/Users";
import classes from "./App.module.css";
import UserSettings from "./user/components/UserSettings";
import Photos from "./photos/pages/Photos";
import User from "./user/pages/User";
import AddPhoto from "./photos/pages/AddPhoto";
import UpdatePhoto from "./photos/pages/UpdatePhoto";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    }
  }
});

const App = () => {
  const authCtx = useContext(AuthContext);

  const { isLoggedIn, loggedInUser, login, logout, setProfileImage } =
    useAuth();

  let routes;

  if (isLoggedIn || authCtx.isLoggedIn) {
    routes = (
      <Fragment>
        <Route path="/" element={<Photos />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:uid" element={<User />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/photos/search/:searchTerm" element={<Photos />} />
        <Route path="/admin/:uid/settings" element={<UserSettings />} />
        <Route path="/admin/add" element={<AddPhoto />} />
        <Route path="/admin/edit/:pid" element={<UpdatePhoto />} />
        <Route path="/photos/:uid" element={<Photos />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Fragment>
    );
  } else {
    routes = (
      <Fragment>
        <Route path="/" element={<Landing />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:uid" element={<User />} />
        <Route path="/photos/search/:searchTerm" element={<Photos />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/photos/:uid" element={<Photos />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loggedInUser, login, logout, setProfileImage }}
    >
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <Header />
          <main className={classes.main}>
            <Routes>{routes}</Routes>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </main>
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
