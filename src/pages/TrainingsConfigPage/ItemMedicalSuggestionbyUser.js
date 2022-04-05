import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UTILS
import { casteMapNameArrayForString } from "utils/misc";

//UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CloseIcon from "@material-ui/icons/Close";

//UTILS
import { useStyles } from "utils/useStyles";

//COMPONENTS
import Loading from "components/Shared/Loading/Loading";

//SERVICES
import { getMedicalSuggestionByUser } from "services/MedicalSoftware/MedicalSuggestions";
import { getDetailMedicalSuggestionById } from "services/MedicalSoftware/MedicalSuggestions";

// Utils
import { errorToast, mapErrors } from "utils/misc";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `wrapped-tab-${index}`,
    "aria-controls": `wrapped-tabpanel-${index}`,
  };
}

const ItemMedicalSuggestionByUser = ({
  idAfiliate,
  setIsOpen,
  userName,
  userDocument,
  isDetail,
  idSuggestion,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("one");
  const [dataSuggestion, setDataSuggestion] = useState([]);

  useEffect(() => {
    setLoading(true);
    const functionCall = isDetail
      ? getDetailMedicalSuggestionById
      : getMedicalSuggestionByUser;
    functionCall(isDetail ? idSuggestion : idAfiliate)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setLoading(false);
          setDataSuggestion(data.data);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar, idAfiliate, idSuggestion, isDetail]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="d-flex justify-content-between">
          <Typography variant="h5">
            {t("DetailClinicHistory.MedicalRecommendations")}
          </Typography>
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
        <div className="d-flex align-items-center">
          <Typography variant="h6">{userName}</Typography>
          <Typography className="ms-5" variant="body1">
            {userDocument}
          </Typography>
        </div>
      </div>

      <AppBar position="static" className={`${classes.appBar}`}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          variant="scrollable"
        >
          <Tab
            value="one"
            label={t("MedicalSuggestions.TitleGeneral")}
            {...a11yProps("one")}
          />
          <Tab
            value="two"
            label={t("MedicalSuggestions.TitleCardio")}
            {...a11yProps("two")}
          />
          <Tab
            value="three"
            label={t("MedicalSuggestions.TitleForce")}
            {...a11yProps("three")}
          />
          <Tab
            value="four"
            label={t("MedicalSuggestions.TitleFlexibility")}
            {...a11yProps("four")}
          />
          <Tab
            value="five"
            label={t("MedicalSuggestions.TitleGroupLesson")}
            {...a11yProps("five")}
          />
          <Tab
            value="six"
            label={t("MedicalSuggestions.TitleRemition")}
            {...a11yProps("six")}
          />
        </Tabs>
      </AppBar>

      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
          <TabPanel value={value} index="one">
            <div className="row">
              <div className="col-4">
                <div className={classes.boxObservation}>
                  <div className="row m-1">
                    <Typography className={classes.fontObservation}>
                      {t("MedicalSuggestions.SelectPathologies")}
                    </Typography>
                    <Typography variant="body1">
                      {dataSuggestion.medical_conditions
                        ? casteMapNameArrayForString(
                            dataSuggestion.medical_conditions
                          )
                        : t("Message.EmptyData")}
                    </Typography>
                  </div>
                  <div className="row m-1">
                    <Typography className={classes.fontObservation}>
                      {t("MedicalSuggestions.Contraindications")}
                    </Typography>
                    <Typography variant="body1">
                      {dataSuggestion.medical_conditions
                        ? casteMapNameArrayForString(
                            dataSuggestion.medical_conditions
                          )
                        : t("Message.EmptyData")}
                    </Typography>
                  </div>
                  <div className="row m-1">
                    <Typography className={classes.fontObservation}>
                      {t("MedicalSuggestions.SelectGoals")}
                    </Typography>
                    <Typography variant="body1">
                      {dataSuggestion.goals
                        ? casteMapNameArrayForString(dataSuggestion.goals)
                        : t("Message.EmptyData")}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="col-8 ps-5">
                <div className="row">
                  <Typography variant="h6">Datos Básicos</Typography>
                </div>
                <div className="row">
                  <div className="col-6">
                    <Typography className={classes.fontObservation}>
                      {t("MedicalSuggestions.TitleAge")}
                    </Typography>
                    <Typography>{`${
                      dataSuggestion?.age ? dataSuggestion.age : "-"
                    } ${t("Message.Age")}`}</Typography>
                  </div>
                  <div className="col-6">
                    <Typography className={classes.fontObservation}>
                      Rieago de caída
                    </Typography>
                    <Typography variant="body1">{`${
                      dataSuggestion.risks &&
                      dataSuggestion.risks.FormIndiceDownton
                        ? dataSuggestion.risks.FormIndiceDownton
                        : t("Message.NoEvaluation")
                    }`}</Typography>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <Typography className={classes.fontObservation}>
                      Nivel de entrenamiento
                    </Typography>
                    <Typography>{`${
                      dataSuggestion?.training_level &&
                      dataSuggestion.training_level.name
                        ? dataSuggestion.training_level.name
                        : t("Message.EmptyData")
                    }`}</Typography>
                  </div>
                  <div className="col-6">
                    <Typography className={classes.fontObservation}>
                      Riesgo Cardiovascular
                    </Typography>
                    <Typography variant="body1">{`${
                      dataSuggestion.risks &&
                      dataSuggestion.risks.cardiovascularRisk
                        ? dataSuggestion.risks.cardiovascularRisk
                        : t("Message.NoEvaluation")
                    }`}</Typography>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <Typography className={classes.fontObservation}>
                      Número de sesiones por semana
                    </Typography>
                    <Typography>{`${
                      dataSuggestion?.session_number
                        ? dataSuggestion.session_number
                        : t("Message.EmptyData")
                    }`}</Typography>
                  </div>
                  <div className="col-6">
                    <Typography className={classes.fontObservation}>
                      Riesgo Bodytech
                    </Typography>
                    <Typography variant="body1">{`${
                      dataSuggestion.risks &&
                      dataSuggestion.risks.surveyRiskRating
                        ? dataSuggestion.risks.surveyRiskRating
                        : t("Message.NoEvaluation")
                    }`}</Typography>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* ===== CARDIO ===== */}
          <TabPanel value={value} index="two">
            <div className="row">
              <div className="col-8">
                <div className="row">
                  <Typography className={classes.fontObservation}>
                    {t("MedicalSuggestions.InputNumberDaysWeek")}
                  </Typography>
                  <Typography variant="body1">{`${
                    dataSuggestion.training_stages_cardio
                      ? dataSuggestion.training_stages_cardio.weekly_frequency
                      : "-"
                  } ${t("Message.Times")}`}</Typography>
                </div>
                <div className="row">
                  <Typography className={classes.fontObservation}>
                    {t("MedicalSuggestions.InputFrequencyMaxCalculate")}
                  </Typography>
                  <Typography variant="body1">{`${
                    dataSuggestion.training_stages_cardio
                      ? dataSuggestion.training_stages_cardio.max_age_frequency
                      : "-"
                  } ${t("MedicalSuggestions.BPM")}`}</Typography>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputPorcentFrequencyMinAbv")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_cardio
                          ? dataSuggestion.training_stages_cardio
                              .percentage_min_frequency
                          : "-"
                      } ${t("MedicalSuggestions.BPM")}`}</Typography>
                    </div>
                    <div style={{ width: 150 }}>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputPorcentFrequencyMax")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_cardio
                          ? dataSuggestion.training_stages_cardio
                              .percentage_max_frequency
                          : "-"
                      } ${t("MedicalSuggestions.BPM")}`}</Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        FC min
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_cardio
                          ? dataSuggestion.training_stages_cardio.min_frequency
                          : "-"
                      } ${t("MedicalSuggestions.BPM")}`}</Typography>
                    </div>
                    <div style={{ width: 150 }}>
                      <Typography className={classes.fontObservation}>
                        FC max
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_cardio
                          ? dataSuggestion.training_stages_cardio.max_frequency
                          : "-"
                      } ${t("MedicalSuggestions.BPM")}`}</Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputTime")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_cardio
                          ? dataSuggestion.training_stages_cardio.time
                          : "-"
                      } ${t("Message.Minutes")}`}</Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.SelectMethod")}
                      </Typography>
                      <Typography variant="body1">
                        {" "}
                        {dataSuggestion.training_stages_cardio
                          ? dataSuggestion.training_stages_cardio.method_name
                          : t("Message.EmptyData")}
                      </Typography>
                    </div>
                    <div style={{ width: 150 }}>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.SelectModeType")}
                      </Typography>
                      <Typography variant="body1">
                        {dataSuggestion.training_stages_cardio
                          ? casteMapNameArrayForString(
                              dataSuggestion.training_stages_cardio.mode_type
                            )
                          : t("Message.EmptyData")}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <Typography className={classes.fontObservation}>
                  {t("MedicalSuggestions.InputProgression")}
                </Typography>
                <div className={classes.boxObservation}>
                  <Typography variant="body1" className="p-3">{`${
                    dataSuggestion.training_stages_cardio
                      ? dataSuggestion.training_stages_cardio.progression
                      : t("Message.EmptyData")
                  }`}</Typography>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* ===== FUERZA ===== */}
          <TabPanel value={value} index="three">
            <div className="row">
              <div className="col-8">
                <div className="row">
                  <Typography className={classes.fontObservation}>
                    {t("MedicalSuggestions.InputNumberDaysWeek")}
                  </Typography>
                  <Typography variant="body1">{`${
                    dataSuggestion.training_stages_force
                      ? dataSuggestion.training_stages_force.weekly_frequency
                      : "-"
                  } ${t("Message.Times")}`}</Typography>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputPorcentRMMin")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_force
                          ? dataSuggestion.training_stages_force
                              .percentage_RM_min
                          : t("Message.EmptyData")
                      }`}</Typography>
                    </div>
                    <div style={{ width: 150 }}>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputPorcentRMMax")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_force
                          ? dataSuggestion.training_stages_force
                              .percentage_RM_max
                          : t("Message.EmptyData")
                      }`}</Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputMinTime")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_force
                          ? dataSuggestion.training_stages_force.min_time
                          : t("Message.EmptyData")
                      }`}</Typography>
                    </div>
                    <div style={{ width: 150 }}>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputMaxTime")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_force
                          ? dataSuggestion.training_stages_force.max_time
                          : t("Message.EmptyData")
                      }`}</Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.SelectMethod")}
                      </Typography>
                      <Typography variant="body1">
                        {" "}
                        {dataSuggestion.training_stages_force
                          ? dataSuggestion.training_stages_force.method_name
                          : t("Message.EmptyData")}{" "}
                      </Typography>
                    </div>
                    <div style={{ width: 150 }}>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.SelectModeType")}
                      </Typography>
                      <Typography variant="body1">
                        {" "}
                        {dataSuggestion.training_stages_force
                          ? casteMapNameArrayForString(
                              dataSuggestion.training_stages_force.mode_type
                            )
                          : t("Message.EmptyData")}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputSeriesNumber")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_force
                          ? dataSuggestion.training_stages_force
                              .intensity_series_number
                          : "-"
                      } ${t("Message.Series")}`}</Typography>
                    </div>
                    <div style={{ width: 150 }}>
                      <Typography className={classes.fontObservation}>
                        {t("Repetitions.title")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_force
                          ? dataSuggestion.training_stages_force
                              .intensity_repeats_by_exercise
                          : t("Message.EmptyData")
                      }`}</Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <Typography className={classes.fontObservation}>
                  {t("MedicalSuggestions.InputProgression")}
                </Typography>
                <div className={classes.boxObservation}>
                  <Typography variant="body1" className="p-3">
                    {dataSuggestion.training_stages_force
                      ? dataSuggestion.training_stages_force.progression
                      : t("Message.EmptyData")}
                  </Typography>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* ===== FLEXIBILIDAD ===== */}
          <TabPanel value={value} index="four">
            <div className="row">
              <div className="col-8">
                <div className="row">
                  <Typography className={classes.fontObservation}>
                    {t("MedicalSuggestions.InputNumberDaysWeek")}
                  </Typography>
                  <Typography variant="body1">{`${
                    dataSuggestion.training_stages_flexibility
                      ? dataSuggestion.training_stages_flexibility
                          .weekly_frequency
                      : "-"
                  } ${t("Message.Times")}`}</Typography>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputTime")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_flexibility
                          ? dataSuggestion.training_stages_flexibility.time
                          : "-"
                      } ${t("Message.Minutes")}`}</Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.SelectMethod")}
                      </Typography>
                      <Typography variant="body1">
                        {" "}
                        {dataSuggestion.training_stages_flexibility
                          ? dataSuggestion.training_stages_flexibility
                              .method_name
                          : t("Message.EmptyData")}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        {t("MedicalSuggestions.InputRepeatsByExercise")}
                      </Typography>
                      <Typography variant="body1">{`${
                        dataSuggestion.training_stages_flexibility
                          ? dataSuggestion.training_stages_flexibility
                              .intensity_repeats_number
                          : t("Message.EmptyData")
                      }`}</Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <Typography className={classes.fontObservation}>
                  {t("MedicalSuggestions.InputProgression")}
                </Typography>
                <div className={classes.boxObservation}>
                  <Typography variant="body1" className="p-3">{`${
                    dataSuggestion.training_stages_flexibility
                      ? dataSuggestion.training_stages_flexibility.progression
                      : t("Message.EmptyData")
                  }`}</Typography>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* ===== CLASES GRUPALES ===== */}
          <TabPanel value={value} index="five">
            <div className="row">
              <div className="col-8">
                <div className="row">
                  <Typography className={classes.fontObservation}>
                    {t("MedicalSuggestions.InputNumberDaysWeek")}
                  </Typography>
                  <Typography variant="body1">{`${
                    dataSuggestion.training_stages_group_lessons
                      ? dataSuggestion.training_stages_group_lessons
                          .weekly_frequency
                      : "-"
                  } veces`}</Typography>
                </div>

                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography className={classes.fontObservation}>
                        Actividades grupales
                      </Typography>

                      <ul>
                        {dataSuggestion.training_stages_group_lessons &&
                        dataSuggestion.training_stages_group_lessons.activities
                          .length > 0
                          ? dataSuggestion.training_stages_group_lessons.activities.map(
                              (activity) => (
                                <li>
                                  <Typography variant="body2">
                                    {activity.name}
                                  </Typography>
                                </li>
                              )
                            )
                          : t("Message.EmptyData")}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <Typography className={classes.fontObservation}>
                  {t("MedicalSuggestions.InputProgression")}
                </Typography>
                <div className={classes.boxObservation}>
                  <Typography variant="body1" className="p-3">{`${
                    dataSuggestion.training_stages_group_lessons
                      ? dataSuggestion.training_stages_group_lessons.progression
                      : t("Message.EmptyData")
                  }`}</Typography>
                </div>
              </div>
            </div>
          </TabPanel>

          {/* REMISIÓN */}
          <TabPanel value={value} index="six">
            <div className="d-flex flex-column justify-content-start align-items-start">
              <Typography className={classes.fontObservation}>
                Servicios de remisión
              </Typography>
              <ul>
                {dataSuggestion?.referral_services?.length > 0
                  ? dataSuggestion?.referral_services.map((service) => (
                      <li>
                        <Typography variant="body2">{service.name}</Typography>{" "}
                      </li>
                    ))
                  : t("Message.EmptyData")}
              </ul>
            </div>
            <div className="d-flex flex-column align-items-between">
              <Typography className={classes.fontObservation}>
                {t("DetailClinicHistory.Observations")}
              </Typography>
              <div className={classes.boxObservation}>
                <Typography variant="body1" className="p-3">{`${
                  dataSuggestion && dataSuggestion.observation
                    ? dataSuggestion.observation
                    : t("Message.EmptyDataObservations")
                }`}</Typography>
              </div>
            </div>
          </TabPanel>
        </React.Fragment>
      )}
    </div>
  );
};

export default ItemMedicalSuggestionByUser;
