/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable-next-line no-unused-vars*/

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import AssingRecipeData from "./AssingRecipeData";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import Loading from "components/Shared/Loading/Loading";

// UI
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import TimePicker from "components/Shared/TimePicker/TimePicker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import EditRecipeModal from "components/Common/ModuleNutrition/AssingRecipeModal/EditRecipeModal";

// utils
import { formatDateToHHMMSS, infoToast } from "utils/misc";

// hooks
import { useSearchElasticRecipes } from "hooks/useSearchElasticRecipes";
import { useDispatch } from "react-redux";

// redux
import { setNutrtionDays } from "modules/nutrition";

const propsTimePicker = {
  ampm: true,
  inputVariant: "outlined",
  margin: "normal",
  minutesStep: 5,
  mask: "__:__ _M",
  KeyboardButtonProps: { "aria-label": "change time" },
  emptyLabel: null,
  showTodayButton: true,
  todayLabel: "Hora actual",
  invalidLabel: "Hora inválida",
  InputAdornmentProps: { position: "start" },
};

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const useStyles = makeStyles((theme) => ({
  button: {
    width: "130px",
    height: "50px",
    background: "transparent",
    color: "#3C3C3B",
    marginBottom: "20px",
  },
}));

const AssingRecipeModal = ({
  cellData,
  setCellData,
  scheduleItems,
  setScheduleItems,
  setModalState,
  modalNutritionItemData,
  isCreatedPlan,
  selectedRecipe,
  setSelectedRecipe,
  fromNutritionItem,
  setModalNutritionItemData,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();

  const [editRecipeModal, setEditRecipeModal] = useState(false);
  const [loadSelect, setLoadSelect] = useState(false);
  const [selectedTime, setSelectedTime] = useState(
    modalNutritionItemData?.time
      ? new Date(`2021-08-18T${modalNutritionItemData.time}`)
      : null
  );
  const { enqueueSnackbar } = useSnackbar();
  const [
    options,
    dailyFood,
    daysWeek,
    term,
    setTerm,
    selectedFoodType,
    setSelectedFoodType,
    loader,
  ] = useSearchElasticRecipes();

  const [recipeInitialData, setRecipeInitialData] = useState(dailyFood);

  useEffect(() => {
    setSelectedFoodType(cellData?.hour?.id);
    setLoadSelect(true);
    if (modalNutritionItemData) {
      setSelectedRecipe(modalNutritionItemData);
      setLoadSelect(false);
    }
  }, [modalNutritionItemData, setSelectedFoodType, setSelectedRecipe]);

  useEffect(() => {
    if (selectedRecipe?.food_type) {
      setRecipeInitialData(selectedRecipe?.food_type);
    } else {
      setRecipeInitialData(dailyFood);
    }
  }, [selectedRecipe, dailyFood]);

  const handleCloseModal = () => {
    if (selectedRecipe === {}) {
      setModalState(false);
    } else {
      setSelectedRecipe({});
      setModalState(false);
    }
  };

  const setNewItem = (value) => {
    const food_type = Number(value?.food_type);

    if (food_type) {
      let temporalItems = [...scheduleItems];
      // map items by days
      value?.days?.forEach((selectedDay) => {
        const foundItem = scheduleItems.find(
          (item) =>
            item.food_type === food_type && item.day_week_id === selectedDay.id
        );

        const data = {
          recipe_id: selectedRecipe.id,
          recipe_uuid: selectedRecipe.uuid,
          day_week_id: selectedDay.id,
          food_type: food_type,
          total_calories: selectedRecipe.total_calories,
          time: formatDateToHHMMSS(selectedTime),
          is_customized: 0,
        };

        if (!foundItem) {
          return temporalItems.push(data);
        } else {
          // update item if exists
          temporalItems = temporalItems.map((actualItem) => {
            return actualItem.day_week_id === selectedDay.id &&
              actualItem.food_type === food_type
              ? data
              : actualItem;
          });
        }
      });

      setScheduleItems(temporalItems);
      setCellData({});
      setSelectedRecipe({});
      setModalNutritionItemData({});
    }
    handleCloseModal();
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  useEffect(() => {
    setTimeout(() => {
      if (scheduleItems) {
        setScheduleItems(
          scheduleItems.map((item) => {
            if (
              selectedRecipe?.prevData?.id === item.recipe_id &&
              selectedRecipe?.prevData?.day_week_id === item?.day_week_id &&
              selectedRecipe?.prevData?.food_type === item?.food_type
            ) {
              return {
                ...item,
                recipe_id: selectedRecipe.id,
                recipe_uuid: selectedRecipe.uuid,
                total_calories: selectedRecipe.total_calories,
              };
            } else {
              return item;
            }
          })
        );
      }
    }, 200);
  }, [selectedRecipe]);

  useEffect(() => {
    if (modalNutritionItemData.time) {
      setTimeout(
        () =>
          setValue(
            "time",
            new Date(`2021-08-18T${modalNutritionItemData.time}`)
          ),
        1000
      );
    }
  }, [modalNutritionItemData, setValue]);

  useEffect(() => {
    dispatch(setNutrtionDays([cellData?.day]));
    return () => setNutrtionDays([]);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(setNewItem, onError)} className="row m-0">
        <div className="container">
          <div className="d-flex justify-content-center flex-column">
            {selectedRecipe?.uuid && (
              <AssingRecipeData
                selectedRecipe={selectedRecipe}
                setEditRecipeModal={setEditRecipeModal}
                isCreatedPlan={isCreatedPlan}
              />
            )}
          </div>

          <>
            <div className="d-flex justify-content-center flex-column">
              {!selectedRecipe ||
              selectedRecipe.isEditRecipe === false ||
              fromNutritionItem === false ? (
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="recipe"
                  error={errors.recipe}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      className="mb-2"
                      onChange={(_, data) => {
                        onChange(data?._source);
                        setSelectedRecipe(data?._source);
                      }}
                      options={options}
                      filterOptions={(opt, state) => opt}
                      noOptionsText={t("ModuleNutrition.NoOptionRecipes")}
                      getOptionLabel={(option) => option._source.name}
                      renderOption={(option) => (
                        <React.Fragment>
                          <span className="me-3">
                            <Avatar src={option._source.urlImage} />
                          </span>
                          <Typography variant="body2">
                            {option._source.name}
                          </Typography>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <>
                          <TextField
                            error={errors.recipe}
                            className={"mt-3"}
                            {...params}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {loader ? <Loading /> : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                            label={t("FormRecipe.AddRecipe")}
                            variant="outlined"
                            value={term}
                            onChange={({ target }) => setTerm(target.value)}
                            inputProps={{
                              ...params.inputProps,
                            }}
                          />
                        </>
                      )}
                    />
                  )}
                />
              ) : null}

              {loadSelect ? (
                <Loading />
              ) : (
                <Controller
                  name="food_type"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={cellData?.hour?.id || ""}
                  render={({ field }) => (
                    <FormControl
                      className="mt-3"
                      variant="outlined"
                      error={errors.food_type}
                    >
                      <InputLabel id="select">Tiempo de comida</InputLabel>
                      <Select
                        labelId="select"
                        defaultValue={cellData?.hour?.id || ""}
                        label="Tiempo de comida"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {recipeInitialData?.map((item) => (
                          <MenuItem key={`item-${item?.id}`} value={item?.id}>
                            {item?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
            </div>
            <div className="row mt-3 m-0">
              <div className="col mt-2 p-0 pe-1">
                <Controller
                  control={control}
                  rules={{ required: true }}
                  error={errors.days}
                  name="days"
                  defaultValue={cellData ? [cellData?.day] : []}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      multiple={true}
                      defaultValue={
                        cellData && cellData.day ? [cellData?.day] : []
                      }
                      options={daysWeek}
                      onChange={(_, data) => {
                        onChange(data);
                        dispatch(setNutrtionDays(data));
                      }}
                      getOptionSelected={(option, value) =>
                        option.id === value.id
                      }
                      getOptionLabel={(option) => `${option?.name}`}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={errors.days}
                          label="Días de la semana"
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                />
              </div>

              <div className="col p-0 ps-1">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="time"
                  defaultValue={modalNutritionItemData?.time}
                  error={errors.time}
                  render={({ field: { onChange } }) => (
                    <FormControl variant="outlined">
                      <TimePicker
                        error={errors.time}
                        onChange={(data) => {
                          setSelectedTime(data);
                          onChange(data);
                        }}
                        label="Hora"
                        id="time-picker-2"
                        value={selectedTime}
                        {...propsTimePicker}
                      />
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className="col-12 d-flex justify-content-around mt-5">
              <Button
                className={classes.button}
                onClick={() => {
                  setModalState(false);
                  setSelectedRecipe({});
                  setModalNutritionItemData({});
                }}
              >
                {t("Btn.Cancel")}
              </Button>
              <ButtonSave text={t("NutritionPlan.ButtonSave")} />
            </div>
          </>
        </div>
      </form>

      {/* Edit recipe modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <EditRecipeModal
            cellData={cellData}
            setEditRecipeModal={setEditRecipeModal}
            selectedRecipe={selectedRecipe}
            setSelectedRecipe={setSelectedRecipe}
          />
        }
        isOpen={editRecipeModal}
        handleClose={() => setEditRecipeModal(false)}
        title={t("FormRecipe.EditRecipe")}
      />
    </>
  );
};

export default AssingRecipeModal;
