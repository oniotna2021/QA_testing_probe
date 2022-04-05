import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

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

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import {
  postCountry,
  putCountry,
  deleteCountry,
} from "services/GeneralConfig/Countries";
import { getAllCurrencies } from "services/GeneralConfig/Currency";

//utils
import { successToast, errorToast, mapErrors, infoToast } from "utils/misc";

export const FormCountry = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [currencies, setCurrencies] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    if (type === "Nuevo" && !permissionsActions.create) {
      return;
    } else if (type !== "Nuevo" && !permissionsActions.edit) {
      return;
    }

    setLoadingFetch(true);
    value.sign = "$";
    const functionCall = type === "Nuevo" ? postCountry : putCountry;
    functionCall(value, defaultValue?.uuid)
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
        deleteCountry(defaultValue.uuid)
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
    getAllCurrencies().then(({ data }) => setCurrencies(data.data));
  }, []);

  return (
    <form>
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
        <form>
          <div className="row">
            <div className="col-sm" style={{ maxWidth: 300 }}>
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
                    label={t("FormCountry.Name")}
                    variant="outlined"
                  />
                )}
              />
            </div>
            <div className="col-sm">
              <Controller
                rules={{ required: true }}
                control={control}
                name="currency_id"
                defaultValue={defaultValue?.currency_id}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel>{t("FormCountry.Currency")}</InputLabel>
                    <Select
                      {...field}
                      fullWidth
                      error={errors.currency_id}
                      className="mb-3"
                      variant="outlined"
                      label={t("FormCountry.Currency")}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                      }}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={`item-${item.id}`} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
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
                <ButtonSave
                  text={t("Btn.save")}
                  onClick={handleSubmit(onSubmit, onError)}
                  loader={loadingFetch}
                />
              </div>
            </ActionWithPermission>
          </div>
        </form>
      </div>
    </form>
  );
};
