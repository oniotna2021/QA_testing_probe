import React, { useState } from "react";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  isFuture,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";

// UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

// Utils
import { useStyles } from "utils/useStyles";
import { capitalize } from "utils/misc";

//DAY WEEKS
const Days = ({ currentDate, classes }) => {
  const dateFormat = "iiiii";
  const days = [];
  let startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    days.push(
      <div
        //   className="column col-center cell"
        style={{
          textTransform: "capitalize",
          padding: "8px",
          borderRadius: "10px",
        }}
        key={i}
      >
        <Typography className={classes.boldText}>
          {format(addDays(startDate, i), dateFormat, { locale: es })}
        </Typography>
      </div>
    );
  }
  return days;
};

//DAY CELLS
const Cells = ({ currentDate, handleChangeDate, dateLocal, classes }) => {
  const monthStart = startOfMonth(dateLocal);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd);
  const dateFormat = "dd";
  const formatData = "yyyy-MM-dd";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = format(day, formatData);
      days.push(
        <div
          style={{
            padding: "8px",
            borderRadius: "10px",
          }}
          className={`cell ${
            !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, currentDate)
              ? "selected"
              : ""
          } ${isFuture(day) ? "disabled-next-days" : ""}`}
          key={cloneDay}
          onClick={() => handleChangeDate(addDays(new Date(cloneDay), 1))}
        >
          <Typography className={classes.boldText}>{formattedDate}</Typography>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(<React.Fragment key={day}>{days}</React.Fragment>);
    days = [];
  }
  return <>{rows}</>;
};

const DatePicker = ({ currentDate, handleChangeDate }) => {
  const classes = useStyles();

  const [dateLocal, setDateLocal] = useState(currentDate || new Date());
  let currentDateFormat = format(dateLocal, "dd MMMM yyy", { locale: es });

  return (
    <div
      className="d-flex flex-column justify-content-between"
      style={{ minHeight: "450px", width: "300px", userSelect: "none" }}
    >
      <Typography className={classes.boldText}>
        {isToday(currentDate) && "Hoy, "} {currentDateFormat}{" "}
      </Typography>

      <div className="date-picker-container">
        <div className="grid">
          <Days currentDate={currentDate} classes={classes} />
        </div>

        <div className="grid mt-3">
          <Cells
            currentDate={currentDate}
            classes={classes}
            handleChangeDate={handleChangeDate}
            dateLocal={dateLocal}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between my-3">
        <IconButton
          style={{
            backgroundColor: "#ffff",
            borderRadius: 5,
            padding: "10px 12px",
            minWidth: 120,
          }}
          onClick={() => setDateLocal((date) => subMonths(date, 1))}
          //   disabled={currentHour === 0}
        >
          <div className="d-flex align-items-center">
            <ArrowBackIosIcon fontSize="small" />

            <div className="ms-2">
              <Typography className={classes.boldText}>
                {capitalize(
                  format(subMonths(dateLocal, 1), "MMMM", { locale: es })
                )}
              </Typography>
            </div>
          </div>
        </IconButton>

        <IconButton
          style={{
            backgroundColor: "#ffff",
            borderRadius: 5,
            padding: "10px 12px",
            minWidth: 120,
          }}
          onClick={() => setDateLocal((date) => addMonths(date, 1))}
          //   disabled={currentHour === 0}
        >
          <div className="d-flex align-items-center">
            <div className="me-2">
              <Typography className={classes.boldText}>
                {capitalize(
                  format(addMonths(dateLocal, 1), "MMMM", { locale: es })
                )}
              </Typography>
            </div>
            <ArrowForwardIosIcon fontSize="small" />
          </div>
        </IconButton>
      </div>
    </div>
  );
};

export default DatePicker;
