import React, { useState, useEffect } from "react";
import {
  isSameDay,
  eachDayOfInterval,
  getDay,
  format,
  addMinutes,
  isDate,
  addDays,
} from "date-fns";
import slugify from "slugify";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

// Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import TimePicker from "components/Shared/TimePicker/TimePicker";
import DatePicker from "components/Shared/DatePicker/DatePicker";
import Schedule from "components/Shared/ScheduleActivity/ScheduleWithRangeTime/Schedule";

// Services
import { getActivitesByVenue } from "services/Reservations/venueActivities";
import { postActivityByDates } from "services/Reservations/activitiesUser";
import { getSchedulesByEmployee } from "services/Reservations/scheduleEmployee";
import { getIsFestiveByRangeDays } from "services/Reservations/dayFestives";

// Utils
import {
  errorToast,
  infoToast,
  formatDateToHHMMSS,
  mapErrors,
  successToast,
  convertH2M,
} from "utils/misc";

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

const FormAssingActivity = ({
  venueId,
  selectedDate: defaultDate,
  setFetchReload,
  userId,
  handleClose,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [selectedDate, setSelectedDate] = useState({
    start_date: defaultDate,
    end_date: null,
  });
  const [selectedTime, setSelectedTime] = useState({
    start_time: null,
    end_time: null,
  });
  const [isFestive, setIsFestive] = useState(false);
  const [duration, setDuration] = useState(null);
  const [checked, setChecked] = useState("0");
  const [schedules, setSchedules] = useState([]);
  const [schedulesEmployee, setSchedulesEmployee] = useState([]);
  const [listActivites, setListActivites] = useState([]);
  const [daysWeek, setDaysWeek] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);

  useEffect(() => {
    if (venueId) {
      getActivitesByVenue(venueId)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setListActivites(data?.data);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, venueId]);

  useEffect(() => {
    if (selectedDate.start_date && selectedDate.end_date) {
      if (!isSameDay(selectedDate.start_date, selectedDate.end_date)) {
        try {
          const arrayDaysWeek = eachDayOfInterval({
            start: selectedDate.start_date,
            end: selectedDate.end_date,
          });

          let hash = {};
          arrayDaysWeek.forEach((day) => {
            hash[getDay(day) === 0 ? 7 : getDay(day)] = true;
          });

          setDaysWeek(hash);
        } catch (err) {
          enqueueSnackbar(mapErrors(err), errorToast);
        }
      } else {
        setDaysWeek({ [getDay(selectedDate.start_date)]: true });
      }
    }
  }, [selectedDate, enqueueSnackbar]);

  useEffect(() => {
    if (selectedDate.start_date && selectedDate.end_date) {
      const formatOpt = "yyyy-MM-dd";
      getIsFestiveByRangeDays(
        format(selectedDate.start_date, formatOpt),
        format(selectedDate.end_date, formatOpt),
        1
      )
        .then(({ data }) => {
          if (data.status === "success" && data?.data?.length > 0) {
            setIsFestive(true);
          } else {
            setIsFestive(false);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [selectedDate, enqueueSnackbar]);

  useEffect(() => {
    if (venueId && userId) {
      getSchedulesByEmployee(venueId, userId)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data.schedules) {
            setSchedulesEmployee(data.data.schedules);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data?.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, setSchedules, venueId, userId]);

  const handleSetDurationActivity = (id) => {
    const activitySelect = listActivites.find((p) => p.id === id);
    if (activitySelect?.length_minutes) {
      const minutesDate = addMinutes(
        new Date("2021-08-18T00:00:00"),
        activitySelect.length_minutes
      );
      setDuration(minutesDate);
      if (selectedTime.start_time !== null) {
        const endTimeWithMinutes = addMinutes(
          selectedTime.start_time,
          activitySelect.length_minutes
        );
        setSelectedTime({
          ...selectedTime,
          end_time: endTimeWithMinutes,
        });
      }
    }
  };

  const handleChangeChecked = (e) => {
    setChecked(e.target.value);
  };

  const handleChangeDate = (value, name) => {
    if (name === "start_date") {
      setSelectedDate({
        ...selectedDate,
        start_date: value,
        end_date: addDays(value, 1),
      });
      return;
    }

    setSelectedDate({
      ...selectedDate,
      [name]: value,
    });
  };

  const handleChangeTime = (value, name) => {
    if (duration !== null && isDate(duration)) {
      const endTimeWithMinutes = addMinutes(
        value,
        convertH2M(formatDateToHHMMSS(duration))
      );
      if ("start_time") {
        setSelectedTime({
          ...selectedTime,
          start_time: value,
          end_time: endTimeWithMinutes,
        });
      } else {
        setSelectedTime({
          ...selectedTime,
          [name]: value,
        });
      }
    } else {
      setSelectedTime({
        ...selectedTime,
        [name]: value,
      });
    }
  };

  const onSubmit = (data) => {
    if (!selectedDate?.start_date || !selectedDate?.end_date) {
      enqueueSnackbar("Selecciona una fecha de finalización", infoToast);
      return;
    }

    if (checked === "0") {
      enqueueSnackbar("Asigne un horario", infoToast);
      return;
    }

    let dataForm = {
      location_has_activity_id: Number(data.location_has_activity_id),
      start_date: format(selectedDate.start_date, "yyyy-MM-dd"),
      end_date: format(addDays(selectedDate.end_date, 1), "yyyy-MM-dd"),
      managers: [Number(userId)],
    };

    if (checked === "1") {
      dataForm = { ...dataForm, schedules: schedules };
    } else {
      let schedulesFilter = [];
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((schedule) => {
        const isWorkingEmployee = schedulesEmployee.some(
          (p) => p.day_week_id === schedule
        );
        if (daysWeek[schedule] || (schedule === 8 && isFestive)) {
          if (isWorkingEmployee) {
            schedulesFilter.push({
              day_week_id: schedule,
              start_time: formatDateToHHMMSS(selectedTime.start_time),
              end_time: formatDateToHHMMSS(selectedTime.end_time),
              managers: [],
            });
          }
        }
      });
      dataForm = { ...dataForm, schedules: schedulesFilter };
    }

    setLoadingFetch(true);
    postActivityByDates(dataForm)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          handleClose();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => setLoadingFetch(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Typography variant="body1">
            {t("FormAssingActivity.ConfigActivity")}
          </Typography>

          <div className="mt-4">
            <Controller
              rules={{ required: true }}
              control={control}
              name="location_has_activity_id"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel>
                    {t("FormsVenueActivities.SelectActivity")}
                  </InputLabel>
                  <Select
                    fullWidth
                    id={slugify("activity_id", { lower: true })}
                    label={t("FormsVenueActivities.SelectActivity")}
                    variant="outlined"
                    {...field}
                    onChange={(e) => {
                      handleSetDurationActivity(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  >
                    {listActivites &&
                      listActivites.map((activity) => (
                        <MenuItem value={activity.id} key={activity.id}>
                          {activity.activity_name} - {activity.length_minutes}{" "}
                          Min
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.location_has_activity_id && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>

          <Typography className="mt-3" variant="body1">
            {t("FormAssingActivity.Validity")}
          </Typography>
          <div className="col-12 d-flex justify-content-between mt-2">
            <DatePicker
              id="date-picker"
              value={selectedDate.start_date}
              onChange={(date) => handleChangeDate(date, "start_date")}
              style={{ width: 220 }}
              placeholder="Inicia"
            />

            <DatePicker
              id="date-picker"
              value={selectedDate.end_date}
              onChange={(date) => handleChangeDate(date, "end_date")}
              style={{ width: 220 }}
              name="date_picker"
              placeholder="Finaliza"
            />
          </div>
          <div className="col-12 my-3">
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={1}
              name="check_recurrent"
              render={({ field }) => (
                <FormControl
                  component="fieldset"
                  onChange={(e) => {
                    handleChangeChecked(e);
                    field.onChange(e.target.value);
                  }}
                >
                  <div className="col-12 d-flex justify-content-center">
                    <RadioGroup row {...field} aria-label="type" name="checks">
                      <div className="d-flex justify-content-center">
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label={t("FormAssingActivity.labelRecurrent")}
                        />
                        <FormControlLabel
                          value="2"
                          style={{ marginLeft: 120 }}
                          control={<Radio />}
                          label={t("FormAssingActivity.labelPermanent")}
                        />
                      </div>
                    </RadioGroup>
                  </div>
                </FormControl>
              )}
            />

            {checked === "1" && (
              <div className="col-12 my-3">
                <Typography variant="body1">
                  {t("FormAssingActivity.DuplicateAll")}
                </Typography>
                <Schedule
                  isFestive={isFestive}
                  schedulesEmployee={schedulesEmployee}
                  duration={duration}
                  schedules={schedules}
                  setSchedules={setSchedules}
                  daysWeek={daysWeek}
                />
              </div>
            )}

            {checked === "2" && (
              <>
                <Typography className="my-3" variant="body1">
                  {t("FormAssingActivity.DuplicateAll")}
                </Typography>
                <div className="col-12 d-flex justify-content-between mt-2">
                  <div>
                    <FormControl variant="outlined">
                      <TimePicker
                        style={{ width: 210 }}
                        id="time-picker-2"
                        label={t("label.InitialOur")}
                        name="start_time"
                        value={selectedTime.start_time}
                        onChange={(date) => {
                          handleChangeTime(date, "start_time");
                        }}
                        {...propsTimePicker}
                      />
                    </FormControl>
                  </div>
                  <div>
                    <FormControl variant="outlined">
                      <TimePicker
                        style={{ width: 210 }}
                        id="time-picker-2"
                        label={t("label.FinalOur")}
                        name="end_time"
                        value={selectedTime.end_time}
                        onChange={(date) => {
                          handleChangeTime(date, "end_time");
                        }}
                        disabled={duration !== null ? true : false}
                        {...propsTimePicker}
                      />
                    </FormControl>
                  </div>
                </div>
              </>
            )}

            <div className="col-12 d-flex justify-content-end my-4">
              <ButtonSave loader={loadingFetch} text={t("Btn.schedule")} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(FormAssingActivity);
