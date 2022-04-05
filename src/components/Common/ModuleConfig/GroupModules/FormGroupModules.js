import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { GroupModulesForm } from "config/Forms/AdminForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import {
  postGroupModule,
  putGroupModule,
  deleteGroupModule,
} from "services/SuperAdmin/GroupModules";

//Swal
import Swal from "sweetalert2";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormGroupModules = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    if (type === "Nuevo" && !permissionsActions.create) {
      return;
    } else if (type !== "Nuevo" && !permissionsActions.edit) {
      return;
    }

    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postGroupModule : putGroupModule;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
        } else {
          enqueueSnackbar(data.message, errorToast);
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
        deleteGroupModule(defaultValue.id)
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
        <ActionWithPermission isValid={permissionsActions.delete}>
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
        </ActionWithPermission>
      )}
      <div className="row align-items-end">
        <div className="col">
          <CommonComponentSimpleForm
            form={GroupModulesForm}
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
            <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
          </div>
        </ActionWithPermission>
      </div>
    </form>
  );
};
