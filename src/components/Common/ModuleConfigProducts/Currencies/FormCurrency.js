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
  postCurrency,
  putCurrency,
  deleteCurrency,
} from "services/GeneralConfig/Currency";

//Swal
import Swal from "sweetalert2";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//utils
import { successToast, errorToast, mapErrors, infoToast } from "utils/misc";

export const FormCurrency = ({
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
  const [loadingFetch, setLoadingFetch] = useState(false);

  const onSubmit = (value) => {
    setLoadingFetch(true);

    value.apply_decimal = value.apply_decimal ? "1" : "0";

    const functionCall = type === "Nuevo" ? postCurrency : putCurrency;
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
        deleteCurrency(defaultValue.uuid)
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
    <form>
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
      <div className="row align-items-end">
        <form>
          <div className="row">
            <div className="col-sm">
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
            <div className="col-sm">
              <Controller
                rules={{ required: true }}
                control={control}
                defaultValue={defaultValue?.sign}
                name="sign"
                render={({ field }) => (
                  <TextField
                    className="mb-3"
                    {...field}
                    error={errors.sign}
                    type="text"
                    label={t("FormCurrency.Sign")}
                    variant="outlined"
                  />
                )}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm mb-3 d-flex w-100 align-items-center">
              <p>{t("FormCurrency.ApplyDecimals")}</p>
              <Controller
                rules={{ required: false }}
                defaultValue={defaultValue?.apply_decimal}
                control={control}
                name="apply_decimal"
                render={({ field }) => (
                  <FormControl styles={{ width: 20 }}>
                    <Checkbox
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                      }}
                      style={{ width: 20, height: 20 }}
                      checked={field.value}
                      color="primary"
                    />
                  </FormControl>
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
              <ButtonSave
                text={t("Btn.save")}
                onClick={handleSubmit(onSubmit, onError)}
                loader={loadingFetch}
              />
            </ActionWithPermission>
          </div>
        </form>
      </div>
    </form>
  );
};
