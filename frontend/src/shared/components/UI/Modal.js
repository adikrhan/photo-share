import ReactDOM from "react-dom";

import classes from "./Modal.module.css";

const Modal = (props) => {
  const content = <div className={classes.modal}>{props.children}</div>;

  return ReactDOM.createPortal(content, document.getElementById("modal"));
};

export default Modal;
