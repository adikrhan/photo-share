import classes from "./UserList.module.css";
import userIcon from "../../assets/user.png";

const UserList = (props) => {
  const { users, onUserInfoClick } = props;

  return (
    <div className={classes.container}>
      <div className={classes["list-container"]}>
        <ul className={classes["user-list"]}>
          {users.map((user) => {
            return (
              <li onClick={() => onUserInfoClick(user.id)} key={user.id}>
                <div className={classes["user-thumbnail"]}>
                  <img src={user.image || userIcon} alt="User" />
                </div>
                <div className={classes["user-info"]}>
                  <span className={classes.username}>{user.name}</span>
                  <span className={classes.number}>
                    {user.photos.length} photos
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
