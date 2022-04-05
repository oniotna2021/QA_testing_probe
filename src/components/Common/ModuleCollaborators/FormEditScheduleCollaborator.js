import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

//UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";

//COMPONENTS
// import Schedules from "components/Shared/ScheduleDaysWithTurns/Schedule";
import FormScheduleRefactored from "components/Shared/FormScheduleRefactored/FormScheduleRefactored";

//SERVICES
import {
  getSchedulesByEmployee,
  postAddSchedulesEmployee,
  putSchedulesEmployee,
} from "services/Reservations/scheduleEmployee";

// Hooks
import useIsMounted from "hooks/useIsMounted";

//UTILS
import { useStyles } from "utils/useStyles";
import {
  checkSchedules,
  errorToast,
  mapErrors,
  successToast,
} from "utils/misc";

const FormAddScheldule = ({
  setIsOpen,
  isForTurns = false,
  isEdit,
  idUser,
  setUnmountSchedule,
  currentVenueId,
  setLoad,
  scheduleVirtual,
  isVirtual,
  setReloadDataUser,
  selectedCity,
}) => {
  const isMounted = useIsMounted();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { handleSubmit } = useForm();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [defaultValues, setDefaultValues] = useState([]);

  useEffect(() => {
    if (isEdit && currentVenueId) {
      getSchedulesByEmployee(currentVenueId, idUser)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data.schedules) {
            if (isMounted.current) {
              const dataDaysWeek = data.data.schedules.map((day) => ({
                day_week_id: day.day_week_id,
                shifts_venue_id: day.shifts_venue_id,
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
  }, [
    enqueueSnackbar,
    setSchedules,
    isMounted,
    isEdit,
    currentVenueId,
    idUser,
  ]);

  useEffect(() => {
    if (isEdit && isVirtual && scheduleVirtual) {
      setDefaultValues(scheduleVirtual);
    }
  }, [isEdit, isVirtual, scheduleVirtual]);

  const onSubmit = (data) => {
    const dataForm = {
      user_id: Number(idUser),
      venue_id: currentVenueId !== null ? Number(currentVenueId) : null,
      schedules: schedules
        ? schedules.length !== 0
          ? checkSchedules(schedules, true)
          : []
        : [],
      is_virtual: isVirtual ? 1 : 0,
    };

    setLoading(true);
    const functionCall = isEdit
      ? putSchedulesEmployee
      : postAddSchedulesEmployee;
    functionCall(dataForm)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(true);
          if (isVirtual) {
            setReloadDataUser(true);
          } else {
            if (setUnmountSchedule) {
              setUnmountSchedule(false);
              setUnmountSchedule(true);
            }
          }
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

  return (
    <>
      <form
        className="d-flex flex-column align-items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          {/* <Schedules
            defaultValues={defaultValues}
            setSchedules={setSchedules}
            schedules={schedules}
          /> */}

          <div className="my-4">
            <FormScheduleRefactored
              inCollaborators={true}
              idVenue={currentVenueId}
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

          <div className="mt-2 mb-4 d-flex justify-content-end">
            <Button
              onLoad={loading}
              type="submit"
              className={classes.button}
              color="primary"
              variant="contained"
            >
              {t("Btn.save")}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  isVirtual: auth.isVirtual,
});

export default connect(mapStateToProps)(FormAddScheldule);
