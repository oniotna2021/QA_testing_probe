import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfWeek,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";

// UI
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";

// Utils
import { useStyles } from "utils/useStyles";

const HeaderCalendar = ({
  dateWeekCalendar,
  setDateWeekCalendar,
  isFullCalendar,
  currentDate,
  setCurrentDate,
  setFetchReload,
}) => {
  const dateFormat = "PP";

  const { t } = useTranslation();
  const classes = useStyles();

  useEffect(() => {
    if (isFullCalendar === "false") {
      var dateWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
      setDateWeekCalendar(dateWeek);
    } else {
      setDateWeekCalendar(null);
    }
  }, [isFullCalendar, setDateWeekCalendar, currentDate, setFetchReload]);

  // Next/Prev Week
  const nextWeek = () => {
    setDateWeekCalendar(addWeeks(dateWeekCalendar, 1));
  };
  const prevWeek = () => {
    setDateWeekCalendar(subWeeks(dateWeekCalendar, 1));
  };

  // Next/Prev Month
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setFetchReload(true);
  };
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setFetchReload(true);
  };

  return (
    <div className="header d-flex align-items-center justify-content-between">
      <div>
        {isFullCalendar === "true" ? (
          <Typography className={classes.textBold} variant="body1">
            {isToday(currentDate) ? "Hoy, " : ""}
            {format(currentDate, dateFormat, { locale: es })}
          </Typography>
        ) : (
          dateWeekCalendar !== null && (
            <Typography className={classes.textBold} variant="body1">
              {isToday(dateWeekCalendar) ? "Hoy, " : ""}
              {format(dateWeekCalendar, dateFormat, { locale: es })}
            </Typography>
          )
        )}
      </div>

      <div className="d-flex">
        {isFullCalendar === "true" ? (
          <>
            <div className="me-4">
              <Button onClick={prevMonth} className={classes.buttonCalendar}>
                {t("DetailCollaborator.CalendarPrevMonth")}
              </Button>
            </div>

            <Button onClick={nextMonth} className={classes.buttonCalendar}>
              {t("DetailCollaborator.CalendarNextMonth")}
            </Button>
          </>
        ) : (
          <>
            <div className="me-4">
              <Button onClick={prevWeek} className={classes.buttonCalendar}>
                {t("DetailCollaborator.CalendarPrevWeek")}
              </Button>
            </div>

            <Button onClick={nextWeek} className={classes.buttonCalendar}>
              {t("DetailCollaborator.CalendarNextWeek")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default HeaderCalendar;
