//REACT
import React, { useEffect, useState } from "react";

//IMPORTS
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

//TRANSLATE
import { useTranslation } from "react-i18next";

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";

//COMPONENTS
import LoadForms from "components/Shared/LoadForms/LoadForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//UTILS
import {
  successToast,
  addFormsPercentToLocalStorage,
  mapErrors,
  errorToast,
} from "utils/misc";

export const FormPhysicalExamination = ({ setIsOpen, setReload, reload }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  let percent = {};

  const formId = 12;
  const { handleSubmit, control } = useForm();
  const [loadForm, setLoadForm] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState();
  const [fields, setFields] = useState([]);
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
  }, [enqueueSnackbar]);

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
          enqueueSnackbar(t("Message.SavedSuccess"), successToast);
          percent = { id: formId, completed: req.data.data.percent };
          addFormsPercentToLocalStorage(percent);
        } else {
          enqueueSnackbar(req.data.message[0].message, errorToast);
        }
        setLoadingFetchForm(false);
        setReload(!reload);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column align-items-center"
      >
        <div className="row align-items-center mb-4">
          <div className="col ">
            <Typography variant="h5">
              {t("DetailClinicHistory.PhysicalExam")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        {loadForm ? (
          <Loading />
        ) : (
          <div className="row">
            <div className="col">
              <LoadForms fields={fields} control={control} />
            </div>
            <div className="d-flex flex-row-reverse">
              <ButtonSave loader={loadingFetchForm} text={t("Btn.save")} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
