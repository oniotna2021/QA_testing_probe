import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

//UI
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";

//Components
import SearchAffiliates from "components/Shared/SearchAffiliates/SearchAffiliates";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import AvatarTraining from "components/Shared/AvatarTraining/AvatarTraining";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
import ItemMedicalSuggestionByUser from "pages/TrainingsConfigPage/ItemMedicalSuggestionbyUser";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import SessionsList from "components/Common/ManageTrainingPlan/SessionsList/SessionsList";
import ItemPhysical from "components/Shared/ItemPhysical/ItemPhysical";

//Internal dependencies
import { numbersSessions, daysWeek } from "utils/misc";
import { generateQueryElastic } from "hooks/_elasticQuerys";

//Services
import { searchElastic } from "services/_elastic";
import { getPhysicalByUserHistory } from "services/affiliates";

import { errorToast, mapErrors, dataSourceGetFieldSessions } from "utils/misc";
import { useStyles } from "utils/useStyles";

//ICONS
import { IconPrescription, IconACC } from "assets/icons/customize/config";

const FilterForCreateTrainingPlan = ({
  handleSubmit,
  control,
  getValues,
  isViewAfiliate,
  viewDataAfiliateRoute,
  errors,
  setValue,
  daysSelected,
  setDaysSelected,
  placesTraining,
  trainingsLevels,
  medicalConditions,
  goalsData,
  fetchData,
  setFetchData,
  setSessionList,
  step,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [messageError, setMessageError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [itemPhysicalModal, setItemPhysicalModal] = useState(false);
  const [dataPhysical, setDataPhysical] = useState();
  const [user, setUser] = useState({});

  const handleSelectedDays = (event, newDays) => {
    setValue("training_days", newDays);
    setDaysSelected(newDays);
  };

  const onSubmit = (value) => {
    if (
      (value.goals.length > 0 ||
        value.trainingLevel.length > 0 ||
        value.placeTraining.length > 0 ||
        value.contrains.length > 0) &&
      value.user
    ) {
      setFetchData(true);
      const resultQuery = generateQueryElastic(value);
      searchElastic("sessions", {
        query: {
          bool: {
            must: resultQuery,
          },
        },
        _source: dataSourceGetFieldSessions,
      })
        .then(({ data }) => {
          setFetchData(false);
          setSessionList({
            dataSessionsInList: data.data.hits.hits,
            dataInfoForSessionCreate: value,
          });
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
          setSessionList({
            dataSessionsInList: [],
            dataInfoForSessionCreate: {},
          });
        });
    } else {
      if (!value.user) {
        setMessageError(t("TrainingPlan.EmptySelectAffiliate"));
        return;
      }
      setMessageError(t("TrainingPlan.EmptyPropertySession"));
    }
  };

  useEffect(() => {
    setDataPhysical(null);
    if (user.user_id || viewDataAfiliateRoute.user_id) {
      getPhysicalByUserHistory(user.user_id || viewDataAfiliateRoute.user_id)
        .then(({ data }) => {
          if (data.data && data.data.length > 0) {
            setDataPhysical(data.data.at(-1));
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [user, enqueueSnackbar, viewDataAfiliateRoute]);

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container">
          <div className="row">
            <div className="col-12 mb-2">
              {isViewAfiliate ? (
                <React.Fragment>
                  {Object.keys(viewDataAfiliateRoute).length === 0 ? (
                    <Loading />
                  ) : (
                    <AvatarTraining
                      name={
                        Object.keys(viewDataAfiliateRoute).length > 0
                          ? viewDataAfiliateRoute?.first_name +
                            " " +
                            viewDataAfiliateRoute?.last_name
                          : ""
                      }
                    />
                  )}
                </React.Fragment>
              ) : (
                <SearchAffiliates
                  label={t("SearchAfiliate.label")}
                  setValue={(event) => {
                    setValue("user", event);
                    setUser(event ? event : "");
                  }}
                />
              )}

              {messageError === t("TrainingPlan.EmptySelectAffiliate") && (
                <Alert severity="error">{messageError}</Alert>
              )}
            </div>

            {(isViewAfiliate || Object.keys(user).length > 0) && (
              <div className="col d-flex justify-content-around mb-3">
                <div>
                  <Button
                    className={`${classes.boxItemGray}`}
                    onClick={() => setIsOpen(true)}
                  >
                    <div className="me-2 d-flex align-items-cener">
                      <IconPrescription color="black" />
                    </div>
                    Prescripción
                  </Button>
                </div>

                <div>
                  <Button
                    className={`${classes.boxItemGray}`}
                    onClick={() => setItemPhysicalModal(true)}
                    disabled={dataPhysical ? false : true}
                  >
                    <div className="me-2 d-flex align-items-cener">
                      <IconACC color="black" />
                    </div>
                    ACC
                  </Button>
                </div>
              </div>
            )}

            <ShardComponentModal
              body={
                <ItemMedicalSuggestionByUser
                  userName={`${
                    isViewAfiliate
                      ? viewDataAfiliateRoute.first_name
                      : user.first_name
                  }  ${
                    isViewAfiliate
                      ? viewDataAfiliateRoute.last_name
                      : user.last_name
                  }`}
                  userDocument={
                    isViewAfiliate
                      ? viewDataAfiliateRoute.document_number
                      : user.document_number
                  }
                  idAfiliate={
                    isViewAfiliate
                      ? viewDataAfiliateRoute.user_id
                      : user.user_id
                  }
                  setIsOpen={setIsOpen}
                />
              }
              isOpen={isOpen}
            />

            <ShardComponentModal
              body={
                <ItemPhysical
                  setIsOpen={setItemPhysicalModal}
                  data={dataPhysical}
                />
              }
              isOpen={itemPhysicalModal}
            />

            <div className="col-12 mt-1 mb-1">
              <FormControl variant="outlined">
                <InputLabel>{t("Session.numbersSelect")}</InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      label={t("Session.numbersSelect")}
                    >
                      {numbersSessions.map((option, index) => (
                        <MenuItem key={`dayweek` + index} value={option}>
                          {option} sesiones
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                  name="numberSessions"
                ></Controller>
                <FormHelperText
                  error={
                    errors.numberSessions &&
                    errors.numberSessions.type === "required"
                      ? true
                      : false
                  }
                >
                  {errors.numberSessions ? t("Field.required") : ""}
                </FormHelperText>
              </FormControl>
            </div>

            <div className="col-12 mt-1 mb-3">
              <ToggleButtonGroup
                value={daysSelected}
                onChange={handleSelectedDays}
              >
                {daysWeek.map((item, index) => (
                  <ToggleButton key={item} value={index + 1} aria-label={item}>
                    {item}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>

            <div className="col-12 mt-1">
              <Divider />
            </div>

            {step === 0 && (
              <React.Fragment>
                <div className="col-12 mt-3">
                  <Typography variant="h5">
                    {t("TrainingPlan.titleCaracteristica")}
                  </Typography>
                  <br></br>
                  <Typography variant="body2">
                    {t("TrainingPlan.descriptionCaracteristica")}
                  </Typography>
                </div>

                <div className="col-12 mt-1">
                  <ControlledAutocomplete
                    control={control}
                    name="goals"
                    options={goalsData?.data || []}
                    getOptionLabel={(option) => `${option.name}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("TrainingPlan.titleGoalsAfiliate")}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                    defaultValue={[]}
                  />
                </div>

                <div className="col-12 mt-1">
                  <ControlledAutocomplete
                    control={control}
                    name="trainingLevel"
                    options={trainingsLevels?.data || []}
                    getOptionLabel={(option) => `${option.name}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("TrainingPlan.titleLevelAfiliate")}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                    defaultValue={[]}
                  />
                </div>

                <div className="col-12 mt-1">
                  <ControlledAutocomplete
                    control={control}
                    name="patologia"
                    options={medicalConditions?.data || []}
                    getOptionLabel={(option) => `${option.name}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("TrainingPlan.titlePatologiaAfiliate")}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                    defaultValue={[]}
                  />
                </div>

                <div className="col-12 mt-1">
                  <ControlledAutocomplete
                    control={control}
                    name="placeTraining"
                    options={placesTraining || []}
                    getOptionLabel={(option) => `${option.name}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("TrainingPlan.titlePlaceTrainingAfiliate")}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                    defaultValue={[]}
                  />
                </div>

                <div className="col-12 mt-1">
                  <ControlledAutocomplete
                    control={control}
                    name="contrains"
                    options={medicalConditions?.data || []}
                    getOptionLabel={(option) => `${option.name}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("TrainingPlan.titleContraindicacionAfiliate")}
                        variant="outlined"
                        margin="normal"
                      />
                    )}
                    defaultValue={[]}
                  />
                </div>
                {messageError !== t("TrainingPlan.EmptySelectAffiliate") &&
                  messageError && (
                    <div className="col-12 mt-1">
                      <Alert severity="error">{messageError}</Alert>
                    </div>
                  )}
                <div className="col-12 mt-2 d-flex justify-content-center p-2">
                  <ButtonSave
                    loader={fetchData}
                    disabled={daysSelected.length === 0}
                    text={t("Btn.filter")}
                  />
                </div>
              </React.Fragment>
            )}

            {step === 1 && !fetchData && <SessionsList />}
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

const mapStateToProps = ({ trainingPlan, common }) => ({
  step: trainingPlan.step,
  placesTraining: common.placesTraining,
  trainingsLevels: common.trainingsLevels,
  medicalConditions: common.medicalConditions,
  goalsData: common.goalsData,
});

export default connect(mapStateToProps)(FilterForCreateTrainingPlan);
