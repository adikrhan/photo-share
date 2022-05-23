import { useParams } from "react-router-dom";

import UserDetail from "../components/UserDetail";
import classes from './User.module.css';

const User = () => {
  let { uid } = useParams();

  return (
    <div className={classes.container}>
      <UserDetail userId={+uid} />
    </div>
  );
};

export default User;
