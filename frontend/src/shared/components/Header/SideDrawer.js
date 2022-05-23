import ReactDOM from "react-dom";

import classes from "./SideDrawer.module.css";

const SideDrawer = (props) => {
  const content = <aside className={classes.aside}>{props.children}</aside>;

  return ReactDOM.createPortal(content, document.getElementById('sideDrawer'));
};

export default SideDrawer;
