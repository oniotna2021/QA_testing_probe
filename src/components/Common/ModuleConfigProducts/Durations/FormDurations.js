import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import {
  postDuration,
  putDuration,
  deleteDuration,
} from "services/GeneralConfig/Durations";

//Swal
import Swal from "sweetalert2";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//utils
import { successToast, errorToast, mapErrors, infoToast } from "utils/misc";

export const FormDurations = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
  uuid,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    console.log(value);
    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postDuration : putDuration;
    functionCall(value, uuid)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
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
        deleteDuration(uuid)
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
              <IconButton color="primary" fullWidth variant="outlined">
                <DeleteIcon onClick={() => deleteForm()} />
              </IconButton>
            </ActionWithPermission>
          </div>
        </div>
      )}
      <div className="row align-items-end">
        <div className="row">
          <div className="col">
            <Controller
              rules={{ required: true }}
              control={control}
              name="name"
              defaultValue={defaultValue?.name}
              render={({ field }) => (
                <TextField
                  error={errors.name}
                  className="mb-3"
                  {...field}
                  type="text"
                  label={t("FormCurrency.Name")}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>

        <div className="row w-100 d-flex justify-content-end">
          <ActionWithPermission
            isValid={
              type === "Nuevo"
                ? permissionsActions.create
                : permissionsActions.edit
            }
          >
            <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
          </ActionWithPermission>
        </div>
      </div>
    </form>
  );
};
