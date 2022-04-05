import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useHistory } from "react-router";

//UI
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Tooltip from "@material-ui/core/Tooltip";

//UTILS
import { useStyles } from "utils/useStyles";

//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setNutrition } from "modules/nutrition";

//SERVICES
import { getNutritionGoals } from "services/MedicalSoftware/NutritionGoals";
import { getTypeAlimentation } from "services/MedicalSoftware/TypeAlimentation";
import { searchElastic } from "services/_elastic";

const FormFirstStepNutritionTemplate = ({ setNutrition, defaultValues }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const [nutritionGoals, setNutritionGoals] = useState([]);
  const [typeAlimentations, setTypeAlimentations] = useState([]);
  const [isValidateNameTemplate, setIsValidateNameTemplate] = useState(
    defaultValues && !defaultValues.assigned ? true : false
  );
  const watchShowNameTemplate = watch("name", false);

  useEffect(() => {
    getNutritionGoals().then(({ data }) => {
      if (data && data.data) {
        setNutritionGoals(data.data.items);
      } else {
        setNutritionGoals([]);
      }
    });
    getTypeAlimentation().then(({ data }) => {
      if (data && data.data) {
        setTypeAlimentations(data.data.items);
      } else {
        setTypeAlimentations([]);
      }
    });
  }, []);

  useEffect(() => {
    if (watchShowNameTemplate) {
      searchElastic("nutritional_plan", {
        query: {
          match: {
            name: {
              query: watchShowNameTemplate,
            },
          },
        },
      })
        .then(({ data }) => {
          if (
            data.data.hits.hits.length > 0 &&
            data.data.hits.hits[0]._source.name === watchShowNameTemplate
          ) {
            if (defaultValues && !defaultValues.assigned) {
              setIsValidateNameTemplate(true);
            } else {
              setIsValidateNameTemplate(false);
            }
          } else {
            setIsValidateNameTemplate(true);
          }
        })
        .catch((err) => {
          setIsValidateNameTemplate(true);
        });
    }
  }, [watchShowNameTemplate, defaultValues]);

  const onSubmit = (value) => {
    let initialData = {
      name: value.name,
      goal: nutritionGoals.filter((item) => item.id === Number(value.goal)),
      type_alimentation: typeAlimentations.filter(
        (item) => item.id === Number(value.food_type)
      ),
      description: value.description,
      recipes: defaultValues?.rescipes,
      recipe_exchange: defaultValues?.recipes_exchangue,
      isCreateTemplate: true,
      isViewTemplate: false,
      uuid: defaultValues?.uuid,
    };
    setNutrition(initialData);
    history.push("/nutrition/0");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ width: "100%", padding: 20 }}
    >
      <div className="row">
        <div className="col-6">
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            error={errors.name ? true : false}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label={t("WeeklyNutrition.InputName")}
                className="mb-2"
                InputProps={{
                  endAdornment: watchShowNameTemplate && (
                    <Tooltip
                      placement="top"
                      title={
                        isValidateNameTemplate
                          ? t("ModuleNutrition.CorrectName")
                          : t("ModuleNutrition.ErrorName")
                      }
                    >
                      <InputAdornment position="end">
                        {isValidateNameTemplate ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </InputAdornment>
                    </Tooltip>
                  ),
                }}
              />
            )}
            defaultValue={defaultValues?.name}
          />
          {errors.name && (
            <FormHelperText error={errors.name ? true : false}>
              {t("Field.required")}
            </FormHelperText>
          )}
          <Controller
            control={control}
            name="goal"
            rules={{ required: true }}
            error={errors.goal ? true : false}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="food_type">
                  {t("FormRecipe.SelectGoalRecipe")}
                </InputLabel>
                <Select
                  {...field}
                  fullWidth
                  className="mb-2"
                  labelId="food_type"
                  variant="outlined"
                  label={t("FormRecipe.SelectGoalRecipe")}
                >
                  {nutritionGoals &&
                    nutritionGoals.map((item, idx) => (
                      <MenuItem key={`goal-${idx}`} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            defaultValue={defaultValues?.goal_id}
          />
          {errors.goal && (
            <FormHelperText error={errors.goal ? true : false}>
              {t("Field.required")}
            </FormHelperText>
          )}
          <Controller
            control={control}
            name="food_type"
            rules={{ required: true }}
            error={errors.food_type ? true : false}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="food_type">
                  {t("FormRecipe.SelectFeedingType")}
                </InputLabel>
                <Select
                  {...field}
                  fullWidth
                  className="mb-2"
                  labelId="food_type"
                  variant="outlined"
                  label={t("FormRecipe.SelectFeedingType")}
                >
                  {typeAlimentations &&
                    typeAlimentations.map((item, idx) => (
                      <MenuItem key={`goal-${idx}`} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
            defaultValue={defaultValues?.type_alimentation_id}
          />
          {errors.food_type && (
            <FormHelperText error={errors.food_type ? true : false}>
              {t("Field.required")}
            </FormHelperText>
          )}
        </div>
        <div className="col-6">
          <Controller
            control={control}
            name="description"
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={8}
                variant="outlined"
                label={t("WeeklyNutrition.InputDescription")}
              />
            )}
            defaultValue={defaultValues?.description}
          />
          {errors.description && (
            <FormHelperText error={errors.food_type ? true : false}>
              {t("Field.required")}
            </FormHelperText>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <Button
          type="submit"
          disabled={!isValidateNameTemplate ? true : false}
          className={`${classes.button} me-4 mt-3`}
        >
          {t("Btn.Next")}
        </Button>
      </div>
    </form>
  );
};
const mapStateToProps = ({ nutrition }) => ({
  dataFromStore: nutrition.data,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setNutrition }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormFirstStepNutritionTemplate);
