import { useEffect, useState } from "react";

// fetching
import { axiosInstanceGeneralConfig } from "../../services/instance";
import useSWR from "swr";

// utils
import { useSnackbar } from "notistack";
import { errorToast, mapErrors } from "utils/misc";

export const useGetAllVenues = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [dataState, setDataState] = useState([]);

  const fetcher = (url) =>
    axiosInstanceGeneralConfig.get(url).then((res) => res.data.data);
  const { data, mutate, error } = useSWR(`venue/all`, fetcher);

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
