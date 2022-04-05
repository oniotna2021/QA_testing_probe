//REACT
import React, { useEffect, useState } from "react";

//IMPORTS
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

//TRANSLATE
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

//UTILS
import {
  addKeyClinicalHistoryForm,
  errorToast,
  mapErrors,
  addFormsPercentToLocalStorage,
  infoToast,
} from "utils/misc";
import Swal from "sweetalert2";

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";

//COMPONENTS
import LoadForms from "components/Shared/LoadForms/LoadForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

export const NutritionPhysicalExamForm = ({
  setIsOpen,
  setReload,
  reload,
  completeNutritionExam,
  setCompleteNutritionExam,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const formId = 9;
  let percent = {};
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [fields, setFields] = useState([]);
  const [loadForm, setLoadForm] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState();
  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  useEffect(() => {
    setLoadForm(true);
    getLoadForm(
      formId,
      appoiment_type_id,
      user_id,
      window.localStorage.getItem(`form-${user_id}-${formId}`) ? 1 : 0
    )
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          setFields(data.data[0].customInputFields);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
        setLoadForm(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [appoiment_type_id, completeNutritionExam, enqueueSnackbar, user_id]);

  const onSubmit = (data) => {
    setLoadingFetchForm(true);
    let dataSubmit = {
      form_id: Number(formId),
      user_id: Number(user_id),
      quote_id: Number(quote_id),
      medical_professional_id: Number(medical_professional_id),
      customInputFields: [],
    };
    for (const property in data) {
      for (const it of fields) {
        if (it.slug === property) {
          dataSubmit.customInputFields.push({
            id: it.id,
            value: `${data[property]}`,
          });
        }
      }
    }

    saveForms(dataSubmit)
      .then((req) => {
        if (req && req.data && req.data.message === "success") {
          setIsOpen(false);
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          setCompleteNutritionExam(1);
          percent = { id: formId, completed: req?.data.data.percent };
          addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
          addFormsPercentToLocalStorage(percent);
        } else {
          Swal.fire({
            title: mapErrors(req.data),
            icon: "error",
          });
        }
        setLoadingFetchForm(false);
        setReload(!reload);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
      });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="row align-items-center mb-4">
          <div className="col ">
            <Typography variant="h5">
              {t("DetailClinicHistory.NutritionalPhysicalExamination")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        {loadForm ? (
          <Loading />
        ) : (
          <div className="row m-0">
            <div className="col-12">
              <LoadForms fields={fields} control={control} errors={errors} />
              <div className="d-flex flex-row-reverse">
                <ButtonSave loader={loadingFetchForm} text={t("Btn.save")} />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
