import React, { useEffect, useMemo, useRef } from "react";
import { eachMinuteOfInterval, roundToNearestMinutes } from "date-fns";

// Components
import TimeGridSlots from "./TimeGridSlots";
import ScheduleSlots from "./ScheduleSlots";

// UI
import {
  TableLTR,
  ScrollContainer,
  ContainerTableRelative,
} from "./WeekScheduleCalendar.styles";

//Utils
import { useStyles } from "utils/useStyles";

const WeekScheduleCalendar = ({
  rangeDate,
  dataEvents,
  handleClickAvailableHour,
  handleClickEvent,
  stylesContainerCalendar,
  scrollToHourNow,
  viewHeaderDate,
  dateWeeks,
  businessHour,
  itemEvent,
  eachMinuteCalendar,
}) => {
  const classes = useStyles();

  const scrollToHour = useRef(true);
  const refHour = useRef(null);
  const refHourNow = useRef(
    roundToNearestMinutes(new Date(), {
      nearestTo: eachMinuteCalendar === 30 ? 30 : 1,
    })
  );

  const arrayHours = useMemo(() => {
    return eachMinuteOfInterval(
      {
        start: new Date(2014, 9, 14, rangeDate.start),
        end: new Date(2014, 9, 14, rangeDate.end),
      },
      { step: eachMinuteCalendar }
    );
  }, [rangeDate, eachMinuteCalendar]);

  const arrayDataQuotes = useMemo(() => {
    return [...dataEvents];
  }, [dataEvents]);

  useEffect(() => {
    if (
      // arrayHours.length > 38 &&
      arrayDataQuotes.length > 0 &&
      refHour.current !== null &&
      scrollToHour.current &&
      scrollToHourNow
    ) {
      refHour.current.scrollIntoView({
        behavior: "smooth",
      });
      scrollToHour.current = false;
    }
  }, [arrayHours, arrayDataQuotes, scrollToHourNow]);

  return (
    <div style={{ height: "100%", ...stylesContainerCalendar }}>
      <TableLTR>
        <ScrollContainer>
          <ContainerTableRelative>
            {/* Time Grid Slots */}
            <TimeGridSlots
              arrayHours={arrayHours}
              refHourNow={refHourNow}
              refHour={refHour}
              classes={classes}
              viewHeaderDate={viewHeaderDate}
              dateWeeks={dateWeeks}
            />

            {/* Time Grid Schedule Slots */}
            <ScheduleSlots
              arrayDataQuotes={arrayDataQuotes}
              handleClickAvailableHour={handleClickAvailableHour}
              handleClickEvent={handleClickEvent}
              viewHeaderDate={viewHeaderDate}
              businessHour={businessHour}
              dateWeeks={dateWeeks}
              itemEvent={itemEvent}
              eachMinuteCalendar={eachMinuteCalendar}
            />
          </ContainerTableRelative>
        </ScrollContainer>
      </TableLTR>
    </div>
  );
};

export default WeekScheduleCalendar;
