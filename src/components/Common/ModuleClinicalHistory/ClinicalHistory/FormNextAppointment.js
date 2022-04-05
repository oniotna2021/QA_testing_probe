import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

//UI
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { FormHelperText } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

//components
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//services
import { addNextDateAppointment } from "services/MedicalSoftware/Appointments";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";
import { useStyles } from "utils/useStyles";
import Swal from "sweetalert2";

const FormNextAppointment = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  let { quote_id, user_id } = useParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [loadingFetchDate, setLoadingFetchDate] = useState(false);

  const addNextAppointmentDate = (value) => {
    setLoadingFetchDate(true);
    let dataSubmit = {
      quote_id: quote_id,
      user_id: user_id,
      date_next_consultation: value.date_next_consultation,
      training_suitability: value.training_suitability,
      training_program_exemption:
        value.training_program_exemption === 1 ? "si" : "no",
    };
    addNextDateAppointment(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
        } else {
          Swal.fire({
            title: mapErrors(data),
            icon: "error",
          });
        }
        setLoadingFetchDate(false);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
        setLoadingFetchDate(false);
      });
  };

  return (
    <>
      <div className="row mt-5 ms-0">
        <div className="col-4 ps-0">
          <Typography className={classes.fontGray}>
            {t("DetailClinicHistory.Result")}
          </Typography>
          <Controller
            name="training_suitability"
            control={control}
            rules={{ required: true }}
            error={errors.training_suitability ? true : false}
            render={({ field }) => (
              <FormControl variant="outlined">
                <Select labelId="select" {...field}>
                  <MenuItem value={1}>Apto</MenuItem>
                  <MenuItem value={2}>No apto</MenuItem>
                  <MenuItem value={3}>Apto con recomendaciones</MenuItem>
                  <MenuItem value={4}>Apto con restricciones</MenuItem>
                  <MenuItem value={5}>Pendiente aptitud</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          {errors.training_suitability && (
            <FormHelperText error={errors.training_suitability ? true : false}>
              {t("Field.required")}
            </FormHelperText>
          )}
        </div>
        <div className="col-4 pe-0">
          <Typography className={classes.fontGray}>
            {t("DetailClinicHistory.DateLastAppointment")}
          </Typography>
          <Controller
            name="date_next_consultation"
            control={control}
            rules={{ required: true }}
            error={errors.date_next_consultation ? true : false}
            render={({ field }) => (
              <TextField {...field} variant="outlined" type="date" />
            )}
          />
          {errors.date_next_consultation && (
            <FormHelperText
              error={errors.date_next_consultation ? true : false}
            >
              {t("Field.required")}
            </FormHelperText>
          )}
        </div>
        <div className="col-4">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Typography className={classes.fontGray}>
              {t("DetailClinicHistory.Exoneration")}
            </Typography>
            <Controller
              name="training_program_exemption"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  control={
                    <Checkbox style={{ paddingTop: 15 }} name="checkedA" />
                  }
                />
              )}
            />
          </div>
        </div>
      </div>
      <div
        className="d-flex justify-content-end my-3"
        style={{ marginRight: -20 }}
      >
        <form onSubmit={handleSubmit(addNextAppointmentDate)} className="me-3">
          <MinButtonLoader text={t("Btn.save")} loader={loadingFetchDate} />
        </form>
      </div>
    </>
  );
};

export default FormNextAppointment;
