import React from "react";

import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useParams } from "react-router";

//UI
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

//components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//utils
import { errorToast, successToast, mapErrors } from "utils/misc";
import Swal from "sweetalert2";

//sevices
import { postObservation } from "services/MedicalSoftware/ActivityObservations";

const FormAddObservation = ({ loadingFetch, setLoadingFetch }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user_id, quote_id, medical_professional_id } = useParams();

  const onSubmit = (value) => {
    let dataSubmit = {
      user_id: user_id,
      quote_id: quote_id,
      observation: value.observation,
      medical_profesional_id: medical_professional_id,
    };
    setLoadingFetch(true);
    postObservation(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          reset({ observation: "" });
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
        setLoadingFetch(false);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
        setLoadingFetch(false);
      });
  };

  return (
    <form className="mt-1 mx-5" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="observation"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            {...field}
            multiline
            variant="outlined"
            error={errors.observation}
            rows={5}
            label={t("DetailClinicHistory.Observations")}
          />
        )}
      />
      {errors.observation && (
        <FormHelperText error>{t("Field.required")}</FormHelperText>
      )}
      <div className="d-flex justify-content-end mt-4">
        <ButtonSave loader={loadingFetch} text={t("Btn.save")} />
      </div>
    </form>
  );
};

export default FormAddObservation;
