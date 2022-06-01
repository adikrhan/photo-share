import { useState, useContext, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import { AdvancedImage } from "@cloudinary/react";

import useCloudinary from "../../shared/hooks/useCloudinary";
import PhotoModal from "../../photos/components/PhotoModal";
import Backdrop from "../../shared/components/UI/Backdrop";
import profileImg from "../../assets/profile-user.png";
import camera from "../../assets/camera.png";
import diaphragm from "../../assets/diaphragm.png";
import editing from "../../assets/edit.png";
import { FaUserCog } from "react-icons/fa";
import classes from "./UserDetail.module.css";
import Loader from "../../shared/components/UI/Loader";
import useToast from "../../shared/hooks/useToast";

const UserDetail = () => {
  const queryClient = useQueryClient();
  const authCtx = useContext(AuthContext);
  const [photoId, setPhotoId] = useState(null);
  const { uid } = useParams();
  const [notify] = useToast();
  const [getCloudinaryImage] = useCloudinary();

  const userQuery = useQuery(
    ["users", uid],
    async () => {
      return fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/users/${uid.toString()}`).then(
        (res) => res.json()
      );
    },
    {
      onError: (error) => {
        notify("Could not load user", "error");
      },
    }
  );

  const user = userQuery.data;

  const clickImageHandler = (photo) => {
    if (!photoId) {
      setPhotoId(photo.id);
    } else {
      setPhotoId(null);
    }
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const deletePhotoHandler = () => {
    return fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/api/photos/${photoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.loggedInUser.token}`,
      },
    }).then((res) => res.json());
  };

  const deletePhoto = useMutation(deletePhotoHandler, {
    onSuccess: (data) => {
      notify("Photo deleted succesfully", "success");
      queryClient.refetchQueries(["users", uid], { exact: true });
      clickImageHandler();
    },
    onError: (error) => {
      notify('Could not delete photo, please try again later', 'error');
    }
  });

  return (
    <Fragment>
      {photoId && <Backdrop onClickBackdrop={clickImageHandler} />}
      {photoId && (
        <PhotoModal
          photoId={photoId}
          onClickImage={clickImageHandler}
          onDeletePhoto={deletePhoto}
        />
      )}
      {userQuery.isLoading ? (
        <Loader />
      ) : (
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes["img-container"]}>
              <img src={user.image || profileImg} alt="User" />
            </div>
            <div className={classes["user-info"]}>
              <h2>{user.name}</h2>
              <div className={classes["user-info-small"]}>
                <span>
                  {user.dateOfBirth
                    ? calculateAge(user.dateOfBirth) + " years old"
                    : ""}{" "}
                </span>
                {user.dateOfBirth && "|"}
                <span>{user.city ? user.city : ""}</span>
              </div>
            </div>
            {authCtx.isLoggedIn && authCtx.loggedInUser.userId === uid && (
              <div className={classes.settings}>
                <Link to={`/admin/${authCtx.loggedInUser.userId}/settings`}>
                  <FaUserCog />
                </Link>
              </div>
            )}
          </div>
          <div className={classes["left-col"]}>
            <div className={classes["who"]}>
              <h3>Who am I?</h3>
              <p>{user.description || "No description yet"}</p>
            </div>
            <div className={classes.use}>
              <h3>I use</h3>
              {!user.uses.camera &&
                !user.uses.lens &&
                !user.uses.editingSoftware && (
                  <p>User hasn't entered any data yet.</p>
                )}
              {user.uses.camera && (
                <div className={classes.item}>
                  <div className={classes["item-header"]}>
                    <img src={camera} alt="" />
                    <span>Cameras</span>
                  </div>
                  <ul>
                    <li>{user.uses.camera}</li>
                  </ul>
                </div>
              )}
              {user.uses.lens && (
                <div className={classes.item}>
                  <div className={classes["item-header"]}>
                    <img src={diaphragm} alt="" />
                    <span>Lenses</span>
                  </div>
                  <ul>
                    <li>{user.uses.lens}</li>
                  </ul>
                </div>
              )}
              {user.uses.editingSoftware && (
                <div className={classes.item}>
                  <div className={classes["item-header"]}>
                    <img src={editing} alt="" />
                    <span>Editing software</span>
                  </div>
                  <ul>
                    <li>{user.uses.editingSoftware}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className={classes["right-col"]}>
            <h3>Photos</h3>
            {user.photos.length === 0 && <p>No photos yet.</p>}
            {user.photos.length > 0 && (
              <div className={classes.grid}>
                {user.photos.map((photo, index) => {
                  return (
                    <div
                      key={index}
                      className={classes["grid-item"]}
                      onClick={() => clickImageHandler(photo)}
                    >
                      <AdvancedImage cldImg={getCloudinaryImage(photo)} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserDetail;
