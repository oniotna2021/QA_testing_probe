import { useEffect, useState } from "react";

// fetching
import { axiosInstanceReservation } from "../../services/instance";
import useSWR from "swr";

// utils
import { useSnackbar } from "notistack";
import { errorToast, mapErrors } from "utils/misc";

export const useGetEmployeesByVenue = (idVenue, isRolTower) => {
  const { enqueueSnackbar } = useSnackbar();
  const [dataState, setDataState] = useState([]);

  const fetcher = (url) =>
    axiosInstanceReservation
      .get(url)
      .then((res) =>
        isRolTower
          ? res.data.data.users.filter(
              (item) =>
                item.user_profiles_id === 29 || item.user_profiles_id === 30
            )
          : res.data.data.users
      );

  const { data, mutate, error } = useSWR(
    `employeeVenue/venue/${idVenue}`,
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
