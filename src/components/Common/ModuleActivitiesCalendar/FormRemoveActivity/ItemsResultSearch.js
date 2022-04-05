import React from "react";
import { useTheme } from "@material-ui/core/styles";

// UI
import Skeleton from "@material-ui/lab/Skeleton";
import { IconScheduleActivity } from "assets/icons/customize/config";
import Typography from "@material-ui/core/Typography";

// Utils
import { checkVariable, checkDayWeekNameById } from "utils/misc";
import { useStyles } from "utils/useStyles";
import ContainerPaginationItems from "./ContainerPaginationItems";

const ItemsResultSearch = ({ schedules, loading, typeInactivate }) => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <>
      {loading ? (
        <div className={`mt-2 ${classes.boxSchedule}`}>
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
        </div>
      ) : (
        schedules.length !== 0 &&
        typeInactivate === "temp" && (
          <div className={`mt-2 ${classes.boxSchedule}`}>
            <ContainerPaginationItems schedules={schedules}>
              {({ schedulesPag }) =>
                schedulesPag.map((day, idx) => (
                  <div key={`day-${idx}`}>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      <b>
                        {checkDayWeekNameById(day?.date?.day_week)}
                        {" - "}
                        {checkVariable(day?.date?.date)}
                      </b>
                    </Typography>

                    {day.date.schedules &&
                      day.date.schedules.map((schedule, scheduleIdx) => (
                        <div
                          key={`schedule-${schedule.id}`}
                          className="mt-2 d-flex align-items-center"
                        >
                          <IconScheduleActivity
                            color={theme.palette.black.main}
                          />
                          <div className="ms-2 d-flex align-items-center">
                            {checkVariable(schedule.start_time)} /{" "}
                            {checkVariable(schedule.end_time)} {" - "}
                            <Typography
                              variant="body1"
                              style={{
                                color:
                                  Number(schedule.reservations) === 0
                                    ? "primary"
                                    : "red",
                              }}
                            >
                              {schedule.reservations} reservas{" "}
                            </Typography>
                          </div>
                        </div>
                      ))}
                  </div>
                ))
              }
            </ContainerPaginationItems>
          </div>
        )
      )}
    </>
  );
};

export default ItemsResultSearch;
