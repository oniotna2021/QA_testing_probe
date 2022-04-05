import React from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { TypeMedicalPracticeForm } from "config/Forms/ProfessionalForms";

//Services
import {
  postTypePractice,
  putTypePractice,
  deleteTypePractice,
} from "services/Professional/TypePractice";

//Swal
import Swal from "sweetalert2";

import { errorToast, mapErrors } from "utils/misc";

export const FormTypeMedicalPractice = ({
  type,
  defaultValue,
  setExpanded,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = (value) => {
    const functionCall = type === "Nuevo" ? postTypePractice : putTypePractice;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          reset();
        }
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
        deleteTypePractice(defaultValue.id)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
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
      )}
      <div className="row align-items-end">
        <div className="col">
          <CommonComponentSimpleForm
            form={TypeMedicalPracticeForm}
            control={control}
            defaultValue={defaultValue}
          />
        </div>
        <div className="col-2">
          <Button
            color="primary"
            className="mb-3"
            fullWidth
            variant="contained"
            type="submit"
          >
            {t("Btn.save")}
          </Button>
        </div>
      </div>
    </form>
  );
};
