import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//internal dependencies
import { setInitsForm } from "modules/sessions";

//UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

//Internal dependencies
import { daysWeekForSession, uuidv4 } from "utils/misc";

//Utils
import { useStyles } from "utils/useStyles";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { SessionsFormOne, SessionsFormTwo } from "config/Forms/ConfigForms";
import OptionsPlaceTraining from "components/Shared/OptionsPlaceTraining/OptionsPlaceTraining";
import Loading from "components/Shared/Loading/Loading";

//Service
import { searchElastic } from "services/_elastic";

//Misc
import { ConfigNameRoutes } from "router/constants";

export const ManageSession = ({
  defaultValue,
  nameStep,
  trainingsLevels,
  medicalConditions,
  goalsData,
  userType,
  setInitsForm,
  handleClose,
}) => {
  const classes = useStyles();
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      is_daily_training: defaultValue?.is_daily_training,
      day:
        defaultValue && defaultValue.day
          ? daysWeekForSession[
              defaultValue.day === 1 ? 0 : defaultValue.day - 1
            ]
          : "",
    },
  });
  const watchShowNameSession = watch("name", false);
  const watchIsDaySession = watch("is_daily_training", false);
  // you can supply default value as second argument
  // you can supply default value as second argument

  const { t } = useTranslation();
  const history = useHistory();
  const [optionPlaceTraining, setOptionPlaceTraining] = useState(
    defaultValue && defaultValue.training_places
      ? () => defaultValue?.training_places.map((x) => Number(x.id))
      : () => []
  );
  const [messageError, setMessageError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isValidateNameSession, setIsValidateNameSession] = useState(
    defaultValue && !defaultValue.used_in_training_plan ? true : false
  );

  const handleOptionPlaceTraining = (event, selectedOption) => {
    setMessageError("");
    setValue("training_places", selectedOption);
    setOptionPlaceTraining(selectedOption);
  };

  useEffect(() => {
    if (watchShowNameSession) {
      searchElastic("sessions", {
        query: {
          match: {
            name: {
              query: watchShowNameSession,
            },
          },
        },
      })
        .then(({ data }) => {
          if (
            data.data.hits.hits.length > 0 &&
            data.data.hits.hits[0]._source.name === watchShowNameSession
          ) {
            if (defaultValue && !defaultValue.used_in_training_plan) {
              setIsValidateNameSession(true);
            } else {
              setIsValidateNameSession(false);
            }
          } else {
            setIsValidateNameSession(true);
          }
        })
        .catch((err) => {
          setIsValidateNameSession(true);
        });
    }
  }, [watchShowNameSession]);

  useEffect(() => {
    if (trainingsLevels && trainingsLevels.data.length > 0) {
      setLoading(false);
      setDataSelect();
    }
  }, [trainingsLevels]);

  const setDataSelect = () => {
    SessionsFormOne.forEach((item) => {
      switch (item.name) {
        case "goals":
          item.dataSelect = goalsData?.data || [];
          break;
        default:
          break;
      }
    });
    SessionsFormTwo.forEach((item) => {
      switch (item.name) {
        case "training_levels":
          item.dataSelect = trainingsLevels?.data || [];
          break;
        case "goals":
          item.dataSelect = goalsData?.data || [];
          break;
        case "pathologies":
          item.dataSelect = medicalConditions?.data || [];
          break;
        case "contraindications":
          item.dataSelect = medicalConditions?.data || [];
          break;
        default:
          break;
      }
    });
  };

  const onSubmit = (value) => {
    if (optionPlaceTraining.length === 0) {
      setMessageError("Por favor seleccionar lugar de entrenamiento");
      return;
    }
    if (!isValidateNameSession) {
      setMessageError(
        "Por favor verifique el nombre de la sessión para continuar"
      );
      return;
    }
    value.training_places = optionPlaceTraining;
    if (
      defaultValue &&
      defaultValue.id &&
      isValidateNameSession &&
      defaultValue.name === value.name
    ) {
      value.session_id = defaultValue.id;
    } else {
      delete value.id;
    }
    if (value.is_daily_training) {
      if (typeof value.day === "string") {
        value.day = daysWeekForSession.findIndex((x) => x === value.day);
      }
      value.day = value.day === 0 ? 1 : value.day + 1;
    }
    setInitsForm(value);
    if (defaultValue && defaultValue?.isEditForModal && handleClose) {
      handleClose();
      return;
    }
    if (defaultValue) {
      history.push(ConfigNameRoutes.updateSessionRoute + defaultValue.uuid +
          "?token=" +
          uuidv4()
      );
    } else {
      history.push(ConfigNameRoutes.createSession + "?token=" + uuidv4());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loading && <Loading />}

      {nameStep === "init" && !loading && (
        <div className="row">
          <div className="col-6">
            <div className="mt-1" style={{ marginBottom: 18 }}>
              <Controller
                rules={{ required: true }}
                control={control}
                defaultValue={
                  defaultValue && !defaultValue.used_in_training_plan
                    ? defaultValue.name
                    : ""
                }
                name="name"
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <TextField
                      {...field}
                      required={true}
                      fullWidth
                      type="text"
                      label={"Nombre"}
                      rows={1}
                      variant="outlined"
                      InputProps={{
                        endAdornment: watchShowNameSession && (
                          <InputAdornment position="end">
                            {isValidateNameSession ? (
                              <CheckCircleIcon />
                            ) : (
                              <CancelIcon />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </FormControl>
                )}
              />
            </div>

            <CommonComponentSimpleForm
              form={SessionsFormOne}
              control={control}
              defaultValue={{
                goals: defaultValue?.goals,
                id: defaultValue?.id,
                long_description: defaultValue?.long_description,
              }}
            />
          </div>

          <div className="col-6">
            <CommonComponentSimpleForm
              form={SessionsFormTwo}
              control={control}
              defaultValue={{
                ...defaultValue,
                training_levels:
                  defaultValue && defaultValue.training_levels
                    ? defaultValue.training_levels[0].id
                    : null,
              }}
            />

            <div className="d-flex justify-content-between align-items-center gx-3">
              <Typography variant="p">{t("Place.label")}</Typography>
              <OptionsPlaceTraining
                option={optionPlaceTraining}
                handleOption={handleOptionPlaceTraining}
              />
            </div>

            {userType === 4 && (
              <div className="d-flex justify-content-between align-items-center">
                <Typography variant="body2">
                  {t("FormSessions.FormOnSubmit")}
                </Typography>
                <Controller
                  name="is_daily_training"
                  control={control}
                  defaultValue={defaultValue?.is_daily_training}
                  render={({ field: props }) => (
                    <Checkbox
                      {...props}
                      color="primary"
                      checked={props.value}
                    />
                  )}
                />
              </div>
            )}

            {!watchIsDaySession ||
              (watchIsDaySession !== 0 && (
                <div className="d-flex justify-content-between align-items-center">
                  <Controller
                    defaultValue={
                      defaultValue && defaultValue.day
                        ? daysWeekForSession[
                            defaultValue.day === 1 ? 0 : defaultValue.day - 1
                          ]
                        : ""
                    }
                    name="day"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <FormControl variant="outlined">
                        <InputLabel id="select">
                          {t("ModuleSession.Select.ForDay")}
                        </InputLabel>
                        <Select
                          labelId="select"
                          {...field}
                          label={t("ModuleSession.Select.ForDay")}
                        >
                          {daysWeekForSession.map((res) => (
                            <MenuItem key={"day-select" + res} value={res}>
                              {res}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
              ))}

            {userType === 4 && (
              <div className="d-flex justify-content-between align-items-center">
                <Typography variant="body2">
                  {t("FormSessions.FormOnSubmitObjetives")}
                </Typography>
                <Controller
                  name="is_plan_by_goals"
                  control={control}
                  defaultValue={defaultValue?.is_plan_by_goals}
                  render={({ field: props }) => (
                    <Checkbox
                      {...props}
                      color="primary"
                      checked={props.value}
                    />
                  )}
                />
              </div>
            )}

            {messageError && <Alert severity="error">{messageError}</Alert>}

            <div className="d-flex justify-content-end mt-3">
              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                type="submit"
              >
                {defaultValue?.isEditForModal ? t("Btn.Edit") : t("Btn.Next")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

const mapStateToProps = ({ auth, common, sessions }) => ({
  trainingsElements: common.trainingsElements,
  trainingsLevels: common.trainingsLevels,
  userType: auth.userType,
  medicalConditions: common.medicalConditions,
  goalsData: common.goalsData,
  nameStep: sessions.nameStep,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setInitsForm,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ManageSession);
