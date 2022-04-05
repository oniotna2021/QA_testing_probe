import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IconScheduleActivity } from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

//COMPONENTS
// import ScheduleWithTurns from 'components/Shared/ScheduleWithTurns/ScheduleWithTurns';
// import Schedules from "components/Shared/ScheduleDaysWithTurns/Schedule";
import FormScheduleRefactored from "components/Shared/FormScheduleRefactored/FormScheduleRefactored";

//SERVICES
import { getVenuesByCity } from "services/Reservations/venues";
import {
  getSchedulesByEmployee,
  postAddSchedulesEmployee,
  putSchedulesEmployee,
  deleteSchedulesEmployee,
} from "services/Reservations/scheduleEmployee";

// Hooks
import useIsMounted from "hooks/useIsMounted";
import useAutocomplete from "hooks/useAutocomplete";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//UTILS
import { useStyles } from "utils/useStyles";
import {
  checkSchedules,
  errorToast,
  mapErrors,
  successToast,
  infoToast,
} from "utils/misc";

export const FormAddScheldule = ({
  setIsOpen,
  isForTurns,
  isEdit,
  idUser,
  currentVenueId = null,
  setLoad,
  selectedCity,
  virtualData,
  brands,
  permissionsActions,
}) => {
  const isMounted = useIsMounted();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();

  const [loadingDeleting, setLoadingDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [checkSchedule, setCheckSchedule] = useState(true);
  // const [checkScheduleByTurn, setCheckScheduleByTurn] = useState(false);
  const [dataVenues, setDataVenues] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [defaultValues, setDefaultValues] = useState([]);
  const [idVenue, setIdVenue] = useState(currentVenueId);
  const [isVirtual, setIsVirtual] = useState(
    virtualData.is_virtual === 1 && currentVenueId === null ? true : false
  );

  const [valueVenue] = useAutocomplete(dataVenues, idVenue);

  useEffect(() => {
    if (selectedCity) {
      getVenuesByCity(selectedCity, brands)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.length > 0
          ) {
            setDataVenues(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, selectedCity, brands]);

  useEffect(() => {
    if (isEdit && idVenue !== null) {
      getSchedulesByEmployee(idVenue, idUser)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data.schedules) {
            if (isMounted.current) {
              const dataDaysWeek = data.data.schedules.map((day) => ({
                day_week_id: day.day_week_id,
                shifts_venue_id: day?.shifts_venue_id,
                start_time: day.start_time,
                end_time: day.end_time,
                id: day?.id,
                modality: day?.modality,
              }));
              setDefaultValues(dataDaysWeek);
            }
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data?.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, setSchedules, isMounted, isEdit, idVenue, idUser]);

  useEffect(() => {
    if (isVirtual) {
      setDefaultValues(virtualData.schedule_virtual);
    }
  }, [isVirtual, virtualData]);

  const onSubmit = () => {
    setLoading(true);

    if (Number(idVenue) === 0 && !isVirtual) {
      enqueueSnackbar(
        t("FormProfessional.WarningMessageEmptyVenue"),
        infoToast
      );
      setLoading(false);
      return;
    }

    const dataForm = {
      user_id: Number(idUser),
      is_virtual: isVirtual ? 1 : 0,
      venue_id: isVirtual ? null : Number(idVenue),
      schedules: schedules
        ? schedules.length !== 0
          ? checkSchedules(schedules, true)
          : []
        : [],
    };

    // if(dataForm?.schedules?.length === 0) {
    //     enqueueSnackbar(t('FormProfessional.WarningMessageEmptySchedules'), infoToast);
    //     setLoading(false)
    //     return;
    // }

    const functionCall = isEdit
      ? putSchedulesEmployee
      : postAddSchedulesEmployee;
    functionCall(dataForm)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(true);
          setIsOpen(false);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickDeleteVenue = () => {
    setLoadingDeleting(true);
    deleteSchedulesEmployee(idUser, idVenue)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar("Eliminado correctammente", successToast);
          setLoad(true);
          setIsOpen(false);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoadingDeleting(false);
      });
  };

  // const handleChangeCheck = (e) => {
  //   if (e.target.name === "checkSchedule") {
  //     setCheckScheduleByTurn(false);
  //     setCheckSchedule(e.target.checked);
  //   } else {
  //     setCheckSchedule(false);
  //     setCheckScheduleByTurn(e.target.checked);
  //   }
  // };

  const handleChangeVenue = (_, e) => {
    setIdVenue(e.id);
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <div className="row align-items-center mb-4">
          <div className="col">
            <Typography variant="h5">
              {isEdit
                ? t("FormProfessional.InputEditSchedule")
                : t("FormProfessional.InputAddSchedule")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="col-12">
              {(currentVenueId === null || currentVenueId === 0) && (
                <div className="d-flex align-items-center justify-content-center">
                  <div>
                    <FormControl>
                      <Checkbox
                        name="checkScheduleIsVirtual"
                        onChange={(e) => setIsVirtual(e.target.checked)}
                        checked={isVirtual}
                        disabled={virtualData.is_virtual === 1}
                        color="primary"
                      />
                    </FormControl>
                  </div>
                  <div>
                    <Typography variant="body2">
                      {t("FormProfessional.CheckIsVirtualSchedule")}
                    </Typography>
                  </div>
                </div>
              )}
            </div>

            {!isVirtual && (
              <>
                <div className="col-12 mt-4">
                  <FormControl variant="outlined">
                    <Autocomplete
                      placeholder={t("FormProfessional.InputSelectVenue")}
                      className={classes.listItem}
                      value={valueVenue}
                      onChange={handleChangeVenue}
                      disableClearable={true}
                      disabled={isEdit}
                      getOptionLabel={(option) => `${option.name}`}
                      getOptionSelected={(option, value) =>
                        Number(value) === option.id
                      }
                      aria-label="seleccionar sede"
                      id="controllable-select-venue"
                      options={dataVenues}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("FormProfessional.InputSelectVenue")}
                          variant="outlined"
                        />
                      )}
                    />
                  </FormControl>
                </div>
                {selectedCity === 0 && (
                  <FormHelperText error={true}>
                    {t("FormProfessional.InputSelectCity")}
                  </FormHelperText>
                )}
              </>
            )}
          </div>

          {/* {!isVirtual && (
            <div className="col-12 mt-4">
              <div className="d-flex justify-content-around">
                {isForTurns && (
                        <div className="d-flex align-items-center justify-content-start">
                            <div>
                                <FormControl>
                                    <Checkbox
                                        name="checkScheduleByTurn"
                                        onChange={handleChangeCheck}
                                        checked={checkScheduleByTurn}
                                        color="primary"
                                    />
                                </FormControl>
                            </div>
                            <div>
                                <Typography variant="body2">{t('FormProfessional.CheckScheduleByTurn')}</Typography>
                            </div>
                        </div>
                    )}
                <div className="d-flex align-items-center justify-content-start">
                  <div>
                    <FormControl>
                      <Checkbox
                        name="checkSchedule"
                        onChange={handleChangeCheck}
                        checked={checkSchedule}
                        color="primary"
                      />
                    </FormControl>
                  </div>
                  <div>
                    <Typography variant="body2">
                      {t("FormProfessional.CheckSchedule")}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          <div className="my-4">
            <FormScheduleRefactored
              inCollaborators={true}
              idVenue={idVenue}
              defaultValues={defaultValues}
              duration={null}
              setSchedules={setSchedules}
              schedules={schedules}
              isSelectManagers={false}
              isSelectVirtual={true}
              title={t("FormCollaboratorsVenue.TitleSchedules")}
              description={t("FormCollaboratorsVenue.DescriptionSchedules")}
            ></FormScheduleRefactored>
          </div>

          {/* <Schedules
                 defaultValues={defaultValues}
               setSchedules={setSchedules}
                  schedules={schedules}
                /> 
           { checkScheduleByTurn && (
                        <ScheduleWithTurns defaultValues={defaultValues} currentVenueId={idVenue} setSchedules={setSchedules} schedules={schedules} />
                    )}  */}

          <ActionWithPermission isValid={permissionsActions?.edit}>
            <div className="mt-2 mb-4 d-flex justify-content-between">
              {isEdit && (
                <Button
                  onClick={handleClickDeleteVenue}
                  disabled={loadingDeleting ? true : false}
                  fullWidth={true}
                  type="button"
                  className={classes.buttonReasing}
                  variant="contained"
                >
                  {loadingDeleting ? (
                    <CircularProgress size={30} color="secondary" />
                  ) : (
                    t("Btn.delete")
                  )}
                </Button>
              )}
              <Button
                fullWidth={true}
                onClick={onSubmit}
                disabled={loading ? true : false}
                type="button"
                className={classes.buttonSave}
                variant="contained"
                style={{ marginRight: 0 }}
              >
                {loading ? (
                  <CircularProgress size={30} color="secondary" />
                ) : (
                  t("Btn.save")
                )}
              </Button>
            </div>
          </ActionWithPermission>
        </div>
      </div>
    </>
  );
};
