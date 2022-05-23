import ReactDOM from "react-dom";
import { useContext } from "react";
import useForm from "../../hooks/useForm";
import useToast from "../../hooks/useToast";
import { useHttp } from "../../hooks/useHttp";
import { AuthContext } from "../../context/auth-context";
import Input from "../UI/Input";
import classes from "./LoginModal.module.css";
import Button from "./Button";
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from "../../util/validators";

const LoginModal = () => {
  const authCtx = useContext(AuthContext);
  const [isLoading, sendRequest] = useHttp();
  const [notify] = useToast();

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

  const loginClickHandler = async (event) => {
    event.preventDefault();

    const userData = {
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
    };
    const loginUrl = "http://localhost:3001/api/users/login";
    const headers = {
      "Content-Type": "application/json",
    };

    try {
      const data = await sendRequest(
        loginUrl,
        "POST",
        JSON.stringify(userData),
        headers
      );
        console.log("login", data);
      authCtx.login({
        name: data.name,
        userId: data.userId,
        image: data.image,
        token: data.token
      });
      notify(`Logged in as ${data.name}`, "success");
    } catch (error) {}
  };

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
        <Button text="Go" onClick={loginClickHandler} />
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById("modal"));
};

export default LoginModal;
