import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { useTheme } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";

import { IconClock } from "assets/icons/customize/config";

import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";

// Services
import { formatDateToHHMMSS, isRangeHours } from "utils/misc";

const TimePicker = React.forwardRef(
  ({ id, onChange, rangeTime = [], label, name, value, ...restProps }, ref) => {
    const theme = useTheme();

    const { enqueueSnackbar } = useSnackbar();

    const verififyTimeRange = (date) => {
      if (rangeTime.length !== 0) {
        const [startTime, endTime] = rangeTime;

        if (isRangeHours(date, startTime, endTime, true)) {
          return true;
        } else {
          enqueueSnackbar(
            `El colaborador no tiene horario en ese rango de horas, asignar entre ${formatDateToHHMMSS(
              startTime
            )} y ${formatDateToHHMMSS(endTime)}`,
            { variant: "info", autoHideDuration: 2500 }
          );
          return false;
        }
      }

      return true;
    };

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          ref={ref}
          keyboardIcon={<IconClock color={theme.palette.primary.main} />}
          id={id}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          onAccept={verififyTimeRange}
          cancelLabel="Cancelar"
          {...restProps}
        />
      </MuiPickersUtilsProvider>
    );
  }
);

export default TimePicker;
