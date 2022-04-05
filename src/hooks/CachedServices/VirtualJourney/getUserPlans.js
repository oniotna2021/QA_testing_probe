import { useEffect, useState } from "react";

// fetching
import { axiosInstance } from "../../../services/instance";
import useSWR from "swr";

// utils
import { useSnackbar } from "notistack";
import { errorToast, mapErrors } from "utils/misc";

export const useGetUserPlans = (user_id) => {
  const { enqueueSnackbar } = useSnackbar();
  const [dataState, setDataState] = useState();

  const nutritionFetcher = (url) =>
    axiosInstance.get(url).then((res) => res.data.data.items);

  const trainingFetcher = (url) =>
    axiosInstance.get(url).then((res) => res.data.data);

  const { data: nutritionalPlans, error: nutritionError } = useSWR(
    `nutritionalPlanUser/history/user/${user_id}`,
    nutritionFetcher
  );

  const { data: trainingPlans, error: trainingError } = useSWR(
    nutritionalPlans ? `training-plans/user/id/${user_id}` : null,
    trainingFetcher
  );

  useEffect(() => {
    if (
      !nutritionError &&
      !trainingError &&
      nutritionalPlans &&
      trainingPlans
    ) {
      setDataState({ nutritionalPlans, trainingPlans });
    } else {
      if (nutritionError) {
        enqueueSnackbar(mapErrors(nutritionError), errorToast);
      }

      if (trainingError) {
        enqueueSnackbar(mapErrors(trainingError), errorToast);
      }
      setDataState(null);
    }
  }, [
    nutritionalPlans,
    trainingPlans,
    nutritionError,
    trainingError,
    enqueueSnackbar,
  ]);

  return {
    swrData: dataState,
    isLoading: !dataState,
  };
};
