import React from "react";
import {
  eachMinuteOfInterval,
  roundToNearestMinutes,
  addMinutes,
} from "date-fns";

// UI
import {
  TableLTR,
  ScrollContainer,
  ContainerTableRelative,
} from "./WeekScheduleCalendar.styles";

//Utils
import { useStyles } from "utils/useStyles";
import { calculateInsetSchedules, formatDateToHHMMSS } from "utils/misc";

const AvailableBlocks = ({
  itemSchedule,
  handleClickAvailableHour,
  date,
  viewHeaderDate,
  eachMinuteCalendar,
}) => {
  const classes = useStyles();

  const blocks = (itemSchedule) => {
    if (itemSchedule.start_time && itemSchedule.end_time) {
      const roundHour = (date) =>
        roundToNearestMinutes(date, {
          nearestTo: eachMinuteCalendar === 30 ? 10 : 15,
        });

      const startTime = roundHour(
        new Date(`2021-08-18T${itemSchedule.start_time}`)
      );
      const endTime = roundHour(
        new Date(`2021-08-18T${itemSchedule.end_time}`)
      );

      const arrayHours = eachMinuteOfInterval(
        {
          start: startTime,
          end: endTime,
        },
        { step: eachMinuteCalendar === 30 ? 10 : 15 }
      );

      return arrayHours.map(
        (hourSchedule, idx) =>
          formatDateToHHMMSS(hourSchedule) !== formatDateToHHMMSS(endTime) && (
            <div
              key={idx}
              style={{
                inset: calculateInsetSchedules({
                  initHour: formatDateToHHMMSS(hourSchedule),
                  finalHour: formatDateToHHMMSS(
                    addMinutes(
                      hourSchedule,
                      eachMinuteCalendar === 30 ? 10 : 15
                    )
                  ),
                  isHourAvailable: true,
                  isHeaderDate: viewHeaderDate,
                  eachMinuteCalendar: eachMinuteCalendar,
                }),
                zIndex: 1,
                position: "absolute",
                cursor: "pointer",
              }}
              onClick={() =>
                handleClickAvailableHour({
                  data: itemSchedule,
                  date: date,
                  hour: formatDateToHHMMSS(hourSchedule),
                })
              }
            >
              <div
                style={{
                  padding: 0,
                  height: "100%",
                  borderRadius: 0,
                }}
                className={classes.quoteAvailable}
              >
                <div
                  className="d-flex flex-column"
                  style={{ height: "100%", padding: 0 }}
                ></div>
              </div>
            </div>
          )
      );
    }

    // return (
    //   <div
    //     style={{
    //       inset: calculateInsetSchedules(
    //         itemSchedule.start_time,
    //         itemSchedule.end_time
    //       ),
    //       zIndex: 1,
    //       position: "absolute",
    //       cursor: "pointer",
    //     }}
    //     onClick={() => handleClickQuote(null)}
    //   >
    //     <div
    //       style={{
    //         padding: 5,
    //         height: "100%",
    //         borderRadius: 6,
    //         // backgroundColor: "rgba(255, 255, 255, 0.3)",
    //         backgroundColor: "#ffffff",
    //       }}
    //     >
    //       <div
    //         className="d-flex flex-column"
    //         style={{ height: "100%", padding: 15 }}
    //       ></div>
    //     </div>
    //   </div>
    // );
  };

  return blocks(itemSchedule);
};

export default AvailableBlocks;
