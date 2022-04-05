/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

//Route
import { ConfigNameRoutes } from "router/constants";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

//UI
import Button from "@material-ui/core/Button";
import { Card } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import FormHelperText from "@material-ui/core/FormHelperText";

//ICONS
import {
  IconProfile,
  IconFood,
  IconPoint,
  IconTraining,
  IconEdit,
  IconMedical,
} from "assets/icons/customize/config";

//HOOKS
import useSearchUserById from "hooks/useSearchUserById";
import { useGetSelectsClinicalHistory } from "hooks/useGetSelectsClinicalHistory";

//COMPONENTS
import Loading from "components/Shared/Loading/Loading";
import FormInterventionDiagnosisProcedure from "components/Common/ModuleClinicalHistory/Exams/InterventionDiagnosisProcedure/FormInterventionDiagnosisProcedure";
import { FormResidenceAddress } from "components/Common/ModuleClinicalHistory/FirstTime/ResidenceAddress/ResidenceAddress";
import { FormBasicInformation } from "components/Common/ModuleClinicalHistory/FirstTime/BasicInformation/BasicInformation";
import FormInformation from "components/Common/ModuleClinicalHistory/FirstTime/Identity/FormInformation";
import { HealthconditionForm } from "../Anamnesis/Healthcondition/HealthconditionForm";
import { FormReasonMedical } from "../Anamnesis/ReasonMedical/ReasonMedical";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import { FormSportsHistory } from "../Nutrition/SportsHistory/SportsHistory";
import { FoodHistoryForm } from "../Nutrition/FoodHistory/FoodHistory";
import { WeeklyNutritionForm } from "components/Common/ModuleClinicalHistory/Nutrition/WeeklyNutrition/WeeklyNutrition";
import { NutritionPhysicalExamForm } from "../Nutrition/NutritionPhysicalExam/NutritionPhysicalExam";
import { FormPhysicalExamination } from "../Exams/PhysicalExamination/PhysicalExamination";
import { FormPhysicalMovements2 } from "../Exams/PhysicalMovements/PhysicalMovements2";
import { MedicalSuggestions } from "./MedicalRecommendations/MedicalSuggestions";
import { FormIndexDownTon } from "components/Common/ModuleClinicalHistory/Questions/FormIndexDownTon";
import { FormCardiovascularRisk } from "components/Common/ModuleClinicalHistory/Questions/FormCardiovascularRisk";
import { FormBodytechRisk } from "components/Common/ModuleClinicalHistory/Questions/FormBodytechRisk";
import FormSystemReview from "../Exams/SystemReview/FormSystemReview";
import ModuleNutrition from "../Nutrition/NutritionPlan/ModuleNutrition";
import BodyCompositionForm from "../Exams/PhysicalAssessment/BodyCompositionForm";
import AvatarUser from "components/Shared/AvatarUser/AvatarUser";
import FormNextAppointment from "./FormNextAppointment";
import HealthConditionInfo from "./InfoUser/HealthConditionInfo";
import ReasonMedicalInfo from "./InfoUser/ReasonMedicalInfo";
import BasicInfoUser from "./InfoUser/BasicInfoUser";
import LastObservationCard from "./InfoUser/LastObservationCard";
import HistoryObservations from "./InfoUser/HistoryObservations";
import FormAddObservation from "./FormAddObservation";
import FormAnnexes from "./FormAnnexes";

//SERVICES
import { getObservationsByUser } from "services/MedicalSoftware/ActivityObservations";
import { finishQuote } from "services/MedicalSoftware/Quotes";
import { getMedicalHistory } from "services/MedicalSoftware/MedicalAnnexes";
import {
  getReasonQuoteByUser,
  getHealthConditionByUser,
  getLastFiveReasonQuotesByUser,
} from "services/MedicalSoftware/UserInformation";
import { getLoadForm } from "services/MedicalSoftware/LoadForms";

