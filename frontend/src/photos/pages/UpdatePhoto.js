import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Chip from "@mui/material/Chip";

import useForm from "../../shared/hooks/useForm";
import { useHttp } from "../../shared/hooks/useHttp";
import { VALIDATOR_REQUIRE } from "../../shared/util/validators";
import Input from "../../shared/components/UI/Input";
import Button from "../../shared/components/UI/Button";
import { AuthContext } from "../../shared/context/auth-context";
import Loader from "../../shared/components/UI/Loader";
import classes from "./UpdatePhoto.module.css";

const AddPhoto = () => {
  const [currentPhoto, setCurrentPhoto] = useState();
  const [isLoading, sendRequest] = useHttp();
  const authCtx = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const tagInputRef = useRef();
  const { pid } = useParams();

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
  };

  const [formState, inputHandler, setFormData, previewSrc] = useForm(
    inputs,
    false
  );

  useEffect(() => {
    const fetchPhoto = async () => {
      console.log("fetchPhoto", pid);
      try {
        const data = await sendRequest(
          `http://localhost:3001/api/photos/${pid}`
        );
        if (data.photo) {
          setCurrentPhoto(data.photo);
          const tagPairs = data.photo.tags.map((tag, index) => ({
            value: tag,
            id: index,
          }));
          setTags(tagPairs);
          setFormData(
            {
              title: {
                value: data.photo.title,
                isValid: true,
              },
              camera: {
                value: data.photo.camera,
                isValid: true,
              },
              lens: {
                value: data.photo.lens,
                isValid: true,
              },
              location: {
                value: data.photo.location,
                isValid: true,
              },
              date: {
                value: data.photo.date,
                isValid: true,
              },
              tags: {
                value: "",
                isValid: true,
              },
            },
            true
          );
        }
      } catch (error) {}
    };
    fetchPhoto();
  }, [sendRequest]);

  useEffect(() => {
    if (tagInputRef && tagInputRef.current) {
      tagInputRef.current.value = "";
    }
  }, [tags]);

  const onUpdatePhoto = async (event) => {
    const tagList = tags.map((tag) => tag.value);

    const photoData = {
      title: formState.inputs.title.value,
      camera: formState.inputs.camera.value,
      lens: formState.inputs.lens.value,
      location: formState.inputs.location.value,
      date: formState.inputs.date.value,
      tags: tagList,
    };

    try {
      const data = await sendRequest(
        `http://localhost:3001/api/photos/${pid}`,
        "PATCH",
        JSON.stringify(photoData),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authCtx.loggedInUser.token}`,
        },
        "Photo updated successfully",
        "/"
      );
    } catch (error) {}
  };

  const onKeyDown = (event) => {
    if (event.keyCode !== 13) return;
    setTags((prevState) => {
      return [
        ...prevState,
        { value: event.target.value, id: prevState.length },
      ];
    });
  };

  const deleteChipHandler = (chipId) => {
    const filteredTags = [...tags].filter((tag) => tag.id !== chipId);
    setTags(filteredTags);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.container}>
      <h2>{pid ? "Edit" : "Add"} photo</h2>
      {!isLoading && currentPhoto && (
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
            initialIsValid={formState.inputs.date.isValid}
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
          {isLoading && <Loader width="3rem" />}
          {!isLoading && (
            <Button
              text="Save"
              type="button"
              disabled={!formState.isValid}
              onClick={onUpdatePhoto}
              style={{ marginBottom: "4rem" }}
            />
          )}
        </form>
      )}
    </div>
  );
};

export default AddPhoto;
