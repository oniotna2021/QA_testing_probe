import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "../../../../Shared/SimpleForm/SimpleForm";
import { TypeHealthTechnologyForm } from "../../../../../config/Forms/MedicalForms";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

// hoc
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import {
  postTypeHealthTechnology,
  putTypeHealthTechnology,
  deleteTypeHealthTechnology,
} from "../../../../../services/MedicalSoftware/TypeHealthTechnology";

//Swal
import Swal from "sweetalert2";

import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormTypeHealthTechnology = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    if (type === "Nuevo" && !permissionsActions.create) {
      return;
    } else if (type !== "Nuevo" && !permissionsActions.edit) {
      return;
    }
    setLoadingFetch(true);
    const functionCall =
      type === "Nuevo" ? postTypeHealthTechnology : putTypeHealthTechnology;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar("Guardado correctamente", successToast);
          setLoad(!load);
          reset();
        } else {
          enqueueSnackbar(mapErrors(data.messafe), errorToast);
        }
        setLoadingFetch(false);
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
        deleteTypeHealthTechnology(defaultValue.id)
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
          <ActionWithPermission isValid={permissionsActions.delete}>
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
          </ActionWithPermission>
        </div>
      )}
      <div className="row align-items-end">
        <div className="col">
          <CommonComponentSimpleForm
            form={TypeHealthTechnologyForm}
            control={control}
            defaultValue={defaultValue}
          />
        </div>
        <ActionWithPermission
          isValid={
            type === "Nuevo"
              ? permissionsActions.create
              : permissionsActions.edit
          }
        >
          <div className="col-2">
            <MinButtonLoader text={t("Btn.save")} loader={loadingFetch} />
          </div>
        </ActionWithPermission>
      </div>
    </form>
  );
};
