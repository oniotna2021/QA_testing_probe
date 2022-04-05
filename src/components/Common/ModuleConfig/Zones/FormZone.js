import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

// UI
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import { postZone, deleteZone, putZone } from "services/GeneralConfig/Zones";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormZone = ({
  isEdit,
  defaultValue,
  setExpanded,
  getList,
  citiesOptions,
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

    value.city_id = value.city_id.id;

    setLoadingFetch(true);
    const fetchMethod = isEdit ? putZone : postZone;
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
        deleteZone(defaultValue.id).then((req) => {
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
          </div>
        </ActionWithPermission>
      )}

      <div className="row mb-3">
        <div className="col">
          <Controller
            rules={{ required: true }}
            name="city_id"
            defaultValue={citiesOptions.find(
              (city) => city.id === defaultValue?.city_id
            )}
            control={control}
            render={({ field: { onChange } }) => (
              <Autocomplete
                onChange={(_, data) => {
                  onChange(data);
                }}
                defaultValue={citiesOptions.find(
                  (city) => city.id === defaultValue?.city_id
                )}
                options={citiesOptions || []}
                noOptionsText={t("ListPermissions.NoData")}
                getOptionLabel={(option) => option?.name}
                renderOption={(option) => (
                  <React.Fragment>
                    <Typography variant="body1">{option?.name}</Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={errors.city_id}
                    label={t("FormZones.City")}
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
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
