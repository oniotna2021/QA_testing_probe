import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { connect } from "react-redux";

// UI
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import {
  addLocality,
  updateLocality,
  deleteLocality,
} from "services/GeneralConfig/Localities";

// Hooks
import useListCitiesByCountry from "hooks/useListCitiesByCountry";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

// utils
import { successToast, errorToast, mapErrors } from "utils/misc";

const FormLocality = ({
  listCountries,
  isEdit,
  defaultValue,
  setExpanded,
  onClose,
  defaultValueIdCountry,
  defaultValueIdCity,
  permissionsActions,
}) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);

  const { idCountry, handleChangeIdCountry, listCities } =
    useListCitiesByCountry(defaultValueIdCountry);

  const onSubmit = (value) => {
    if (!isEdit && !permissionsActions.create) {
      return;
    } else if (isEdit && !permissionsActions.edit) {
      return;
    }

    setLoadingFetch(true);
    const fetchMethod = isEdit ? updateLocality : addLocality;
    fetchMethod(value, isEdit && defaultValue.id)
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar(data.message, successToast);
          setExpanded(false);
          onClose();
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
        deleteLocality(defaultValue.id).then((req) => {
          Swal.fire("¡Eliminado!", "Su registro ha sido eliminado.", "success");
          onClose();
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

        <div className="col">
          <Controller
            control={control}
            rules={{ required: true }}
            defaultValue={defaultValue?.zip_code}
            name="zip_code"
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.zip_code}
                onChange={(e) => field.onChange(e.target.value)}
                variant="outlined"
                label={"Código"}
              />
            )}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <Controller
            rules={{ required: false }}
            control={control}
            name="id_country"
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
                    handleChangeIdCountry(e.target.value);
                    setValue("id_city", null);
                  }}
                  value={idCountry}
                >
                  {listCountries &&
                    listCountries.map((res) => (
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
            rules={{ required: true }}
            control={control}
            name="city_id"
            defaultValue={defaultValue?.city_id || defaultValueIdCity}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="id_organization">
                  {t("FormZones.City")}
                </InputLabel>
                <Select
                  error={errors.city_id}
                  labelId="city_id"
                  label={t("FormZones.City")}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {listCities &&
                    listCities.map((res) => (
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

const mapStateToProps = ({ global }) => ({
  listCountries: global.countries,
});

export default connect(mapStateToProps)(FormLocality);
