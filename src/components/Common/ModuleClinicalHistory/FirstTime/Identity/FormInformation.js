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
  addFormsPercentToLocalStorage,
  errorToast,
  mapErrors,
  infoToast,
} from "utils/misc";
import Swal from "sweetalert2";

const FormInformation = ({ setIsOpen, setReload, reload }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [loadForm, setLoadForm] = useState(false);
  const [loadingFetchForm, setLoadingFetchForm] = useState();

  const formId = 2;
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [fields, setFields] = useState([]);
  let percent = {};
  const { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  useEffect(() => {
    getLoadForm(formId, appoiment_type_id, user_id, 1)
      .then(({ data }) => {
        setLoadForm(true);
        if (data.status === "success" && data.data && data.data.length > 0) {
          setFields(data.data[0].customInputFields);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    setLoadForm(false);
  }, [appoiment_type_id, enqueueSnackbar, user_id]);

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
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          percent = { id: formId, completed: req.data.data.percent };
          addFormsPercentToLocalStorage(percent);
          setIsOpen(false);
        } else {
          Swal.fire({
            title: mapErrors(data),
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
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="d-flex flex-column align-items-center"
      >
        <div className="row align-items-center mb-4">
          <div className="col">
            <Typography variant="h5">
              {t("DetailClinicHistory.Identity")}
            </Typography>
          </div>
          <div className="col-1" style={{ marginRight: "18px" }}>
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        {!loadForm ? (
          <Loading />
        ) : (
          <div className="row">
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

export default FormInformation;
