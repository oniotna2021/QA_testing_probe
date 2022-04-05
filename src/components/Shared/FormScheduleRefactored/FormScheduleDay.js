import React, { useState, useEffect, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { isDate, addMinutes, differenceInMinutes } from "date-fns";

//UI
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import { IconDeleteItem } from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";

// Components
import TimePicker from "components/Shared/TimePicker/TimePicker";
import ControlledAutocomplete from "components/Shared/AutocompleteSelect/AutocompleteSelect";

//utils
import { useStyles } from "utils/useStyles";
import { convertH2M, formatDateToHHMMSS } from "utils/misc";

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

const FormScheduleDay = ({
  duration = null,
  currentDayId,
  indexSchedule,
  assingSameHour,
  managers,
  isSelectManagers,
  selectedDays,
  idScheduleDay,
  setSchedules,
  dataSchedule,
  handleClickCreateRangeSchedule,
  isSelectVirtual,
  userType,
  lockCapacity,
  setChangeSchedule,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [managersSelect, setManagersSelect] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndtime] = useState(null);
  const [modality, setIsModality] = useState(false);

  const setDefaultManagers = useCallback(
    (array) => {
      if (array.length === 0) return [];

      let findArr = [];

      array.forEach((arr) => {
        const managerFind = managers.find((manager) => manager.id === arr);

        if (Boolean(managerFind)) {
          findArr.push(managerFind);
        }
      });

      return findArr ? findArr : [];
    },
    [managers]
  );

  const error = useMemo(() => {
    if (startTime && endTime) {
      if (differenceInMinutes(startTime, endTime) >= 0) {
        return true;
      }

      return false;
    }
    return false;
  }, [startTime, endTime]);

  useEffect(() => {
    if (Object.keys(dataSchedule).length > 0) {
      if (dataSchedule) {
        const newDateStart =
          dataSchedule.start_time === null
            ? null
            : dataSchedule.start_time.length === 0
            ? null
            : new Date(`2021-08-18T${dataSchedule.start_time}`);
        const newDateEnd =
          dataSchedule.end_time === null
            ? null
            : dataSchedule.end_time.length === 0
            ? null
            : new Date(`2021-08-18T${dataSchedule.end_time}`);
        setManagersSelect(
          setDefaultManagers(dataSchedule.managers ? dataSchedule.managers : [])
        );
        setStartTime(newDateStart);
        setEndtime(newDateEnd);
        const modalityCondition =
          dataSchedule?.modality === "virtual" ? true : false;
        setIsModality(modalityCondition);
      }
    }
  }, [idScheduleDay, currentDayId, dataSchedule, setDefaultManagers]);

  const handleChange = (value, nameTime) => {
    if (!isDate(value)) return;

    const hourFormat = formatDateToHHMMSS(value);

    if (
      selectedDays.length > 0 &&
      selectedDays.some((day) => day === currentDayId)
    ) {
      if (duration !== null && isDate(duration)) {
        const endTimeWithMinutes = addMinutes(
          value,
          convertH2M(formatDateToHHMMSS(duration))
        );

        setSchedules((schedules) =>
          schedules.map((schedule, key) => {
            if (selectedDays.some((day) => key + 1 === day)) {
              return schedule.map((day) => {
                if (day.dayId === idScheduleDay) {
                  return {
                    ...day,
                    [nameTime]: hourFormat,
                    end_time: formatDateToHHMMSS(endTimeWithMinutes),
                  };
                }

                return day;
              });
            }
            return schedule;
          })
        );
      } else {
        setSchedules((schedules) =>
          schedules.map((schedule, key) => {
            if (selectedDays.some((day) => key + 1 === day)) {
              return schedule.map((day) => {
                if (day.dayId === idScheduleDay) {
                  return {
                    ...day,
                    [nameTime]: hourFormat,
                  };
                }

                return day;
              });
            }
            return schedule;
          })
        );
      }
    } else {
      if (duration !== null && isDate(duration)) {
        const endTimeWithMinutes = addMinutes(
          value,
          convertH2M(formatDateToHHMMSS(duration))
        );
        setSchedules((schedules) =>
          schedules.map((schedule, key) => {
            if (key + 1 === currentDayId) {
              return schedule.map((day) => {
                if (
                  day.day_week_id === currentDayId &&
                  day.dayId === idScheduleDay
                ) {
                  return {
                    ...day,
                    [nameTime]: hourFormat,
                    end_time: formatDateToHHMMSS(endTimeWithMinutes),
                  };
                }

                return day;
              });
            }
            return schedule;
          })
        );
      } else {
        setSchedules((schedules) =>
          schedules.map((schedule, key) => {
            if (key + 1 === currentDayId) {
              return schedule.map((day) => {
                if (
                  day.day_week_id === currentDayId &&
                  day.dayId === idScheduleDay
                ) {
                  return {
                    ...day,
                    [nameTime]: hourFormat,
                  };
                }

                return day;
              });
            }
            return schedule;
          })
        );
      }
    }
  };

  const clearHour = () => {
    if (
      selectedDays.length > 0 &&
      selectedDays.some((day) => day === currentDayId)
    ) {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (selectedDays.some((day) => key + 1 === day)) {
            return schedule.map((day) => {
              if (day.dayId === idScheduleDay) {
                return {
                  ...day,
                  start_time: null,
                  end_time: null,
                  managers: [],
                };
              }

              return day;
            });
          }
          return schedule;
        })
      );
    } else {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (key + 1 === currentDayId) {
            return schedule.map((day) => {
              if (
                day.day_week_id === currentDayId &&
                day.dayId === idScheduleDay
              ) {
                return {
                  ...day,
                  start_time: null,
                  end_time: null,
                  managers: [],
                };
              }

              return day;
            });
          }
          return schedule;
        })
      );
    }
    setStartTime(null);
    setEndtime(null);
  };

  const deleteSchedule = () => {
    setSchedules((schedules) =>
      schedules.map((schedule, key) => {
        if (key + 1 === currentDayId) {
          return schedule.filter((day) => !(day.dayId === idScheduleDay));
        }
        return schedule;
      })
    );
  };

  const handleChangeManagers = (data) => {
    setManagersSelect(data);
    if (
      selectedDays.length > 0 &&
      selectedDays.some((day) => day === currentDayId)
    ) {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (selectedDays.some((day) => key + 1 === day)) {
            return schedule.map((day) => {
              if (day.dayId === idScheduleDay) {
                return {
                  ...day,
                  managers: data ? data.map((item) => item.id) : [],
                };
              }

              return day;
            });
          }
          return schedule;
        })
      );
    } else {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (key + 1 === currentDayId) {
            return schedule.map((day) => {
              if (
                day.day_week_id === currentDayId &&
                day.dayId === idScheduleDay
              ) {
                return {
                  ...day,
                  managers: data ? data.map((item) => item.id) : [],
                };
              }

              return day;
            });
          }
          return schedule;
        })
      );
    }
  };

  const handleChangeModality = (value) => {
    const modalitySchedule = value === true ? "virtual" : "presencial";
    if (
      selectedDays.length > 0 &&
      selectedDays.some((day) => day === currentDayId)
    ) {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (selectedDays.some((day) => key + 1 === day)) {
            return schedule.map((day) => {
              if (day.dayId === idScheduleDay) {
                return {
                  ...day,
                  modality: modalitySchedule,
                };
              }

              return day;
            });
          }
          return schedule;
        })
      );
    } else {
      setSchedules((schedules) =>
        schedules.map((schedule, key) => {
          if (key + 1 === currentDayId) {
            return schedule.map((day) => {
              if (
                day.day_week_id === currentDayId &&
                day.dayId === idScheduleDay
              ) {
                return {
                  ...day,
                  modality: modalitySchedule,
                };
              }

              return day;
            });
          }
          return schedule;
        })
      );
    }
  };

  return (
    <>
      {idScheduleDay ? (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <Typography className={`${classes.boldText}`} variant="body2">
              Horario {indexSchedule}
            </Typography>

            {indexSchedule === 1 && (
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: 210 }}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <Typography noWrap variant="body2">
                    {t("FormsVenueCollaborator.CreateScheduleDescription")}
                  </Typography>
                </div>

                <div className="d-flex align-items-center justify-content-end">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      display: "flex",
                      background: "#CCCCCC",
                      borderRadius: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        handleClickCreateRangeSchedule(
                          currentDayId,
                          idScheduleDay
                        );
                      }}
                      size="medium"
                    >
                      <AddIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            )}

            {indexSchedule > 1 && (
              <IconButton
                variant="outlined"
                size="medium"
                onClick={deleteSchedule}
              >
                <IconDeleteItem color="#3C3C3B" width="25" height="25" />
              </IconButton>
            )}
          </div>

          <div className="d-flex justify-content-between mt-4">
            <div className="me-2" style={{ width: "100%" }}>
              <FormControl variant="outlined">
                <TimePicker
                  id="time-picker-1"
                  label={t("FormVenueTurnsWorking.HourInit")}
                  name="start_time"
                  value={startTime}
                  onChange={(e) => {
                    handleChange(e, "start_time");
                    if (lockCapacity === 1) {
                      setChangeSchedule(false);
                    }
                  }}
                  error={error}
                  {...propsTimePicker}
                />
              </FormControl>
            </div>

            <div style={{ width: "100%" }}>
              <FormControl error={error} variant="outlined">
                <TimePicker
                  id="time-picker-2"
                  label={t("FormVenueTurnsWorking.HourFinal")}
                  name="end_time"
                  value={endTime}
                  onChange={(e) => handleChange(e, "end_time")}
                  disabled={duration !== null ? true : false}
                  error={error}
                  {...propsTimePicker}
                />
              </FormControl>
            </div>
          </div>

          {error && (
            <FormHelperText error>
              {t("ErrorScheduleInterval.message")}
            </FormHelperText>
          )}

          <div className=" d-flex justify-content-end">
            <ButtonBase
              onClick={clearHour}
              className={`${classes.buttonClearHour}`}
            >
              Limpiar hora
            </ButtonBase>
          </div>

          {userType !== (17 || 41) && (
            <div className="mt-2">
              {isSelectManagers && (
                <ControlledAutocomplete
                  lockCapacity={lockCapacity}
                  setChangeSchedule={setChangeSchedule}
                  multiple={true}
                  value={managersSelect}
                  handleChange={handleChangeManagers}
                  name="managers"
                  options={managers || []}
                  getOptionSelected={(option, value) =>
                    value?.id === option?.id
                  }
                  getOptionLabel={(option) =>
                    `${option?.first_name} ${option?.last_name}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("FormsVenueActivities.SelectResponsable")}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              )}
            </div>
          )}

          {isSelectVirtual && (
            <div className="row align-items-center justify-content-center">
              <div className="col-3">
                <FormControl>
                  <Checkbox
                    name="modality"
                    onChange={(e) => {
                      handleChangeModality(e.target.checked);
                    }}
                    checked={modality}
                    color="primary"
                  />
                </FormControl>
              </div>
              <div className="col-9 justify-items-center">
                <Typography variant="body2">
                  ¿Aplica para modalidad virtual?
                </Typography>
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

FormScheduleDay.propTypes = {
  setSchedules: PropTypes.func.isRequired,
  assingSameHour: PropTypes.bool.isRequired,
  selectedDays: PropTypes.array.isRequired,
  duration: PropTypes.instanceOf(Date),
  managers: PropTypes.array,
  currentDayId: PropTypes.number.isRequired,
  idScheduleDay: PropTypes.number.isRequired,
  indexSchedule: PropTypes.string.isRequired,
  dataSchedule: PropTypes.array.isRequired,
};

export default FormScheduleDay;
