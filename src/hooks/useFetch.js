import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

//utils
import { errorToast, mapErrors } from "utils/misc";

const useFetch = (functionFetch) => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    functionFetch()
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          if (Array.isArray(data?.data)) {
            setData(data?.data);
          } else if (Array.isArray(data?.data?.items)) {
            setData(data?.data?.items);
          }
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [enqueueSnackbar, functionFetch]);

  return [data, loading];
};

export default useFetch;
