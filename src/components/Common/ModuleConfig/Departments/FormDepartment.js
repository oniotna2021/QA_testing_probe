import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

// UI
import { FormControl } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import {
  postDepartment,
  deleteDepartment,
  putDepartment,
} from "services/GeneralConfig/Deparments";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormDepartment = ({
  isEdit,
  defaultValue,
  setExpanded,
  getList,
  countriesOptions,
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
    const fetchMethod = isEdit ? putDepartment : postDepartment;
    fetchMethod(value, isEdit && defaultValue.id)
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
        deleteDepartment(defaultValue.id).then((req) => {
          Swal.fire("¡Eliminado!", "Su registro ha sido eliminado.", "success");
          getList();
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isEdit && (
        <ActionWithPermission isValid={permissionsActions?.delete}>
          <div className="row">
            <div className="col d-flex justify-content-end">
              <IconButton onClick={deleteForm}>
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        </ActionWithPermission>
      )}

      <div className="row mb-3">
        <div className="col">
          <Controller
            rules={{ required: true }}
            control={control}
            name="country_id"
            defaultValue={defaultValue?.country_id}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="country_id">{"País"}</InputLabel>
                <Select
                  {...field}
                  error={errors.country_id}
                  labelId="country_id"
                  label={"País"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {countriesOptions.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>

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
