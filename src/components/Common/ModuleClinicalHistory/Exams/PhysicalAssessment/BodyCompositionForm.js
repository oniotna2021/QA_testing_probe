//REACT
import React, { useEffect, useState } from "react";

//IMPORTS
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";

//date-fns
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

//UTILS
import {
  addKeyClinicalHistoryForm,
  errorToast,
  mapErrors,
  addFormsPercentToLocalStorage,
  regexOnlyPositiveNumbers,
  infoToast,
} from "utils/misc";
import { useStyles } from "utils/useStyles";
import Swal from "sweetalert2";

//TRANSLATE
import { useTranslation } from "react-i18next";

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";
import {
  postPhysicalMedical,
  getLastPhysicalMedical,
} from "services/MedicalSoftware/Questions";
import { getLastBodyCompositionAnalysis } from "services/affiliates";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

const BodyCompositionForm = ({
  setIsOpen,
  completePhysicalAssesment,
  setCompletePhysicalAssesment,
  dateBirth,
  reload,
  setReload,
}) => {
  const formId = 11;
  let percent = {};
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  const [fields, setFields] = useState([]);
  const [loadForm, setLoadForm] = useState([]);
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);
  const [weight, setWeight] = useState(0);
  const [size, setSize] = useState(0);
  const [muscle, setMuscle] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [lastRegistration, setLastRegistration] = useState(null);

  const [IMC, setIMC] = useState(0);
  const [IMM, setIMM] = useState(0);

  let currentDate = new Date();
  let yearCurrent = currentDate.getFullYear();
  let monthCurrent = currentDate.getMonth();
  let dayCurrent = currentDate.getDate();
  currentDate.setDate(dayCurrent);
  currentDate.setMonth(monthCurrent);
  currentDate.setFullYear(yearCurrent);

  useEffect(() => {
    setLoadForm(true);
    getLoadForm(
      formId,
      appoiment_type_id,
      user_id,
      window.localStorage.getItem(`form-${user_id}-${formId}`) ? 1 : 0
    )
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          setFields(data.data[0].customInputFields);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    getLastPhysicalMedical(user_id)
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          setQuestions(data.data);
        }
      })
      .catch((err) => {
        console.error(mapErrors(err));
      });
    getLastBodyCompositionAnalysis(user_id)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setLastRegistration(data.data.created_at.substring(0, 10));
        }
        setLoadForm(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadForm(false);
      });
  }, [appoiment_type_id, completePhysicalAssesment, enqueueSnackbar, user_id]);

  const onSubmit = (values) => {
    setLoadingFetchForm(true);
    let questionsSubmit = {
      user_id: user_id,
      questions: [
        {
          survey_question_id: 1,
          answer: values.question_one ? values.question_one : "",
        },
        {
          survey_question_id: 2,
          answer: values.question_two ? values.question_two : "",
        },
        {
          survey_question_id: 3,
          answer: values.question_three ? values.question_three : "",
        },
        {
          survey_question_id: 4,
          answer: values.question_four ? values.question_four : "",
        },
        {
          survey_question_id: 5,
          answer: values.question_five ? values.question_five : "",
        },
        {
          survey_question_id: 6,
          answer: values.question_six ? values.question_six : "",
        },
        {
          survey_question_id: 7,
          answer: values.question_seven ? values.question_seven : "",
        },
        {
          survey_question_id: 8,
          answer: values.question_eight ? values.question_eight : "",
        },
      ],
    };
    postPhysicalMedical(questionsSubmit)
      .then(({ data }) => {
        if (data.data && data.status === "success") {
          let dataSubmit = {
            form_id: Number(formId),
            user_id: Number(user_id),
            quote_id: Number(quote_id),
            medical_professional_id: Number(medical_professional_id),
            customInputFields: [
              { id: 91, value: weight ? weight : fields[2]?.value },
              { id: 92, value: size ? size * 100 : fields[0]?.value },
              { id: 93, value: "" },
              { id: 96, value: muscle ? muscle : fields[5]?.value },
              { id: 94, value: "" },
              {
                id: 95,
                value: values?.fat_percentage
                  ? values?.fat_percentage
                  : fields[4]?.value,
              },
              {
                id: 97,
                value: values?.abdominal_perimeter
                  ? values?.abdominal_perimeter
                  : fields[3]?.value,
              },
              {
                id: 98,
                value: values?.observations
                  ? values?.observations
                  : fields[8].value,
              },
              { id: 255, value: data?.data?.Survey_Physical_Evaluation_id },
            ],
          };
          saveForms(dataSubmit)
            .then((req) => {
              if (req && req.data && req.data.message === "success") {
                Swal.fire({
                  title: t("Message.SavedSuccess"),
                  icon: "success",
                });
                percent = { id: formId, completed: req.data.data.percent };
                addFormsPercentToLocalStorage(percent);
                addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
                setCompletePhysicalAssesment(1);
                setIsOpen(false);
              } else {
                setLoadingFetchForm(false);
                Swal.fire({
                  title: mapErrors(req.data),
                  icon: "error",
                });
              }
            })
            .catch((err) => {
              setLoadingFetchForm(false);
              Swal.fire({
                title: mapErrors(err),
                icon: "error",
              });
            });
        } else {
          enqueueSnackbar(t("Message.AlertCompleteQuestions"), infoToast);
        }
        setReload(!reload);
        setLoadingFetchForm(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetchForm(false);
      });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  const handleNextStep = () => {
    setActiveStep(activeStep + 1);
  };

  const handleChangeWeight = (e) => {
    setWeight(Number(e.target.value));
  };

  const handleChangeSize = (e) => {
    setSize(Number(e.target.value / 100));
    let size = Number(e.target.value / 100);
    setIMC(parseFloat(weight / Math.pow(size, 2)).toFixed(2));
  };

  const handleChangeMuscle = (e) => {
    setMuscle(Number(e.target.value));
    let muscle = Number(e.target.value);
    setIMM(((muscle * weight) / size ** 2 / 100).toFixed(2));
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="row align-items-center mb-4">
        <div className="col">
          <Typography variant="h5">
            {t("DetailClinicHistory.PhysicalAssessment")}
          </Typography>
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

      {loadForm ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {activeStep === 0 && (
            <>
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
                    <Typography variant="body1">
                      {fields && fields[1] && fields[1].value
                        ? `${fields[1]?.value}(kg)`
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="col-4">
                  <Controller
                    name="weight"
                    rules={{
                      required:
                        fields && fields[1] && fields[1].value ? false : true,
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
                            handleChangeWeight(e);
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
                    <Typography variant="body1">
                      {fields && fields[0] && fields[0].value
                        ? `${fields[0]?.value}(cm)`
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="col-4">
                  <Controller
                    name="height"
                    control={control}
                    rules={{
                      required:
                        fields && fields[0] && fields[0].value ? false : true,
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
                            handleChangeSize(e);
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
                      {fields && fields[4] && fields[4]?.value
                        ? `${parseFloat(fields[4]?.value)}%`
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="col-4">
                  <Controller
                    name="muscle_mass_percentage"
                    control={control}
                    rules={{
                      required:
                        fields && fields[4] && fields[4]?.value ? false : true,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        error={errors.muscle_mass_percentage}
                        type="text"
                        inputProps={{ maxLength: 4, min: 0 }}
                        onKeyUp={(e) => {
                          if (regexOnlyPositiveNumbers.test(e.target.value)) {
                            handleChangeMuscle(e);
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
                  <Typography variant="body1">
                    {t("BodyCompositionForm.IMC")}
                  </Typography>
                </div>
                <div className="col-4">
                  <div className={classes.iconBoxForm}>
                    <Typography variant="body1">
                      {fields && fields[5] && fields[5].value
                        ? `${parseFloat(fields[5]?.value).toFixed(2)}`
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="col-4">
                  <Controller
                    name="IMC"
                    control={control}
                    defaultValue={IMC}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        disabled={true}
                        type="number"
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ shrink: true }}
                        label={t("BodyCompositionForm.IMC")}
                        value={IMC}
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="row mb-3 container">
                <div className="col-4">
                  <Typography variant="body1">
                    {t("BodyCompositionForm.IMM")}
                  </Typography>
                </div>
                <div className="col-4">
                  <div className={classes.iconBoxForm}>
                    <Typography variant="body1">
                      {fields && fields[6] && fields[6].value
                        ? `${parseFloat(fields[6]?.value)}`
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="col-4">
                  <Controller
                    name="IMM"
                    control={control}
                    defaultValue={IMM}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("BodyCompositionForm.IMM")}
                        disabled={true}
                        inputProps={{ min: 0 }}
                        InputLabelProps={{ shrink: true }}
                        value={IMM}
                        type="number"
                        variant="outlined"
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
                      {fields && fields[3] && fields[3].value
                        ? `${parseFloat(fields[3]?.value)}%`
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="col-4">
                  <Controller
                    name="fat_percentage"
                    rules={{
                      required:
                        fields && fields[3] && fields[3].value ? false : true,
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
                      {fields && fields[2] && fields[2]?.value
                        ? `${fields[2]?.value}(cm)`
                        : "-"}
                    </Typography>
                  </div>
                </div>
                <div className="col-4">
                  <Controller
                    name="abdominal_perimeter"
                    control={control}
                    rules={{
                      required:
                        fields && fields[2] && fields[2]?.value ? false : true,
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

              <div className="row mt-3 container">
                <div className="col-12 mt-3 pe-0">
                  <Controller
                    name="observations"
                    rules={{ required: true }}
                    control={control}
                    defaultValue={
                      fields && fields[7] && fields[7]?.value
                        ? fields[7]?.value
                        : ""
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        error={errors.observations}
                        label={t("BodyCompositionForm.Observation")}
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>
            </>
          )}
          {activeStep === 1 && (
            <div className="container">
              <div className="row d-flex align-items-center mt-3">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionOne")}{" "}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_one"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[0]?.answer.toLowerCase()
                    }
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                            label={t("Btn.Yes")}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                            label={t("Btn.Not")}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_one && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -50, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
              <div className="row d-flex align-items-center mt-2">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionTwo")}{" "}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_two"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[1]?.answer.toLowerCase()
                    }
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                            label={t("Btn.Yes")}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                            label={t("Btn.Not")}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_two && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -15, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
              <div className="row d-flex align-items-center mt-2">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionThree")}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_three"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[2]?.answer.toLowerCase()
                    }
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                            label={t("Btn.Yes")}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                            label={t("Btn.Not")}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_three && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -40, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
              <div className="row d-flex align-items-center mt-2">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionFour")}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_four"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[3]?.answer.toLowerCase()
                    }
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                            label={t("Btn.Yes")}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                            label={t("Btn.Not")}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_four && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -30, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
              <div className="row d-flex align-items-center mt-2">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionFive")}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_five"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[4]?.answer.toLowerCase()
                    }
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                            label={t("Btn.Yes")}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                            label={t("Btn.Not")}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_five && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -9, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
              <div className="row d-flex align-items-center mt-2">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionSix")}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_six"
                    rules={{ required: true }}
                    control={control}
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[5]?.answer.toLowerCase()
                    }
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                            label={t("Btn.Yes")}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                            label={t("Btn.Not")}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_six && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -9, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
              <div className="row d-flex align-items-center mt-2">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionSeven")}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_seven"
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[6]?.answer.toLowerCase()
                    }
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <FormControlLabel
                            value="si"
                            control={<Radio color="primary" />}
                            label={t("Btn.Yes")}
                          />
                          <FormControlLabel
                            value="no"
                            control={<Radio color="primary" />}
                            label={t("Btn.Not")}
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_seven && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -40, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
              <div className="row d-flex align-items-center mt-2">
                <div className="col-8">
                  <Typography
                    display="block"
                    component={"span"}
                    variant="button"
                    style={{ color: "black" }}
                  >
                    {t("PhysicalAssesment.QuestionEight")}
                  </Typography>
                </div>
                <div className="col-4">
                  <Controller
                    name="question_eight"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      questions &&
                      questions.questions &&
                      questions.questions[7]?.answer.toLowerCase()
                    }
                    render={({ field }) => (
                      <FormControl component="fieldset">
                        <RadioGroup row={true} name="Surgery" {...field}>
                          <div className="d-flex">
                            <FormControlLabel
                              value="si"
                              control={<Radio color="primary" />}
                              label={t("Btn.Yes")}
                            />
                            <FormControlLabel
                              value="no"
                              control={<Radio color="primary" />}
                              label={t("Btn.Not")}
                            />
                          </div>
                        </RadioGroup>
                      </FormControl>
                    )}
                  />
                </div>
                {errors.question_eight && (
                  <div className="d-flex justify-content-end">
                    <FormHelperText
                      style={{ marginTop: -10, marginRight: 20 }}
                      error={true}
                    >
                      {t("Message.AlertSelectOption")}
                    </FormHelperText>{" "}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="d-flex justify-content-between mt-3 container row">
            <Button
              disabled={activeStep === 0}
              className={classes.buttonBack}
              onClick={() => setActiveStep(activeStep - 1)}
            >
              {t("Btn.Back")}
            </Button>
            {activeStep !== 1 && (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={handleSubmit(handleNextStep, onError)}
              >
                {t("Btn.Next")}
              </Button>
            )}
            {activeStep === 1 && (
              <ButtonSave text="Guardar" loader={loadingFetchForm} />
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default BodyCompositionForm;
