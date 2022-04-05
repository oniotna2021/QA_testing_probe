import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import slugify from "slugify";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

// Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import TimePicker from "components/Shared/TimePicker/TimePicker";

//Services
import {
  postShiftsVenue,
  putShiftsVenue,
  getShiftsVenueByUUID,
} from "services/Reservations/shiftsVenue";

//utils
import {
  successToast,
  errorToast,
  mapErrors,
  formatDateToHHMMSS,
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

const FormTurns = ({
  setLoad,
  idVenue,
  dataItem,
  setOpenForm,
  isEdit = false,
  setIsEdit,
  setIdItem,
  idItem,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndtime] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      id_venue: idVenue,
      name: "",
      start_time: null,
      end_time: null,
    },
  });

  useEffect(() => {
    if (idItem && isEdit) {
      getShiftsVenueByUUID(idItem)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setValue("name", data?.data?.name);
            const newDateStart =
              data?.data?.start_time === null
                ? null
                : data.data.start_time.length === 0
                ? null
                : new Date(`2021-08-18T${data.data.start_time}`);
            const newDateEnd =
              data?.data?.end_time === null
                ? null
                : data.data.end_time.length === 0
                ? null
                : new Date(`2021-08-18T${data.data.end_time}`);
            setStartTime(newDateStart);
            setEndtime(newDateEnd);
            setValue("start_time", newDateStart);
            setValue("end_time", newDateEnd);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }

    return () => {
      setIdItem("");
      setIsEdit(false);
    };
  }, [idItem, enqueueSnackbar, isEdit, setIdItem, setIsEdit, setValue]);

  const submitForm = (data) => {
    const dataForm = {
      ...data,
      start_time: formatDateToHHMMSS(data.start_time),
      end_time: formatDateToHHMMSS(data.end_time),
    };
    setLoading(true);
    const functionCall = isEdit ? putShiftsVenue : postShiftsVenue;
    functionCall(dataForm, idItem)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(true);
          setOpenForm(false);
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="mt-4">
        <Controller
          rules={{ required: true }}
          control={control}
          name="name"
          render={({ field }) => (
            <FormControl variant="outlined">
              <TextField
                {...field}
                id={slugify("name", { lower: true })}
                type="text"
                label={t("FormVenueTurnsWorking.InputName")}
                rows={1}
                variant="outlined"
              />
              {errors.name && (
                <FormHelperText error>Campo requerido</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>

      <div className="mb-4">
        <div className="d-flex justify-content-between mt-4">
          <div className="me-2" style={{ width: "100%" }}>
            <Controller
              rules={{ required: true }}
              control={control}
              name="start_time"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TimePicker
                    {...field}
                    id={slugify("start_time", { lower: true })}
                    label={t("FormVenueTurnsWorking.HourInit")}
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e);
                      field.onChange(e);
                    }}
                    {...propsTimePicker}
                  />
                  {errors.start_time && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>

          <div style={{ width: "100%" }}>
            <Controller
              rules={{ required: true }}
              control={control}
              name="end_time"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TimePicker
                    {...field}
                    id={slugify("end_time", { lower: true })}
                    label={t("FormVenueTurnsWorking.HourFinal")}
                    value={endTime}
                    onChange={(e) => {
                      setEndtime(e);
                      field.onChange(e);
                    }}
                    {...propsTimePicker}
                  />
                  {errors.end_time && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <ButtonSave
          style={{ width: "200px" }}
          loader={loading}
          text={isEdit ? t("Btn.saveChanges") : t("Btn.save")}
        />
      </div>
    </form>
  );
};

export default FormTurns;
