import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";

// ui
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import DatePicker from "components/Shared/DatePicker/DatePicker";
import TimePicker from "components/Shared/TimePicker/TimePicker";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles(() => ({
  pickers: {
    width: 156,
    height: 48,
  },
  buttonRes: {
    background: "#8D33D3",
    color: "#ffff",
    width: 162,
    height: 48,
    marginTop: 203,
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

const FormReservationTrainer = () => {
  const classes = useStyles();
  const history = useHistory();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (value) => {
    console.log(value);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row m-4 ">
          <div className="col-3">
            <Typography variant="p">
              Tienes 3 días disponibles a la semana para crear el horario
            </Typography>
          </div>
          <div className="col-4">
            <div className="mb-4">
              <Typography variant="p">
                Seleccionar la misma hora siempre
              </Typography>
              <Checkbox />
            </div>
            <div className="d-flex justify-content-around mb-3">
              <div className={`mt-2 ${classes.pickers}`}>
                <Controller
                  render={({ field }) => (
                    <FormControl>
                      <DatePicker
                        {...field}
                        id="outlined-name-planTraininig"
                        placeholder={"Dia"}
                        onChange={(data) => field.onChange(data)}
                      />
                    </FormControl>
                  )}
                  control={control}
                  defaultValue={null}
                  error={errors.day1 ? true : false}
                  name="day1"
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
            <div className="d-flex justify-content-around mb-3">
              <div className={`mt-2 ${classes.pickers}`}>
                <Controller
                  render={({ field }) => (
                    <FormControl>
                      <DatePicker
                        {...field}
                        id="outlined-name-planTraininig"
                        placeholder={"Dia"}
                        onChange={(data) => field.onChange(data)}
                      />
                    </FormControl>
                  )}
                  control={control}
                  defaultValue={null}
                  error={errors.day2 ? true : false}
                  name="day2"
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
            <div className="d-flex justify-content-around">
              <div className={`mt-2 ${classes.pickers}`}>
                <Controller
                  render={({ field }) => (
                    <FormControl>
                      <DatePicker
                        {...field}
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
          </div>
          <div className="col-5 d-flex align-items-end">
            <Button
              type="submit"
              className={classes.buttonRes}
              onClick={() => history.push("/trainer-booking")}
            >
              <Typography variant="p">Crear reserva</Typography>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default FormReservationTrainer;
