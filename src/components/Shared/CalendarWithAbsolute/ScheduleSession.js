import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";

// ui
import Container from "@material-ui/core/Container";
import DatePicker from "components/Shared/DatePicker/DatePicker";
import TimePicker from "components/Shared/TimePicker/TimePicker";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  pickers: {
    width: "178px",
    height: "48px",
  },
  cancel: {
    width: "178px",
    height: "48px",
    border: "1px solid #8D33D3",
    borderRadius: "10px",
    color: "#8D33D3",
  },
  buttonRes: {
    background: "#8D33D3",
    color: "#ffff",
    width: "178px",
    height: "48px",
    "&:hover": {
      background: "#8D33D3",
    },
  },
}));

const propsTimePicker = {
  ampm: true,
  inputVariant: "outlined",
  margin: "normal",
  minutesStep: 5,
  mask: "__:__ _M",
  KeyboardButtonProps: { "aria-label": "change time" },
  emptyLabel: null,
  showTodayButton: true,
  todayLabel: "Hora actual",
  invalidLabel: "Hora inválida",
  InputAdornmentProps: { position: "start" },
};

const ScheduleSession = ({ setOpenReserva }) => {
  const classes = useStyles();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (value) => {
    console.log(value);
  };

  return (
    <Container>
      <div className="mb-4">
        <Typography variant="p">
          Selecciona los días y las horas para reservar esta sesión
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="d-flex justify-content-between mb-5">
          <div className={classes.pickers}>
            <Controller
              render={({ field }) => (
                <FormControl>
                  <DatePicker
                    {...field}
                    style={{ marginTop: 8 }}
                    id="outlined-name-planTraininig"
                    placeholder={"Dia"}
                    onChange={(data) => field.onChange(data)}
                  />
                </FormControl>
              )}
              control={control}
              defaultValue={null}
              error={errors.day3 ? true : false}
              name="day3"
              rules={{ required: true }}
            />
          </div>
          <div className={classes.pickers}>
            <FormControl>
              <TimePicker
                id="time-picker-2"
                label={"Hora"}
                name="start_time"
                {...propsTimePicker}
              />
            </FormControl>
          </div>
        </div>
        <div className="d-flex justify-content-between my-4">
          <Button
            className={classes.cancel}
            onClick={() => setOpenReserva(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" className={classes.buttonRes}>
            <Typography variant="p">Reservar</Typography>
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default ScheduleSession;
