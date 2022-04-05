import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { DailyFoodForm } from "config/Forms/MedicalForms";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import {
  postTypeFood,
  putTypeFood,
  deleteTypeFood,
} from "services/MedicalSoftware/TypeFood";

//Swal
import Swal from "sweetalert2";

//utils
import { mapErrors, infoToast } from "utils/misc";

export const FormTypeFood = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  console.log(permissionsActions);
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postTypeFood : putTypeFood;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setExpanded(false);
          Swal.fire({
            title: data.message,
            icon: "success",
          });
          setLoad(!load);
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
        deleteTypeFood(defaultValue.id)
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
            form={DailyFoodForm}
            control={control}
            defaultValue={defaultValue}
            errors={errors}
          />
        </div>
        <div className="col-2">
          <ActionWithPermission
            isValid={
              type === "Nuevo"
                ? permissionsActions?.create
                : permissionsActions?.edit
            }
          >
            <MinButtonLoader text={t("Btn.save")} loader={loadingFetch} />
          </ActionWithPermission>
        </div>
      </div>
    </form>
  );
};
