//REACT
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

//TRANSLATE
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";

//UTILS
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  infoToast,
  mapErrors,
  regexNumbersPositive,
} from "utils/misc";

// HOOKS
import useDebounce from "hooks/useDebounce";

//IMPORTS
import { useSnackbar } from "notistack";

//SERVICES
import { getTypeFood } from "services/MedicalSoftware/TypeFood";
import { getFoodByType } from "services/MedicalSoftware/Food";
import { getWeightUnit } from "services/MedicalSoftware/WeightUnit";
import { searchElastic } from "services/_elastic";

const FormFoodItem = ({
  setIsOpen,
  setIngredients,
  ingredients,
  fromAssingModal,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [typeFood, setTypeFood] = useState([]);
  const [food, setFood] = useState([]);
  const [weightUnit, setWeightUnit] = useState([]);
  const [idType, setIdType] = useState(0);
  const [foodOptions, setFoodOptions] = useState([]);
  const [foodTerm, setFoodTerm] = useState("");
  const [fields, setFields] = useState([]);
  const [selectedFood, setSelectedFood] = useState({});
  const debouncedFilter = useDebounce(foodTerm, 100);

  useEffect(() => {
    getTypeFood()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setTypeFood(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getWeightUnit()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setWeightUnit(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (idType) {
      getFoodByType(idType)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setFood(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [idType, enqueueSnackbar]);

  const handleFoodByType = (e) => {
    setIdType(e.target.value);
  };

  const addIngredients = (value, e) => {
    e.preventDefault();
    value.id = "";
    value.is_customized = 1;
    value.food = food.find((x) => x.id === value.food_id);
    value.food_id = value?.food?.id;
    value.unit = weightUnit.find((x) => x.id === Number(value.weight_unit_id));
    value.calories = Number(value.calories);
    setIngredients((prevState) => [...prevState, value]);
    setIsOpen(false);
  };

  useEffect(() => {
    searchElastic("food", {
      query: {
        bool: {
          filter: [{ term: { food_type_id: idType } }],
        },
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setFoodOptions(data.data.hits.hits);
        } else {
          setFoodOptions([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar, idType]);

  // elastic search for food
  useEffect(() => {
    const setFilterValue = (value) => {
      setFoodOptions([]);
      if (value) {
        searchElastic("food", {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: value,
                    type: "phrase_prefix",
                    fields: ["name^1"],
                  },
                },
                {
                  multi_match: {
                    query: idType,
                    fields: ["food_type_id"],
                  },
                },
              ],
            },
          },
        })
          .then(({ data }) => {
            if (data && data.data) {
              setFoodOptions(data.data.hits.hits);
            } else {
              setFoodOptions([]);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
          });
      } else {
        setFoodOptions([]);
      }
    };

    if (debouncedFilter) {
      setFilterValue(debouncedFilter);
    }
  }, [debouncedFilter, enqueueSnackbar, idType]);

  const calculateCalories = () => {
    let calcCalories = 0;
    let currentQuantity = getValues("weight_value");
    calcCalories =
      (currentQuantity * selectedFood.calories) / selectedFood.quantity;
    setValue("calories", Math.round(calcCalories));
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <div>
      <div className="row mb-3">
        <div className="col-11">
          <Typography variant="h6">{t("NutritionPlan.Create")}</Typography>
        </div>
        <div className="col-1">
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>
      <form>
        <div className="row mb-3">
          <div className="col-12">
            <Controller
              control={control}
              name="type_food"
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl variant="outlined" error={errors.type_food}>
                  <InputLabel id="SelectTypeFood">
                    {t("NutritionPlan.FormFoodItem.SelectTypeFood")}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="SelectTypeFood"
                    label={t("NutritionPlan.FormFoodItem.SelectTypeFood")}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleFoodByType(e);
                    }}
                  >
                    {typeFood.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-8">
            <Controller
              rules={{ required: true }}
              control={control}
              name="food_id"
              defaultValue={fields && fields[1] && fields[1].value}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  onChange={(_, data) => {
                    onChange(Number(data?._source?.id));
                    setSelectedFood(data?._source);
                    setValue("weight_unit_id", data?._source?.weight_unit_id);
                  }}
                  className="mb-2"
                  options={foodOptions}
                  noOptionsText={"No hay alimentos"}
                  filterOptions={(opt, state) => opt}
                  getOptionLabel={(option) => option._source.name}
                  renderOption={(option) => (
                    <React.Fragment>
                      <Typography variant="body2">
                        {option._source.name}
                      </Typography>
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <>
                      <TextField
                        className={"mt-3"}
                        {...params}
                        label={t("NutritionPlan.FormFoodItem.SelectFood")}
                        variant="outlined"
                        value={foodTerm}
                        error={errors.food_id}
                        onChange={({ target }) => setFoodTerm(target.value)}
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    </>
                  )}
                />
              )}
            />
          </div>
          <div className="col-4 mt-3">
            <Controller
              name="weight_value"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={errors.weight_value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    calculateCalories();
                  }}
                  onKeyUp={(e) => {
                    if (regexNumbersPositive.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                  variant="outlined"
                  label={t("NutritionPlan.FormFoodItem.InputAmount")}
                  type="number"
                />
              )}
            />
          </div>
          <div className="col-8 mt-3">
            <Controller
              defaultValue={
                selectedFood && Number(selectedFood?.weight_unit_id)
              }
              name="weight_unit_id"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <FormControl variant="outlined" error={errors.weight_unit_id}>
                  <InputLabel id="InputMeasure">
                    {t("NutritionPlan.FormFoodItem.SelectMeasure")}
                  </InputLabel>
                  <Select
                    {...field}
                    value={selectedFood && Number(selectedFood?.weight_unit_id)}
                    disabled={true}
                    labelId="InputMeasure"
                    label={t("NutritionPlan.FormFoodItem.SelectMeasure")}
                  >
                    {weightUnit.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          <div className="col-4 mt-3">
            <Controller
              control={control}
              name="calories"
              render={({ field }) => (
                <TextField
                  {...field}
                  disabled={true}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  label={t("NutritionPlan.FoodFormItem.FieldCalories")}
                  type="number"
                />
              )}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12">
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  rows={4}
                  variant="outlined"
                  label={t("NutritionPlan.FormFoodItem.InputAddNotes")}
                  type="time"
                />
              )}
            />
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Button
            type="button"
            onClick={handleSubmit(addIngredients, onError)}
            className={classes.button}
            variant="contained"
          >
            {t("Btn.Add")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormFoodItem;
