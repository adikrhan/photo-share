import { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useMutation } from 'react-query';

import Input from "../../shared/components/UI/Input";
import Button from "../../shared/components/UI/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_CONFIRM,
} from "../../shared/util/validators";
import classes from "./Signup.module.css";
import useForm from "../../shared/hooks/useForm";
import useToast from "../../shared/hooks/useToast";
import useFetchWithError from '../../shared/hooks/useFetchWithError';

const Signup = () => {
  const authCtx = useContext(AuthContext);
  const [notify] = useToast();
  const signupUrl = `${process.env.REACT_APP_SERVER_BASE_URL}/api/users/signup`;
  const fetchWithError = useFetchWithError();

  const inputs = {
    name: {
      value: "",
      isValid: false,
    },
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
    confirmPassword: {
      value: "",
      isValid: false,
    },
  };

  const [formState, inputHandler] = useForm(inputs, false);

  const signupSubmitHandler = () => {

    const userData = {
      name: formState.inputs.name.value,
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
      confirmPassword: formState.inputs.confirmPassword.value,
    };

    return fetchWithError(signupUrl, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      }
    })
  };

  const signup = useMutation(signupSubmitHandler, {
    onSuccess: (data) => {
      console.log(data);
      notify('Signed up successfully', 'success');
      authCtx.login({
        name: data.name,
        userId: data.userId,
        image: data.image,
        token: data.token
      });
    },
    onError: (error) => {
      console.log(error.message);
      notify(`${error.message}`, 'error');
    }
  })

  return (
    <div className={classes.container}>
      <h2>Sign up</h2>
      <form className={classes["signup-form"]}>
        <Input
          type="text"
          name="name"
          id="name"
          label="Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a name"
          onInput={inputHandler}
        />
        <Input
          type="email"
          name="email"
          id="email"
          label="Email"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email"
          onInput={inputHandler}
        />
        <Input
          type="password"
          name="password"
          id="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Password must be at least 6 characters"
          onInput={inputHandler}
        />
        <Input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          label="Confirm password"
          validators={[VALIDATOR_CONFIRM()]}
          errorText="Passwords don't match"
          onInput={inputHandler}
          compareValue={formState.inputs.password.value}
        />
        <Button text="Submit" type="button" onClick={signup.mutate} disabled={!formState.isValid} />
      </form>
    </div>
  );
};

export default Signup;
