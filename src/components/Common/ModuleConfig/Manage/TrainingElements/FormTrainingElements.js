import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

//UI
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

//utils
import { useStyles } from "utils/useStyles";

//Icons
import { IconCross } from "assets/icons/customize/config";

//Components
import { CommonComponentSimpleForm } from "../../../../Shared/SimpleForm/SimpleForm";
import { TrainingElementsForm } from "../../../../../config/Forms/ConfigForms";
import DropzoneImage from "components/Shared/DropzoneImage/DropzoneImage";
import ControlledAutocompleteChip from "components/Shared/ControlledAutocompleteChip/ControlledAutocompleteChip";

//Services
import {
  postTrainingElements,
  putTrainingElements,
  deleteTrainingElements,
} from "../../../../../services/TrainingPlan/TrainingElements";

//UTILS
import {
  checkEquivalentNames,
  errorToast,
  mapErrors,
  setFormData,
  successToast,
} from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Swal
import Swal from "sweetalert2";

export const FormTrainingElements = ({
  type,
  defaultValue,
  setExpanded,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const { handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      equivalent_names: [],
    },
  });

  useEffect(() => {
    if (defaultValue?.image || defaultValue?.elements_icon) {
      setFiles([{ preview: defaultValue.image || defaultValue.elements_icon }]);
    }

    if (defaultValue?.equivalent_names) {
      setValue("equivalent_names", defaultValue?.equivalent_names);
    }
  }, [setFiles, defaultValue, setValue]);

  const onSubmit = (value) => {
    let dataSubmit = {
      name: value.name,
      equivalent_names: JSON.stringify(
        checkEquivalentNames(value.equivalent_names)
      ),
    };

    if (type === "Nuevo") {
      dataSubmit = {
        ...dataSubmit,
        elements_icon: files[0],
      };
    } else {
      if (files[0]?.path) {
        dataSubmit = {
          ...dataSubmit,
          elements_icon: files[0],
        };
      }
    }

    const functionCall =
      type === "Nuevo" ? postTrainingElements : putTrainingElements;
    functionCall(setFormData(dataSubmit), defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          reset();
          setLoad(true);
        } else {
          enqueueSnackbar(mapErrors(data.data?.message), errorToast);
        }
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
          deleteTrainingElements(defaultValue.id).then((req) => {
            Swal.fire(
              "¡Eliminado!",
              "Su registro ha sido eliminado.",
              "success"
            );
          });
        }
        setLoad(true);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <div className="row ">
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
          <div className="row">
            <CommonComponentSimpleForm
              form={TrainingElementsForm}
              control={control}
              defaultValue={defaultValue}
            />
            <div className="d-flex align-items-center">
              <DropzoneImage files={files} setFiles={setFiles} />
              <ControlledAutocompleteChip
                control={control}
                name="equivalent_names"
                isHomolog={true}
                options={[]}
                defaultValue={
                  defaultValue?.equivalent_names.map((i) => i.name) || []
                }
                className="col-9"
              />
            </div>
          </div>
        </div>
        <div className="col-3" style={{ marginTop: "70px" }}>
          <ActionWithPermission
            isValid={
              type === "Nuevo"
                ? permissionsActions.create
                : permissionsActions.edit
            }
          >
            <Button
              color="primary"
              className={classes.button}
              fullWidth
              variant="contained"
              type="submit"
            >
              {type === "Nuevo" ? "Crear" : "Guardar"}
            </Button>
          </ActionWithPermission>
        </div>
      </div>
    </form>
  );
};
