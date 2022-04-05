import React, { useEffect } from "react";
import PropTypes from "prop-types";

// Components
import FormScheduleDay from "./FormScheduleDay";

const FormDay = ({
  arraySchedules,
  setSchedules,
  assingSameHour,
  selectedDays,
  duration,
  managers,
  isSelectManagers,
  isSelectVirtual,
  userType,
  lockCapacity,
  setChangeSchedule,
}) => {
  const handleClickCreateRangeSchedule = (currentDayId, idScheduleDay) => {
    let min = 1718;
    let max = 3429;
    let x = Math.floor(Math.random() * (max - min + 1) + min);
    const dataNewRange = {
      start_time: null,
      end_time: null,
      dayId: x,
      managers: [],
      shifts_venue_id: null,
      modality: isSelectVirtual ? "presencial" : "",
    };

    if (selectedDays.length > 0) {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (selectedDays.some((day) => key + 1 === day)) {
            return [...schedule, { ...dataNewRange, day_week_id: key + 1 }];
          }
          return schedule;
        })
      );
    } else {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (key + 1 === currentDayId) {
            return [...schedule, { ...dataNewRange, day_week_id: key + 1 }];
          }
          return schedule;
        })
      );
    }
  };

  return (
    <>
      {arraySchedules.length !== 0 && (
        <>
          {arraySchedules &&
            arraySchedules.map((item, index) => (
              <FormScheduleDay
                lockCapacity={lockCapacity}
                setChangeSchedule={setChangeSchedule}
                dataSchedule={item}
                userType={userType}
                key={index}
                idScheduleDay={item?.dayId ? item.dayId : index}
                indexSchedule={index + 1}
                currentDayId={arraySchedules[0].day_week_id}
                setSchedules={setSchedules}
                selectedDays={selectedDays}
                assingSameHour={assingSameHour}
                duration={duration}
                managers={managers}
                isSelectManagers={isSelectManagers}
                handleClickCreateRangeSchedule={handleClickCreateRangeSchedule}
                isSelectVirtual={isSelectVirtual}
              />
            ))}
        </>
      )}
    </>
  );
};

FormDay.propTypes = {
  arraySchedules: PropTypes.array.isRequired,
  setSchedules: PropTypes.func.isRequired,
  assingSameHour: PropTypes.bool.isRequired,
  selectedDays: PropTypes.array.isRequired,
  duration: PropTypes.instanceOf(Date),
  managers: PropTypes.array,
};

export default FormDay;
