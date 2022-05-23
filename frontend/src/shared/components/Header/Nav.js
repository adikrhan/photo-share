import { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import classes from "./Nav.module.css";

const Nav = (props) => {
  const authCtx = useContext(AuthContext);

  return (
    <div className={classes.nav}>
      <ul className={classes["nav-list"]}>
        <NavLink to="/photos" onClick={props.navLinkClickHandler}>
          <li>Photos</li>
        </NavLink>
        <NavLink to="/users" onClick={props.navLinkClickHandler}>
          <li>Users</li>
        </NavLink>
        {authCtx.isLoggedIn && (
          <NavLink to="/admin/add" onClick={props.navLinkClickHandler}>
            <li>Add photo</li>
          </NavLink>
        )}
      </ul>
    </div>
  );
};

export default Nav;
