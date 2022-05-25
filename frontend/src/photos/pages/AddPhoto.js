import { useMutation, useQuery, useQueryClient } from "react-query";
import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useForm from "../../shared/hooks/useForm";
import useWindowSize from "../../shared/hooks/useWindowSize";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/UI/Input";
import Button from "../../shared/components/UI/Button";
import classes from "./AddPhoto.module.css";
import { AuthContext } from "../../shared/context/auth-context";
import Loader from "../../shared/components/UI/Loader";

import Chip from "@mui/material/Chip";
import useToast from "../../shared/hooks/useToast";
import useFetchWithError from "../../shared/hooks/useFetchWithError";

const AddPhoto = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const authCtx = useContext(AuthContext);
  const screenSize = useWindowSize();
  const tagInputRef = useRef();
  const [tags, setTags] = useState([]);
  const [notify] = useToast();

  const inputs = {
    title: {
      value: "",
      isValid: false,
    },
    camera: {
      value: "",
      isValid: true,
    },
    lens: {
      value: "",
      isValid: true,
    },
    location: {
      value: "",
      isValid: true,
    },
    date: {
      value: "",
      isValid: true,
    },
    tags: {
      value: "",
      isValid: true,
    },
    fileInput: {
      value: "",
      isValid: false,
    },
  };

  const [formState, inputHandler, setFormData, previewSrc] = useForm(
    inputs,
    false
  );

  const onChoosePhoto = () => {
    let fileInputElmt = document.getElementById("fileInput");
    fileInputElmt.click();
  };

  const deleteChipHandler = (chipId) => {
    const filteredTags = [...tags].filter((tag) => tag.id !== chipId);
    setTags(filteredTags);
  };

  const fetchWithError = useFetchWithError();

  const addPhotoHandler = async () => {
    const tagList = tags.map((tag) => tag.value);

    const photoData = {
      title: formState.inputs.title.value,
      camera: formState.inputs.camera.value,
      lens: formState.inputs.lens.value,
      location: formState.inputs.location.value,
      date: formState.inputs.date.value,
      tags: tagList,
      image: previewSrc,
      creator: authCtx.loggedInUser.userId,
    };

    return fetchWithError("http://localhost:3001/api/photos", {
      method: "POST",
      body: JSON.stringify(photoData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.loggedInUser.token}`,
      },
    });
  };

  const addPhoto = useMutation(addPhotoHandler, {
    onSuccess: (data) => {
      notify("Photo successfully added", "success");
      queryClient.setQueryData(["photos", {}], (oldData) => {
        const newPhoto = {
          creator: {
            id: authCtx.loggedInUser.userId,
            name: authCtx.loggedInUser.name,
          },
          id: data.id,
          publicId: data.publicId,
          title: data.title,
        };
        return [newPhoto, ...oldData];
      });
      queryClient.invalidateQueries(["photos", {}]);
      navigate('/');
    },
    onError: (error) => {
      notify(`Could not add photo: ${error.message}`, "error");
    },
  });

  const onKeyDown = (event) => {
    if (event.keyCode !== 13) return;
    setTags((prevState) => {
      return [
        ...prevState,
        { value: event.target.value, id: prevState.length },
      ];
    });
  };

  useEffect(() => {
    tagInputRef.current.value = "";
  }, [tags]);

  return (
    <div className={classes.container}>
      <h2>Add photo</h2>

      <form className={classes["add-place-form"]}>
        <Input
          type="text"
          name="title"
          id="title"
          label="Title*"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a title"
          initialIsValid={formState.inputs.title.isValid}
          initialValue={formState.inputs.title.value}
        />
        <Input
          type="text"
          name="camera"
          id="camera"
          label="Camera"
          validators={[]}
          onInput={inputHandler}
          initialIsValid={formState.inputs.camera.isValid}
          initialValue={formState.inputs.camera.value}
        />
        <Input
          type="text"
          name="lens"
          id="lens"
          label="Lens"
          validators={[]}
          onInput={inputHandler}
          initialIsValid={formState.inputs.lens.isValid}
          initialValue={formState.inputs.lens.value}
        />
        <Input
          type="text"
          name="location"
          id="location"
          label="Location"
          validators={[]}
          onInput={inputHandler}
          initialIsValid={formState.inputs.location.isValid}
          initialValue={formState.inputs.location.value}
        />
        <Input
          type="date"
          name="date"
          id="date"
          label="Date"
          validators={[]}
          onInput={inputHandler}
          initialIsValid={formState.inputs.date.isValid}
          initialValue={formState.inputs.date.value}
        />
        <Input
          type="text"
          name="tags"
          id="tags"
          label="Tags"
          validators={[]}
          onInput={inputHandler}
          onKeyDown={onKeyDown}
          ref={tagInputRef}
          initialIsValid={formState.inputs.tags.isValid}
        />
        {tags.length > 0 && (
          <div className={classes["tag-container"]}>
            {tags.map((tag) => {
              return (
                <Chip
                  key={tag.id}
                  label={tag.value}
                  onDelete={() => deleteChipHandler(tag.id)}
                  className={classes.chip}
                />
              );
            })}
          </div>
        )}

        <Input
          type="file"
          name="fileInput"
          id="fileInput"
          label="Add photo (max 10 mb)*"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please choose a photo"
          initialIsValid={false}
          style={{ visibility: "hidden", height: "0" }}
        />
        <div className={classes["import-file-container"]}>
          {!previewSrc && (
            <div className={classes["chooser"]}>
              {screenSize > 700 && (
                <p>
                  Drag and drop a file <br></br> or{" "}
                </p>
              )}
              <button type="button" onClick={onChoosePhoto}>
                Choose photo
              </button>
            </div>
          )}

          {previewSrc && (
            <div className={classes["img-preview-container"]}>
              <img src={previewSrc} alt="" />
              <span onClick={onChoosePhoto}>Change</span>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          {addPhoto.isLoading && <Loader />}
          {!addPhoto.isLoading && (
            <Button
              text="Upload"
              type="button"
              disabled={!formState.isValid}
              onClick={() => addPhoto.mutate()}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default AddPhoto;
