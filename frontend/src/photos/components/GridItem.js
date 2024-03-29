import { Fragment, useState, useContext } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { useQueryClient, useMutation } from "react-query";

import useCloudinary from "../../shared/hooks/useCloudinary";
import Backdrop from "../../shared/components/UI/Backdrop";
import classes from "./GridItem.module.css";
import PhotoModal from "./PhotoModal";
import useFetchWithError from "../../shared/hooks/useFetchWithError";
import { AuthContext } from "../../shared/context/auth-context";
import useToast from "../../shared/hooks/useToast";

const GridItem = (props) => {
  const authCtx = useContext(AuthContext);
  const [photoId, setPhotoId] = useState();
  const [getCloudinaryImage] = useCloudinary();
  const queryClient = useQueryClient();
  const [notify] = useToast();

  const fetchWithError = useFetchWithError();

  const clickImageHandler = () => {
    if (!photoId) {
      setPhotoId(props.photo.id);
    } else {
      setPhotoId(null);
    }
  };

  const deletePhotoHandler = () => {
    return fetchWithError(
      `${process.env.REACT_APP_SERVER_BASE_URL}/api/photos/${props.photo.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.loggedInUser.token}`,
        },
      }
    );
  };

  const deletePhoto = useMutation(deletePhotoHandler, {
    onSuccess: (data) => {
      notify("Photo deleted", "success");
      queryClient.refetchQueries(["photos", {}], { exact: true });
    },
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

      <div className={classes["grid-item"]} onClick={clickImageHandler}>
        <div className={classes["item-img"]}>
          <AdvancedImage
            cldImg={getCloudinaryImage(props.photo, { width: 500 })}
          />
        </div>
        <div className={classes["item-text"]}>
          <h3>{props.photo.title}</h3>
          <span>by {props.photo.creator.name}</span>
        </div>
      </div>
    </Fragment>
  );
};

export default GridItem;
