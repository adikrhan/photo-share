import classes from "./Button.module.css";

const Button = (props) => {
  return (
    <button
      className={classes.btn}
      type={props.type || "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      style={props.style}
    >
      {props.text}
    </button>
  );
};

export default Button;
