import { useEffect, useState } from "react";

// fetching
import { axiosInstance } from "services/instance";
import useSWR from "swr";

// utils
import { useSnackbar } from "notistack";
import { errorToast, mapErrors } from "utils/misc";

export const useGetNotes = (user_id) => {
  const { enqueueSnackbar } = useSnackbar();
  const [dataState, setDataState] = useState([]);

  const fetcher = (url) => axiosInstance.get(url).then((res) => res.data.data);
  const { data, mutate, error } = useSWR(
    `quotesNotes/user/${user_id}`,
    fetcher
  );

  useEffect(() => {
    if (!error) {
      setDataState(data);
    } else {
      enqueueSnackbar(mapErrors(error), errorToast);
      setDataState([]);
    }
  }, [data, error, enqueueSnackbar]);

  return {
    swrData: dataState,
    isLoading: !dataState,
    refreshData: () => mutate(),
  };
};
