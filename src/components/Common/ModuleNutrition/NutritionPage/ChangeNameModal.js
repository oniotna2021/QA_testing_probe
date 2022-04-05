import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

//UI
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import { searchElastic } from "services/_elastic";
import { getNutritionGoals } from "services/MedicalSoftware/NutritionGoals";
import { getTypeAlimentation } from "services/MedicalSoftware/TypeAlimentation";

const ChangeNameModal = ({ defaultValues, setcurrentPlanName, isLoading }) => {
  const [isValidateNameTemplate, setIsValidateNameTemplate] = useState(false);

  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const watchShowNameTemplate = watch("name", false);

  const [nutritionGoals, setNutritionGoals] = useState([]);
  const [typeAlimentations, setTypeAlimentations] = useState([]);

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

  const changeName = (value) => {
    setcurrentPlanName(value);
  };

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
            data.data.hits.hits[0]._source.name === watchShowNameTemplate.trim()
          ) {
            setIsValidateNameTemplate(false);
          } else {
            setIsValidateNameTemplate(true);
          }
        })
        .catch((err) => {
          setIsValidateNameTemplate(false);
        });
    }
  }, [watchShowNameTemplate, defaultValues]);

  return (
    <form onSubmit={handleSubmit(changeName)}>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        error={errors.name ? true : false}
        defaultValue={defaultValues?.name}
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
      />
      <Controller
        control={control}
        name="goal_id"
        rules={{ required: true }}
        error={errors.goal ? true : false}
        render={({ field }) => (
          <FormControl variant="outlined" error={errors.goal_id}>
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
      />
      <Controller
        control={control}
        name="type_alimentation_id"
        rules={{ required: true }}
        error={errors.food_type ? true : false}
        render={({ field }) => (
          <FormControl variant="outlined" error={errors.type_alimentation_id}>
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
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <TextField
            {...field}
            multiline
            rows={4}
            error={errors.description}
            variant="outlined"
            label={t("WeeklyNutrition.InputDescription")}
          />
        )}
      />
      <div className="d-flex justify-content-end mt-3">
        <ButtonSave
          text={t("Btn.save")}
          disabled={!isValidateNameTemplate}
          loader={isLoading}
        />
      </div>
    </form>
  );
};

export default ChangeNameModal;
