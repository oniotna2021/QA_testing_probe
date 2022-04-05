import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

import { getCitiesByCountryCrud } from "services/MedicalSoftware/Countries";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

const useListCitiesByCountry = (defaultValue = null) => {
  const { enqueueSnackbar } = useSnackbar();
  const [idCountry, setIdCountry] = useState(defaultValue);
  const [listCities, setListCities] = useState([]);

  useEffect(() => {
    const fetchData = (idCountry) => {
      getCitiesByCountryCrud(idCountry)
        .then(({ data }) => {
          if (data.status === "success") {
            setListCities(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    };

    if (idCountry !== null) {
      fetchData(idCountry);
    }
  }, [idCountry, enqueueSnackbar]);

  const handleChangeIdCountry = (value) => {
    setIdCountry(value);
  };

  return { idCountry, handleChangeIdCountry, listCities };
};

export default useListCitiesByCountry;
