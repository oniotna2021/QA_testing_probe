import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { format } from "date-fns/esm";

// UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

// Components
import ScheduleActivity from "components/Shared/ScheduleActivity/ScheduleCollaborator/ScheduleActivity";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// Service
import {
  updateManagersSchedule,
  updateManagersScheduleQuotes,
} from "services/Reservations/scheduleActivityUser";

// Utils
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  formatDateToHHMMSS,
  mapErrors,
  successToast,
} from "utils/misc";
import ChangeDateComponent from "./ChangeDateComponent";
import ReasingQuotes from "./ReasingQuotes";

const FormReasingActivity = ({
  title,
  activityData,
  setValueTab,
  userId,
  setIsOpen,
  selectDate,
  handleChangeDate,
  isMedical,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();
  const [quotes, setQuotes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (isMedical && Object.keys(activityData).length > 0) {
      setQuotes(
        activityData?.quotes.map((item) => ({
          hour: item.hour,
          id: item.id,
          optionals_medicals: item.optionals_medicals,
          optional_medical_id: null,
          date: item.date,
        }))
      );
    }
  }, [isMedical, activityData]);

  const handleSubmit = () => {
    let dataForm = {};

    if (isMedical) {
      const mapQuotes = quotes.map((q) => ({
        id: q.id,
        optional_medical_id: q?.optional_medical_id?.id,
      }));

      if (mapQuotes.every((schedule) => schedule.optional_medical_id)) {
        dataForm = {
          quotes: mapQuotes,
        };
      } else {
        enqueueSnackbar(t("FormNovelty.WarningEmptyManagers"), {
          variant: "info",
          autoHideDuration: 2500,
        });
        return;
      }
    } else {
      const schedulesFilter = schedules.filter((p) => p.start_time !== null);

      if (schedulesFilter.every((schedule) => schedule.managers.length > 0)) {
        dataForm = {
          user_internal_id: Number(userId),
          start_date: `${format(
            selectDate.start_date,
            "yyyy-MM-dd"
          )} ${formatDateToHHMMSS(selectDate.start_time)}`,
          end_date: `${format(
            selectDate.end_date,
            "yyyy-MM-dd"
          )} ${formatDateToHHMMSS(selectDate.end_time)}`,
          schedules: schedulesFilter,
        };
      } else {
        enqueueSnackbar(t("FormNovelty.WarningEmptyManagers"), {
          variant: "info",
          autoHideDuration: 2500,
        });
        return;
      }
    }

    const fetchFunc = isMedical
      ? updateManagersScheduleQuotes
      : updateManagersSchedule;
    setLoading(true);
    fetchFunc(dataForm)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoading(false);
          setValueTab(1);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
          setLoading(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {title && (
          <div className="d-flex align-items-center">
            <Typography className="me-2" variant="h6">
              {title}
            </Typography>

            <Typography variant="body1">
              {activityData?.activity_name}
            </Typography>
          </div>
        )}
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <ChangeDateComponent
        isEdit={false}
        setLoad={setLoad}
        selectDate={selectDate}
        handleChangeDate={handleChangeDate}
      />

      <div className="my-4">
        {isMedical
          ? Object.keys(activityData).length > 0 &&
            quotes.length > 0 && (
              <ReasingQuotes quotes={quotes} setQuotes={setQuotes} />
            )
          : Object.keys(activityData).length > 0 && (
              <ScheduleActivity
                userId={userId}
                defaultValues={activityData?.schedules}
                title={t("FormsVenueActivities.ActivityHour")}
                setSchedules={setSchedules}
                schedules={schedules}
              />
            )}
      </div>

      <div className="d-flex justify-content-between mt-5">
        <Button
          onClick={() => setValueTab(1)}
          fullWidth
          className={classes.buttonBlock}
        >
          {t("Btn.Cancel")}
        </Button>
        <ButtonSave
          onClick={handleSubmit}
          typeButton="button"
          loader={loading}
          fullWidth={true}
          text={t("Btn.Reasign")}
        />
      </div>
    </>
  );
};

export default FormReasingActivity;
