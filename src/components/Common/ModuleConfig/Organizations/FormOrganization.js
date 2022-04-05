import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

// UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import {
  postOrganization,
  putOrganization,
  deleteOrganization,
} from "services/GeneralConfig/Organization";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormOrganization = ({
  isEdit,
  defaultValue,
  setExpanded,
  getList,
  permissionsActions,
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
    if (!isEdit && !permissionsActions.create) {
      return;
    } else if (isEdit && !permissionsActions.edit) {
      return;
    }

    setLoadingFetch(true);
    const fetchMethod = isEdit ? putOrganization : postOrganization;
    fetchMethod(value, isEdit && defaultValue.uuid)
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar(data.message, successToast);
          setExpanded(false);
          getList();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setLoadingFetch(false));
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
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrganization(defaultValue.uuid).then((req) => {
          Swal.fire("¡Eliminado!", "Su registro ha sido eliminado.", "success");
          getList();
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isEdit && (
        <ActionWithPermission isValid={permissionsActions.delete}>
          <div className="row">
            <div className="col d-flex justify-content-end">
              <IconButton onClick={deleteForm}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>{" "}
        </ActionWithPermission>
      )}

      <div className="row mb-3">
        <div className="col">
          <Controller
            control={control}
            rules={{ required: true }}
            defaultValue={defaultValue?.name}
            name="name"
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.name}
                onChange={(e) => field.onChange(e.target.value)}
                variant="outlined"
                label={"Nombre"}
              />
            )}
          />
        </div>
      </div>

      <ActionWithPermission
        isValid={isEdit ? permissionsActions.edit : permissionsActions.create}
      >
        <div className="col d-flex justify-content-end">
          <ButtonSave
            text={isEdit ? t("Btn.Edit") : t("Btn.save")}
            loader={loadingFetch}
          />
        </div>
      </ActionWithPermission>
    </form>
  );
};
