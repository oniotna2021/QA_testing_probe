import React from "react";
import { format, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";

// UI
import Typography from "@material-ui/core/Typography";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";

// Utils
import { useStyles } from "utils/useStyles";
import { capitalize } from "utils/misc";

const HeaderJourney = ({
  currentDate,
  setDate,
  setFetchReload,
  setFetchReloadQuotes,
}) => {
  const classes = useStyles();
  const dateFormatMonth = "MMMM";
  const dateFormatYear = "Y";

  // Next/Prev Month
  const nextMonth = () => {
    setDate(addMonths(currentDate, 1));
    setFetchReload(true);
    setFetchReloadQuotes(true);
  };
  const prevMonth = () => {
    setDate(subMonths(currentDate, 1));
    setFetchReload(true);
    setFetchReloadQuotes(true);
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ minWidth: 340, width: 340 }}
      >
        <IconButton
          style={{ transform: "rotate(-180deg)" }}
          className={`me-3 ${classes.buttonArrowForward}`}
          onClick={prevMonth}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
        <div className="d-flex align-items-center">
          <Typography variant="h6" className={classes.textBold}>
            {capitalize(format(currentDate, dateFormatMonth, { locale: es }))}{" "}
            {format(currentDate, dateFormatYear, { locale: es })}
          </Typography>

          <Typography variant="p" className="ms-3">
            {capitalize(
              format(addMonths(currentDate, 1), dateFormatMonth, { locale: es })
            )}
          </Typography>
        </div>
        <IconButton
          onClick={nextMonth}
          className={`ms-3 ${classes.buttonArrowForward}`}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

export default HeaderJourney;
