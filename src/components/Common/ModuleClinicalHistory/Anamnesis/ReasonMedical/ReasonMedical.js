//REACT
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";

//COMPONENTS
import LoadForms from "components/Shared/LoadForms/LoadForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//UTILS
import {
  addFormsPercentToLocalStorage,
  addKeyClinicalHistoryForm,
  errorToast,
  mapErrors,
  infoToast,
} from "utils/misc";
import Swal from "sweetalert2";

export const FormReasonMedical = ({
  setIsOpen,
  setReload,
  reload,
  completeReasonMedical,
  setCompleteReasonMedical,
}) => {
  const formId = 5;
  let percent = {};
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();
  const { t } = useTranslation();

  const [loadForm, setLoadForm] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState();
  const [fields, setFields] = useState([]);

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
          setFields(data?.data[0]?.customInputFields);
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
  }, [appoiment_type_id, completeReasonMedical, enqueueSnackbar, user_id]);

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
        } else {
          Swal.fire({
            title: mapErrors(req.data),
            icon: "error",
          });
        }
        percent = { id: formId, completed: req.data.data.percent };
        addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
        addFormsPercentToLocalStorage(percent);
        setLoadingFetchForm(false);
        setReload(!reload);
        setCompleteReasonMedical(1);
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
      <form
        className="d-flex flex-column align-items-center"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <div className="row align-items-center mb-4">
          <div className="col">
            <Typography variant="h5">
              {t("DetailClinicHistory.ReasonToConsult")}
            </Typography>
          </div>
          <div className="col-1" style={{ marginRight: "18px" }}>
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        {loadForm ? (
          <Loading />
        ) : (
          <div className="row align-items-center">
            <div className="col-12">
              <LoadForms
                fields={fields || []}
                row={false}
                control={control}
                errors={errors}
              />
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
