import classes from "./Landing.module.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className={classes.landing}>
      <div className={classes["hero-text"]}>
        <h1>Share your images with thousands of other users</h1>
        <div className={classes.buttons}>
          <Link to="signup">
            <button className={classes["signup-btn"]}>Sign up!</button>
          </Link>
          <Link to="photos">
            {" "}
            <button className={classes["browse-btn"]}>Browse</button>
          </Link>
        </div>
      </div>
      <div className={classes.line}>
        <svg
          width="100%"
          viewBox="0 0 1440 69"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1480.5 26.5C1342 96.0001 402.5 -85.0001 -2 65.9999"
            stroke="#166086"
            strokeOpacity="0.7"
            strokeWidth="6"
          />
        </svg>
      </div>
      <div className={classes["hero-images"]}>
        <div className={classes["img-container"]}>
          <img
            src="https://source.unsplash.com/lnIer7ix_0w"
            alt="Hero one"
          />
        </div>
        <div className={classes["img-container"]}>
          <img
            src="https://source.unsplash.com/CbAvGjy4rmE"
            alt="Hero one"
          />
        </div>
        <div className={classes["img-container"]}>
          <img
            src="https://source.unsplash.com/51adhgg5KkE"
            alt="Hero one"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;
