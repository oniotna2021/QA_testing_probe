import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { TypeAppointmentForm } from "config/Forms/MedicalForms";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//Services
import {
  postTypeAppointment,
  putTypeAppointment,
  deleteTypeAppointment,
} from "services/MedicalSoftware/TypeAppointment";

//Swal
import Swal from "sweetalert2";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormTypeAppointment = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    setLoadingFetch(true);
    const functionCall =
      type === "Nuevo" ? postTypeAppointment : putTypeAppointment;
    functionCall(value, defaultValue?.id).then(({ data }) => {
      if (data && data.message && data.status === "success") {
        setExpanded(false);
        enqueueSnackbar(t("Message.SavedSuccess"), successToast);
        setLoad(!load);
        reset();
      } else {
        enqueueSnackbar(data.message, errorToast);
      }
      setLoadingFetch(false);
    });
  };

  const deleteForm = () => {
    Swal.fire({
      title: t("Message.AreYouSure"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Message.YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTypeAppointment(defaultValue.id)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            setLoad(!load);
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <div className="row justify-content-end mb-3">
          <div className="col-1">
            <IconButton
              color="primary"
              fullWidth
              variant="outlined"
              onClick={deleteForm}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      )}
      <div className="row align-items-end">
        <div className="col">
          <CommonComponentSimpleForm
            form={TypeAppointmentForm}
            control={control}
            defaultValue={defaultValue}
          />
        </div>
        <div className="col-2">
          <MinButtonLoader text={t("Btn.save")} loader={loadingFetch} />
        </div>
      </div>
    </form>
  );
};
