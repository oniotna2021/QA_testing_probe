import React from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { WeightUnitForm } from "../../../../../config/Forms/MedicalForms";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import {
  postWeightUnit,
  putWeightUnit,
  deleteWeightUnit,
} from "services/MedicalSoftware/WeightUnit";

//Swal
import Swal from "sweetalert2";

import { errorToast, infoToast, mapErrors, successToast } from "utils/misc";

export const FormWeightUnit = ({
  type,
  defaultValue,
  setExpanded,
  reload,
  setReload,
  permissionsActions,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const [loadingFetch, setLoadingFetch] = React.useState(false);

  const onSubmit = (value) => {
    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postWeightUnit : putWeightUnit;
    functionCall(type === "Nuevo" ? value : defaultValue?.id, value)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setExpanded(false);
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          setReload(!reload);
          reset();
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

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
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
        deleteWeightUnit(defaultValue.id)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            setReload(!reload);
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      {type !== "Nuevo" && (
        <div className="row justify-content-end mb-3">
          <div className="col-1">
            <ActionWithPermission isValid={permissionsActions.delete}>
              <IconButton
                color="primary"
                fullWidth
                variant="outlined"
                onClick={deleteForm}
              >
                <DeleteIcon />
              </IconButton>
            </ActionWithPermission>
          </div>
        </div>
      )}
      <div className="row align-items-end">
        <div className="col">
          <CommonComponentSimpleForm
            errors={errors}
            form={WeightUnitForm}
            control={control}
            defaultValue={defaultValue}
          />
        </div>
        <div className="col-2">
          <ActionWithPermission
            isValid={
              type === "Nuevo"
                ? permissionsActions.create
                : permissionsActions.edit
            }
          >
            <MinButtonLoader text={t("Btn.save")} loader={loadingFetch} />
          </ActionWithPermission>
        </div>
      </div>
    </form>
  );
};
