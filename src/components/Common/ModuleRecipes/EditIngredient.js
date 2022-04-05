import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

// UI
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";

// services
import { searchElastic } from "services/_elastic";

// imports
import { useSnackbar } from "notistack";

// utils
import { errorToast, mapErrors, regexNumbersPositive } from "utils/misc";

const EditIngredient = ({
  food,
  weightUnit,
  item,
  deleteItem,
  idx,
  ingredients,
  setIngredients,
  changeCalories,
  setChangeCalories,
}) => {
  const { control } = useForm();
  const [unitNumber, setunitNumber] = useState(item?.weight_value);
  const [idType, setIdType] = useState(0);
  const [foodOptions, setFoodOptions] = useState([]);
  const [foodTerm, setFoodTerm] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  // change item
  const handleChangeName = (recipeId) => {
    ingredients.map((ingredient) => {
      if (ingredient.id === item.id) {
        if (recipeId) {
          const foodItem = food.find((x) => x.id === recipeId);
          ingredient.food_id = foodItem.id;
          ingredient.food = foodItem;
          ingredient.is_customized = 1;
          setIngredients((actual) => {
            return actual.map((actualIngredient) => {
              return actualIngredient.id === item.id
                ? ingredient
                : actualIngredient;
            });
          });
        }
      }
    });
  };

  const handleChangeUnit = (value) => {
    ingredients.forEach((ingredient) => {
      if (ingredient?.id === item.id) {
        ingredient.weight_value = parseInt(value);
        ingredient.is_customized = 1;
        setIngredients((actual) => {
          return actual.map((actualIngredient) => {
            return actualIngredient.id === item.id
              ? ingredient
              : actualIngredient;
          });
        });
      }
    });
  };

  const calculateCalories = (e) => {
    let calcCalories = 0;
    calcCalories = (e.target.value * item.food.calories) / item.food.quantity;
    item.calories = Math.round(calcCalories);
  };

  const handleChangeUnitName = (e) => {
    const unit = weightUnit.find((x) => x.id === e.target.value);
    ingredients.forEach((ingredient) => {
      if (ingredient.id === item.id) {
        ingredient.is_customized = 1;
        ingredient.weight_unit_id = unit.id;
        ingredient.weight_unit_name = unit.name;
        ingredient.unit = unit;
        setIngredients((actual) => {
          return actual.map((actualIngredient) => {
            return actualIngredient.id === item.id
              ? ingredient
              : actualIngredient;
          });
        });
      }
    });
  };

  // elastic search for food

  useEffect(() => {
    setIdType(item.food.food_type_id);
  }, []);

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
                    fuzziness: "2",
                  },
                },
              ],
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
      } else {
        setFoodOptions([]);
      }
    };

    if (foodTerm) {
      setFilterValue(foodTerm);
    }
  }, [foodTerm, enqueueSnackbar, idType]);

  return (
    <>
      {/* name */}

      <Controller
        rules={{ required: true }}
        control={control}
        name="food_id"
        defaultValue={{ _source: { ...item.food } }}
        render={({ field: { onChange } }) => (
          <Autocomplete
            onChange={(_, data) => handleChangeName(Number(data?._source?.id))}
            options={foodOptions}
            noOptionsText={"Sin alimentos"}
            defaultValue={{ _source: { ...item.food } }}
            getOptionLabel={({ _source }) => _source.name}
            renderOption={({ _source }) => (
              <React.Fragment>
                <Typography variant="body2">{_source.name}</Typography>
              </React.Fragment>
            )}
            renderInput={(params) => (
              <>
                <TextField
                  {...params}
                  style={{ width: 180 }}
                  variant="outlined"
                  value={foodTerm}
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

      {/* unit */}
      <Controller
        name="weight_value"
        control={control}
        render={({ field }) => (
          <TextField
            style={{ width: 300 }}
            {...field}
            onChange={(e) => {
              setunitNumber(e.target.value);
              handleChangeUnit(e.target.value);
              calculateCalories(e);
            }}
            onKeyUp={(e) => {
              if (regexNumbersPositive.test(e.target.value)) {
                field.onChange(e.target.value);
              } else {
                e.target.value = "";
                field.onChange("");
              }
            }}
            value={unitNumber}
            variant="outlined"
            defaultValue={item?.weight_value}
            type="number"
          />
        )}
      />

      {/* unit name */}
      <Controller
        name="weight_unit_id"
        control={control}
        render={({ field }) => (
          <FormControl variant="outlined">
            <Select
              {...field}
              onChange={handleChangeUnitName}
              defaultValue={item && item.weight_unit_id}
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

      <Button onClick={() => deleteItem(idx)}>
        <CloseIcon />
      </Button>
    </>
  );
};

export default EditIngredient;
