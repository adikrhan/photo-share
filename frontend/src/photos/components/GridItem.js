import { Fragment, useState, useContext } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { useQueryClient, useMutation } from "react-query";

import useCloudinary from "../../shared/hooks/useCloudinary";
import Backdrop from "../../shared/components/UI/Backdrop";
import classes from "./GridItem.module.css";
import PhotoModal from "./PhotoModal";
import Map from "../../shared/components/Map";
import useFetchWithError from "../../shared/hooks/useFetchWithError";
import { AuthContext } from "../../shared/context/auth-context";
import useToast from "../../shared/hooks/useToast";

const GridItem = (props) => {
  const authCtx = useContext(AuthContext);
  const [photoId, setPhotoId] = useState();
  const [showMap, setShowMap] = useState(false);
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

  const clickMapHandler = () => {
    setShowMap((prevState) => {
      return !prevState;
    });
  };

  const deletePhotoHandler = () => {
    return fetch(`http://localhost:3001/api/photos/${props.photo.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.loggedInUser.token}`,
      },
    }).then((res) => res.json());
  };

  const deletePhoto = useMutation(deletePhotoHandler, { 
    onSuccess: (data) => {
      notify('Photo deleted succesfully', 'success');
      queryClient.refetchQueries(["photos", {}], { exact: true });
    },
  });

  return (
    <Fragment>
      {photoId && <Backdrop onClickBackdrop={clickImageHandler} />}
      {photoId && (
        <PhotoModal photoId={photoId} onClickImage={clickImageHandler} onDeletePhoto={deletePhoto} />
      )}

      <div
        className={classes["grid-item"]}
        onClick={clickImageHandler}
        // onMouseEnter={() => {
        //   queryClient.prefetchQuery(["photos", props.photo.id], () =>
        //     fetchWithError(`http://localhost:3001/api/photos/${props.photo.id}`)
        //   );
        // }}
      >
        <div className={classes["item-img"]}>
          <AdvancedImage
            cldImg={getCloudinaryImage(props.photo, { width: 800 })}
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
