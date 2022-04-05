import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";

//utils
import {
  successToast,
  errorToast,
  mapErrors,
  checkEquivalentNames,
} from "utils/misc";

//Icons
import { IconCross } from "assets/icons/customize/config";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { MedicalConditionsForm } from "config/Forms/ConfigForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ControlledAutocompleteChip from "components/Shared/ControlledAutocompleteChip/ControlledAutocompleteChip";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import {
  postMedicalConditions,
  putMedicalConditions,
  deleteMedicalConditions,
} from "services/TrainingPlan/MedicalConditions";

//Swal
import Swal from "sweetalert2";

export const FormMedicalConditions = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control, setValue, reset } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (defaultValue?.equivalent_names) {
      setValue("equivalent_names", defaultValue?.equivalent_names);
    }
  }, [defaultValue, setValue]);

  const onSubmit = (value) => {
    const dataSubmit = {
      name: value.name,
      equivalent_names: checkEquivalentNames(value.equivalent_names),
    };
    setLoadingFetch(true);
    const functionCall =
      type === "Nuevo" ? postMedicalConditions : putMedicalConditions;
    functionCall(dataSubmit, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
          reset();
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
        setLoadingFetch(true);
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
          deleteMedicalConditions(defaultValue.id)
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
            form={MedicalConditionsForm}
            control={control}
            defaultValue={defaultValue}
          />
          <ControlledAutocompleteChip
            control={control}
            name="equivalent_names"
            isHomolog={true}
            options={[]}
            defaultValue={
              defaultValue?.equivalent_names.map((i) => i.name) || []
            }
            className="col-8"
          />
        </div>
        <div className="col-3 d-flex align-items-end">
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
