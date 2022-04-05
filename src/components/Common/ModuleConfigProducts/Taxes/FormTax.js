import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import { postTax, putTax, deleteTax } from "services/Comercial/Tax";
import { getAllCountries } from "services/GeneralConfig/Countries";

//Swal
import Swal from "sweetalert2";

//utils
import { successToast, errorToast, mapErrors, infoToast } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

export const FormTax = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
  id,
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
  const [countriesOptions, setCountriesOptions] = useState([]);

  // submit
  const onSubmit = (value) => {
    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postTax : putTax;
    functionCall(value, functionCall == postTax ? id : uuid)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
        } else {
          enqueueSnackbar(mapErrors(data.message), errorToast);
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
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
        deleteTax(uuid)
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

  useEffect(() => {
    getAllCountries()
      .then(({ data }) => setCountriesOptions(data.data))
      .catch((err) => console.log(err));
  }, []);

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
      <form>
        <div className="row">
          <div className="col">
            <Controller
              rules={{ required: true }}
              control={control}
              name="country_id"
              defaultValue={defaultValue?.country_id}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel>{t("FormTax.Country")}</InputLabel>
                  <Select
                    {...field}
                    fullWidth
                    className="mb-3"
                    error={errors.country_id}
                    variant="outlined"
                    label={t("FormTax.Country")}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    {countriesOptions.map((item) => (
                      <MenuItem key={`item-${item.id}`} value={item.id}>
                        {item.name}
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
              name="name"
              defaultValue={defaultValue?.name}
              render={({ field }) => (
                <TextField
                  className="mb-3"
                  error={errors.name}
                  {...field}
                  type="text"
                  label={t("FormTax.Name")}
                  variant="outlined"
                />
              )}
            />
          </div>
          {/* <div className="col-sm">
            <Controller
              rules={{ required: true }}
              control={control}
              name="description"
              defaultValue={defaultValue?.description}
              render={({ field }) => (
                <TextField
                  {...field}
                  error={errors.description}
                  multiline
                  rows={8}
                  variant="outlined"
                  label={t("WeeklyNutrition.InputDescription")}
                />
              )}
            />
          </div> */}
        </div>
        <div className="row">
          <div className="col"></div>
          <div className="col">
            <Controller
              rules={{ required: true }}
              control={control}
              name="percentage"
              defaultValue={defaultValue?.percentage}
              render={({ field }) => (
                <TextField
                  error={errors.percentage}
                  {...field}
                  type="number"
                  label={t("FormTax.PercentajeValue")}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
      </form>
      <div className="col-xl d-flex justify-content-end mt-4">
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
    </form>
  );
};
