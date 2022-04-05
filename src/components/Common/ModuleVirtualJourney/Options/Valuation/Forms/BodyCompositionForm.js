import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// date-fns
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

// UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// utils
import {
  errorToast,
  mapErrors,
  regexOnlyPositiveNumbers,
  infoToast,
  successToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";
import { useStyles } from "utils/useStyles";

// services
import { getLastDateBodyCompositionAnalysis } from "services/VirtualJourney/Afiliates";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import {
  postWelcomeForm,
  postWelcomeFormNutrition,
} from "services/VirtualJourney/WelcomeForm";

const BodyCompositionForm = ({
  setIsOpen,
  completePhysicalAssesment,
  userType,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let { user_id, quote_id } = useParams();

  const dispatch = useDispatch();
  const savedForm = useSelector((state) => state.virtualJourney.welcomeForm);

  const [lastRegistration, setLastRegistration] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  let currentDate = new Date();
  let yearCurrent = currentDate.getFullYear();
  let monthCurrent = currentDate.getMonth();
  let dayCurrent = currentDate.getDate();
  currentDate.setDate(dayCurrent);
  currentDate.setMonth(monthCurrent);
  currentDate.setFullYear(yearCurrent);

  useEffect(() => {
    getLastDateBodyCompositionAnalysis(user_id)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setLastRegistration(data.data.substring(0, 10));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [completePhysicalAssesment, enqueueSnackbar, user_id]);

  const onSubmit = (values) => {
    let functionToCall =
      userType === 30 ? postWelcomeFormNutrition : postWelcomeForm;
    setIsLoading(true);
    const payload = {
      form: 3,
      quote_id: quote_id,
      user_id: user_id,
      height: values.height,
      weight: values.weight,
      thigh_circumference: values.thigh_circumference,
      arm_circumference: values.arm_circumference,
      fat_percentage: values.fat_percentage,
      muscle_mass_percentage: values.muscle_mass_percentage,
      abdominal_perimeter: values.abdominal_perimeter,
    };
    functionToCall(payload)
      .then(({ data }) => {
        if (data.status === "success") {
          addKeyClinicalHistoryForm(`form_3_${user_id}_${quote_id}`, 100);
          enqueueSnackbar("Guardado correctamente", successToast);
          setIsOpen(false);
          dispatch(updateWelcomeForm(data.data));
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setIsLoading(false));
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="row align-items-center mb-4">
        <div className="col">
          {
            <Typography variant="h5">
              {t("DetailClinicHistory.PhysicalAssessment")}
            </Typography>
          }
          {lastRegistration ? (
            <Typography style={{ fontWeight: "bold" }}>
              Ultimo análisis:{" "}
              {lastRegistration ? (
                <span style={{ fontWeight: "normal" }}>
                  {`${format(
                    addDays(new Date(lastRegistration), 1),
                    "dd LLLL",
                    {
                      locale: es,
                    }
                  )} de ${format(
                    addDays(new Date(lastRegistration), 1),
                    "yyyy"
                  )}`}
                </span>
              ) : (
                <span style={{ fontWeight: "normal" }}>
                  {t("Message.EmptyDatas")}
                </span>
              )}
            </Typography>
          ) : null}
        </div>
        <div className="col-1" style={{ marginRight: "12px" }}>
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="row mb-3">
          <div className="col-4"></div>
          <div className="col-4">
            <Typography variant="body1">
              {t("BodyCompositionForm.LastValue")}
            </Typography>
          </div>
          <div className="col-4">
            <Typography variant="body1">
              {t("BodyCompositionForm.NewValue")}
            </Typography>
          </div>
        </div>
        <div className="row mb-3 container">
          <div className="col-4">
            <Typography variant="body1">
              {t("BodyCompositionForm.Weight")}
            </Typography>
          </div>
          <div className="col-4">
            <div className={classes.iconBoxForm}>
              <Typography variant="body1">{savedForm.weight}(kg)</Typography>
            </div>
          </div>
          <div className="col-4">
            <Controller
              name="weight"
              defaultValue={savedForm?.weight}
              rules={{
                required: false,
              }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  error={errors.weight}
                  inputProps={{ maxLength: 10, min: 0 }}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                  label={t("BodyCompositionForm.Weight")}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <div className="row mb-3 container">
          <div className="col-4">
            <Typography variant="body1">
              {t("BodyCompositionForm.Size")}
            </Typography>
          </div>
          <div className="col-4">
            <div className={classes.iconBoxForm}>
              <Typography variant="body1">{savedForm.height}(cm)</Typography>
            </div>
          </div>
          <div className="col-4">
            <Controller
              name="height"
              defaultValue={savedForm?.height}
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  error={errors.height}
                  label={t("BodyCompositionForm.Size")}
                  inputProps={{ maxLength: 5, min: 0 }}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <div className="row mb-3 container">
          <div className="col-4">
            <Typography variant="body1">
              {t("BodyCompositionForm.Muscle")}
            </Typography>
          </div>
          <div className="col-4">
            <div className={classes.iconBoxForm}>
              <Typography variant="body1">
                {savedForm.muscle_mass_percentage}%
              </Typography>
            </div>
          </div>
          <div className="col-4">
            <Controller
              name="muscle_mass_percentage"
              defaultValue={savedForm?.muscle_mass_percentage}
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={errors.muscle_mass_percentage}
                  type="text"
                  inputProps={{ maxLength: 4, min: 0 }}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                  label={t("BodyCompositionForm.Muscle")}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <div className="row mb-3 container">
          <div className="col-4">
            <Typography variant="body1">{"Muslo"}</Typography>
          </div>
          <div className="col-4">
            <div className={classes.iconBoxForm}>
              <Typography variant="body1">
                {savedForm.thigh_circumference
                  ? `${savedForm?.thigh_circumference}(cm)`
                  : "-"}
              </Typography>
            </div>
          </div>
          <div className="col-4">
            <Controller
              name="thigh_circumference"
              control={control}
              defaultValue={savedForm?.thigh_circumference}
              rules={{ required: false }}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputProps={{ min: 0 }}
                  label={"Muslo(cm)"}
                  error={errors.thigh_circumference}
                  variant="outlined"
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="row mb-3 container">
          <div className="col-4">
            <Typography variant="body1">{"Brazo(cm)"}</Typography>
          </div>
          <div className="col-4">
            <div className={classes.iconBoxForm}>
              <Typography variant="body1">
                {savedForm?.arm_circumference
                  ? `${savedForm?.arm_circumference}(cm)`
                  : "-"}
              </Typography>
            </div>
          </div>
          <div className="col-4">
            <Controller
              name="arm_circumference"
              rules={{ required: false }}
              control={control}
              defaultValue={savedForm?.arm_circumference}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={"Brazo(cm)"}
                  variant="outlined"
                  error={errors.arm_circumference}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="row mb-3 container">
          <div className="col-4">
            <Typography variant="body1">
              {" "}
              {t("BodyCompositionForm.Fat")}
            </Typography>
          </div>
          <div className="col-4">
            <div className={classes.iconBoxForm}>
              <Typography variant="body1">
                {savedForm?.fat_percentage}%
              </Typography>
            </div>
          </div>
          <div className="col-4">
            <Controller
              name="fat_percentage"
              defaultValue={savedForm?.fat_percentage}
              rules={{
                required: false,
              }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={errors.fat_percentage}
                  type="text"
                  inputProps={{ maxLength: 4, min: 0 }}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                  label={t("BodyCompositionForm.Fat")}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <div className="row mb-3 container">
          <div className="col-4">
            <Typography variant="body1">
              {t("BodyCompositionForm.AbdominalPerimeter")}
            </Typography>
          </div>
          <div className="col-4">
            <div className={classes.iconBoxForm}>
              <Typography variant="body1">
                {savedForm.abdominal_perimeter}(cm)
              </Typography>
            </div>
          </div>
          <div className="col-4">
            <Controller
              name="abdominal_perimeter"
              defaultValue={savedForm?.abdominal_perimeter}
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  inputProps={{ max: 3, min: 0 }}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                  type="text"
                  error={errors.abdominal_perimeter}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                  label={t("BodyCompositionForm.AbdominalPerimeter")}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3 container row">
          <Button
            className={classes.buttonBack}
            onClick={() => setIsOpen(false)}
          >
            {t("Btn.Back")}
          </Button>

          <ButtonSave
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit, onError)}
            loader={isLoading}
            text="Guardar"
          />
        </div>
      </form>
    </div>
  );
};

export default BodyCompositionForm;
