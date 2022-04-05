import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { isDate, addMinutes } from "date-fns";
import { useStyles } from "utils/useStyles";

// UI
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

// Components
import AccordeonDayweek from "./AccordeonDayweek";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormDay from "./FormDay";

// Utils
import {
  groupBy,
  convertH2M,
  formatDateToHHMMSS,
  daysWeekNames,
} from "utils/misc";
import AssignMassiveActivities from "components/Common/ModuleConfigReservations/MassiveActivities/AssignMassiveActivities";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
  //   style: { padding: "30px" },
};

// Data Local
const dayWeeksArray = [
  {
    day_week_id: 1,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
  {
    day_week_id: 2,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
  {
    day_week_id: 3,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
  {
    day_week_id: 4,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
  {
    day_week_id: 5,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
  {
    day_week_id: 6,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
  {
    day_week_id: 7,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
  {
    day_week_id: 8,
    start_time: null,
    end_time: null,
    managers: [],
    dayId: 1,
  },
];

const FormSchedule = ({
  defaultValues,
  setIsOpen,
  duration,
  setSchedules,
  schedules,
  description,
  managers,
  setIsModified,
  isModified,
  isSelectManagers,
  isSelectVirtual,
  inCollaborators,
  userType,
  setOpenedDayWeek,
  openedDayWeek,
  regions,
  cities,
  venues,
  lockCapacity,
  changeSchedul,
  setChangeSchedule,
  ...restProps
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [expanded, setExpanded] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [assingSameHour, setAssingSameHour] = useState(false);
  const [dataSet, setDataSet] = useState(false);

  // modal state
  const [openMassiveActivity, setOpenMassiveActivity] = useState(false);

  useEffect(() => {
    const setNormalizeData = () => {
      if (defaultValues && defaultValues.length !== 0) {
        let arrToReturn = [];
        dayWeeksArray.forEach((schedule) => {
          if (
            defaultValues.some((p) => p.day_week_id === schedule.day_week_id)
          ) {
            const dataToUpdate = defaultValues.filter(
              (p) => p.day_week_id === schedule.day_week_id
            );
            const arrToUpdate = dataToUpdate.map((item) => ({
              ...item,
              dayId: item.id,
              id: item.id,
              managers: item.managers || [],
              start_time: item.start_time === "" ? null : item.start_time,
              end_time: item.end_time === "" ? null : item.end_time,
            }));
            arrToReturn = [...arrToReturn, ...arrToUpdate];
            return;
          }
          arrToReturn = [...arrToReturn, schedule];
        });

        if (duration !== null && isDate(duration)) {
          const arrToReturnDur = arrToReturn.map((day) => {
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
          });
          setSchedules(groupBy(arrToReturnDur, "day_week_id", "array"));
          return;
        }
        setSchedules(groupBy(arrToReturn, "day_week_id", "array"));
        return;
      }
      setSchedules(groupBy([...dayWeeksArray], "day_week_id", "array"));
    };

    if (isModified) {
      setDataSet(true);
    } else {
      setNormalizeData();
      setDataSet(true);
      setIsModified(true);
    }
  }, [defaultValues, duration, setSchedules, isModified, setIsModified]);

  const handleChangeCheck = (e) => {
    const valueChecked = e.target.checked;
    setAssingSameHour(e.target.checked);

    if (valueChecked) {
      setSelectedDays([1, 2, 3, 4, 5, 6, 7, 8]);

      return;
    }
    setSelectedDays([]);
  };

  const handleChangeCheckByDay = (idDay) => {
    setAssingSameHour(false);
    if (selectedDays.some((val) => val === idDay)) {
      const selectedDaysFilter = selectedDays.filter((day) => day !== idDay);
      setSelectedDays(selectedDaysFilter);
    } else {
      setSelectedDays((selectedDays) => [...selectedDays, idDay]);
    }
  };

  return (
    <div>
      {description && (
        <Typography className="mt-2" variant="body1">
          {description}
        </Typography>
      )}
      {/* <div className="mt-2">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <Typography variant="body2">
              {t("FormsVenueSchedule.CheckAssingSameHourAllDays")}
            </Typography>
          </div>
          <div>
            <Checkbox
              name="check_assing_hour"
              onChange={handleChangeCheck}
              checked={assingSameHour}
              color="primary"
            />
          </div>
        </div>
      </div> */}
      {schedules.length > 0 &&
        dataSet &&
        schedules.map((arraySchedules, key) => (
          <AccordeonDayweek
            setOpenedDayWeek={setOpenedDayWeek}
            openedDayWeek={openedDayWeek}
            name={daysWeekNames[key]}
            id={key + 1}
            key={key}
            setExpanded={setExpanded}
            expanded={expanded}
            selectedDays={selectedDays}
            available={
              defaultValues && defaultValues?.length > 0
                ? arraySchedules.some(
                    (item) => item.start_time !== null && item.end_time !== null
                  )
                : false
            }
            handleChangeCheckByDay={handleChangeCheckByDay}
          >
            <FormDay
              lockCapacity={lockCapacity}
              setChangeSchedule={setChangeSchedule}
              userType={userType}
              managers={managers}
              arraySchedules={arraySchedules}
              schedules={schedules}
              setSchedules={setSchedules}
              duration={duration}
              assingSameHour={assingSameHour}
              selectedDays={selectedDays}
              isSelectManagers={isSelectManagers}
              isSelectVirtual={isSelectVirtual}
            />
          </AccordeonDayweek>
        ))}
      {inCollaborators ? (
        ""
      ) : (
        <div className="row m-0 pt-2">
          <div className="col-6 d-flex justify-content-center">
            <Button
              onClick={() => setIsOpen(false)}
              type="button"
              className={classes.buttonCancel}
              variant="contained"
              style={{ marginRight: 0, width: "100%" }}
            >
              {t("Btn.Cancel")}
            </Button>
          </div>
          <div className="col-6">
            {userType === 17 || userType === 41 ? (
              <Button
                fullWidth={true}
                onClick={() => setOpenMassiveActivity(true)}
                type="button"
                className={classes.buttonSave}
                variant="contained"
                style={{ marginRight: 0 }}
              >
                Asignar
              </Button>
            ) : (
              <Button
                fullWidth={true}
                onClick={() => setIsOpen(false)}
                type="button"
                className={classes.buttonSave}
                variant="contained"
                style={{ marginRight: 0 }}
              >
                {t("Btn.save")}
              </Button>
            )}
          </div>
        </div>
      )}

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <>
            <AssignMassiveActivities
              {...restProps}
              regions={regions}
              cities={cities}
              venues={venues}
              setIsOpen={setIsOpen}
              setOpenMassiveActivity={setOpenMassiveActivity}
            />
          </>
        }
        isOpen={openMassiveActivity}
        title={"Asignar Actividad"}
        handleClose={() => {
          setIsOpen(false);
        }}
      />
    </div>
  );
};

FormSchedule.propTypes = {
  defaultValues: PropTypes.array,
  idVenue: PropTypes.number.isRequired,
  duration: PropTypes.instanceOf(Date),
  setSchedules: PropTypes.func.isRequired,
  schedules: PropTypes.array.isRequired,
  description: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  managers: PropTypes.array.isRequired,
};

export default FormSchedule;
