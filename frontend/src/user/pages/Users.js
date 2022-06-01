import { useNavigate } from "react-router-dom";
import classes from "./Users.module.css";
import UserList from "../components/UserList";
import Loader from "../../shared/components/UI/Loader";
import UsersHeader from "../components/UsersHeader";

import { useQuery } from "react-query";
import useFetchWithError from "../../shared/hooks/useFetchWithError";
import useToast from "../../shared/hooks/useToast";

const Users = () => {
  const navigate = useNavigate();
  const [notify] = useToast();
  const fetchWithError = useFetchWithError();

  const usersQuery = useQuery(
    ["users"],
    ({ signal }) =>
      fetchWithError(`${process.env.REACT_APP_SERVER_BASE_URL}/api/users`, { signal }),
    {
      onError: (error) => {
        notify(error.message, "error");
      },
      staleTime: 1000 * 60 * 5,
    }
  );

  const userInfoClickHandler = (uid) => {
    navigate(`/users/${uid}`);
  };

  return (
    <div className={classes.container}>
      <UsersHeader />
      {usersQuery.isLoading && (
        <Loader width={150} className={classes.loading} />
      )}
      {usersQuery.data && (
        <UserList
          onUserInfoClick={userInfoClickHandler}
          users={usersQuery.data}
        />
      )}
    </div>
  );
};

export default Users;
