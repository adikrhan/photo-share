import ReactDOM from "react-dom";
import { useContext, useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "react-query";

import { AuthContext } from "../../shared/context/auth-context";
import userIcon from "../../assets/user.png";
import {
  FaHeart,
  FaUserCircle,
  FaChevronLeft,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdCameraAlt, MdCamera, MdPlace } from "react-icons/md";
import { BsFillTagFill } from "react-icons/bs";
import classes from "./PhotoModal.module.css";
import useFetchWithError from "../../shared/hooks/useFetchWithError";
import Loader from "../../shared/components/UI/Loader";
import Map from "./Map";

const PhotoModal = ({ photoId, onClickImage, onDeletePhoto }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showLikedUsers, setShowLikedUsers] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [hasLiked, setHasLiked] = useState();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const fetchWithError = useFetchWithError();

  const photoQuery = useQuery(
    ["photos", photoId],
    ({ signal }) =>
      fetchWithError(
        `${process.env.REACT_APP_SERVER_BASE_URL}/api/photos/${photoId}`,
        {
          signal,
        }
      ),
    {
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const photo = photoQuery.data;
  const creator = photoQuery.data?.creator;

  const onEditPhoto = () => {
    navigate(`/admin/edit/${photoQuery.data?.id}`);
  };

  const deleteClickHandler = () => {
    setShowConfirmDelete((prevState) => {
      return !prevState;
    });
  };

  const likePhotoHandler = async () => {
    let body = { uid: authCtx.loggedInUser.userId };
    hasLiked ? (body.action = "unlike") : (body.action = "like");
    return fetch(
      `${process.env.REACT_APP_SERVER_BASE_URL}/api/photos/like/${photoQuery.data?.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }
    ).then((res) => res.json());
  };

  const likePhoto = useMutation(likePhotoHandler, {
    onSuccess: (data) => {
      queryClient.setQueryData(["photos", photoId], (oldData) => {
        const like = data.likes
          .map((user) => user.id)
          .includes(authCtx.loggedInUser.userId);
        like ? setHasLiked(true) : setHasLiked(false);
        if (like) {
          oldData.likes.push({
            id: authCtx.loggedInUser.userId,
            image: authCtx.loggedInUser.image,
            name: authCtx.loggedInUser.name,
          });
        } else {
          const index = oldData.likes.findIndex(
            (like) => like.id === authCtx.loggedInUser.userId
          );
          if (index !== -1) {
            oldData.likes.splice(index, 1);
          }
        }
        return oldData;
      });
    },
  });

  useEffect(() => {
    if (photo) {
      photo.likes.map((user) => user.id).includes(authCtx.loggedInUser.userId)
        ? setHasLiked(true)
        : setHasLiked(false);
    }
  }, []);

  const authCtx = useContext(AuthContext);

  const userInfoClickHandler = (uid) => {
    navigate(`/users/${uid}`, { replace: true });
    onClickImage();
  };

  const onListUsersLiked = () => {
    setShowLikedUsers((prevState) => {
      return !prevState;
    });
  };

  const confirmDelete = (
    <div className={classes["confirm-container"]}>
      <p>Are you sure you want to delete this photo?</p>
      <div className={classes["confirm-btns"]}>
        {onDeletePhoto.isLoading ? (
          <Loader />
        ) : (
          <Fragment>
            <button
              type="button"
              className={classes.yes}
              onClick={() => onDeletePhoto.mutate()}
            >
              Yes
            </button>
            <button
              type="button"
              className={classes.cancel}
              onClick={deleteClickHandler}
            >
              Cancel
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );

  const likesList = (
    <div className={classes["likes-container"]}>
      <span className={classes.back} onClick={onListUsersLiked}>
        <FaChevronLeft /> Back
      </span>
      <ul className={classes["likes-list"]}>
        {photo?.likes.map((user) => {
          return (
            <li onClick={() => userInfoClickHandler(user.id)} key={user.id}>
              <div className={classes["user-thumbnail"]}>
                <img src={user.image || userIcon} alt="User" />
              </div>
              <div className={classes["user-info"]}>
                <span className={classes.username}>{user.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const content = (
    <div className={classes.container}>
      {photoQuery.isLoading ? (
        <Loader />
      ) : (
        photo && (
          <Fragment>
            {!mapView ? (
              <div className={classes["img-container"]}>
                <img src={photo.image} alt="Text" onClick={onClickImage} />
              </div>
            ) : (
              <Map location={photo.coordinates} zoomLevel={14} />
            )}
            <div className={classes["meta-container"]}>
              {showLikedUsers && likesList}
              {!showLikedUsers && (
                <Fragment>
                  <div className={classes.user}>
                    <div className={classes["profile-img-container"]}>
                      {!creator.image && <FaUserCircle />}
                      {creator.image && <img src={creator.image} alt="User" />}
                    </div>
                    <span onClick={() => userInfoClickHandler(creator.id)}>
                      {creator.name}
                    </span>
                  </div>
                  <div className={classes.head}>
                    <h3>{photo.title}</h3>
                    {photo.likes.length > 0 && (
                      <span onClick={onListUsersLiked}>
                        {photo.likes.length} likes
                      </span>
                    )}
                  </div>
                  <div className={classes.list}>
                    <ul>
                      {photo.camera && (
                        <li>
                          <MdCameraAlt />
                          <span>{photo.camera}</span>
                        </li>
                      )}
                      {photo.lens && (
                        <li>
                          <MdCamera />
                          <span>{photo.lens}</span>
                        </li>
                      )}
                      {photo.location && (
                        <li>
                          <MdPlace />
                          <span>{photo.location}</span>
                        </li>
                      )}
                      {photo.date && (
                        <li>
                          <FaCalendarAlt />
                          <span>{photo.date}</span>
                        </li>
                      )}
                      {photo.tags.length > 0 && (
                        <li>
                          <BsFillTagFill />
                          <span>{photo.tags.join(", ")}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className={classes.buttons}>
                    {!mapView && photo.coordinates ? (
                      <button
                        onClick={() => setMapView(true)}
                        className={`${classes.btn} ${classes.map}`}
                      >
                        View on map
                      </button>
                    ) : mapView && photo.coordinates ? (
                      <button
                        onClick={() => setMapView(false)}
                        className={`${classes.btn} ${classes["back-to-photo"]}`}
                      >
                        Back
                      </button>
                    ) : (
                      ""
                    )}
                    {authCtx.isLoggedIn &&
                      authCtx.loggedInUser.userId !== creator.id && (
                        <button
                          className={`${classes.btn}  ${
                            !hasLiked ? classes.like : classes["has-liked"]
                          } `}
                          onClick={() => {
                            if (likePhoto.isLoading) return;
                            likePhoto.mutate();
                          }}
                        >
                          <FaHeart />
                        </button>
                      )}
                    {authCtx.isLoggedIn &&
                      authCtx.loggedInUser.userId === creator.id && (
                        <div className={classes.options}>
                          <span onClick={onEditPhoto}>Edit</span>
                          <span onClick={deleteClickHandler}>Delete</span>
                        </div>
                      )}
                  </div>
                  {showConfirmDelete && confirmDelete}
                </Fragment>
              )}
            </div>
          </Fragment>
        )
      )}
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById("modal"));
};

export default PhotoModal;
