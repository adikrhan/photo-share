import { useReducer, useCallback, useState } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.val, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case "SET_DATA": 
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    default:
      return state;
  }
};

const useForm = (inputs, formValidity) => {

  const [formState, dispatch] = useReducer(formReducer, {
    inputs: inputs,
    isValid: formValidity,
  });

  const [previewSrc, setPreviewSrc] = useState();

  const inputHandler = useCallback((id, value, isValid, event) => {
    if(event && event.target.type === 'file' && event.target.files.length > 0){
      previewFile(event.target.files[0]);
    }
    dispatch({
      type: "INPUT_CHANGE",
      val: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSrc(reader.result);
    };
  };

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return [formState, inputHandler, setFormData, previewSrc];
};

export default useForm;
