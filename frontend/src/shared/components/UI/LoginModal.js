import ReactDOM from "react-dom";
import { useContext } from "react";
import { useMutation } from "react-query";

import useForm from "../../hooks/useForm";
import useToast from "../../hooks/useToast";
import { AuthContext } from "../../context/auth-context";
import Input from "../UI/Input";
import classes from "./LoginModal.module.css";
import Button from "./Button";
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from "../../util/validators";
import useFetchWithError from "../../hooks/useFetchWithError";
import Loader from "./Loader";

const LoginModal = () => {
  const authCtx = useContext(AuthContext);
  const [notify] = useToast();
  const fetchWithError = useFetchWithError();

  const inputs = {
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  };

  const [formState, inputHandler] = useForm(inputs, false);

  const loginHandler = () => {
    const userData = {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };

    return fetchWithError("http://localhost:3001/api/users/login", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const login = useMutation(loginHandler, {
    onSuccess: (data) => {
      notify(`Logged in as ${data.name}`, "success");
      authCtx.login({
        name: data.name,
        userId: data.userId,
        image: data.image,
        token: data.token,
      });
    },
    onError: (error) => {
      notify(`Could not login: ${error.message}`, "error");
    },
  });

  const content = (
    <div className={classes["login-modal"]}>
      <h2>Login</h2>
      <form>
        <Input
          type="email"
          id="email"
          name="email"
          label="Email"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email"
          onInput={inputHandler}
        />
        <Input
          type="password"
          id="password"
          name="password"
          label="Password"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a password"
          onInput={inputHandler}
        />
        <div className={classes['btn-container']}>
          {login.isLoading ? (
            <Loader />
          ) : (
            <Button text="Go" onClick={() => login.mutate()} />
          )}
        </div>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal"));
};

export default LoginModal;
