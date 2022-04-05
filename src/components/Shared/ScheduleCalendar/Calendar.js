import React from "react";
import PropTypes from "prop-types";

import WeekScheduleCalendar from "./WeekScheduleCalendar/WeekScheduleCalendar";

const Calendar = ({
  type,
  rangeDate,
  handleClickAvailableHour,
  handleClickEvent,
  dataEvents,
  scrollToHourNow = false,
  businessHour = false,
  viewHeaderDate = false,
  itemEvent = { type: "default" },
  eachMinuteCalendar = 30,
  ...restProps
}) => {
  return (
    <WeekScheduleCalendar
      rangeDate={rangeDate}
      handleClickAvailableHour={handleClickAvailableHour}
      handleClickEvent={handleClickEvent}
      dataEvents={dataEvents}
      scrollToHourNow={scrollToHourNow}
      viewHeaderDate={viewHeaderDate}
      businessHour={businessHour}
      itemEvent={itemEvent}
      eachMinuteCalendar={eachMinuteCalendar}
      {...restProps}
    />
  );
};

Calendar.propTypes = {
  rangeDate: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number,
  }).isRequired,
  type: PropTypes.string.isRequired,
  dataEvents: PropTypes.array.isRequired,
  handleClickAvailableHour: PropTypes.func.isRequired,
  handleClickEvent: PropTypes.func.isRequired,
  scrollToHourNow: PropTypes.bool,
  businessHour: PropTypes.bool,
  viewHeaderDate: PropTypes.bool,
  itemEvent: PropTypes.shape({
    type: PropTypes.string,
    EventCustom: PropTypes.func,
  }),
  eachMinuteCalendar: PropTypes.number,
};
export default Calendar;
