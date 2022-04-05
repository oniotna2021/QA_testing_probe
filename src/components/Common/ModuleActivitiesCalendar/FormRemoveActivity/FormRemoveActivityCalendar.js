import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useStyles } from "utils/useStyles";

// form hook
import { useForm, Controller } from "react-hook-form";

// ui
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import { getAllActivitiesReasons } from "services/Reservations/activitiesCancelationReason";
import { postInactivateActivityByCalendar } from "services/Reservations/activitiesCalendar";

// utils
import {
  errorToast,
  formatDateToHHMMSS,
  infoToast,
  mapErrors,
  successToast,
} from "utils/misc";

const FormRemoveActicityCalendar = ({
  setIsOpen,
  dataDetailActivity,
  setFetchReload,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [listReasonInactivate, setListReasonInactivate] = useState([]);

  useEffect(() => {
    getAllActivitiesReasons()
      .then(({ data }) => {
        if (data && data.status === "success") {
          setListReasonInactivate(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  const onSubmitInactivate = (value) => {
    let dataForm = {
      uuid: dataDetailActivity.uuid,
      news_reason_id: value.news_reason_id,
      note: value.note,
      date: dataDetailActivity.date,
      day_week_id: dataDetailActivity.day_week_id,
    };
    setFetchReload(true);
    postInactivateActivityByCalendar(dataForm)
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          enqueueSnackbar(mapErrors(data), successToast);
          setIsOpen(false);
        } else {
          enqueueSnackbar(mapErrors(data), infoToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setFetchReload(false);
      });
  };

  return (
    <>
      <Card className={classes.cardInfoActivity}>
        <p>Horario</p>
        <div className="d-flex">
          <p style={{ marginRight: "8px" }}>
            <b>{dataDetailActivity.date}</b>
          </p>
          <p>
            {`${dataDetailActivity.start_time}/${dataDetailActivity.end_time}`}
          </p>
        </div>
      </Card>
      <form onSubmit={handleSubmit(onSubmitInactivate)}>
        <p>Selecciona el motivo por el que deseas inactivar esta actividad</p>
        <Controller
          rules={{ required: true }}
          control={control}
          name="news_reason_id"
          render={({ field }) => (
            <FormControl variant="outlined">
              <InputLabel id="news_reason_id">Seleccionar motivo</InputLabel>
              <Select
                {...field}
                error={errors.news_reason_id}
                disabled={false}
                labelId="news_reason_id"
                label="Seleccionar motivo"
              >
                {listReasonInactivate.map((res) => (
                  <MenuItem key={res.description} value={res.id}>
                    {res.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <div className="my-4">
          <Controller
            rules={{ required: true }}
            control={control}
            name="note"
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.note}
                label="Notas:"
                multiline
                rows={4}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="d-flex justify-content-between mt-3">
          <Button
            fullWidth
            variant="contained"
            className="me-2"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <ButtonSave
            color="primary"
            style={{ marginBottom: 0 }}
            fullWidth={true}
            text="Inactivar"
          />
        </div>
      </form>
    </>
  );
};

export default FormRemoveActicityCalendar;
