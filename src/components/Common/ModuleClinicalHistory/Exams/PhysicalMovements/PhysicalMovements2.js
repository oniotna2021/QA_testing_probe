//REACT
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

//SERVICES
import {
  getLoadCustomForm,
  getLoadForm,
} from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";

//COMPONENTS
import LoadForms from "components/Shared/LoadForms/LoadForms";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//UTILS
import { useStyles } from "utils/useStyles";
import Swal from "sweetalert2";
import {
  addKeyClinicalHistoryForm,
  errorToast,
  addFormsPercentToLocalStorage,
  mapErrors,
  infoToast,
} from "utils/misc";

export const FormPhysicalMovements2 = ({
  setIsOpen,
  setReload,
  reload,
  setCompletePhysicalExam,
  completePhysicalExam,
}) => {
  const formId = 13;
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  let percent = {};
  let {
    quote_id,
    appoiment_type_id,
    medical_professional_id,
    user_id,
    modality_id,
  } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [fields, setFields] = useState([]);
  const [fieldsSection, setFieldsSection] = useState([]);
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);
  const [load, setLoad] = useState(false);
  const [formSections, setFormSections] = useState([]);
  const [fieldsSystem, setFieldsSystem] = useState([]);

  useEffect(() => {
    setLoad(true);
    getLoadCustomForm(
      formId,
      appoiment_type_id,
      user_id,
      window.localStorage.getItem(`form-${user_id}-${formId}`) ? 1 : 0
    )
      .then(({ data }) => {
        if (data && data.status === "success" && data.data.length > 0) {
          setFieldsSection(data.data[0]?.customInputFields[activeStep]);
          setFormSections(data.data[0].customInputFields);
        } else {
          setFieldsSection([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getLoadForm(formId, appoiment_type_id, user_id, completePhysicalExam)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data.length > 0) {
          setFields(data.data[0].customInputFields);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
        setLoad(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getLoadForm(21, appoiment_type_id, user_id, 1)
      .then(({ data }) => {
        if (data && data.status === "success" && data.data.length > 0) {
          setFieldsSystem(data.data[0].customInputFields);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
        setLoad(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [
    activeStep,
    appoiment_type_id,
    completePhysicalExam,
    enqueueSnackbar,
    user_id,
  ]);

  const handleNextSection = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBackSection = () => {
    setActiveStep(activeStep - 1);
  };

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
        setCompletePhysicalExam(1);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
        setLoadingFetchForm(false);
      });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <div>
      <>
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
        <div>
          {modality_id === "1" ? (
            <LoadForms
              fields={fields.slice(fields.length - 1, fields.length)}
              control={control}
            />
          ) : appoiment_type_id === "3" &&
            fieldsSystem[2]?.value === "alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 1 */}

              {activeStep === 0 ? (
                <LoadForms
                  fields={fields.slice(0, 9)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(13, 15)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <Typography>{`No hay campos disponibles en la sección ${
                  activeStep + 1
                }`}</Typography>
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : appoiment_type_id === "3" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "alterado" ? (
            <div>
              {/* CASO 2 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(15, 21)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <Typography>{`No hay campos disponibles en la sección ${activeStep}`}</Typography>
              ) : activeStep === 3 ? (
                <>
                  <LoadForms
                    fields={fields.slice(21, 22)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(22, 23)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : null}
            </div>
          ) : appoiment_type_id === "3" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 3 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(9, 13)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(13, 14)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : appoiment_type_id === "3" &&
            fieldsSystem[2]?.value === "alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "alterado" ? (
            <div>
              {/* CASO 4 */}

              {activeStep === 0 ? (
                <LoadForms
                  fields={fields.slice(0, 9)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(13, 15)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(15, 21)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <>
                  <LoadForms
                    fields={fields.slice(21, 22)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(22, 23)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : null}
            </div>
          ) : appoiment_type_id === "3" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "alterado" &&
            fieldsSystem[1]?.value === "alterado" ? (
            <div>
              {/* CASO 5 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(9, 14)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(15, 21)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <>
                  <LoadForms
                    fields={fields.slice(21, 22)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(22, 23)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : null}
            </div>
          ) : appoiment_type_id === "3" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 6 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <Typography>{`No hay campos disponibles en la sección ${activeStep}`}</Typography>
              ) : activeStep === 2 ? (
                <Typography>{`No hay campos disponibles en la sección ${activeStep}`}</Typography>
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : appoiment_type_id === "3" &&
            fieldsSystem[2]?.value === "alterado" &&
            fieldsSystem[0]?.value === "alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 7 */}
              {activeStep === 0 ? (
                <LoadForms
                  fields={fields.slice(0, 9)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(9, 13)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(13, 15)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : appoiment_type_id === "5" &&
            fieldsSystem[2]?.value === "alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 1 */}

              {activeStep === 0 ? (
                <LoadForms
                  fields={fields.slice(0, 9)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(13, 15)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <Typography>{`No hay campos disponibles en la sección ${
                  activeStep + 1
                }`}</Typography>
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : appoiment_type_id === "5" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "alterado" ? (
            <div>
              {/* CASO 2 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(15, 21)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <Typography>{`No hay campos disponibles en la sección ${activeStep}`}</Typography>
              ) : activeStep === 3 ? (
                <>
                  <LoadForms
                    fields={fields.slice(21, 22)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(22, 23)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : null}
            </div>
          ) : appoiment_type_id === "5" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 3 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(9, 13)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(13, 14)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : appoiment_type_id === "5" &&
            fieldsSystem[2]?.value === "alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "alterado" ? (
            <div>
              {/* CASO 4 */}

              {activeStep === 0 ? (
                <LoadForms
                  fields={fields.slice(0, 9)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(13, 15)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(15, 21)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <>
                  <LoadForms
                    fields={fields.slice(21, 22)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(22, 23)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : null}
            </div>
          ) : appoiment_type_id === "5" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "alterado" &&
            fieldsSystem[1]?.value === "alterado" ? (
            <div>
              {/* CASO 5 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(9, 14)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(15, 21)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <>
                  <LoadForms
                    fields={fields.slice(21, 22)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(22, 23)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : null}
            </div>
          ) : appoiment_type_id === "5" &&
            fieldsSystem[2]?.value === "no alterado" &&
            fieldsSystem[0]?.value === "no alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 6 */}

              {activeStep === 0 ? (
                <>
                  <LoadForms
                    fields={fields.slice(0, 6)}
                    control={control}
                    errors={errors}
                  />
                  <LoadForms
                    fields={fields.slice(7, 9)}
                    control={control}
                    errors={errors}
                  />
                </>
              ) : activeStep === 1 ? (
                <Typography>{`No hay campos disponibles en la sección ${activeStep}`}</Typography>
              ) : activeStep === 2 ? (
                <Typography>{`No hay campos disponibles en la sección ${activeStep}`}</Typography>
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : appoiment_type_id === "5" &&
            fieldsSystem[2]?.value === "alterado" &&
            fieldsSystem[0]?.value === "alterado" &&
            fieldsSystem[1]?.value === "no alterado" ? (
            <div>
              {/* CASO 7 */}
              {activeStep === 0 ? (
                <LoadForms
                  fields={fields.slice(0, 9)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 1 ? (
                <LoadForms
                  fields={fields.slice(9, 13)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 2 ? (
                <LoadForms
                  fields={fields.slice(13, 15)}
                  control={control}
                  errors={errors}
                />
              ) : activeStep === 3 ? (
                <LoadForms
                  fields={fields.slice(21, 22)}
                  control={control}
                  errors={errors}
                />
              ) : null}
            </div>
          ) : load ? (
            <Loading />
          ) : appoiment_type_id === "4" &&
            activeStep === formSections.length - 1 ? (
            <LoadForms
              fields={fieldsSection.slice(0, 1)}
              control={control}
              errors={errors}
            />
          ) : appoiment_type_id === "5" &&
            activeStep === formSections.length - 1 ? (
            <LoadForms
              fields={fieldsSection.slice(0, 1)}
              control={control}
              errors={errors}
            />
          ) : activeStep === formSections.length - 1 ? (
            <LoadForms
              fields={fieldsSection.slice(0, 1)}
              control={control}
              errors={errors}
            />
          ) : (
            <LoadForms
              fields={fieldsSection}
              control={control}
              errors={errors}
            />
          )}
        </div>

        <div className="row mt-3">
          <div className="col-8">
            <Button
              disabled={activeStep === 0}
              className={classes.buttonBack}
              onClick={handleBackSection}
              style={{ marginRight: 30 }}
            >
              {t("Btn.Back")}
            </Button>
          </div>
          <div className="col-4 d-flex justify-content-between">
            {modality_id === "1" ? (
              <form onSubmit={handleSubmit(onSubmit, onError)}>
                <ButtonSave loader={loadingFetchForm} text={t("Btn.save")} />
              </form>
            ) : (
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {activeStep === formSections.length - 1 && (
                    <ButtonSave
                      loader={loadingFetchForm}
                      text={t("Btn.save")}
                    />
                  )}
                </form>
                {activeStep !== formSections.length - 1 && (
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(handleNextSection, onError)}
                  >
                    {t("Btn.Next")}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </>
    </div>
  );
};
