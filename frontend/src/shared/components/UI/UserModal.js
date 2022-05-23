import { Link } from "react-router-dom";
import { useContext, useRef, useEffect } from "react";

import { AuthContext } from "../../context/auth-context";
import classes from "./UserModal.module.css";

const UserModal = (props) => {

  const useOutsideClick = (ref) => {
    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          props.onMenuItemClick();
        }
      };
  
      document.addEventListener("mousedown", handleOutsideClick);
  
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [ref]);
  };

  const authCtx = useContext(AuthContext);
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef);

  return (
    <div ref={wrapperRef} className={classes.container}>
      <ul>
        <Link
          to={`/users/${authCtx.loggedInUser.userId}`}
          onClick={props.onMenuItemClick}
        >
          <li>My profile</li>
        </Link>
        <Link
          to={`/admin/${authCtx.loggedInUser.userId}/settings`}
          onClick={props.onMenuItemClick}
        >
          <li>Settings</li>
        </Link>
        <li onClick={props.onLogoutClick}>Logout</li>
      </ul>
    </div>
  );
};

export default UserModal;
