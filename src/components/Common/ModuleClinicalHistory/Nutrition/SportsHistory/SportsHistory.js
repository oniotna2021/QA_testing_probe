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

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";

//COMPONENTS
import LoadForms from "components/Shared/LoadForms/LoadForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//UTILS
import {
  errorToast,
  mapErrors,
  addFormsPercentToLocalStorage,
  infoToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";
import Swal from "sweetalert2";

export const FormSportsHistory = ({
  setIsOpen,
  setReload,
  reload,
  completeSportHistory,
  setCompleteSportHistory,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();
  const formId = 7;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  let percent = {};

  const [fields, setFields] = useState([]);
  const [loadForm, setLoadForm] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState();

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
  }, [appoiment_type_id, completeSportHistory, enqueueSnackbar, user_id]);

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
          setCompleteSportHistory(1);
          Swal.fire({
            title: t("SportsHistory.SaveForms"),
            icon: "success",
          });
          percent = { id: formId, completed: req.data.data.percent };
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
              {t("DetailClinicHistory.SportsBackground")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        <div className="row m-0">
          {loadForm ? (
            <Loading />
          ) : (
            <div className="col-12">
              <LoadForms fields={fields} control={control} errors={errors} />
              <div className="d-flex flex-row-reverse">
                <ButtonSave loader={loadingFetchForm} text={t("Btn.save")} />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
