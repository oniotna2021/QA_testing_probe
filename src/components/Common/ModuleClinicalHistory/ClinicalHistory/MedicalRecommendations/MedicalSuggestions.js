//REACT
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

//COMPONENTS
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
import ElasticSearchAutocomplete from "components/Shared/ElasticSearchAutocomplete/ElasticSearchAutocomplete";

//UI
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormHelperText from "@material-ui/core/FormHelperText";

//SERVICES
import {
  postMedicalSuggestion,
  getMedicalSuggestionByUser,
} from "services/MedicalSoftware/MedicalSuggestions";
import { getListTypeClassGroup } from "services/MedicalSoftware/ActivityObservations";

//UTILS
import { useStyles } from "utils/useStyles";
import Swal from "sweetalert2";
import {
  addFormsPercentToLocalStorage,
  errorToast,
  mapErrors,
  regexNumbersPositive,
  addKeyClinicalHistoryForm,
} from "utils/misc";

export const MedicalSuggestions = ({
  setIsOpen,
  dateBirth,
  setReload,
  reload,
  setCompleteMedicalSuggestions,
  trainingsLevels,
  medicalConditions,
  goals,
  typeAppointments,
  method,
  modeType,
}) => {
  //INTERNAL OBJECTS
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const formId = 20;
  let percent = {};
  let { user_id, quote_id } = useParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  //CALC AGE USER
  let currentDate = new Date();
  let yearCurrent = currentDate.getFullYear();
  let monthCurrent = currentDate.getMonth();
  let dayCurrent = currentDate.getDate();
  currentDate.setDate(dayCurrent);
  currentDate.setMonth(monthCurrent);
  currentDate.setFullYear(yearCurrent);
  let formatBirth = new Date(dateBirth);
  let age = Math.floor(
    (currentDate - formatBirth) / (1000 * 60 * 60 * 24) / 365
  );
  let calc = 208 - age * 0.7;

  //FORM STEPS
  function getSteps() {
    return [
      "",
      t("MedicalSuggestions.TitleCardio"),
      t("MedicalSuggestions.TitleForce"),
      t("MedicalSuggestions.TitleFlexibility"),
      t("MedicalSuggestions.TitleGroupLesson"),
      t("MedicalSuggestions.TitleRemition"),
    ];
  }

  //INITIAL STATES
  const [referalServices, setReferalServices] = useState([]);
  const [minFrequency, setMinFrequency] = useState();
  const [maxFrequency, setMaxFrequency] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastData, setLastData] = useState({});
  const [fraction, setFraction] = useState("");
  const [isTime, setIsTime] = useState("");
  const [isRepetition, setIsRepetition] = useState("");

  //CURRENT SELECT OPTIONS AUTOCOMPLETE STATES
  const [selectedPathologies, setSelectedPathologies] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedModeCardio, setSelectedModeCardio] = useState([]);
  const [selectedModeForce, setSelectedModeForce] = useState();
  const [listTypeGroup, setListTypeGroup] = useState([]);

  //GET ACTIVE STEP
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  //LOAD LAST DATA USER
  useEffect(() => {
    if (window.localStorage.getItem(`form-${user_id}-${formId}`)) {
      setLoading(true);
      getMedicalSuggestionByUser(user_id)
        .then(({ data }) => {
          if (data && data.data && data.status === "success") {
            setLastData(data.data);
            setValue("pathologies", data.data?.medical_conditions);
            setValue("goals", data.data?.goals);
            setValue("method_id_cardio", {
              id: data.data.training_stages_cardio.method_id,
              name: data.data.training_stages_cardio.method_name,
            });
            setValue("method_id_force", {
              id: data.data.training_stages_force.method_id,
              name: data.data.training_stages_force.method_name,
            });
            setValue("method_id_flexibility", {
              id: data.data.training_stages_flexibility.method_id,
              name: data.data.training_stages_flexibility.method_name,
            });
            setValue(
              "training_stages_group_lessons",
              data.data.training_stages_group_lessons.activities
            );
            setSelectedPathologies(data.data?.medical_conditions);
            setSelectedModeCardio(data.data.training_stages_cardio.mode_type);
            setSelectedGoals(data.data?.goals);
            setFraction(
              data.data.training_stages_cardio.is_fraction.toString()
            );
            setMinFrequency(data.data.training_stages_cardio.min_frequency);
            setMaxFrequency(data.data.training_stages_cardio.max_frequency);
            setSelectedModeForce(data.data.training_stages_force.mode_type);
            setIsRepetition(
              data.data.training_stages_force.is_repetition.toString()
            );
            setReferalServices(data.data.referral_services);
            setIsTime(data.data.training_stages_force.is_time.toString());

            setLoading(false);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data?.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enqueueSnackbar, user_id]);

  useEffect(() => {
    getListTypeClassGroup().then(({ data }) => setListTypeGroup(data.data));
  }, []);

  //HANDLE FUNCTIONS
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  const handleFraction = (e) => {
    setFraction(e.target.value);
  };
  const handleTime = (e) => {
    setIsTime(e.target.value);
  };
  const handleRepetition = (e) => {
    setIsRepetition(e.target.value);
  };
  const handleMinPercent = (e) => {
    let minPercent = e.target.value;
    setMinFrequency(((calc * minPercent) / 100).toFixed(2));
  };
  const handleMaxPercent = (e) => {
    let maxPercent = e.target.value;
    setMaxFrequency(((calc * maxPercent) / 100).toFixed(2));
  };
  const handleChangePathologies = (data) => {
    setSelectedPathologies(data);
  };
  const handleChangeGoals = (data) => {
    setSelectedGoals(data);
  };
  const handleChangeModeCardio = (data) => {
    setSelectedModeCardio(data);
  };
  const handleChangeModeForce = (data) => {
    setSelectedModeForce(data);
  };

  //VALIDATE FIELDS
  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), {
      variant: "info",
      autoHideDuration: 2500,
    });
  };

  //SEND DATA
  const onSubmit = (value) => {
    setLoadingFetchForm(true);
    let dataSubmit = {
      quote_id: parseInt(quote_id),
      user_id: parseInt(user_id),
      referral_services: value?.referral_services?.map((item) => {
        return { referral_service: item.id };
      }),
      observation: value?.observation
        ? value?.observation
        : lastData?.observation,
      training_levels_id: value?.training_level
        ? value?.training_level
        : lastData?.training_level?.id,
      session_number: value?.session_number
        ? value?.session_number
        : lastData?.session_number,
      age: parseInt(age),
      goals: value.goals?.map((x) => {
        return { id: x.id };
      }),
      medical_conditions: value.pathologies?.map((y) => {
        return { id: y.id };
      }),

      training_stages_cardio: {
        is_fraction: fraction
          ? parseInt(fraction)
          : lastData?.training_stages_cardio?.is_fraction,
        start_fraction: value.start_fraction
          ? parseInt(value.start_fraction)
          : lastData?.training_stages_cardio?.start_fraction,
        end_fraction: value.end_fraction
          ? parseInt(value.end_fraction)
          : lastData?.training_stages_cardio?.end_fraction,
        max_age_frequency: value.frequency_calc
          ? parseFloat(value.frequency_calc)
          : lastData?.training_stages_cardio?.max_age_frequency,
        weekly_frequency: value.weekly_frecuency
          ? parseInt(value.weekly_frecuency)
          : lastData?.training_stages_cardio?.weekly_frequency,
        percentage_min_frequency: value.percent_min_heart_rate
          ? parseInt(value.percent_min_heart_rate)
          : lastData?.training_stages_cardio?.percentage_min_frequency,
        percentage_max_frequency: value.percent_max_heart_rate
          ? parseInt(value.percent_max_heart_rate)
          : lastData?.training_stages_cardio?.percentage_max_frequency,
        min_frequency: minFrequency
          ? parseFloat(minFrequency)
          : lastData?.training_stages_cardio?.min_frequency,
        max_frequency: maxFrequency
          ? parseFloat(maxFrequency)
          : lastData?.training_stages_cardio?.max_frequency,
        time: value.time_cardio
          ? value.time_cardio
          : lastData?.training_stages_cardio?.time,
        method_id: value.method_id_cardio.id
          ? value.method_id_cardio.id
          : lastData?.training_stages_cardio?.method_id,
        mode_type: value.mode_type_id?.map((y) => {
          return { id: y.id };
        }),
        progression: value.progression
          ? value.progression
          : lastData?.training_stages_cardio?.progression,
      },

      training_stages_flexibility: {
        time: value.time_flexibility
          ? value.time_flexibility
          : lastData?.training_stages_flexibility?.time,
        weekly_frequency: value.weekly_frecuency_flexibility
          ? parseInt(value.weekly_frecuency_flexibility)
          : lastData?.training_stages_flexibility?.weekly_frequency,
        method_id: value.method_id_flexibility.id
          ? value.method_id_flexibility.id
          : lastData?.training_stages_flexibility?.method_id,
        intensity_repeats_number: value.intensity_repeats_number_flexibility
          ? parseInt(value.intensity_repeats_number_flexibility)
          : lastData?.training_stages_flexibility?.intensity_repeats_number,
        progression: value.progression_flexibility
          ? value.progression_flexibility
          : lastData?.training_stages_flexibility?.progression,
      },

      training_stages_force: {
        weekly_frequency: value.weekly_frecuency_force
          ? parseInt(value.weekly_frecuency_force)
          : lastData?.training_stages_force?.weekly_frequency,
        min_time: value.intensity_min_time_force
          ? value.intensity_min_time_force
          : lastData?.training_stages_force?.min_time,
        max_time: value.intensity_max_time_force
          ? value.intensity_max_time_force
          : lastData?.training_stages_force?.max_time,
        method_id: value.method_id_force.id,
        mode_type: value.mode_type_id_force.map((x) => {
          return { id: x.id };
        }),
        intensity_series_number: value.intensity_series_number
          ? parseInt(value.intensity_series_number)
          : lastData?.training_stages_force?.intensity_series_number,
        percentage_RM_min: parseFloat(value.percent_rm_min),
        percentage_RM_max: parseFloat(value.percent_rm_max),
        intensity_repeats_by_exercise: value.intensity_repeats_by_exercise_force
          ? parseInt(value.intensity_repeats_by_exercise_force)
          : lastData?.training_stages_force?.intensity_repeats_by_exercise,
        progression: value.progression_force,
        is_time: parseInt(isTime),
        is_repetition: parseInt(isRepetition),
      },

      training_stages_group_lessons: {
        weekly_frequency: parseInt(value.weekly_frecuency_group_classes),
        activities: value.training_stages_group_lessons?.map((activity) => {
          return { activity: activity.id };
        }),
        progression: value.progression_group_classes,
      },
    };

    postMedicalSuggestion(dataSubmit)
      .then((req) => {
        if (req && req.data && req.data.status === "success") {
          percent = { id: 20, completed: req.data.data };
          addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
          addFormsPercentToLocalStorage(percent);
          setIsOpen(false);
          setCompleteMedicalSuggestions(1);
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
        } else {
          Swal.fire({
            title: mapErrors(req.data),
            icon: "error",
          });
        }
        setReload(!reload);
        setLoadingFetchForm(false);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
        setLoadingFetchForm(false);
      });
  };

  //FUNCTION TO RENDER ACTIVE STEP
  function getStepContent(stepIdx) {
    switch (stepIdx) {
      case 0:
        return (
          <div className="d-flex flex-column align-items-center">
            {/*MEDICAL*/}
            {loading ? (
              <Loading />
            ) : (
              <div className="row">
                <div className="col-12">
                  {/*SELECT LEVELS*/}
                  <Controller
                    control={control}
                    name="training_level"
                    rules={{ required: true }}
                    defaultValue={lastData && lastData?.training_levels_id}
                    render={({ field }) => (
                      <FormControl
                        variant="outlined"
                        className="my-2"
                        error={errors.training_level ? true : false}
                      >
                        <InputLabel id="select">
                          {t("ListTrainingLevels.Container")}
                        </InputLabel>
                        <Select
                          labelId="select"
                          label={t("ListTrainingLevels.Container")}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        >
                          {trainingsLevels.data.map((res) => (
                            <MenuItem key={res.name} value={res.id}>
                              {res.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
                <div className="col-12">
                  <></>
                  <></>
                  <Controller
                    control={control}
                    name="session_number"
                    defaultValue={lastData && lastData?.session_number}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        inputProps={{ maxLength: 1 }}
                        id="weekly_frecuency"
                        error={errors.session_number ? true : false}
                        variant="outlined"
                        label={t("MedicalSuggestions.InputNumberSessionsWeek")}
                        className="mb-2"
                      />
                    )}
                  />
                </div>
                <div className="container">
                  <div className="col">
                    {/*SELECT PATHOLOGIES*/}
                    <div className="col-12">
                      <ControlledAutocomplete
                        control={control}
                        handleChange={handleChangePathologies}
                        defaultValue={selectedPathologies}
                        name="pathologies"
                        required={true}
                        options={medicalConditions.data || []}
                        getOptionLabel={(option) => `${option.name}`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("Pathologies.Title")}
                            variant="outlined"
                            margin="normal"
                            error={errors.pathologies ? true : false}
                          />
                        )}
                      />
                    </div>
                    {/*SELECT GOALS*/}
                    <div className="col-12 my-2">
                      <ControlledAutocomplete
                        control={control}
                        name="goals"
                        required={true}
                        handleChange={handleChangeGoals}
                        defaultValue={selectedGoals}
                        options={goals.data}
                        getOptionLabel={(option) => `${option.name}`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("Objective.Title")}
                            error={errors.goals ? true : false}
                            variant="outlined"
                            margin="normal"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="d-flex flex-column align-items-center">
            {/*CARDIO*/}
            {loading ? (
              <Loading />
            ) : (
              <div className="row">
                <div className="col-12">
                  <div></div>
                  {/*TEXTFIELD WEEKLY FRECUENCY CARDIO*/}
                  <Controller
                    control={control}
                    name="weekly_frecuency"
                    rules={{ required: true }}
                    defaultValue={
                      lastData &&
                      lastData?.training_stages_cardio?.weekly_frequency
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        inputProps={{ maxLength: 1, min: 0, max: 7 }}
                        id="weekly_frecuency"
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        error={errors.weekly_frecuency ? true : false}
                        variant="outlined"
                        label={t("MedicalSuggestions.InputNumberDaysWeek")}
                        className="mb-2"
                      />
                    )}
                  />
                </div>
                <div className="col-12 mb-2">
                  {/*TEXTFIELD FREQUENCY CALCULATE*/}
                  <Controller
                    control={control}
                    name="frequency_calc"
                    defaultValue={calc}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        id="time_cardio"
                        disabled={true}
                        value={calc}
                        variant="outlined"
                        label={t(
                          "MedicalSuggestions.InputFrequencyMaxCalculate"
                        )}
                      />
                    )}
                  />
                </div>
                {/*BUTTON IS FRACTION*/}
                <div className="d-flex justify-content-center">
                  <Controller
                    name="is_fraction"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={fraction ? fraction : ""}
                    render={({ field }) => (
                      <FormControl
                        component="fieldset"
                        error={errors.is_fraction}
                      >
                        <RadioGroup
                          {...field}
                          row
                          name="fraction"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleFraction(e);
                          }}
                          value={fraction}
                        >
                          <div className="col d-flex align-items-center">
                            <Typography>
                              {t("MedicalSuggestions.TitleFraction")}
                            </Typography>
                            <div className=" col d-flex justify-content-end">
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label={t("MedicalSuggestions.LabelButtonYes")}
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label={t("MedicalSuggestions.LabelButtonNo")}
                              />
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.is_fraction && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -12, marginBottom: 5 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}

                {fraction === "1" && (
                  <React.Fragment>
                    <div className="col-6 mb-2">
                      {/*TEXTFIELD START-FRACTION*/}
                      <Controller
                        control={control}
                        name="start_fraction"
                        rules={{ required: fraction === "1" ? true : false }}
                        defaultValue={
                          lastData &&
                          lastData.training_stages_cardio?.start_fraction
                        }
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="start_fraction"
                            variant="outlined"
                            error={errors.start_fraction}
                            onKeyUp={(e) => {
                              if (regexNumbersPositive.test(e.target.value)) {
                                field.onChange(e.target.value);
                              } else {
                                e.target.value = "";
                                field.onChange("");
                              }
                            }}
                            label={t("MedicalSuggestions.InitialFraction")}
                          />
                        )}
                      />
                    </div>
                    <div className="col-6 mb-2">
                      {/*TEXTFIELD END-FRACTION*/}
                      <Controller
                        control={control}
                        name="end_fraction"
                        rules={{ required: fraction === "1" ? true : false }}
                        defaultValue={
                          lastData &&
                          lastData.training_stages_cardio?.end_fraction
                        }
                        render={({ field }) => (
                          <TextField
                            {...field}
                            onKeyUp={(e) => {
                              if (regexNumbersPositive.test(e.target.value)) {
                                field.onChange(e.target.value);
                              } else {
                                e.target.value = "";
                                field.onChange("");
                              }
                            }}
                            error={errors.end_fraction}
                            id="end_fraction"
                            variant="outlined"
                            label={t("MedicalSuggestions.EndFraction")}
                          />
                        )}
                      />
                    </div>
                  </React.Fragment>
                )}
                <div className="col-12">
                  {/*TEXTFIELD TIME CARDIO*/}
                  <Controller
                    control={control}
                    name="time_cardio"
                    rules={{ required: true }}
                    defaultValue={
                      lastData && lastData?.training_stages_cardio?.time
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        id="time_cardio"
                        variant="outlined"
                        inputProps={{ min: 1, maxLength: 3 }}
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        error={errors.time_cardio ? true : false}
                        label={t("MedicalSuggestions.InputTime")}
                        className="me-1"
                      />
                    )}
                  />
                </div>
                <div className="col-6 mt-2">
                  {/*SELECT METHOD CARDIO*/}
                  <Controller
                    name="method_id_cardio"
                    rules={{ required: true }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        onChange={(_, data) => {
                          onChange(data);
                        }}
                        options={method}
                        defaultValue={value}
                        noOptionsText={t("ListPermissions.NoData")}
                        getOptionLabel={(option) => option?.name}
                        renderOption={(option) => (
                          <React.Fragment>
                            <Typography variant="body2">
                              {option?.name}
                            </Typography>
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("MedicalSuggestions.SelectMethod")}
                            error={errors.method_id_cardio}
                            variant="outlined"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password", // disable autocomplete and autofill
                            }}
                          />
                        )}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  {/*SELECT MODE TYPE CARDIO*/}
                  <ControlledAutocomplete
                    control={control}
                    defaultValue={selectedModeCardio}
                    handleChange={handleChangeModeCardio}
                    required={true}
                    name="mode_type_id"
                    options={modeType}
                    getOptionLabel={(option) => {
                      return "" + option?.name;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={errors.mode_type_id}
                        label={t("MedicalSuggestions.SelectModeType")}
                        variant="outlined"
                        margin="normal"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-6 mb-2">
                  {/*TEXTFIELD PERCENT MIN HEART RATE CARDIO*/}
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      lastData &&
                      lastData.training_stages_cardio?.percentage_min_frequency
                    }
                    name="percent_min_heart_rate"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          handleMinPercent(e);
                          field.onChange(e.target.value);
                        }}
                        id="percent_min_heart_rate"
                        inputProps={{ min: 1, maxLength: 3 }}
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        error={errors.percent_min_heart_rate}
                        variant="outlined"
                        label={t("MedicalSuggestions.InputPorcentFrequencyMin")}
                      />
                    )}
                  />
                </div>
                <div className="col-6 mb-2">
                  {/*TEXTFIELD PERCENT MAX RATE CARDIO*/}
                  <Controller
                    control={control}
                    name="percent_max_heart_rate"
                    rules={{ required: true }}
                    defaultValue={
                      lastData &&
                      lastData.training_stages_cardio?.percentage_max_frequency
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) => {
                          handleMaxPercent(e);
                          field.onChange(e.target.value);
                        }}
                        id="percent_max_heart_rate"
                        inputProps={{ min: 1, maxLength: 3 }}
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        variant="outlined"
                        error={errors.percent_max_heart_rate}
                        label={t("MedicalSuggestions.InputPorcentFrequencyMax")}
                      />
                    )}
                  />
                </div>
                <div className="col-6">
                  {/*TEXTFIELD MIN HEART RATE CARDIO*/}
                  <Controller
                    control={control}
                    name="intensity_min_heart_rate"
                    defaultValue={minFrequency}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="intensity_min_heart_rate"
                        variant="outlined"
                        disabled={true}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={minFrequency}
                        label={t("MedicalSuggestions.InputMinHeartRate")}
                      />
                    )}
                  />
                </div>
                <div className="col-6 mb-2">
                  {/*TEXTFIELD HEART MAX RATE CARDIO*/}
                  <Controller
                    control={control}
                    name="intensity_max_heart_rate"
                    defaultValue={maxFrequency}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="intensity_max_heart_rate"
                        value={maxFrequency}
                        disabled={true}
                        onChange={(e) => field.onChange(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                        label={t("MedicalSuggestions.InputMaxHeartRate")}
                      />
                    )}
                  />
                </div>
                <div className="col-12">
                  {/*TEXTFIELD PROGRESSION CARDIO*/}
                  <Controller
                    control={control}
                    name="progression"
                    rules={{ required: false }}
                    defaultValue={
                      lastData && lastData.training_stages_cardio?.progression
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="progression"
                        multiline
                        error={errors.progression}
                        rows={4}
                        variant="outlined"
                        label={t("MedicalSuggestions.InputProgression")}
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="d-flex flex-column align-items-center">
            {/*FORCE*/}
            <div></div>
            <div className="row">
              <div className="col-12">
                <Controller
                  control={control}
                  defaultValue={
                    lastData && lastData.training_stages_force?.weekly_frequency
                  }
                  name="weekly_frecuency_force"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      inputProps={{ maxLength: 1 }}
                      onKeyUp={(e) => {
                        if (regexNumbersPositive.test(e.target.value)) {
                          field.onChange(e.target.value);
                        } else {
                          e.target.value = "";
                          field.onChange("");
                        }
                      }}
                      id="weekly_frecuency_force"
                      variant="outlined"
                      label={t("MedicalSuggestions.InputNumberDaysWeek")}
                      error={errors.weekly_frecuency_force}
                      className="mb-2"
                    />
                  )}
                />
              </div>
              <div className="col-6 mt-2">
                <Controller
                  name="method_id_force"
                  rules={{ required: true }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      onChange={(_, data) => {
                        onChange(data);
                      }}
                      options={method}
                      defaultValue={value}
                      noOptionsText={t("ListPermissions.NoData")}
                      getOptionLabel={(option) => option?.name}
                      renderOption={(option) => (
                        <React.Fragment>
                          <Typography variant="body2">
                            {option?.name}
                          </Typography>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("MedicalSuggestions.SelectMethod")}
                          variant="outlined"
                          error={errors.method_id_force}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  )}
                />
              </div>
              <div className="col-6 ">
                <ControlledAutocomplete
                  defaultValue={selectedModeForce}
                  handleChange={handleChangeModeForce}
                  control={control}
                  required={true}
                  name="mode_type_id_force"
                  options={modeType}
                  getOptionLabel={(option) => `${option.name}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("MedicalSuggestions.SelectModeType")}
                      variant="outlined"
                      error={errors.mode_type_id_force}
                      margin="normal"
                    />
                  )}
                />
              </div>
              <div className="col-12">
                <Controller
                  control={control}
                  rules={{ required: true }}
                  defaultValue={
                    lastData &&
                    lastData.training_stages_force?.intensity_series_number
                  }
                  name="intensity_series_number"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      onKeyUp={(e) => {
                        if (regexNumbersPositive.test(e.target.value)) {
                          field.onChange(e.target.value);
                        } else {
                          e.target.value = "";
                          field.onChange("");
                        }
                      }}
                      inputProps={{ maxLength: 2 }}
                      error={errors.intensity_series_number}
                      label={t("MedicalSuggestions.InputSeriesNumber")}
                      className="mb-2"
                    />
                  )}
                />
              </div>
              <div className="col-6 mb-2">
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="percent_rm_min"
                  defaultValue={
                    lastData &&
                    lastData.training_stages_force?.percentage_RM_min
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      onKeyUp={(e) => {
                        if (regexNumbersPositive.test(e.target.value)) {
                          field.onChange(e.target.value);
                        } else {
                          e.target.value = "";
                          field.onChange("");
                        }
                      }}
                      inputProps={{ min: 1 }}
                      error={errors.percent_rm_min}
                      variant="outlined"
                      label={t("MedicalSuggestions.InputPorcentRMMin")}
                    />
                  )}
                />
              </div>
              <div className="col-6 mb-2">
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="percent_rm_max"
                  defaultValue={
                    lastData &&
                    lastData.training_stages_force?.percentage_RM_max
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      onKeyUp={(e) => {
                        if (regexNumbersPositive.test(e.target.value)) {
                          field.onChange(e.target.value);
                        } else {
                          e.target.value = "";
                          field.onChange("");
                        }
                      }}
                      inputProps={{ min: 1 }}
                      error={errors.percent_rm_max}
                      variant="outlined"
                      label={t("MedicalSuggestions.InputPorcentRMMax")}
                    />
                  )}
                />
              </div>
              <div className="d-flex justify-content-center">
                <Controller
                  name="is_time"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={isTime}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup
                        {...field}
                        row
                        onChange={(e) => {
                          handleTime(e);
                          field.onChange(e.target.value);
                        }}
                        value={isTime}
                      >
                        <div className="col d-flex align-items-center">
                          <Typography>
                            {t("MedicalSuggestions.TitleIsTime")}
                          </Typography>
                          <div className=" col d-flex justify-content-end">
                            <FormControlLabel
                              value="1"
                              control={<Radio color="primary" />}
                              label={t("MedicalSuggestions.LabelButtonYes")}
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio color="primary" />}
                              label={t("MedicalSuggestions.LabelButtonNo")}
                            />
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.is_time && (
                <div className="d-flex justify-content-end">
                  <FormHelperText
                    style={{ marginTop: -12, marginBottom: 5 }}
                    error={true}
                  >
                    {t("Message.AlertSelectOption")}
                  </FormHelperText>{" "}
                </div>
              )}
              {isTime === "1" && (
                <React.Fragment>
                  <div className="col-6">
                    <Controller
                      control={control}
                      name="intensity_min_time_force"
                      rules={{ required: isTime === "1" ? true : false }}
                      defaultValue={
                        lastData && lastData.training_stages_force?.min_time
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          onKeyUp={(e) => {
                            if (regexNumbersPositive.test(e.target.value)) {
                              field.onChange(e.target.value);
                            } else {
                              e.target.value = "";
                              field.onChange("");
                            }
                          }}
                          inputProps={{ maxLength: 2, min: 1 }}
                          error={errors.intensity_min_time_force}
                          variant="outlined"
                          label={t("MedicalSuggestions.InputMinTime")}
                        />
                      )}
                    />
                  </div>
                  <div className="col-6">
                    <Controller
                      control={control}
                      name="intensity_max_time_force"
                      rules={{ required: isTime === "1" ? true : false }}
                      defaultValue={
                        lastData && lastData.training_stages_force?.max_time
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="outlined"
                          onKeyUp={(e) => {
                            if (regexNumbersPositive.test(e.target.value)) {
                              field.onChange(e.target.value);
                            } else {
                              e.target.value = "";
                              field.onChange("");
                            }
                          }}
                          error={errors.intensity_max_time_force}
                          inputProps={{ maxLength: 2, min: 1 }}
                          label={t("MedicalSuggestions.InputMaxTime")}
                        />
                      )}
                    />
                  </div>
                </React.Fragment>
              )}
              <div className="d-flex justify-content-center">
                <Controller
                  name="is_repetition"
                  control={control}
                  defaultValue={isRepetition}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup
                        {...field}
                        row
                        name="repetition"
                        onChange={(e) => {
                          handleRepetition(e);
                          field.onChange(e.target.value);
                        }}
                        value={isRepetition}
                      >
                        <div className="col d-flex align-items-center">
                          <Typography>
                            {t("MedicalSuggestions.TitleIsRepetition")}
                          </Typography>
                          <div className=" col d-flex justify-content-end">
                            <FormControlLabel
                              value="1"
                              control={<Radio color="primary" />}
                              label={t("MedicalSuggestions.LabelButtonYes")}
                            />
                            <FormControlLabel
                              value="2"
                              control={<Radio color="primary" />}
                              label={t("MedicalSuggestions.LabelButtonNo")}
                            />
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </div>
              {errors.is_repetition && (
                <div className="d-flex justify-content-end">
                  <FormHelperText
                    style={{ marginTop: -12, marginBottom: 5 }}
                    error={true}
                  >
                    {t("Message.AlertSelectOption")}
                  </FormHelperText>{" "}
                </div>
              )}
              {isRepetition === "1" && (
                <div className="col-12 mt-2">
                  <Controller
                    control={control}
                    name="intensity_repeats_by_exercise_force"
                    rules={{ required: isRepetition === "1" ? true : false }}
                    defaultValue={
                      lastData &&
                      lastData.training_stages_force
                        ?.intensity_repeats_by_exercise
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        error={errors.intensity_repeats_by_exercise_force}
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        label={t("MedicalSuggestions.InputRepeatsByExercise")}
                        className="mb-2"
                      />
                    )}
                  />
                </div>
              )}
              <div className="col-12">
                <Controller
                  control={control}
                  name="progression_force"
                  rules={{ required: false }}
                  defaultValue={
                    lastData && lastData.training_stages_force?.progression
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      error={errors.progression_force}
                      rows={4}
                      variant="outlined"
                      label={t("MedicalSuggestions.InputProgression")}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="d-flex flex-column align-items-center">
            {/*FLEXIBILITY*/}
            <div className="row">
              <div className="col-12">
                <div></div>
                {/*TEXTFIELD WEEKLY FRECUENCY FLEXIBILITY*/}
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="weekly_frecuency_flexibility"
                  defaultValue={
                    lastData &&
                    lastData.training_stages_flexibility?.weekly_frequency
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      variant="outlined"
                      onKeyUp={(e) => {
                        if (regexNumbersPositive.test(e.target.value)) {
                          field.onChange(e.target.value);
                        } else {
                          e.target.value = "";
                          field.onChange("");
                        }
                      }}
                      error={errors.weekly_frecuency_flexibility}
                      inputProps={{ maxLength: 1 }}
                      label={t("MedicalSuggestions.InputNumberDaysWeek")}
                      className="mb-2"
                    />
                  )}
                />
              </div>
              <div className="col-12 mt-2">
                {/*TEXTFIELD REPEATS NUMBER FLEXIBILITY*/}
                <Controller
                  control={control}
                  rules={{ required: true }}
                  defaultValue={
                    lastData &&
                    lastData.training_stages_flexibility
                      ?.intensity_repeats_number
                  }
                  name="intensity_repeats_number_flexibility"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      inputProps={{ maxLength: 2 }}
                      onKeyUp={(e) => {
                        if (regexNumbersPositive.test(e.target.value)) {
                          field.onChange(e.target.value);
                        } else {
                          e.target.value = "";
                          field.onChange("");
                        }
                      }}
                      variant="outlined"
                      error={errors.intensity_repeats_number_flexibility}
                      label={t("MedicalSuggestions.InputRepeatsByExercise")}
                      className="mb-2"
                    />
                  )}
                />
              </div>
              <div className="col-12">
                {/*TEXTFIELD TIME FLEXIBILITY*/}
                <Controller
                  control={control}
                  rules={{ required: true }}
                  name="time_flexibility"
                  defaultValue={
                    lastData && lastData.training_stages_flexibility?.time
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      onKeyUp={(e) => {
                        if (regexNumbersPositive.test(e.target.value)) {
                          field.onChange(e.target.value);
                        } else {
                          e.target.value = "";
                          field.onChange("");
                        }
                      }}
                      error={errors.time_flexibility}
                      type="number"
                      variant="outlined"
                      label={t("MedicalSuggestions.InputTime")}
                    />
                  )}
                />
              </div>
              <div className="col-12 my-2">
                {/*SELECT METHOD FLEXIBILITY*/}
                <Controller
                  name="method_id_flexibility"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      onChange={(_, data) => {
                        onChange(data);
                      }}
                      options={method}
                      defaultValue={value}
                      noOptionsText={t("ListPermissions.NoData")}
                      getOptionLabel={(option) => option?.name}
                      renderOption={(option) => (
                        <React.Fragment>
                          <Typography variant="body2">
                            {option?.name}
                          </Typography>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("MedicalSuggestions.SelectMethod")}
                          variant="outlined"
                          error={errors.method_id_flexibility}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  )}
                />
              </div>
              <div className="col-12">
                {/*TEXTFIELD PROGRESSION FLEXIBILITY*/}
                <Controller
                  control={control}
                  defaultValue={
                    lastData &&
                    lastData.training_stages_flexibility?.progression
                  }
                  name="progression_flexibility"
                  rules={{ required: false }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={errors.progression_flexibility}
                      multiline
                      rows={4}
                      variant="outlined"
                      label={t("MedicalSuggestions.InputProgression")}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <>
            <div className="d-flex flex-column align-items-center">
              <div></div>
              {/* GROUP CLASSES*/}
              <div className="row">
                <div className="col-12">
                  {/*TEXTFIELD WEEKLY FRECUENCY GROUP CLASSES*/}
                  <Controller
                    control={control}
                    rules={{ required: false }}
                    defaultValue={
                      lastData &&
                      lastData.training_stages_group_lessons?.weekly_frequency
                    }
                    name="weekly_frecuency_group_classes"
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="weekly_frecuency_group_classes"
                        variant="outlined"
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        error={errors.weekly_frecuency_group_classes}
                        inputProps={{ maxLength: 1 }}
                        label={t("MedicalSuggestions.InputNumberDaysWeek")}
                        className="mb-2"
                      />
                    )}
                  />
                </div>
                <div className="col-12 my-2">
                  {/*SELECT METHOD GROUP CLASSES*/}
                  <Controller
                    name="training_stages_group_lessons"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        onChange={(_, data) => {
                          onChange(data);
                        }}
                        options={listTypeGroup}
                        defaultValue={value}
                        multiple={true}
                        noOptionsText={t("ListPermissions.NoData")}
                        getOptionLabel={(option) => option?.name}
                        renderOption={(option) => (
                          <React.Fragment>
                            <Typography variant="body2">
                              {option?.name}
                            </Typography>
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={"Actividades grupales"}
                            variant="outlined"
                            error={errors.training_stages_group_lessons}
                          />
                        )}
                      />
                    )}
                  />
                </div>
                <div className="col-12">
                  {/*TEXTFIELD PROGRESSION GROUP CLASSES*/}
                  <Controller
                    control={control}
                    defaultValue={
                      lastData &&
                      lastData.training_stages_group_lessons?.progression
                    }
                    name="progression_group_classes"
                    rules={{ required: false }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        error={errors.progression_group_classes}
                        rows={4}
                        variant="outlined"
                        label={t("MedicalSuggestions.InputProgression")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </>
        );
      case 5:
        return (
          <div className="d-flex flex-column align-items-center">
            <div className="col-12 mb-3">
              <ElasticSearchAutocomplete
                control={control}
                elasticIndex="referral_services_all"
                name={"referral_services"}
                required={true}
                label={"Servicio de remisión"}
                error={errors.referral_services}
                defaultValue={referalServices}
                setValue={setValue}
                multiple={true}
              />
            </div>
            <Controller
              control={control}
              name="observation"
              defaultValue={lastData && lastData?.observation}
              render={({ field }) => (
                <TextField
                  {...field}
                  multiline
                  rows={4}
                  variant="outlined"
                  label={t("MedicalSuggestions.Observation")}
                />
              )}
            />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="container p-3">
      <form
        className="d-flex flex-column align-items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="row d-flex align-items-center">
          <div className="col">
            <Typography variant="h5">
              {" "}
              {`${t("MedicalSuggestions.Recomendations")} ${steps[activeStep]}`}
            </Typography>
            <Typography varianrt="body2">{`${t(
              "MedicalSuggestions.PacientAge"
            )} ${age} ${t("MedicalSuggestions.Age")}`}</Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        <div className="d-flex flex-column mt-4" style={{ width: "100%" }}>
          {activeStep === steps.lenght ? (
            <div>
              <Typography className="my-1">
                {t("MedicalSuggestions.StepsCompleted")}
              </Typography>
              <Button onClick={handleReset}>{t("Btn.Reset")}</Button>
            </div>
          ) : (
            <div>
              <div className="mt-1">{getStepContent(activeStep)}</div>
              <div className="row m-0 mt-3">
                <div className="col-6 d-flex justify-content-center align-items-center">
                  <Button
                    disabled={activeStep === 0}
                    className={classes.buttonBack}
                    fullWidth
                    onClick={handleBack}
                    style={{ marginRight: 30 }}
                  >
                    {t("MedicalSuggestions.ButtonBack")}
                  </Button>
                </div>
                <div className="col-6 d-flex justify-content-center align-items-center">
                  {activeStep === 5 && (
                    <ButtonSave
                      text={t("Btn.save")}
                      loader={loadingFetchForm}
                    />
                  )}
                  {activeStep !== 5 && (
                    <Button
                      className={classes.button}
                      variant="contained"
                      fullWidth
                      onClick={handleSubmit(handleNext, onError)}
                    >
                      {steps[activeStep + 1]}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