//UTILS
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  mapErrors,
  deleteKeysLocalStorageClinicalHistory,
  addFormsPercentToLocalStorage,
  infoToast,
} from "utils/misc";
//UTILS
import Swal from "sweetalert2";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography component={"span"} variant="body1">
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/*
  FUNCTION: view all clinical history when init appointment
  PROPERTIES: from useParams => quote_id, appoiment_type_id, user_id, medical_professional_id  
*/

const DetailClinicalHistory = ({
  dailyFood,
  foodPreparationType,
  territorialZones,
  relationship,
  linkTypes,
  territorialEntities,
  disability,
  pathologicalAntecedents,
  surgeryTimes,
  musculoskeletalHistory,
  familyHistory,
  typeHealthTechnology,
  diagnosticType,
  myCoachIntervention,
  healthTechnology,
  healthEducation,
  goalsIntervention,
  trainingsLevels,
  medicalConditions,
  goals,
  typeAppointments,
  method,
  modeType,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  let { quote_id, appoiment_type_id, user_id, medical_professional_id } =
    useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [userInfo, loader] = useSearchUserById(user_id);
  const [dataSelects] = useGetSelectsClinicalHistory();

  const [isCompleted, setIsCompleted] = useState(0);
  const [completeBasicInformation, setCompleteBasicInformation] = useState(0);
  const [completePhysicalExam, setCompletePhysicalExam] = useState(0);
  const [completeReasonMedical, setCompleteReasonMedical] = useState(0);
  const [completeHealthCondition, setCompleteHealthCondition] = useState(0);
  const [completePhysicalAssesment, setCompletePhysicalAssesment] = useState(0);
  const [completeIntervention, setCompleteIntervention] = useState(0);
  const [completeSportHistory, setCompleteSportHistory] = useState(0);
  const [completeNutritionExam, setCompleteNutritionExam] = useState(0);
  const [completeFoodHistory, setCompleteFoodHistory] = useState(0);
  const [completeWeeklyNutrition, setCompleteWeeklyNutrition] = useState(0);
  const [completeSystemForm, setCompleteSystemForm] = useState(0);
  const [completeMedicalSuggestions, setCompleteMedicalSuggestions] =
    useState(0);

  const [reload, setReload] = useState(false);
  const [percentForms, setPercentForms] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [observations, setObservations] = useState([]);
  const [drawerRightID, setDrawerRightID] = useState();
  const [value, setValue] = useState(0);
  const [fieldsReason, setFieldsReason] = useState([]);
  const [fieldsHealth, setFieldsHealth] = useState([]);
  const [lastObservations, setLastObservation] = useState([]);
  const [lastReasonQuote, setLastReasonQuote] = useState([]);

  const [loadingFetchPDF, setLoadingFetchPDF] = useState(false);
  const [resultCardiovascularRisk, setResultCardiovascularRisk] = useState("");
  const [userGender, setUserGender] = useState({});
  const [loadFinishQuote, setLoadFinishQuote] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getReasonQuoteByUser(user_id)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setFieldsReason(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getLastFiveReasonQuotesByUser(user_id)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setLastReasonQuote(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getHealthConditionByUser(user_id)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setFieldsHealth(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }

        getLoadForm(2, appoiment_type_id, user_id).then(({ data }) => {
          if (data.status === "success" && data.data && data.data.length > 0) {
            setUserGender(
              data.data[0] &&
                data.data[0].customInputFields[0] &&
                data.data[0].customInputFields[0].customDataSelect?.filter(
                  (custom) =>
                    custom.id === data.data[0].customInputFields[0].value
                )
            );
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        });
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    setPercentForms(JSON.parse(localStorage.getItem("forms")));
  }, [reload, appoiment_type_id, user_id, enqueueSnackbar]);

  useEffect(() => {
    percentForms?.forEach((form) => {
      if (form.id === 19) {
        setResultCardiovascularRisk(form.result);
      }
    });
  }, [percentForms]);

  useEffect(() => {
    if (!loadingFetch) {
      getObservationsByUser(user_id)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setObservations(data.data);
            setLastObservation(data.data[0]);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [loadingFetch, appoiment_type_id, user_id, enqueueSnackbar]);

  const viewUserInfo = () => {
    history.push(`/detail-afiliate/${user_id}`);
  };

  const handleOpenModal = (idx) => {
    setIsOpen(true);
    setDrawerRightID(idx);
  };

  const onFinishQuote = () => {
    let dataSubmit = {
      medical_professional_id: Number(medical_professional_id),
      quote_id: Number(quote_id),
      user_id: Number(user_id),
      type_appointment: Number(appoiment_type_id),
    };

    // forms validation
    const forms = JSON.parse(localStorage.getItem("forms"));
    const formStatus = {
      identityForm: {
        status: forms?.some((form) => form.id === 2),
        errorMessage: "Formulario de identidad no completado",
      },
      residenceAdressForm: {
        status: forms?.some((form) => form.id === 3),
        errorMessage: "Formulario datos de residencia no completado",
      },
      basicInformationForm: {
        status: forms?.some((form) => form.id === 4),
        errorMessage: "Formulario de información básica no completado",
      },
      reasonMedicalForm: {
        status: forms?.some((form) => form.id === 5),
        errorMessage: "Formulario de motivo de consulta no completado",
      },
      interventionDiagnosisForm: {
        status: forms?.some((form) => form.id === 16),
        errorMessage:
          "Formulario de intervención y procedimiento no completado",
      },
    };

    if (
      formStatus.identityForm.status &&
      formStatus.residenceAdressForm.status &&
      formStatus.basicInformationForm.status &&
      formStatus.reasonMedicalForm.status &&
      formStatus.interventionDiagnosisForm.status
    ) {
      setLoadFinishQuote(true);
      finishQuote(dataSubmit)
        .then(({ data }) => {
          if (data && data.status === "success") {
            Swal.fire({
              title: t("DetailClinicHistory.SavedSuccess"),
              icon: "success",
            });
            history.push(ConfigNameRoutes.quotes);
            deleteKeysLocalStorageClinicalHistory(user_id);
            localStorage.removeItem("forms");
            deleteKeysLocalStorageClinicalHistory(user_id);
            percentForms &&
              percentForms?.forEach((form) => {
                deleteKeysLocalStorageClinicalHistory(user_id, form.id);
              });
          } else {
            Swal.fire({
              title: `${data.message}`,
              icon: "error",
            });
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => setLoadFinishQuote(false));
    } else {
      if (forms === null) {
        enqueueSnackbar("No has llenado ningun formulario", infoToast);
      } else {
        Object.keys(formStatus).forEach((key) => {
          if (formStatus[key].status === false) {
            enqueueSnackbar(formStatus[key].errorMessage, infoToast);
          }
        });
      }
    }
  };

  const onSubmitClincalHistory = () => {
    setLoadingFetchPDF(true);
    getMedicalHistory(quote_id)
      .then((blob) => {
        if (blob.data.type === "application/pdf") {
          const file = new Blob([blob.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(encodeURI(fileURL));
          setLoadingFetchPDF(false);
        } else {
          enqueueSnackbar("No se pudo generar el PDF", errorToast);
        }
        setLoadingFetchPDF(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetchPDF(false);
      });
  };

  // check basic forms percent
  useEffect(() => {
    getLoadForm(2, appoiment_type_id, user_id, 1).then(({ data }) => {
      if (data.status === "success" && data.data && data.data.length > 0) {
        if (
          data.data[0].customInputFields.every((field) => field.value != null)
        ) {
          addFormsPercentToLocalStorage({ id: 2, completed: 100 });
          setPercentForms(JSON.parse(localStorage.getItem("forms")));
        }
      }
    });

    getLoadForm(3, appoiment_type_id, user_id, 1).then(({ data }) => {
      if (data.status === "success" && data.data && data.data.length > 0) {
        if (
          data.data[0].customInputFields.every((field) => field.value != null)
        ) {
          addFormsPercentToLocalStorage({ id: 3, completed: 100 });
          setPercentForms(JSON.parse(localStorage.getItem("forms")));
        }
      }
    });

    getLoadForm(4, appoiment_type_id, user_id, 1).then(({ data }) => {
      if (data.status === "success" && data.data && data.data.length > 0) {
        if (
          data.data[0].customInputFields.every((field) => field.value != null)
        ) {
          addFormsPercentToLocalStorage({ id: 4, completed: 100 });
          setPercentForms(JSON.parse(localStorage.getItem("forms")));
        }
      }
    });

    return () => {
      deleteKeysLocalStorageClinicalHistory(user_id);
      localStorage.removeItem("forms");
      deleteKeysLocalStorageClinicalHistory(user_id);
      percentForms &&
        percentForms?.forEach((form) => {
          deleteKeysLocalStorageClinicalHistory(user_id, form.id);
        });
    };
    // eslint-disable-next-line
  }, [appoiment_type_id, user_id]);

  return (
    <div>
      <div className="row m-0">
        <div className="col-3 p-0 d-flex">
          {loader ? (
            <Loading />
          ) : (
            <React.Fragment>
              <AvatarUser
                isCenter={true}
                userEmail={`${userInfo.first_name} ${userInfo.last_name}`}
              />
              <div className="m-3">
                <Typography
                  component={"span"}
                  variant="h2"
                  className={classes.title}
                >{`${userInfo.first_name} ${userInfo.last_name}`}</Typography>
                <div className="mt-0">{`${userInfo.document_number}`}</div>
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="col-9 d-flex justify-content-end align-items-center">
          <Button
            disabled={loadingFetchPDF}
            className={classes.miniBox}
            onClick={onSubmitClincalHistory}
          >
            {loadingFetchPDF ? (
              <Loading />
            ) : (
              <React.Fragment>
                <IconTraining color={theme.palette.black.main} />
                <Typography display="block" component={"span"} variant="body2">
                  {t("DetailClinicHistory.PDF")}
                </Typography>
              </React.Fragment>
            )}
          </Button>
          <Button className={classes.miniBox} onClick={() => viewUserInfo()}>
            <IconProfile color={theme.palette.black.main} />
            <Typography display="block" component={"span"} variant="body2">
              {t("DetailClinicHistory.ViewInfo")}
            </Typography>
          </Button>
          {appoiment_type_id === "2" && (
            <Button
              className={classes.miniBoxNutrition}
              component={Link}
              to={`/nutrition/${user_id}`}
            >
              <IconFood color={theme.palette.black.main} />
              <Typography
                className="ms-1"
                style={{ fontSize: "12px" }}
                display="block"
                component={"span"}
                variant="body2"
              >
                {t("DetailClinicHistory.CreatePlan")}
              </Typography>
            </Button>
          )}
          <Button
            className={classes.boxFinish}
            onClick={onFinishQuote}
            variant="contained"
            disabled={loadFinishQuote}
            color="primary"
          >
            {loadFinishQuote ? (
              <Loading />
            ) : (
              <Typography
                style={{ fontSize: "12px" }}
                display="block"
                component={"span"}
                variant="h6"
              >
                {t("DetailClinicHistory.FinishQuote")}
              </Typography>
            )}
          </Button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-4">
          <BasicInfoUser user_id={user_id} />
          <ReasonMedicalInfo fieldsReason={fieldsReason} />
          <HealthConditionInfo fieldsHealth={fieldsHealth} />
          <LastObservationCard lastObservations={lastObservations} />
          <div className="d-flex flex-column justify-content-between align-items-center">
            {appoiment_type_id !== "2" && (
              <div className={`${classes.boxMedical} p-3`}>
                <div className="row align-items-center">
                  <div className="col-1 ms-3">
                    <IconMedical color={theme.palette.black.main} />
                  </div>
                  <div className="col">
                    <Typography
                      display="block"
                      component={"span"}
                      variant="button"
                      style={{ color: "black" }}
                    >
                      {t("DetailClinicHistory.MedicalRecommendations")}
                    </Typography>
                    {percentForms?.map((form) =>
                      form.id === 20 ? (
                        <Typography
                          key={`form-${form.id}`}
                          display="block"
                          component={"span"}
                          variant="caption"
                          style={{ color: "black" }}
                        >{`${t("Message.PorcentCompleted")}`}</Typography>
                      ) : null
                    )}
                  </div>
                  <div className="col-1 me-3">
                    <IconButton onClick={() => handleOpenModal(15)}>
                      <IconEdit color={theme.palette.black.main} />
                    </IconButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-8">
          <Card>
            <div className="row gx-5 mt-2">
              <div className="col-12 p-0">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                  variant="scrollable"
                  scrollButtons="auto"
                  style={{ paddingLeft: 15, marginBottom: 20 }}
                >
                  <Tab
                    style={{ padding: 5 }}
                    label={t("DetailClinicHistory.Observations")}
                    {...a11yProps(0)}
                  />
                  <Tab
                    style={{ padding: 5 }}
                    label={t("DetailClinicHistory.BasicData")}
                    {...a11yProps(1)}
                  />
                  <Tab
                    style={{ padding: 5 }}
                    label={t("DetailClinicHistory.Anamnesis")}
                    {...a11yProps(2)}
                  />
                  <Tab
                    style={{ padding: 5 }}
                    label={t("DetailClinicHistory.Questions")}
                    {...a11yProps(3)}
                  />
                  <Tab
                    style={{ padding: 5 }}
                    label={t("DetailClinicHistory.Examns")}
                    {...a11yProps(4)}
                  />
                  <Tab
                    style={{ padding: 5 }}
                    label={t("DetailClinicHistory.Intervention")}
                    {...a11yProps(5)}
                  />
                  <Tab
                    style={{ padding: 5 }}
                    label={t("DetailClinicHistory.Annexes")}
                    {...a11yProps(6)}
                  />
                </Tabs>
                <TabPanel
                  value={value}
                  index={0}
                  style={{ minHeight: "500px" }}
                >
                  <FormAddObservation
                    setLoadingFetch={setLoadingFetch}
                    loadingFetch={loadingFetch}
                  />

                  <HistoryObservations
                    observations={observations ? observations : []}
                    lastReasonQuote={lastReasonQuote ? lastReasonQuote : []}
                  />
                </TabPanel>
                <TabPanel
                  value={value}
                  index={1}
                  className="px-5"
                  style={{ minHeight: "480px" }}
                >
                  <div className={`${classes.boxMedical} p-3 mt-4`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconProfile color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.Identity")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 2 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(1)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconPoint color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("ResidenceAddress.ResidenceData")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 3 ? (
                            <Typography
                              key={`form-${form.id}`}
                              display="block"
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(2)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconTraining color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.BasicInformation")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 4 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(3)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel
                  value={value}
                  index={2}
                  className="px-5"
                  style={{ minHeight: "494px" }}
                >
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconTraining color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.ReasonToConsult")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 5 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(4)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconProfile color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("NutritionSuggestions.SectionOne")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 14 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(5)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconProfile color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.SportsBackground")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 7 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{` ${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(7)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  {appoiment_type_id === "2" && (
                    <>
                      <div className={`${classes.boxMedical} p-3`}>
                        <div className="row align-items-center">
                          <div className="col-1 ms-3">
                            <IconFood color={theme.palette.black.main} />
                          </div>
                          <div className="col">
                            <Typography
                              display="block"
                              component={"span"}
                              variant="button"
                              style={{ color: "black" }}
                            >
                              {t("DetailClinicHistory.FoodHistory")}
                            </Typography>
                            {percentForms?.map((form) =>
                              form.id === 8 ? (
                                <Typography
                                  display="block"
                                  key={`form-${form.id}`}
                                  component={"span"}
                                  variant="caption"
                                  style={{ color: "black" }}
                                >{` ${t(
                                  "Message.PorcentCompleted"
                                )}`}</Typography>
                              ) : null
                            )}
                          </div>
                          <div className="col-1 me-3">
                            <IconButton onClick={() => handleOpenModal(8)}>
                              <IconEdit color={theme.palette.black.main} />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                      <div className={`${classes.boxMedical} p-3`}>
                        <div className="row align-items-center">
                          <div className="col-1 ms-3">
                            <IconFood color={theme.palette.black.main} />
                          </div>
                          <div className="col">
                            <Typography
                              display="block"
                              component={"span"}
                              variant="button"
                              style={{ color: "black" }}
                            >
                              {t("DetailClinicHistory.WeeklyNutrition")}
                            </Typography>
                            {percentForms?.map((form) =>
                              form.id === 15 ? (
                                <Typography
                                  display="block"
                                  key={`form-${form.id}`}
                                  component={"span"}
                                  variant="caption"
                                  style={{ color: "black" }}
                                >{`${t(
                                  "Message.PorcentCompleted"
                                )}`}</Typography>
                              ) : null
                            )}
                          </div>
                          <div className="col-1 me-3">
                            <IconButton onClick={() => handleOpenModal(9)}>
                              <IconEdit color={theme.palette.black.main} />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TabPanel>

                <TabPanel
                  value={value}
                  index={4}
                  className="px-5"
                  style={{ minHeight: "494px" }}
                >
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconTraining color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.PhysicalAssessment")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 11 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(11)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  {appoiment_type_id !== "2" && (
                    <div className={`${classes.boxMedical} p-3`}>
                      <div className="row align-items-center">
                        <div className="col-1 ms-3">
                          <IconTraining color={theme.palette.black.main} />
                        </div>
                        <div className="col">
                          <Typography
                            display="block"
                            component={"span"}
                            variant="button"
                            style={{ color: "black" }}
                          >
                            {t("DetailClinicHistory.SystemReview")}
                          </Typography>
                          {percentForms?.map((form) =>
                            form.id === 21 ? (
                              <Typography
                                display="block"
                                key={`form-${form.id}`}
                                component={"span"}
                                variant="caption"
                                style={{ color: "black" }}
                              >{`${t("Message.PorcentCompleted")}`}</Typography>
                            ) : null
                          )}
                        </div>
                        <div className="col-1 me-3">
                          <IconButton onClick={() => handleOpenModal(20)}>
                            <IconEdit color={theme.palette.black.main} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconFood color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.PhysicalExam")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 13 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{` ${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton
                          onClick={() => handleOpenModal(14)}
                          disabled={
                            completeSystemForm === 0 &&
                            appoiment_type_id === "3"
                              ? true
                              : false
                          }
                        >
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  {completeSystemForm === 0 && appoiment_type_id === "3" && (
                    <FormHelperText error={true}>
                      {t("DetailClinicHistory.ValidationForm")}
                    </FormHelperText>
                  )}
                  {appoiment_type_id === "2" && (
                    <div className={`${classes.boxMedical} p-3`}>
                      <div className="row align-items-center">
                        <div className="col-1 ms-3">
                          <IconProfile color={theme.palette.black.main} />
                        </div>
                        <div className="col">
                          <Typography
                            display="block"
                            component={"span"}
                            variant="button"
                            style={{ color: "black" }}
                          >
                            {t(
                              "DetailClinicHistory.NutritionalPhysicalExamination"
                            )}
                          </Typography>
                          {percentForms?.map((form) =>
                            form.id === 9 ? (
                              <Typography
                                display="block"
                                key={`form-${form.id}`}
                                component={"span"}
                                variant="caption"
                                style={{ color: "black" }}
                              >{`${t("Message.PorcentCompleted")}`}</Typography>
                            ) : null
                          )}
                        </div>
                        <div className="col-1 me-3">
                          <IconButton onClick={() => handleOpenModal(10)}>
                            <IconEdit color={theme.palette.black.main} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  )}
                </TabPanel>
                <TabPanel
                  value={value}
                  index={6}
                  className="px-5"
                  style={{ minHeight: "504px" }}
                >
                  <FormAnnexes />
                  <FormNextAppointment />
                </TabPanel>
                <TabPanel
                  value={value}
                  index={5}
                  className="px-5"
                  style={{ minHeight: "504px" }}
                >
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconTraining color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.Intervention")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 16 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{` ${t("Message.PorcentCompleted")}`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(12)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel
                  value={value}
                  index={3}
                  className="px-5"
                  style={{ minHeight: "504px" }}
                >
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconTraining color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.IndexDownton")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 18 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.Risk")} ${
                              form.result
                            }`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(17)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconTraining color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.CardiovascularRisk")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 19 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{ color: "black" }}
                            >{`${t("Message.Risk")} ${
                              form.result
                            }`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(18)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className={`${classes.boxMedical} p-3`}>
                    <div className="row align-items-center">
                      <div className="col-1 ms-3">
                        <IconTraining color={theme.palette.black.main} />
                      </div>
                      <div className="col">
                        <Typography
                          display="block"
                          component={"span"}
                          variant="button"
                          style={{ color: "black" }}
                        >
                          {t("DetailClinicHistory.BodytechRisk")}
                        </Typography>
                        {percentForms?.map((form) =>
                          form.id === 22 ? (
                            <Typography
                              display="block"
                              key={`form-${form.id}`}
                              component={"span"}
                              variant="caption"
                              style={{
                                color: "black",
                                textTransform: "uppercase",
                              }}
                            >{`${t("Message.Risk")} ${
                              form.result
                            }`}</Typography>
                          ) : null
                        )}
                      </div>
                      <div className="col-1 me-3">
                        <IconButton onClick={() => handleOpenModal(19)}>
                          <IconEdit color={theme.palette.black.main} />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </TabPanel>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {drawerRightID === 1 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormInformation
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 2 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormResidenceAddress
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
              territorialZones={territorialZones?.items}
              relationship={relationship?.items}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 3 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormBasicInformation
              completeBasicInformation={completeBasicInformation}
              setCompleteBasicInformation={setCompleteBasicInformation}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
              linkTypes={linkTypes.items}
              territorialEntities={territorialEntities.items}
              disability={disability?.items}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 4 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormReasonMedical
              completeReasonMedical={completeReasonMedical}
              setCompleteReasonMedical={setCompleteReasonMedical}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 5 && (
        <ShardComponentModal
          fullWidth={true}
          width={"sm"}
          body={
            <HealthconditionForm
              userGender={userGender}
              completeHealthCondition={completeHealthCondition}
              setCompleteHealthCondition={setCompleteHealthCondition}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
              pathologicalAntecedents={pathologicalAntecedents.items}
              surgeryTimes={surgeryTimes.items}
              musculoskeletalHistory={musculoskeletalHistory.items}
              familyHistory={familyHistory.items}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 7 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormSportsHistory
              completeSportHistory={completeSportHistory}
              setCompleteSportHistory={setCompleteSportHistory}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 8 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FoodHistoryForm
              completeFoodHistory={completeFoodHistory}
              setCompleteFoodHistory={setCompleteFoodHistory}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 9 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <WeeklyNutritionForm
              dailyFood={dailyFood?.items}
              foodPreparationType={foodPreparationType?.items}
              completeWeeklyNutrition={completeWeeklyNutrition}
              setCompleteWeeklyNutrition={setCompleteWeeklyNutrition}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 10 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <NutritionPhysicalExamForm
              completeNutritionExam={completeNutritionExam}
              setCompleteNutritionExam={setCompleteNutritionExam}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 11 && (
        <ShardComponentModal
          fullWidth={true}
          width={"sm"}
          body={
            <BodyCompositionForm
              dateBirth={userInfo?.birthdate}
              completePhysicalAssesment={completePhysicalAssesment}
              setCompletePhysicalAssesment={setCompletePhysicalAssesment}
              setIsOpen={setIsOpen}
              reload={reload}
              setReload={setReload}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 12 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormInterventionDiagnosisProcedure
              completeIntervention={completeIntervention}
              setCompleteIntervention={setCompleteIntervention}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
              typeHealthTechnology={typeHealthTechnology.items}
              diagnosticType={diagnosticType.items}
              myCoachIntervention={myCoachIntervention.items}
              healthTechnology={healthTechnology.items}
              healthEducation={healthEducation.items}
              goalsIntervention={goalsIntervention.items}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 13 && (
        <ShardComponentModal
          fullWidth={true}
          width={"sm"}
          body={
            <FormPhysicalExamination
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 14 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormPhysicalMovements2
              completePhysicalExam={completePhysicalExam}
              setCompletePhysicalExam={setCompletePhysicalExam}
              setReload={setReload}
              reload={reload}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 15 && (
        <ShardComponentModal
          fullWidth={true}
          width={"sm"}
          body={
            <MedicalSuggestions
              completeMedicalSuggestions={completeMedicalSuggestions}
              setCompleteMedicalSuggestions={setCompleteMedicalSuggestions}
              setReload={setReload}
              reload={reload}
              dateBirth={userInfo?.birthdate}
              setIsOpen={setIsOpen}
              trainingsLevels={trainingsLevels}
              goals={goals}
              medicalConditions={medicalConditions}
              typeAppointments={typeAppointments}
              method={method}
              modeType={modeType}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 16 && (
        <ShardComponentModal
          is_fullWidth={true}
          body={
            <ModuleNutrition
              is_afiliate={false}
              fields={userInfo}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 17 && (
        <ShardComponentModal
          fullWidth={true}
          width={"sm"}
          body={
            <FormIndexDownTon
              setIsOpen={setIsOpen}
              user_id={user_id}
              quote_id={quote_id}
              reload={reload}
              setReload={setReload}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 18 && (
        <ShardComponentModal
          fullWidth={true}
          width={"sm"}
          body={
            <FormCardiovascularRisk
              setIsOpen={setIsOpen}
              user_id={user_id}
              quote_id={quote_id}
              setResultCardiovascularRisk={setResultCardiovascularRisk}
              reload={reload}
              setReload={setReload}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 19 && (
        <ShardComponentModal
          fullWidth={true}
          width={"sm"}
          body={
            <FormBodytechRisk
              setIsOpen={setIsOpen}
              user_id={user_id}
              quote_id={quote_id}
              resultCardiovascularRisk={resultCardiovascularRisk}
              surgery={fieldsHealth.time_of_surgery}
              pregnancy={fieldsHealth.state_pregnancy}
              reload={reload}
              setReload={setReload}
            />
          }
          isOpen={isOpen}
        />
      )}
      {drawerRightID === 20 && (
        <ShardComponentModal
          fullWidth={true}
          width={"xs"}
          body={
            <FormSystemReview
              typeAppointment={Number(appoiment_type_id)}
              setIsOpen={setIsOpen}
              user_id={user_id}
              quote_id={quote_id}
              reload={reload}
              setReload={setReload}
              completeSystemForm={completeSystemForm}
              setCompleteSystemForm={setCompleteSystemForm}
            />
          }
          isOpen={isOpen}
        />
      )}
    </div>
  );
};
const mapStateToProps = ({ medical, common, global }) => ({
  dailyFood: medical.dailyFood,
  foodPreparationType: medical.foodPreparationType,
  territorialZones: medical.territorialZones,
  relationship: medical.relationship,
  linkTypes: medical.linkTypes,
  territorialEntities: medical.territorialEntities,
  disability: medical.disability,
  pathologicalAntecedents: medical.pathologicalAntecedents,
  surgeryTimes: medical.surgeryTimes,
  musculoskeletalHistory: medical.musculoskeletalHistory,
  familyHistory: medical.familyHistory,
  typeHealthTechnology: medical.typeHealthTechnology,
  diagnosticType: medical.diagnosticType,
  myCoachIntervention: medical.myCoachIntervention,
  healthTechnology: medical.healthTechnology,
  healthEducation: medical.healthEducation,
  goalsIntervention: medical.goalsIntervention,
  trainingsLevels: common.trainingsLevels,
  medicalConditions: common.medicalConditions,
  goals: common.goalsData,
  typeAppointments: global.typeQuotes,
  method: medical.method,
  modeType: medical.modeType,
});

export default connect(mapStateToProps)(DetailClinicalHistory);
