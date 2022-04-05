// react
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// ui
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

// utils
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  mapErrors,
  infoToast,
  successToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import { postWelcomeForm } from "services/VirtualJourney/WelcomeForm";
import { getCardiacDiseases } from "services/VirtualJourney/HealthCondition";

const PhysicalBackground = ({ setIsOpen, setReloadInfo }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { user_id, quote_id } = useParams();

  const lastPositionForm = useSelector((state) =>
    state.virtualJourney.welcomeForm.form_cardiac
      ? state.virtualJourney.welcomeForm.form_cardiac.length
      : null
  );
  const savedForm = useSelector(
    (state) =>
      state.virtualJourney.welcomeForm.form_cardiac &&
      state.virtualJourney.welcomeForm.form_cardiac[lastPositionForm - 1]
  );

  const [loadingFetchForm, setLoadingFetchForm] = useState(false);
  const dispatch = useDispatch();

  //STATES QUESTIONS
  const [diagnosed, setDiagnosed] = useState(
    savedForm?.diagnosed_heart_exercise_medical_supervision || ""
  );
  const [chestPain, setChestPain] = useState(
    savedForm?.chest_pain_associated_exercise || ""
  );
  const [chestPainMonth, setChestPainMonth] = useState(
    savedForm?.chest_pain_last_month || ""
  );
  const [fading, setFading] = useState(
    savedForm?.experienced_fainting_consciousness || ""
  );
  const [bloodPressure, setBloodPressure] = useState(
    savedForm?.prescribed_medication_cardiovascular_disease || ""
  );
  const [muscleDiscomfort, setMuscleDiscomfort] = useState(
    savedForm?.osteoarticular_discomfort_worsens_exercise || ""
  );
  const [pregnancy, setPregnancy] = useState(
    savedForm?.aware_medical_health_conditions_prevent_exercising || ""
  );

  const [selectPregnancy, setSelectPregnancy] = useState();

  // state enfermedades
  const [cardiacDiseases, setCardiacDiseases] = useState();

  //STATE STEPS
  const [step, setStep] = useState(0);

  // consulta enfermedades cardiacas
  useEffect(() => {
    getCardiacDiseases().then(({ data }) => {
      if (data.data && data.status === "success") {
        setCardiacDiseases(data.data);
      } else {
        enqueueSnackbar(mapErrors(data), errorToast);
      }
    });
  }, [enqueueSnackbar]);

  //SEND DATA
  const onSubmit = (value) => {
    setLoadingFetchForm(true);
    value.quote_id = quote_id;
    value.user_id = user_id;
    value.form = 6;

    postWelcomeForm(value)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_6_${user_id}_${quote_id}`, 100);
          dispatch(updateWelcomeForm(data.data));
          setIsOpen(false);
          setReloadInfo((prev) => !prev);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingFetchForm(false);
      });
  };

  const handleChangeDiseases = (e) => {
    setSelectPregnancy(e);
  };

  //NEXT STEP
  const handleNextStep = () => {
    setStep(step + 1);
  };

  //ERROR
  const onError = () => {
    enqueueSnackbar("Debes completar todos los campos", infoToast);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <div className="col-12 d-flex justify-content-between">
          <div className="col-10">
            <Typography variant="h5">
              {t("NutritionSuggestions.SectionOne")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>

        {step === 0 ? (
          <div>
            {/* enfermedad cardiaca */}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">
                {t("PhysicalBackground.PhysicalDiseases")}
              </div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="diagnosed_heart_exercise_medical_supervision"
                  defaultValue={
                    savedForm?.diagnosed_heart_exercise_medical_supervision
                  }
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={
                        errors.diagnosed_heart_exercise_medical_supervision
                          ? true
                          : false
                      }
                    >
                      <RadioGroup
                        {...field}
                        row
                        defaultValue={
                          savedForm?.diagnosed_heart_exercise_medical_supervision
                        }
                        name="diagnosed_heart_exercise_medical_supervision"
                        onChange={(e) => {
                          setDiagnosed(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.diagnosed_heart_exercise_medical_supervision && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {diagnosed === "Si" ? (
                <>
                  <div className="col-12 my-3">
                    <Controller
                      rules={{
                        required: diagnosed === "Si" ? true : false,
                      }}
                      control={control}
                      name="heart_diseases_id"
                      defaultValue={savedForm?.heart_diseases_id}
                      render={({ field }) => (
                        <FormControl
                          variant="outlined"
                          error={errors.heart_diseases_id ? true : false}
                        >
                          <InputLabel id="heart_diseases_id">
                            {t("PhysicalBackground.CardiacDiseases")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="heart_diseases_id"
                            label={t("PhysicalBackground.CardiacDiseases")}
                            onChange={(e) => {
                              handleChangeDiseases(e.target.value);
                              field.onChange(e.target.value);
                            }}
                          >
                            {cardiacDiseases?.map((item) => (
                              <MenuItem key={`id - ${item.id}`} value={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/* dolor en el pecho  */}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">{t("PhysicalBackground.ChestPain")}</div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="chest_pain_associated_exercise"
                  defaultValue={savedForm?.chest_pain_associated_exercise}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={
                        errors.chest_pain_associated_exercise ? true : false
                      }
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="chest_pain_associated_exercise"
                        onChange={(e) => {
                          setChestPain(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.chest_pain_associated_exercise && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {chestPain === "Si" ? (
                <>
                  <div className="my-3">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="description_chest_associated_exercise"
                      defaultValue={
                        savedForm?.description_chest_associated_exercise
                      }
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("WeeklyNutrition.InputDescription")}
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/* dolor en el pecho durante el último mes */}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">
                {t("PhysicalBackground.ChestPainLastMonth")}
              </div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="chest_pain_last_month"
                  defaultValue={savedForm?.chest_pain_last_month}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.chest_pain_last_month ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="chest_pain_last_month"
                        onChange={(e) => {
                          setChestPainMonth(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.chest_pain_last_month && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {chestPainMonth === "Si" ? (
                <>
                  <div className="my-3">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="description_chest_pain_last_month"
                      defaultValue={
                        savedForm?.description_chest_pain_last_month
                      }
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label="Descripcion"
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/*  sensación desvanecimiento */}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">
                {t("PhysicalBackground.FaintingConsciousness")}
              </div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="experienced_fainting_consciousness"
                  defaultValue={savedForm?.experienced_fainting_consciousness}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={
                        errors.experienced_fainting_consciousness ? true : false
                      }
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="experienced_fainting_consciousness"
                        onChange={(e) => {
                          setFading(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.experienced_fainting_consciousness && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {fading === "Si" ? (
                <>
                  <div className="my-3">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="description_experienced_fainting_consciousness"
                      defaultValue={
                        savedForm?.description_experienced_fainting_consciousness
                      }
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label="Descripcion"
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : step === 1 ? (
          <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            {/* medicamentos para la tensión */}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">
                {t("PhysicalBackground.PrescribedMedication")}
              </div>
              <div className="col-5 ">
                <Controller
                  control={control}
                  name="prescribed_medication_cardiovascular_disease"
                  defaultValue={
                    savedForm?.prescribed_medication_cardiovascular_disease
                  }
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={
                        errors.prescribed_medication_cardiovascular_disease
                          ? true
                          : false
                      }
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="prescribed_medication_cardiovascular_disease"
                        onChange={(e) => {
                          setBloodPressure(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.prescribed_medication_cardiovascular_disease && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {bloodPressure === "Si" ? (
                <>
                  <div className="my-3">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="description_prescribed_medication_cardiovascular"
                      defaultValue={
                        savedForm?.description_prescribed_medication_cardiovascular
                      }
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label="Descripcion"
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/* molestia osteoarticular */}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">
                {t("PhysicalBackground.OsteoarticularDiscomfortWorsens")}
              </div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="osteoarticular_discomfort_worsens_exercise"
                  defaultValue={
                    savedForm?.osteoarticular_discomfort_worsens_exercise
                  }
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={
                        errors.osteoarticular_discomfort_worsens_exercise
                          ? true
                          : false
                      }
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="osteoarticular_discomfort_worsens_exercise"
                        onChange={(e) => {
                          setMuscleDiscomfort(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.osteoarticular_discomfort_worsens_exercise && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {muscleDiscomfort === "Si" ? (
                <>
                  <div className="my-3">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="description_osteoarticular_discomfort_worsens_exercise"
                      defaultValue={
                        savedForm?.description_osteoarticular_discomfort_worsens_exercise
                      }
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label="Descripcion"
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/*  conocimiento de alguna condición médica */}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7">
                {t("PhysicalBackground.AwareMedicalHealth")}
              </div>
              <div className="col-5">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="aware_medical_health_conditions_prevent_exercising"
                  defaultValue={
                    savedForm?.aware_medical_health_conditions_prevent_exercising
                  }
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={
                        errors.aware_medical_health_conditions_prevent_exercising
                          ? true
                          : false
                      }
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="aware_medical_health_conditions_prevent_exercising"
                        onChange={(e) => {
                          setPregnancy(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.aware_medical_health_conditions_prevent_exercising && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {pregnancy === "Si" ? (
                <>
                  <div className="my-3">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="description_medical_health_conditions_exercising"
                      defaultValue={
                        savedForm?.description_medical_health_conditions_exercising
                      }
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label="Descripcion"
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {/*SECCION BOTONES*/}
        <div className="col-12 d-flex justify-content-around mt-3">
          <div>
            <Button
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className={classes.buttonBack}
            >
              {t("MedicalSuggestions.ButtonBack")}
            </Button>
          </div>
          <div>
            {step === 0 ? (
              <div>
                <Button
                  onClick={handleSubmit(handleNextStep, onError)}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                >
                  {t("Btn.Next")}
                </Button>
              </div>
            ) : (
              <div>
                <ButtonSave
                  onClick={handleSubmit(onSubmit, onError)}
                  loader={loadingFetchForm}
                  text={t("Btn.save")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default PhysicalBackground;
