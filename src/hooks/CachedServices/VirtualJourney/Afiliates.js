import { useEffect, useState } from "react";

// fetching
import { axiosInstanceReservation } from "services/instance";
import useSWR from "swr";

// utils
import { useSnackbar } from "notistack";
import { errorToast, mapErrors } from "utils/misc";

export const useGetAfiliatesList = (userPlan, selectedQuoteType) => {
  const { enqueueSnackbar } = useSnackbar();
  const [dataState, setDataState] = useState([]);

  const fetcher = (url) =>
    axiosInstanceReservation.get(url).then((res) => res.data.data);
  const { data, mutate, error } = useSWR(
    `quotesMyCoachNutrition/getAffiliatesbyUser${
      userPlan !== 2 ? `?plan=${userPlan}` : ""
    }${
      selectedQuoteType.length > 0
        ? `${userPlan !== 2 ? "&" : "?"}AppointmentType=${selectedQuoteType
            .map((element) => element.id)
            .join()}`
        : ""
    }`,
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
