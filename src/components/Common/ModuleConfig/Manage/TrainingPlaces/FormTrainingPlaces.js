import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";

//UI
import IconButton from "@material-ui/core/IconButton";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

//Translate
import { useTranslation } from "react-i18next";

//Icons
import { IconCross } from "assets/icons/customize/config";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { TrainingPlacesForm } from "config/Forms/ConfigForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import {
  postTrainingPlaces,
  putTrainingPlaces,
  deleteTrainingPlaces,
} from "services/TrainingPlan/TrainingPlaces";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Swal
import Swal from "sweetalert2";

export const FormTrainingPlaces = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const theme = useTheme();

  const onSubmit = (value) => {
    setLoadingFetch(true);
    const functionCall =
      type === "Nuevo" ? postTrainingPlaces : putTrainingPlaces;
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
          deleteTrainingPlaces(defaultValue.id).then((req) => {
            Swal.fire(
              "¡Eliminado!",
              "Su registro ha sido eliminado.",
              "success"
            );
            setLoad(!load);
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
                fullWidth
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
            form={TrainingPlacesForm}
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
