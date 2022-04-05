import React, { useEffect, useState, useCallback } from "react";
import { Controller } from "react-hook-form";
import Swal from "sweetalert2";
import format from "date-fns/format";
import { useSelector } from "react-redux";

// fns week days
import nextMonday from "date-fns/nextMonday";
import nextTuesday from "date-fns/nextTuesday";
import nextWednesday from "date-fns/nextWednesday";
import nextThursday from "date-fns/nextThursday";
import nextFriday from "date-fns/nextFriday";
import nextSaturday from "date-fns/nextSaturday";
import nextSunday from "date-fns/nextSunday";

// UI
import { FormControl, Typography, MenuItem } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import { postAvailabilityByAppoitment } from "services/VirtualJourney/Quotes";

// utils
import { mapErrors } from "utils/misc";
import Loading from "components/Shared/Loading/Loading";

// translate
import { useTranslation } from "react-i18next";

const listTypesQuotesMyCoach = [
  {
    name: "Seguimiento my coach",
    id: 7,
  },
];

const listTypesQuotesNutrition = [
  {
    name: "Seguimiento nutrición",
    id: 10,
  },
];

const ScheduleForm = ({
  control,
  handleSubmit,
  onSubmit,
  errors,
  fetching,
  getValues,
  setValue,
  setSelectedDate,
}) => {
  const { t } = useTranslation();
  const [hours, setHours] = useState([]);
  const [date, setDate] = useState();
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState();
  const usertype = useSelector((state) => state.auth.userType);
  const userId = useSelector((state) => state.auth.userId);

  // list of days
  const listOfDays = [
    {
      name: "Lunes",
      method: (date) => nextMonday(date),
    },
    {
      name: "Martes",
      method: (date) => nextTuesday(date),
    },
    {
      name: "Miércoles",
      method: (date) => nextWednesday(date),
    },
    {
      name: "Jueves",
      method: (date) => nextThursday(date),
    },
    {
      name: "Viernes",
      method: (date) => nextFriday(date),
    },
    {
      name: "Sabado",
      method: (date) => nextSaturday(date),
    },
    {
      name: "Domingo",
      method: (date) => nextSunday(date),
    },
  ];

  const handleMedicalAvailability = useCallback(() => {
    if (getValues().date && getValues().appointment_type_id) {
      const day = listOfDays.find((day) => getValues().date === day.name);
      const dataSelect = {
        appointment_type_id: getValues().appointment_type_id,
        employee_id: userId,
        start_date: format(day.method(new Date()), "yyyy-MM-dd"),
        end_date: format(day.method(new Date()), "yyyy-MM-dd"),
      };
      setSelectedDate(format(day.method(new Date()), "yyyy-MM-dd"));
      setLoadingAvailability(true);
      postAvailabilityByAppoitment(dataSelect)
        .then(({ data }) => {
          if (data.status === "error") {
            Swal.fire({
              title: "¡Cuidado!",
              text: `${mapErrors(data)}`,
              icon: "warning",
            });
          } else if (data.status === "success") {
            if (data?.data?.length > 0) {
              setHours(data?.data);
              setValue("hour", null);
            } else {
              setValue("hour", null);

              setHours([]);
              Swal.fire({
                title: "¡Cuidado!",
                text: `Este médico no tiene horario disponible`,
                icon: "warning",
              });
            }
          }
        })
        .catch((err) => {
          setValue("hour", null);
          setHours([]);
          Swal.fire({
            title: "¡Cuidado!",
            text: `${mapErrors(err)}`,
            icon: "warning",
          });
        })
        .finally(() => {
          setLoadingAvailability(false);
        });
    }
    // eslint-disable-next-line
  }, [getValues, setValue]);

  useEffect(() => {
    handleMedicalAvailability();
  }, [date, handleMedicalAvailability, selectedAppointmentType]);

  return (
    <form>
      <div className="row d-flex align-items-end">
        <div className="col">
          <Typography className="mb-2" color="textSecondary" variant="body2">
            {t("FormAppointmentByMedical.TypeVenue")}
          </Typography>
          <Controller
            name="appointment_type_id"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl variant="outlined">
                <Select
                  labelId="select"
                  error={errors.appointment_type_id}
                  onChange={(e) => {
                    setSelectedAppointmentType(e.target.value);
                    field.onChange(e.target.value);
                  }}
                >
                  {usertype === 29
                    ? listTypesQuotesMyCoach.map((res) => (
                        <MenuItem key={res.name} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))
                    : listTypesQuotesNutrition.map((res) => (
                        <MenuItem key={res.name} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            )}
          />
        </div>

        <div className="col">
          <Typography className="mb-2" color="textSecondary" variant="body2">
            {t("ScheduleForm.ModuleVirtualJourneyAvailable")}
          </Typography>
          <Controller
            name="date"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl variant="outlined">
                <Select
                  labelId="select"
                  error={errors.date}
                  onChange={(e) => {
                    setSelectedAppointmentType(e.target.value);
                    field.onChange(e.target.value);
                  }}
                >
                  {listOfDays.map((res, idx) => (
                    <MenuItem key={`date-${idx}`} value={res.name}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>

        <div className="col">
          {loadingAvailability ? (
            <Loading />
          ) : (
            <>
              <Typography
                className="mb-2"
                color="textSecondary"
                variant="body2"
              >
                {t("ScheduleForm.ModuleVirtualJourneyAvailableHours")}
              </Typography>
              <Controller
                name="hour"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel id="select">
                      {t("WeeklyNutrition.InputHour")}
                    </InputLabel>
                    <Select
                      labelId="select"
                      label={t("WeeklyNutrition.InputHour")}
                      error={errors.hour}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      {hours?.map((item) => (
                        <MenuItem key={`item-${item?.id}`} value={item?.hour}>
                          {item?.hour}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </>
          )}
        </div>

        <div className="col-2 me-0">
          <ButtonSave
            text="Agendar"
            onClick={handleSubmit(onSubmit)}
            loader={fetching}
          />
        </div>
      </div>
    </form>
  );
};

export default ScheduleForm;
