import { Fragment, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

import { AuthContext } from "../../context/auth-context";
import useWindowSize from "../../hooks/useWindowSize";
import { FaImages, FaBars } from "react-icons/fa";
import userIcon from "../../../assets/user.png";
import Nav from "./Nav";
import LoginModal from "../UI/LoginModal";
import SideDrawer from "./SideDrawer";
import MainHeader from "./MainHeader";
import Backdrop from "../UI/Backdrop";
import UserModal from "../UI/UserModal";
import Input from "../UI/Input";
import classes from "./Header.module.css";

const Header = () => {
  const authCtx = useContext(AuthContext);
  const screenSize = useWindowSize();
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSideDrawer, setShowSideDrawer] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const toggleMenuClickHandler = () => {
    console.log("toggleMenuClickHandler");
    setShowSideDrawer((prevState) => {
      setShowSideDrawer(!prevState);
    });
  };

  const loginClickHandler = () => {
    console.log("loginClickHandler");
    setShowLoginModal((prevState) => {
      return !prevState;
    });
  };

  const userClickHandler = () => {
    setShowUserModal((prevState) => {
      return !prevState;
    });
  };

  const logoutClickHandler = () => {
    authCtx.logout();
    userClickHandler();
    loginClickHandler();
  };

  const inputStyle = {
    borderRadius: "var(--border-radius-xl)",
    height: "3rem",
    display: "block",
    fontSize: "1.2rem",
    width: "90%",
    margin: "0 0 0 auto",
  };

  const getInitials = () => {
    let initials = "";
    if (authCtx.loggedInUser.name) {
      let nameArr = authCtx.loggedInUser.name.split(" ");
      nameArr.forEach((part) => {
        initials = initials + part.substring(0, 1);
      });
    }
    return initials;
  };

  let thumbnail;
  if (authCtx.isLoggedIn && authCtx.loggedInUser.image) {
    thumbnail = (
      <img src={authCtx.loggedInUser.image} alt="" onClick={userClickHandler} />
    );
  } else if (authCtx.isLoggedIn && !authCtx.loggedInUser.image) {
    thumbnail = (
      <button
        className={classes["generic-user-img"]}
        onClick={userClickHandler}
      >
        {getInitials()}
      </button>
    );
  } else {
    thumbnail = <img src={userIcon} alt="" onClick={loginClickHandler} />;
  }

  const onPressKey = async (event) => {
    if (event.keyCode == 13) {
      navigate(`/photos/search/${event.target.value}`);
    }
  };

  return (
    <Fragment>
      {showSideDrawer && <Backdrop onClickBackdrop={toggleMenuClickHandler} />}
      {showSideDrawer && (
        <SideDrawer>
          <Nav
            navLinkClickHandler={toggleMenuClickHandler}
            loginClickHandler={loginClickHandler}
          />
        </SideDrawer>
      )}

      <MainHeader>
        <div className={classes.container}>
          <div className={classes.hamburger} onClick={toggleMenuClickHandler}>
            <FaBars />
          </div>
          <div className={classes["main-nav"]}>
            <Nav
              loginClickHandler={loginClickHandler}
              userClickHandler={userClickHandler}
            />
          </div>
          <div className={classes.logo}>
            <Link to="/" className={classes["logo-link"]}>
              <h1 className={classes["h1-first"]}>photo</h1>
              <h1 className={classes["h1-second"]}>Share</h1>
              <FaImages className={classes.icon} />
            </Link>
          </div>

          <div className={classes["right-col"]}>
            {screenSize > 700 && (
              <div className={classes.search}>
                <Input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Search photos"
                  style={inputStyle}
                  validators={[]}
                  onKeyDown={onPressKey}
                />
              </div>
            )}

            <div className={classes["user-thumbnail"]}>{thumbnail}</div>

            {showUserModal && (
              <UserModal
                onLogoutClick={logoutClickHandler}
                onMenuItemClick={userClickHandler}
              />
            )}
          </div>

          {showLoginModal && !authCtx.isLoggedIn && (
            <Fragment>
              <Backdrop onClickBackdrop={loginClickHandler} />
              <LoginModal />
            </Fragment>
          )}
        </div>
      </MainHeader>
    </Fragment>
  );
};

export default Header;
