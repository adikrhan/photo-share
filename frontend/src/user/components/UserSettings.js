import { Fragment, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useForm from "../../shared/hooks/useForm";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";
import Input from "../../shared/components/UI/Input";
import Button from "../../shared/components/UI/Button";
import userIcon from "../../assets/user.png";
import classes from "./UserSettings.module.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import Loader from "../../shared/components/UI/Loader";
import useToast from "../../shared/hooks/useToast";

const UserSettings = () => {
  const queryClient = useQueryClient();
  const uploadUrl = "https://api.cloudinary.com/v1_1/dau7fdnej/upload";
  const authCtx = useContext(AuthContext);
  const [notify] = useToast();
  const [changingProfileImg, setChangingProfileImg] = useState(false);

  const inputs = {
    name: {
      value: "",
      isValid: false,
    },
    email: {
      value: "",
      isValid: false,
    },
    dob: {
      value: "",
      isValid: false,
    },
    city: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,
    },
    camera: {
      value: "",
      isValid: false,
    },
    lens: {
      value: "",
      isValid: false,
    },
    software: {
      value: "",
      isValid: false,
    },
  };

  const [formState, inputHandler, setFormData] = useForm(inputs, false);
  const { uid } = useParams();

  const userQuery = useQuery(
    ["users", uid],
    async () => {
      return fetch(`http://localhost:3001/api/users/${uid.toString()}`).then(
        (res) => res.json()
      );
    },
    {
      onSuccess: (data) => {
        setFormData(
          {
            name: {
              value: data.name,
              isValid: data.name ? true : false,
            },
            email: {
              value: data.email,
              isValid: data.email ? true : false,
            },
            dob: {
              value: data.dateOfBirth,
              isValid: true,
            },
            city: {
              value: data.city,
              isValid: true,
            },
            description: {
              value: data.description,
              isValid: true,
            },
            camera: {
              value: data.uses.camera,
              isValid: true,
            },
            lens: {
              value: data.uses.lens,
              isValid: true,
            },
            software: {
              value: data.uses.editingSoftware,
              isValid: true,
            },
          },
          true
        );
      },
      onError: (error) => {
        notify(error.message, "error");
      },
    }
  );

  const user = userQuery.data;

  const updateUserHandler = async () => {
    const userData = {
      image: user.image,
      name: formState.inputs.name.value,
      email: formState.inputs.email.value,
      dateOfBirth: formState.inputs.dob.value,
      city: formState.inputs.city.value,
      description: formState.inputs.description.value,
      camera: formState.inputs.camera.value,
      lens: formState.inputs.lens.value,
      software: formState.inputs.software.value,
    };

    return fetch(`http://localhost:3001/api/users/${uid}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authCtx.loggedInUser.token}`,
      },
    }).then((res) => res.json());
  };

  const updateUser = useMutation(updateUserHandler, {
    onSuccess: (data) => {
      notify("Changes saved", "success");
      if (authCtx.loggedInUser.image !== data.image) {
        authCtx.setProfileImage(data.image);
      }
    },
    onError: (error) => {
      notify("Could not save, please try again later", "error");
    },
  });

  const changeImgClickHandler = (event) => {
    let input = document.getElementById("profilePic");
    input.click();
  };

  const chooseImgClickHandler = async (event) => {
    setChangingProfileImg(true);
    const files = document.querySelector("[type=file]").files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.url) {
          setChangingProfileImg(false);
          let imgElmt = document.getElementById("profile-img");
          imgElmt.src = result.url;
        }
      } catch (error) {
        console.log(error);
        notify(
          "Could not change profile image, please try again later",
          "error"
        );
      }
    }
  };

  return (
    <div className={classes.container}>
      <h2>Settings{userQuery.isLoading && <Loader />}</h2>
      {!userQuery.isLoading && user && (
        <Fragment>
          <div className={classes["settings-general"]}>
            <div className={classes["settings-general-head"]}>
              <h3>General</h3>
            </div>
            <div className={classes["profile-pic"]}>
              <div className={classes["profile-pic-text"]}>
                <span>
                  <strong>Profile picture</strong>
                </span>
                <input
                  type="file"
                  name="profilePic"
                  id="profilePic"
                  style={{
                    visibility: "hidden",
                    height: "0",
                    width: "0",
                    padding: 0,
                  }}
                  onChange={chooseImgClickHandler}
                />
                <button
                  id="change-btn"
                  className={classes["change-btn"]}
                  onClick={changeImgClickHandler}
                >
                  {changingProfileImg ? <Loader /> : 'Change'}
                </button>
              </div>
              <div className={classes["profile-pic-img"]}>
                <img id="profile-img" src={user.image || userIcon} alt="" />
              </div>
            </div>

            <form className={classes["settings-general-form"]}>
              <Input
                type="text"
                id="name"
                name="name"
                initialValue={user.name}
                label="Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name"
                onInput={inputHandler}
                initialIsValid={true}
              />
              <Input
                type="text"
                id="email"
                name="email"
                initialValue={user.email}
                label="Email"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email"
                onInput={inputHandler}
                initialIsValid={true}
              />
              <Input
                type="date"
                id="dob"
                name="dob"
                initialValue={user.dateOfBirth}
                label="Date of birth"
                validators={[]}
                onInput={inputHandler}
                initialIsValid={true}
              />
              <Input
                type="text"
                id="city"
                name="city"
                initialValue={user.city}
                label="City"
                validators={[]}
                onInput={inputHandler}
                initialIsValid={true}
              />
              <Input
                id="description"
                name="description"
                label="Tell us a bit about yourself"
                initialValue={user.description}
                element="textarea"
                rows="10"
                validators={[VALIDATOR_MAXLENGTH(500)]}
                errorText="You have entered too many characters."
                onInput={inputHandler}
                initialIsValid={true}
              />
            </form>
          </div>
          <div className={classes["settings-uses"]}>
            <div className={classes["settings-uses-head"]}>
              <h3>Uses</h3>
            </div>

            <form className={classes["settings-uses-form"]}>
              <Input
                type="text"
                id="camera"
                name="camera"
                initialValue={user.uses.camera}
                label="Camera"
                validators={[]}
                onInput={inputHandler}
                initialIsValid={true}
              />
              <Input
                type="text"
                id="lens"
                name="lens"
                initialValue={user.uses.lens}
                label="Favourite lens"
                validators={[]}
                onInput={inputHandler}
                initialIsValid={true}
              />
              <Input
                type="text"
                id="software"
                name="software"
                initialValue={user.uses.editingSoftware}
                label="Editing software"
                validators={[]}
                onInput={inputHandler}
                initialIsValid={true}
              />
            </form>
          </div>
        </Fragment>
      )}
      {updateUser.isLoading ? (
        <Loader />
      ) : (
        <div className={classes["save-btn"]}>
          <Button
            text="Save"
            type="submit"
            disabled={!formState.isValid}
            onClick={() => updateUser.mutate()}
          />
        </div>
      )}
    </div>
  );
};

export default UserSettings;
