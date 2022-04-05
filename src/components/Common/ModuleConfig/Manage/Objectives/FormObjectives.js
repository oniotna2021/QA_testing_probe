import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";

//UI
import IconButton from "@material-ui/core/IconButton";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

//Icons
import { IconCross } from "assets/icons/customize/config";

//TRANSLATE
import { useTranslation } from "react-i18next";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { ObjetctivesForm } from "config/Forms/ConfigForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import {
  postObjectives,
  putObjectives,
  deleteObjectives,
} from "services/TrainingPlan/Objectives";

//Swal
import Swal from "sweetalert2";

export const FormObjectives = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, control, reset } = useForm();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const theme = useTheme();

  const onSubmit = (value) => {
    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postObjectives : putObjectives;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
          reset();
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
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, bórralo!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          deleteObjectives(defaultValue.id)
            .then((req) => {
              Swal.fire(
                "¡Eliminado!",
                "Su registro ha sido eliminado.",
                "success"
              );
              setLoad(!load);
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <div className="row mb-3">
          <div className="d-flex justify-content-end ms-4">
            <ActionWithPermission isValid={permissionsActions.delete}>
              <IconButton
                color="primary"
                variant="outlined"
                onClick={deleteForm}
              >
                <IconCross color={theme.palette.primary.light} />
              </IconButton>
            </ActionWithPermission>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-9">
          <CommonComponentSimpleForm
            form={ObjetctivesForm}
            control={control}
            defaultValue={defaultValue}
          />
        </div>
        <div className="col-3">
          <ActionWithPermission
            isValid={
              type === "Nuevo"
                ? permissionsActions.create
                : permissionsActions.edit
            }
          >
            <ButtonSave
              text={type === "Nuevo" ? "Crear" : "Guardar"}
              loader={loadingFetch}
            />
          </ActionWithPermission>
        </div>
      </div>
    </form>
  );
};
