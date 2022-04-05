//REACT
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import FormHelperText from "@material-ui/core/FormHelperText";

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";

//COMPONENTS
import LoadForms from "components/Shared/LoadForms/LoadForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//UTILS
import {
  addKeyClinicalHistoryForm,
  addFormsPercentToLocalStorage,
  errorToast,
  mapErrors,
  infoToast,
} from "utils/misc";
import Swal from "sweetalert2";

export const FoodHistoryForm = ({
  setIsOpen,
  setReload,
  reload,
  setCompleteFoodHistory,
  completeFoodHistory,
}) => {
  let percent = {};
  const formId = 8;
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  const [loadForm, setLoadForm] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState();
  const [fields, setFields] = useState([]);
  const [option, setOption] = useState("");

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
          setOption(data.data[0].customInputFields[3].value);
          setValue("take_supplements", data.data[0].customInputFields[3].value);
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
  }, [
    appoiment_type_id,
    completeFoodHistory,
    enqueueSnackbar,
    setValue,
    user_id,
  ]);

  const onSubmit = (data) => {
    setLoadingFetchForm(true);
    let dataSubmit = {
      form_id: Number(formId),
      user_id: Number(user_id),
      quote_id: Number(quote_id),
      medical_professional_id: Number(medical_professional_id),
      customInputFields: [],
    };
    dataSubmit.customInputFields.push({
      id: 67,
      value: option,
    });
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
          setCompleteFoodHistory(1);
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
              {t("DetailClinicHistory.FoodHistory")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        {loadForm ? (
          <Loading />
        ) : (
          <React.Fragment>
            <div className="row m-0">
              <div className="col-12">
                <LoadForms
                  fields={fields.slice(0, 3)}
                  control={control}
                  errors={errors}
                />
              </div>
            </div>
            <div className="row m-0 mb-2">
              <div className="col-7 mt-2">
                {t("DetailClinicHistory.ConsumesSupplementation")}
              </div>
              <div className="col-5">
                <Controller
                  name="take_supplements"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={option}
                  render={({ field }) => (
                    <FormControl component="fieldset">
                      <RadioGroup
                        {...field}
                        row
                        onChange={(e) => {
                          setOption(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value={"Si"}
                          control={<Radio color="primary" />}
                          label={t("Btn.Yes")}
                        />
                        <FormControlLabel
                          value={"No"}
                          control={<Radio color="primary" />}
                          label={t("Btn.Not")}
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.take_supplements && (
                  <FormHelperText error>
                    {t("Message.AlertSelectOption")}
                  </FormHelperText>
                )}
              </div>
            </div>
            {option === "Si" && (
              <div className="row m-0">
                <div className="col-12">
                  <LoadForms
                    fields={fields.slice(8, 9)}
                    control={control}
                    errors={errors}
                  />
                </div>
              </div>
            )}
            <div className="row m-0">
              <div className="col-12">
                <LoadForms
                  fields={fields.slice(4, 8)}
                  control={control}
                  errors={errors}
                />
              </div>
            </div>
          </React.Fragment>
        )}
        <div className="d-flex flex-row-reverse">
          <ButtonSave loader={loadingFetchForm} text={t("Btn.save")} />
        </div>
      </form>
    </div>
  );
};
