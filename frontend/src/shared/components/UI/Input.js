import { useReducer, useEffect, forwardRef } from "react";
import { validate } from "../../util/validators";
import classes from "./Input.module.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.compareVal, action.validators),
        event: action.event
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = forwardRef((props, ref) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    compareValue: props.compareValue || '',
    isValid: props.initialIsValid,
    isTouched: false,
    event: null
  });

  const { id, onInput } = props;
  const { value, isValid, event } = inputState;

  useEffect(() => {
    if(onInput){
      onInput(id, value, isValid, event);
    }
  }, [id, value, isValid, onInput, event]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      compareVal: props.compareValue || '',
      validators: props.validators,
      event: event
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "textarea" ? (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        value={inputState.value}
        style={props.style}
        onChange={changeHandler}
        onBlur={touchHandler}
      />
    ) : (
      <input
        type={props.type}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        value={inputState.value}
        style={props.style}
        onChange={changeHandler}
        onBlur={touchHandler}
        onKeyDown={props.onKeyDown}
        ref={ref}
      />
    );

  return (
    <div className={classes["form-control"]}>
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {element}
      {!inputState.isValid && inputState.isTouched && (
        <p className={classes.error}>{props.errorText}</p>
      )}
    </div>
  );
});

export default Input;
