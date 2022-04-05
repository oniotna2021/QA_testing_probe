import React from "react";

// date
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import addDays from "date-fns/addDays";

// UI
import Badge from "@material-ui/core/Badge";
import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

// redux
import { connect } from "react-redux";

const StyledBadge = withStyles(() => ({
  badge: {
    right: 20,
    top: 35,
    height: "10px",
    minWidth: "10px",
    padding: "0 4px",
  },
}))(Badge);

const DatePicker = ({ id, onChange, name, holidays, value, isDisablePass = false, ...restProps }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
      <KeyboardDatePicker
        inputVariant="outlined"
        placeholder="Fecha"
        value={value}
        name={name}
        disablePast={isDisablePass}
        InputAdornmentProps={{ position: "start" }}
        onChange={onChange}
        format="yyyy-MM-dd"
        cancelLabel="Cancelar"
        {...restProps}
        renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
          const holiday =
            isInCurrentMonth &&
            holidays.find((holiday) => {
              return (
                day.setHours(0, 0, 0, 0) ===
                addDays(new Date(holiday.date), 1).setHours(0, 0, 0, 0)
              );
            });

          return holiday ? (
            <Tooltip title={holiday && `Día festivo: ${holiday.name}`}>
              <StyledBadge
                badgeContent={
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      background: "#4959A2",
                      borderRadius: "50%",
                    }}
                  ></div>
                }
              >
                {dayComponent}
              </StyledBadge>
            </Tooltip>
          ) : (
            <Badge>{dayComponent}</Badge>
          );
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

const mapStateToProps = ({ global }) => ({
  holidays: global.holidays,
});

export default connect(mapStateToProps)(DatePicker);
