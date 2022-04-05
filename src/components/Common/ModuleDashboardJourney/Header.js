import React from "react";
import { connect } from "react-redux";
import { format, isToday, addDays, subDays } from "date-fns";
import { es } from "date-fns/locale";

// UI
import Typography from "@material-ui/core/Typography";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";

// Utils
import { useStyles } from "utils/useStyles";

const Header = ({ profileName, setFetchReload, setDate, currentDate }) => {
  const classes = useStyles();

  // Next/Prev Day
  const nextDay = () => {
    setDate(addDays(currentDate, 1));
    setFetchReload(true);
  };
  const prevDay = () => {
    setDate(subDays(currentDate, 1));
    setFetchReload(true);
  };

  return (
    <>
      <div className="ms-4">
        <Typography variant="h6" className={classes.textBold}>
          Tareas
        </Typography>
      </div>

      <div className="mt-2 ms-4 mb-4 d-flex justify-content-between">
        <div>
          <Typography variant="body2" className={classes.textBold}>
            Entrenador {profileName}
          </Typography>
        </div>

        <div>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ minWidth: 240, width: 240 }}
          >
            <IconButton
              style={{ transform: "rotate(-180deg)" }}
              className={`me-3 ${classes.buttonArrowForward}`}
              onClick={prevDay}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
            <div className="d-flex align-items-center">
              <Typography variant="body2">
                {isToday(currentDate) ? "Hoy," : ""}{" "}
                {format(currentDate, "PP", { locale: es })}
              </Typography>
            </div>
            <IconButton
              onClick={nextDay}
              className={`ms-3 ${classes.buttonArrowForward}`}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  profileName: auth.userProfileName,
});

export default connect(mapStateToProps)(Header);
