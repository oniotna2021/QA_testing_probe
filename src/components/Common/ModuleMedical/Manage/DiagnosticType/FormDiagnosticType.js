import React from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//Components
import { CommonComponentSimpleForm } from "../../../../Shared/SimpleForm/SimpleForm";
import { DiagnosticTypeForm } from "../../../../../config/Forms/MedicalForms";

// hoc
import ActionWithPermission from "hocs/ActionWithPermission";

//Services
import {
  postDiagnosticType,
  putDiagnosticType,
  deleteDiagnosticType,
} from "../../../../../services/MedicalSoftware/DiagnosticType";

//Swal
import Swal from "sweetalert2";

// Utils
import { errorToast, mapErrors, successToast } from "utils/misc";

export const FormDiagnosticType = ({
  type,
  defaultValue,
  setExpanded,
  reload,
  setReload,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, control, reset } = useForm();
  const [loadingFetch, setLoadingFetch] = React.useState(false);

  const onSubmit = (value) => {
    if (type === "Nuevo" && !permissionsActions.create) {
      return;
    } else if (type !== "Nuevo" && !permissionsActions.edit) {
      return;
    }
    setLoadingFetch(true);
    const functionCall =
      type === "Nuevo" ? postDiagnosticType : putDiagnosticType;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(data.message, successToast);
          setReload(!reload);
          reset();
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
        deleteDiagnosticType(defaultValue.id).then((req) => {
          Swal.fire(
            t("Message.Eliminated"),
            t("Message.EliminatedSuccess"),
            "success"
          );
          setReload(!reload);
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <div className="row justify-content-end mb-3">
          <ActionWithPermission isValid={permissionsActions.delete}>
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
          </ActionWithPermission>
        </div>
      )}
      <div className="row align-items-end">
        <div className="col">
          <CommonComponentSimpleForm
            form={DiagnosticTypeForm}
            control={control}
            defaultValue={defaultValue}
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
            <MinButtonLoader text={t("Btn.save")} loader={loadingFetch} />
          </div>
        </ActionWithPermission>
      </div>
    </form>
  );
};
