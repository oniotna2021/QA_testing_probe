import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import slugify from "slugify";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import {
  postTypeOfContract,
  putTypeOfContract,
  deleteTypeOfContract,
} from "services/Reservations/typeOfContract";

//Swal
import Swal from "sweetalert2";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormTypeOfContract = ({
  type,
  defaultValue,
  idItem,
  setExpanded,
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
    const dataForm = {
      name: value.name,
      check_hourly_shift: value.check_hourly_shift === true ? 1 : 0,
    };
    setLoadingFetch(true);
    const functionCall =
      type === "Nuevo" ? postTypeOfContract : putTypeOfContract;
    functionCall(dataForm, idItem)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(true);
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
      title: t("Message.AreYouSure"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Message.YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTypeOfContract(idItem)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            setLoad(true);
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        <div className="row align-items-center align-content-center">
          <div className="col-6">
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={defaultValue?.name}
              name="name"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("name", { lower: true })}
                    type="text"
                    label={t("ListTypeOfContract.InputName")}
                    rows={1}
                    variant="outlined"
                  />
                  {errors.name && (
                    <FormHelperText error>{t("Field.required")}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>

          <div className="col-6">
            <div className="row">
              <div className="col-3 d-flex justify-items-center align-items-center">
                <Controller
                  rules={{ required: false }}
                  defaultValue={defaultValue?.check_hourly_shift}
                  control={control}
                  name="check_hourly_shift"
                  render={({ field }) => (
                    <FormControl>
                      <Checkbox
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.checked);
                        }}
                        checked={field.value}
                        color="primary"
                      />
                    </FormControl>
                  )}
                />
              </div>
              <div className="col-9 d-flex justify-items-center align-items-center">
                <Typography variant="body2">
                  {t("ListTypeOfContract.AppliesTurnForHour")}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
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
