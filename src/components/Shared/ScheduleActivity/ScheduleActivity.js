import React, { useState, useEffect, useMemo } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { isDate, addMinutes } from "date-fns";

//UI
import { useStyles } from "utils/useStyles";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

// Components
import Loading from "components/Shared/Loading/Loading";
import ListHours from "./ListHours";
import ScheduleButton from "components/Shared/ScheduleButton/ScheduleButton";

//Services
import { getAllDayWeeks } from "services/Reservations/DayWeek";
import { getEmployeesByVenue } from "services/Reservations/employess";

// Hooks
import useIsMounted from "hooks/useIsMounted";

//utils
import {
  convertH2M,
  errorToast,
  formatDateToHHMMSS,
  mapErrors,
} from "utils/misc";

const ScheduleActivity = ({
  title,
  idVenue,
  duration = null,
  defaultValues = [],
  setSchedules,
  schedules,
}) => {
  const isMounted = useIsMounted();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [managers, setManagers] = useState([]);
  const [dataSuccess, setDataSuccess] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [currentDayId, setCurrentDay] = useState(0);
  const [assingSameHour, setAssingSameHour] = useState(false);

  useEffect(() => {
    getAllDayWeeks()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          if (isMounted.current) {
            const dataDaysWeek = data.data.map((day) => ({
              day_week_id: day.id,
              start_time: null,
              end_time: null,
              name: day.name.substring(0, 3),
              managers: [],
              dayId: 1,
            }));
            setSchedules(dataDaysWeek);
            setDataSuccess(true);
          }
        } else {
          enqueueSnackbar(mapErrors(data.data?.message), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar, setSchedules, isMounted]);

  useEffect(() => {
    getEmployeesByVenue(idVenue)
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data?.data?.users?.length > 0
        ) {
          const filterManagers = data?.data?.users;
          setManagers(filterManagers);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar, setManagers, idVenue]);

  useEffect(() => {
    if (defaultValues.length !== 0 && dataSuccess) {
      let schedulesArr = [];
      schedules.forEach((schedule) => {
        if (defaultValues.some((p) => p.day_week_id === schedule.day_week_id)) {
          const dataToUpdate = defaultValues.filter(
            (p) => p.day_week_id === schedule.day_week_id
          );
          const arrToUpdate = dataToUpdate.map((item) => ({
            ...item,
            name: schedule.name,
            dayId: item.id,
            id: item.id,
            managers: item.managers || [],
            start_time: item.start_time === "" ? null : item.start_time,
            end_time: item.end_time === "" ? null : item.end_time,
          }));
          schedulesArr = [...schedulesArr, ...arrToUpdate];
          return;
        }
        schedulesArr = [...schedulesArr, schedule];
      });
      setSchedules(schedulesArr);
    }
  }, [dataSuccess, defaultValues, setSchedules]);

  useEffect(() => {
    if (duration !== null && isDate(duration) && dataSuccess) {
      setSchedules((schedules) =>
        schedules.map((day) => {
          const startTimeToAdd =
            day.start_time === null
              ? null
              : isDate(day.start_time)
              ? day.start_time
              : new Date(`2021-08-18T${day.start_time}`);
          if (startTimeToAdd !== null) {
            const endTimeSum = addMinutes(
              startTimeToAdd,
              convertH2M(formatDateToHHMMSS(duration))
            );

            return { ...day, end_time: formatDateToHHMMSS(endTimeSum) };
          }
          return day;
        })
      );
    }
  }, [duration, setSchedules, dataSuccess]);

  const scheduleButtonsData = useMemo(() => {
    if (schedules.length > 0) {
      var hash = {};
      return schedules.filter((current) => {
        var exists = !hash[current.day_week_id];
        hash[current.day_week_id] = true;
        return exists;
      });
    }
  }, [schedules]);

  const handleClickDay = (e) => {
    const idDay = Number(e.target.value);

    if (assingSameHour) {
      if (selectedDays.some((val) => val === idDay)) {
        const selectedDaysFilter = selectedDays.filter((day) => day !== idDay);
        setSelectedDays(selectedDaysFilter);
        setCurrentDay(selectedDaysFilter[selectedDaysFilter.length - 1]);
      } else {
        setSelectedDays((selectedDays) => [...selectedDays, idDay]);
        setCurrentDay(idDay);
      }
      return;
    }

    setSelectedDays([]);
    setCurrentDay(idDay);
  };

  const handleChangeCheck = (e) => {
    setAssingSameHour(e.target.checked);
    setCurrentDay(0);
    setSelectedDays([]);
  };

  return (
    <>
      {title && <Typography className={classes.textBold}>{title}</Typography>}

      <div className="mt-2 py-2">
        <div className="col">
          <div className="d-flex align-items-center justify-content-center">
            <div>
              <FormControl>
                <Checkbox
                  name="check_assing_hour"
                  onChange={handleChangeCheck}
                  checked={assingSameHour}
                  color="primary"
                />
              </FormControl>
            </div>
            <div>
              <Typography variant="body2">
                {t("FormsVenueSchedule.CheckAssingSameHour")}
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        {schedules.length === 0 ? (
          <Loading />
        ) : (
          scheduleButtonsData &&
          scheduleButtonsData.map((day) => (
            <ScheduleButton
              assingSameHour={assingSameHour}
              currentDayId={currentDayId}
              dayData={day}
              selectedDays={selectedDays}
              handleClick={handleClickDay}
              key={day.day_week_id}
            >
              {day.name}
            </ScheduleButton>
          ))
        )}
      </div>

      <div className="mb-4">
        <ListHours
          managers={managers}
          setManagers={setManagers}
          duration={duration}
          selectedDays={selectedDays}
          assingSameHour={assingSameHour}
          currentDayId={currentDayId}
          schedules={schedules}
          setSchedules={setSchedules}
        />
      </div>
    </>
  );
};

export default ScheduleActivity;
