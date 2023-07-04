import toast from "react-hot-toast";

export const showErrorToast = (errorMessage, setLoading) => {
    toast.error(errorMessage);
    setLoading(false);
  }