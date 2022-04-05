import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack";
import { Controller } from "react-hook-form";
import slugify from "slugify";

// ui
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// hocs
import ActionWithPermission from "hocs/ActionWithPermission";

// translate
import { useTranslation } from "react-i18next";

// services
import {
  postReason,
  putReason,
  deleteReason,
} from "services/JourneyModule/ReasonsReasingQuotes";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";

const FormHeartDiseases = ({
  permissionsActions,
  defaultValue,
  setLoad,
  load,
  isEdit,
  setExpanded,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    if (!isEdit && !permissionsActions.create) {
      return;
    } else if (isEdit && !permissionsActions.edit) {
      return;
    }

    setLoadingFetch(true);
    const functionCall = !isEdit ? postReason : putReason;

    functionCall(!isEdit ? value : defaultValue?.uuid, value)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
          reset();
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
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, bórralo!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          deleteReason(defaultValue.uuid)
            .then((req) => {
              Swal.fire(
                "¡Eliminado!",
                "Su registro ha sido eliminado.",
                "success"
              );
              setLoad(!load);
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* icon delete */}
      {isEdit && (
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
      {/* inputs */}
      <div className="row align-items-end">
        <div className="col">
          <div className="row">
            <div className="col">
              <Controller
                rules={{ required: true }}
                control={control}
                name="description"
                defaultValue={defaultValue?.description}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("description", { lower: true })}
                    type={"text"}
                    label={t("WeeklyNutrition.InputDescription")}
                    variant="outlined"
                    error={errors.description}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <ActionWithPermission
          isValid={
            !isEdit ? permissionsActions.create : permissionsActions.edit
          }
        >
          <div className="col-2">
            <ButtonSave
              style={{ marginBottom: 0 }}
              text={t("Btn.save")}
              loader={loadingFetch}
            />
          </div>
        </ActionWithPermission>
      </div>
    </form>
  );
};

export default FormHeartDiseases;
