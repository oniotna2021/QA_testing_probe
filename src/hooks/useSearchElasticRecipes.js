import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

//services
import { searchElastic } from "services/_elastic";
import { getDailyFood, getDayWeek } from "services/MedicalSoftware/DailyFood";

//utils
import { errorToast, mapErrors } from "utils/misc";
import useDebounce from "hooks/useDebounce";

export const useSearchElasticRecipes = () => {
  const [options, setOptions] = useState([]);
  const [dailyFood, setDailyFood] = useState([]);
  const [daysWeek, setDaysWeek] = useState([]);
  const [term, setTerm] = useState("");
  const [selectedFoodType, setSelectedFoodType] = useState("0");
  const debouncedFilter = useDebounce(term, 500);
  const [loader, setLoader] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectedFoodType !== undefined && typeof selectedFoodType === 'number') {
      setLoader(true);
      searchElastic("recipes", {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: selectedFoodType,
                  fields: ["food_type.id"],
                },
              },
            ],
          },
        },
      })
        .then(({ data }) => {
          if (data && data.data) {
            setOptions(data.data.hits.hits);
          } else {
            setOptions([]);
          }
          setLoader(false);
        })
        .catch((err) => {
          setOptions([]);
          setLoader(false);
        });
    }
  }, [selectedFoodType, enqueueSnackbar]);

  useEffect(() => {
    getDailyFood()
      .then(({ data }) => {
        if (data && data.data) {
          setDailyFood(data.data.items);
        } else {
          setDailyFood([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    getDayWeek()
      .then(({ data }) => {
        if (data && data.data) {
          setDaysWeek(data.data.items);
        } else {
          setDaysWeek([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, []);

  const setFilterValue = (value) => {
    setOptions([]);
    setLoader(true);
    if (value) {
      searchElastic("recipes", {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: value,
                  fuzziness: "3",
                },
              },
            ],
          },
        },
        fields: ["name"],
      })
        .then(({ data }) => {
          if (data && data.data) {
            setOptions(data.data.hits.hits);
          } else {
            setOptions([]);
          }
          setLoader(false);
        })
        .catch((err) => {
          setOptions([]);
          setLoader(false);
        });
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (debouncedFilter) {
      setFilterValue(debouncedFilter);
    }
  }, [debouncedFilter]);

  return [
    options,
    dailyFood,
    daysWeek,
    term,
    setTerm,
    selectedFoodType,
    setSelectedFoodType,
    loader,
  ];
};
