import { useEffect, useState } from "react";

// fetching
import { axiosInstanceReservation } from "../../services/instance";
import useSWR from "swr";

// utils
import { useSnackbar } from "notistack";
import { errorToast, mapErrors } from "utils/misc";

export const useGetActivitiesByUserCalendar = (
  userId,
  venueId,
  month,
  year
) => {
  const { enqueueSnackbar } = useSnackbar();
  const [dataState, setDataState] = useState([]);

  const fetcher = (url) =>
    axiosInstanceReservation.get(url).then((res) => {
      return res.data?.data[0]?.schedules || res.data?.data[0]?.dates;
    });

  const { data, mutate, error } = useSWR(
    `scheduleEmployee/activiesRefactored?users=[${userId}]&venue=${venueId}&month=${month}&year=${year}`,
    fetcher
  );

  useEffect(() => {
    console.log("hi");
    if (!error) {
      setDataState(data);
    } else {
      enqueueSnackbar(mapErrors(error), errorToast);
      setDataState([]);
    }
  }, [data, error, enqueueSnackbar]);

  return {
    swrData: data,
    isLoading: !data,
    refreshData: () => mutate(),
  };
};
