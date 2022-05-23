import classes from "./Loader.module.css";
import { FaSpinner } from "react-icons/fa";

const Loader = (props) => {
  return (
      <FaSpinner className={classes.spinner} />
  );
};

export default Loader;
