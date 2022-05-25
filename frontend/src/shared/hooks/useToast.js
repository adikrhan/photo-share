import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useToast = () => {
  const toastConfig = {
    position: "bottom-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const notify = (message, type) => {
    if (type === "error") {
      toast.error(message, toastConfig);
    } else if (type === "success") {
      toast.success(message, toastConfig);
    } else {
      toast(message, toastConfig);
    }
  };

  return [notify];
};

export default useToast;
