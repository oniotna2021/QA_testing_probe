import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { SurgeryTimesForm } from "config/Forms/MedicalForms";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//Services
import {
  postSurgeryTimes,
  putSurgeryTimes,
  deleteSurgeryTimes,
} from "services/MedicalSoftware/SurgeryTimes";

//Swal
import Swal from "sweetalert2";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormSurgeryTimes = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (value) => {
    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postSurgeryTimes : putSurgeryTimes;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("Message.SavedSuccess"), successToast);
          setLoad(!load);
          reset();
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
        setLoadingFetch(true);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
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
        deleteSurgeryTimes(defaultValue.id)
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
            form={SurgeryTimesForm}
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
