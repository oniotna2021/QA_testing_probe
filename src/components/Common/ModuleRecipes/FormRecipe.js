/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

//UI
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Avatar from "@material-ui/core/Avatar";
import FormHelperText from "@material-ui/core/FormHelperText";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ListIngredients from "./ListIngredients";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";
import Swal from "sweetalert2";

//icons
import { IconCamera, IconEditItem } from "assets/icons/customize/config";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//services
import { searchElastic } from "services/_elastic";
import {
  postRecipe,
  putRecipe,
  getRecipeById,
} from "services/MedicalSoftware/Recipes";
import { getNutritionGoals } from "services/MedicalSoftware/NutritionGoals";
import { getTypeAlimentation } from "services/MedicalSoftware/TypeAlimentation";
import { getDailyFood } from "services/MedicalSoftware/DailyFood";
import { useSelector } from "react-redux";

const FormRecipe = ({
  isEdit,
  dataItem,
  defaultValue,
  setExpanded,
  setLoad,
  load,
  cellData,
  fromAssingModal,
  setSelectedRecipe,
  selectedRecipe,
  setEditRecipeModal,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const classes = useStyles();

  const arrayDays = useSelector((state) => state.nutrition.arrayDays);

  const [term, setTerm] = useState("");
  const [options, setOptions] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [urlImage, setUrlImage] = useState(
    isEdit ? dataItem?.urlImage : undefined
  );
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [ingredients, setIngredients] = useState(
    dataItem ? dataItem?.ingredient : []
  );
  const [nutritionGoals, setNutritionGoals] = useState([]);
  const [typeAlimentations, setTypeAlimentations] = useState([]);
  const [foodType, setFoodType] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const [changeCalories, setChangeCalories] = useState(false);

  useEffect(() => {
    setTotalCalories(
      ingredients.reduce((total, item) => {
        return Number(total + parseInt(item.calories));
      }, 0)
    );
  }, [ingredients, changeCalories]);

  const onSubmit = (values) => {
    setLoadingFetch(true);
    let dataSubmit = {
      name: values.recipe_name,
      description: values.description,
      urlImage: urlImage,
      type_alimentations_id: values.feeding_type.map((x) => {
        return { id: x.id };
      }),
      food_type_id: values.food_type.map((x) => {
        return { id: x.id };
      }),
      nutrition_goals: values.nutrition_goals.map((x) => {
        return { id: x.id };
      }),
      ingredients: ingredients,
      total_calories: totalCalories,
    };

    if (isEdit) {
      if (fromAssingModal) {
        //create recipe from AssingRecipeModal
        dataSubmit.is_customized = 1;
        dataSubmit.parent_id = selectedRecipe.id
        postRecipe(dataSubmit)
          .then(({ data }) => {
            if (data && data.status === "success") {
              enqueueSnackbar(data.message, successToast);
              getRecipeById(data.data.uuid).then((data) => {
                setSelectedRecipe({
                  ...data.data.data,
                  prevData: {
                    id: selectedRecipe.id,
                    day_array: arrayDays,
                    food_type: cellData?.hour?.id,
                  },
                });
                setLoad(!load);
                setExpanded(false);
              });
            } else {
              Swal.fire({
                title: mapErrors(data),
                icon: "error",
              });
            }
            setLoadingFetch(false);
            if (setEditRecipeModal) {
              setEditRecipeModal(false);
            }
          })
          .catch((err) => {
            Swal.fire({
              title: mapErrors(err),
              icon: "error",
            });
            setLoadingFetch(false);
          });
      } else {
        dataSubmit.is_customized = 0;
        putRecipe(dataItem.uuid, dataSubmit)
          .then(({ data }) => {
            if (data && data.status === "success") {
              Swal.fire({
                title: data.message,
                icon: "success",
              });
              setLoad(!load);
              setExpanded(false);
              if (setEditRecipeModal) {
                setEditRecipeModal(false);
              }
            } else {
              Swal.fire({
                title: mapErrors(data),
                icon: "error",
              });
            }
            setLoadingFetch(false);
          })
          .catch((err) => {
            Swal.fire({
              title: mapErrors(err),
              icon: "error",
            });
            setLoadingFetch(false);
          });
      }
    } else {
      dataSubmit.is_customized = 0;
      postRecipe(dataSubmit)
        .then(({ data }) => {
          if (data && data.status === "success") {
            Swal.fire({
              title: data.message,
              icon: "success",
            });
            setLoad(!load);
            setExpanded(false);
            if (setEditRecipeModal) {
              setEditRecipeModal(false);
            }
          } else {
            Swal.fire({
              title: mapErrors(data),
              icon: "error",
            });
          }
          setLoadingFetch(false);
        })
        .catch((err) => {
          Swal.fire({
            title: mapErrors(err),
            icon: "error",
          });
          setLoadingFetch(false);
        });
    }
  };

  useEffect(() => {
    if (term) {
      setFilterValue(term);
    }
  }, [term]);

  useEffect(() => {
    searchElastic("image_of_recipes", {
      from: 0,
      size: 20,
      query: {
        match_all: {},
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setOptions(data.data.hits.hits);
        } else {
          setOptions([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    getNutritionGoals()
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setNutritionGoals(data.data.items);
        } else {
          setNutritionGoals([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    getTypeAlimentation()
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setTypeAlimentations(data.data.items);
        } else {
          setTypeAlimentations([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    getDailyFood()
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setFoodType(data.data.items);
        } else {
          setFoodType([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  const setFilterValue = (value) => {
    setOptions([]);
    if (value) {
      searchElastic("image_of_recipes", {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: value,
                  fields: ["tags.tag"],
                  fuzziness: "2",
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
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    } else {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (dataItem) {
      setIngredients(
        dataItem?.ingredient?.map((ingredient) => {
          return {
            ...ingredient,
            food_id: ingredient.food.id,
          };
        })
      );
    }
  }, [dataItem]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "40px 20px" }}>
      <div className="row">
        <div className="col-2 d-flex justify-content-center">
          {!fromAssingModal && !isEdit && (
            <div>
              {urlImage === undefined ? (
                <Avatar
                  className={classes.avatarImage}
                  children={<IconCamera />}
                />
              ) : (
                <div className={classes.thumb}>
                  <div className={classes.thumbInner}>
                    <img src={urlImage} className={classes.img2} alt="img" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className={!fromAssingModal ? "col-5" : "row-5"}>
          {isEdit ? (
            <div className="row m-0">
              <div className="col-2">
                <Avatar
                  className={`${classes.avatarNutrition}`}
                  src={urlImage}
                  children={<IconCamera color={"white"} />}
                />
              </div>
              <div className="col-10 pe-0">
                <Autocomplete
                  className="mb-2"
                  onChange={(_, data) => setUrlImage(data?._source.urlImage)}
                  options={options}
                  noOptionsText={t("PhysicalExamination.noOptionsText")}
                  getOptionLabel={(option) => option._source.tags[0].tag}
                  renderOption={(option) => (
                    <React.Fragment>
                      <span className="me-3">
                        <Avatar src={option._source.urlImage} />
                      </span>
                      <Typography variant="body2">
                        {option._source.tags[0].tag}
                      </Typography>
                    </React.Fragment>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("FormRecipe.AddImage")}
                      variant="outlined"
                      value={term}
                      onChange={({ target }) => setTerm(target.value)}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            !fromAssingModal && (
              <Autocomplete
                className="mb-2"
                onChange={(_, data) => setUrlImage(data?._source.urlImage)}
                options={options}
                noOptionsText={t("PhysicalExamination.noOptionsText")}
                getOptionLabel={(option) => option._source.tags[0].tag}
                renderOption={(option) => (
                  <React.Fragment>
                    <span className="me-3">
                      <Avatar src={option._source.urlImage} />
                    </span>
                    <Typography variant="body2">
                      {option._source.tags[0].tag}
                    </Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("FormRecipe.AddImage")}
                    variant="outlined"
                    value={term}
                    onChange={({ target }) => setTerm(target.value)}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            )
          )}
          {urlImage === undefined && (
            <FormHelperText error={true}>
              Debes seleccionar una imagen
            </FormHelperText>
          )}
          <Controller
            defaultValue={dataItem && dataItem.name}
            name="recipe_name"
            error={errors.recipe_name ? true : false}
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                className="mb-2"
                {...field}
                variant="outlined"
                label={t("FormRecipe.InputNameRecipe")}
              />
            )}
          />
          {errors.recipe_name && (
            <FormHelperText error={true}>Campo requerido</FormHelperText>
          )}
          <ControlledAutocomplete
            control={control}
            required={true}
            defaultValue={dataItem && dataItem.nutrition_goals}
            name="nutrition_goals"
            error={errors.nutrition_goals ? true : false}
            options={nutritionGoals}
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("FormRecipe.SelectGoalRecipe")}
                variant="outlined"
                margin="normal"
              />
            )}
          />
          {errors.nutrition_goals && (
            <FormHelperText error={true}>Campo requerido</FormHelperText>
          )}
          <ControlledAutocomplete
            control={control}
            required={true}
            defaultValue={dataItem && dataItem.type_alimentations_id}
            name="feeding_type"
            error={errors.feeding_type ? true : false}
            options={typeAlimentations}
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("FormRecipe.SelectFeedingType")}
                variant="outlined"
                margin="normal"
              />
            )}
          />
          {errors.feeding_type && (
            <FormHelperText error={true}>Campo requerido</FormHelperText>
          )}
          <ControlledAutocomplete
            control={control}
            required={true}
            defaultValue={dataItem && dataItem.food_type}
            name="food_type"
            error={errors.food_type ? true : false}
            options={foodType}
            getOptionLabel={(option) => `${option.name}`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("FormRecipe.SelectFoodType")}
                variant="outlined"
                margin="normal"
              />
            )}
          />
          {errors.food_type && (
            <FormHelperText error={true}>Campo requerido</FormHelperText>
          )}
        </div>
        <div className={!fromAssingModal ? "col-5 w-100" : "row-5"}>
          <Controller
            defaultValue={dataItem && dataItem.description}
            name="description"
            control={control}
            error={errors.description ? true : false}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                className="mb-2"
                {...field}
                multiline
                rows={11}
                variant="outlined"
                label={t("FormRecipe.InputPreparation")}
              />
            )}
          />
          {errors.description && (
            <FormHelperText error={true}>Campo requerido</FormHelperText>
          )}
          <Button
            fullWidth
            className={classes.buttonListIngredients}
            endIcon={<IconEditItem color="#3C3C3B" width="25" height="25" />}
            onClick={() => setIsOpenForm(true)}
          >
            {t("FormRecipe.ButtonListIngredients")}
          </Button>
          <Typography variant="body2">{`Total de calorias: ${totalCalories}`}</Typography>
          {ingredients.length === 0 && (
            <FormHelperText error={true}>
              Debes agregar al menos un ingrediente
            </FormHelperText>
          )}

          <div className="d-flex justify-content-end mt-3">
            <ButtonSave
              text={isEdit ? t("Btn.Edit") : t("Btn.save")}
              loader={loadingFetch}
            />
          </div>
        </div>
      </div>
      <ShardComponentModal
        fullWidth={true}
        width={fromAssingModal ? "sm" : "xs"}
        body={
          <ListIngredients
            isDetail={false}
            setChangeCalories={setChangeCalories}
            changeCalories={changeCalories}
            fromAssingModal={fromAssingModal}
            isEdit={isEdit}
            setIngredients={setIngredients}
            ingredients={ingredients}
            setTotalCalories={setTotalCalories}
            totalCalories={totalCalories}
            setIsOpen={setIsOpenForm}
          />
        }
        isOpen={isOpenForm}
      />
    </form>
  );
};

export default FormRecipe;
