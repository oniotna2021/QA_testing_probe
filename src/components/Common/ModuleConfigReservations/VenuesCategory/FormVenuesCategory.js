import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import slugify from "slugify";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import {
  postVenueCategory,
  putVenueCategory,
  deleteVenueCategory,
} from "services/Reservations/venuesCategory";

//Swal
import Swal from "sweetalert2";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

export const FormVenuesCategory = ({
  type,
  defaultValue,
  idItem,
  setExpanded,
  permissionsActions,
  setLoad,
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
      description: value.description,
      position: 1,
    };
    setLoadingFetch(true);
    const functionCall =
      type === "Nuevo" ? postVenueCategory : putVenueCategory;
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
        deleteVenueCategory(idItem)
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
                    label={t("ListVenuesCategory.InputName")}
                    rows={1}
                    variant="outlined"
                  />
                  {errors.name && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>

          <div className="col-6">
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={defaultValue?.description}
              name="description"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("name", { lower: true })}
                    type="text"
                    label={t("WeeklyNutrition.InputDescription")}
                    rows={1}
                    variant="outlined"
                  />
                  {errors.description && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
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
