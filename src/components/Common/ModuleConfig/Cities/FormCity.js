import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

// UI
import { FormControl, Typography } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

// services
import { postCity, putCity, deleteCity } from "services/GeneralConfig/Cities";
import { getDeparmentsByCountry } from "services/GeneralConfig/Deparments";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// utils
import { successToast, errorToast, mapErrors, infoToast } from "utils/misc";

export const FormCity = ({
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
  const [searchDeparmentsLoader, setSearchDeparmentsLoader] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    defaultValue?.id_country
  );
  const [deparmentsOptions, setDeparmentsOptions] = useState([]);

  const onSubmit = (value) => {
    if (!isEdit && !permissionsActions.create) {
      return;
    } else if (isEdit && !permissionsActions.edit) {
      return;
    }

    if (value.id_department) {
      setLoadingFetch(true);
      const fetchMethod = isEdit ? putCity : postCity;
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
    } else {
      enqueueSnackbar(t("FormCities.SelectDepartments"), infoToast);
    }
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
        deleteCity(defaultValue.uuid).then((req) => {
          Swal.fire("¡Eliminado!", "Su registro ha sido eliminado.", "success");
          getList();
        });
      }
    });
  };

  useEffect(() => {
    if (selectedCountry) {
      setSearchDeparmentsLoader(true);
      getDeparmentsByCountry(selectedCountry)
        .then(({ data }) => setDeparmentsOptions(data.data))
        .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
        .finally(() => setSearchDeparmentsLoader(false));
    }
  }, [selectedCountry, enqueueSnackbar]);

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
            control={control}
            name="id_country"
            defaultValue={defaultValue?.id_country}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="id_country">
                  {t("FormCities.Country")}
                </InputLabel>
                <Select
                  {...field}
                  error={errors.id_country}
                  labelId="id_country"
                  label={t("FormCities.Country")}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setSelectedCountry(e.target.value);
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
      </div>

      <div className="row mb-3">
        <div className="col">
          {searchDeparmentsLoader ? (
            <Loading />
          ) : deparmentsOptions.length === 0 ? (
            <Typography
              variant="body2"
              style={{
                textAlign: "center",
              }}
            >
              {t("FormCities.NoDepartments")}
            </Typography>
          ) : (
            <Controller
              rules={{ required: true }}
              control={control}
              name="id_department"
              defaultValue={defaultValue?.id_department}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="id_department">
                    {t("FormCities.Department")}
                  </InputLabel>
                  <Select
                    {...field}
                    error={errors.id_department}
                    labelId="id_department"
                    label={t("FormCities.Department")}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    {deparmentsOptions.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          )}
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
                label={t("FormCurrency.Name")}
              />
            )}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <Controller
            control={control}
            rules={{ required: true }}
            name="latitude"
            defaultValue={defaultValue?.latitude}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.latitude}
                onChange={(e) => field.onChange(e.target.value)}
                variant="outlined"
                label={t("FormCity.Latitude")}
              />
            )}
          />
        </div>

        <div className="col">
          <Controller
            control={control}
            rules={{ required: true }}
            name="longitude"
            defaultValue={defaultValue?.longitude}
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.longitude}
                onChange={(e) => field.onChange(e.target.value)}
                variant="outlined"
                label={t("FormCity.Longitude")}
              />
            )}
          />
        </div>
      </div>

      <ActionWithPermission
        isValid={isEdit ? permissionsActions.edit : permissionsActions.create}
      >
        <div className="col d-flex justify-content-end">
          <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
        </div>
      </ActionWithPermission>
    </form>
  );
};
