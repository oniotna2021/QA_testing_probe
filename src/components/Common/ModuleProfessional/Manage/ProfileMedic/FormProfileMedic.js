import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { MedicalProfileForm } from "config/Forms/ProfessionalForms";

//Services
import {
  postMedicalProfiles,
  putMedicalProfiles,
  deleteMedicalProfiles,
} from "services/Professional/Profile";
import { getSkillsMedical } from "services/Professional/Skills";
import { getTypePractice } from "services/Professional/TypePractice";

//Swal
import Swal from "sweetalert2";
import { CommonComponentSimpleSelect } from "components/Shared/SimpleSelect/SimpleSelect";

import { errorToast, mapErrors } from "utils/misc";

export const FormProfileMedic = ({ type, defaultValue, setExpanded }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { handleSubmit, control, reset } = useForm();
  const [dataSkills, setDataSkills] = useState([]);
  const [dataType, setTypePractice] = useState([]);

  const onSubmit = (value) => {
    const functionCall =
      type === "Nuevo" ? postMedicalProfiles : putMedicalProfiles;
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
        deleteMedicalProfiles(defaultValue.id)
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

  useEffect(() => {
    getSkillsMedical()
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          setDataSkills(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getTypePractice()
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          setTypePractice(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

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
            form={MedicalProfileForm.form}
            control={control}
            defaultValue={defaultValue}
          />
          <div className="row">
            <div className="col">
              <CommonComponentSimpleSelect
                form={MedicalProfileForm.skills}
                control={control}
                option={dataSkills}
                defaultValue={Number(defaultValue?.skills_medical_profiles_id)}
              />
            </div>
            <div className="col">
              <CommonComponentSimpleSelect
                form={MedicalProfileForm.practice}
                control={control}
                option={dataType}
                defaultValue={Number(defaultValue?.type_medical_practice_id)}
              />
            </div>
          </div>
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
