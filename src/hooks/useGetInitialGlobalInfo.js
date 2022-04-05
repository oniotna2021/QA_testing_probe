import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateHolidays,
  updateTypesDocuments,
  updateCities,
  setDataCountries,
  setTypeQuotes,
  setStepsJourneyUser,
  setReasonsReasing,
} from "modules/global";
import axios from "axios";

// services
import { getAllReasons } from "services/JourneyModule/ReasonsReasingQuotes";
import { getDaysFestivesByCountry } from "services/Reservations/dayFestives";
import {
  getCountries,
  getTypeDocumentByCountry,
  getCitiesByCountryCrud,
} from "services/MedicalSoftware/Countries";
import { getTypeAppointment } from "services/MedicalSoftware/TypeAppointment";
import { getTaskStepsByUser } from "services/VirtualJourney/Tasks";

export const useGetInitialGlobalInfo = () => {
  const dispatch = useDispatch();
  const venueCountry = useSelector((state) => state.auth.venueCountryIdDefault);
  const shouldIsVirtual = useSelector((state) => state.auth.shouldIsVirtual);
  const userId = useSelector((state) => state.auth.userId);

  // eslint-disable-next-line no-unused-vars
  const [fetchingGeneralInfo, setFetchingGeneralInfo] = useState(false);

  useEffect(() => {
    const getInitialInfo = async () => {
      try {
        // type documents
        const { data } = await getCountries();
        dispatch(setDataCountries(data.data));
      } catch (err) {
        console.log(err);
      }
    };

    getInitialInfo();
  }, [dispatch]);

  useEffect(() => {
    if (venueCountry || 1) {
      const requestOne = getDaysFestivesByCountry(venueCountry || 1);
      const requestTwo = getTypeDocumentByCountry(venueCountry || 1);
      const requestThree = getCitiesByCountryCrud(venueCountry || 1);

      axios
        .all([requestOne, requestTwo, requestThree])
        .then(
          axios.spread((...responses) => {
            const { data: holidays } = responses[0];
            const { data: typesDocuments } = responses[1];
            const { data: citiesByCountry } = responses[2];

            // use/access the results
            dispatch(updateHolidays(holidays.data));
            dispatch(updateTypesDocuments(typesDocuments.data));
            dispatch(updateCities(citiesByCountry.data));
          })
        )
        .catch((errors) => {
          console.log(errors);
        });
    }
  }, [dispatch, venueCountry]);

  //GET TYPE APOINTMENT
  useEffect(() => {
    getTypeAppointment()
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          dispatch(setTypeQuotes(data.data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  //GET TYPE APOINTMENT
  useEffect(() => {
    if (shouldIsVirtual) {
      getTaskStepsByUser(userId)
        .then(({ data }) => {
          if (data.status === "success" && data.data && data.data.length > 0) {
            dispatch(
              setStepsJourneyUser({
                pending: data.data.find((p) => p.name === "Pendientes"),
                inProcess: data.data.find((p) => p.name === "En proceso"),
                finished: data.data.find((p) => p.name === "Terminado"),
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [dispatch, shouldIsVirtual, userId]);

  useEffect(() => {
    getAllReasons()
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          dispatch(setReasonsReasing(data.data));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  return [fetchingGeneralInfo];
};
