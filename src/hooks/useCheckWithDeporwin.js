import { useState } from "react";

import { useSnackbar } from "notistack";

import { authUsersDW } from "services/auth";

import { successToast, mapErrors } from "utils/misc";

const useCheckWithDeporwin = (brandId) => {
  const { enqueueSnackbar } = useSnackbar();

  const [userInformation, setUserInformation] = useState({});
  const [errorUserNotFound, setErrorUserNotFound] = useState(false);
  const [loadingFetchingUserDW, setLoadingFetchingUserDW] = useState(false);
  const [errorUser, setErrorUser] = useState("");

  // GET USERS DW
  const handleAuthDW = (documentNumber, typeDocument, funcCallback) => {
    setLoadingFetchingUserDW(true);
    authUsersDW(documentNumber, typeDocument, brandId)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setErrorUser("");
          funcCallback({
            ...data?.data,
            document_number: documentNumber,
          });
          setUserInformation(data?.data);
          enqueueSnackbar("Usuario encontrado en DW", successToast);
        } else {
          setUserInformation({});
          setErrorUser(mapErrors(data));
        }
      })
      .catch((err) => {
        setErrorUser(mapErrors(err));
        setUserInformation({});
      })
      .finally(() => {
        setLoadingFetchingUserDW(false);
      });
  };

  return {
    userInformation,
    errorUserNotFound,
    setErrorUserNotFound,
    errorUser,
    setErrorUser,
    loadingFetchingUserDW,
    handleAuthDW,
  };
};

export default useCheckWithDeporwin;
