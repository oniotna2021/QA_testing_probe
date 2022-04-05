import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useSnackbar } from "notistack";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";

//components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
//utils
import {
  addKeyClinicalHistoryForm,
  objectSelectForm,
  errorToast,
  addFormsPercentToLocalStorage,
  mapErrors,
  infoToast,
} from "utils/misc";
import Swal from "sweetalert2";

//services
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";

const FormSystemReview = ({
  setIsOpen,
  typeAppointment,
  setCompleteSystemForm,
  completeSystemForm,
  reload,
  setReload,
}) => {
  let formId = 21;
  let percent = {};
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [fields, setFields] = useState([]);
  const [loadData, setLoadData] = useState(false);
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);

  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  useEffect(() => {
    setLoadData(true);
    getLoadForm(
      formId,
      appoiment_type_id,
      user_id,
      window.localStorage.getItem(`form-${user_id}-${formId}`) ? 1 : 0
    )
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setFields(data.data[0]?.customInputFields);
        } else {
          setFields([]);
        }
        setLoadData(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [appoiment_type_id, completeSystemForm, enqueueSnackbar, formId, user_id]);

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
            value: data[property] ? `${data[property]}` : null,
          });
        }
      }
    }

    saveForms(dataSubmit)
      .then((req) => {
        console.log(req);
        if (req && req.data && req.data.message === "success") {
          setIsOpen(false);
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          percent = { id: formId, completed: req.data.data.percent };
          addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
          addFormsPercentToLocalStorage(percent);
          setCompleteSystemForm(1);
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

  const handleChange = (e) => {
    setSelectedOptions([...selectedOptions, e.target.value]);
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  console.log(fields);
  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="row d-flex align-items-center m-0">
          <div className="col">
            <Typography variant="h5">
              {t("DetailClinicHistory.SystemReview")}
            </Typography>
          </div>
          <div className="col-1" style={{ marginRight: "12px" }}>
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
          <div>
            {Number(typeAppointment) === 3 || Number(typeAppointment) === 5 ? (
              <React.Fragment>
                {loadData ? (
                  <Loading />
                ) : (
                  <>
                    <div className="mt-3 ">
                      <div className="col">
                        <Controller
                          defaultValue={fields && fields[2]?.value}
                          name="pulmonary_cardio"
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              variant="outlined"
                              error={errors.pulmonary_cardio}
                            >
                              <InputLabel id="select">
                                {t("SystemReview.CardioPulmonar")}
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="select"
                                label={t("SystemReview.CardioPulmonar")}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  handleChange(e);
                                }}
                              >
                                {objectSelectForm.map((res) => (
                                  <MenuItem key={res.name} value={res.name}>
                                    {res.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="col">
                        <Controller
                          defaultValue={fields && fields[0]?.value}
                          name="musculoskeletal"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <FormControl
                              variant="outlined"
                              error={errors.musculoskeletal}
                            >
                              <InputLabel id="select">
                                {t("SystemReview.Musculoskeletal")}
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="select"
                                label={t("SystemReview.Musculoskeletal")}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  handleChange(e);
                                }}
                              >
                                {objectSelectForm.map((res) => (
                                  <MenuItem key={res.name} value={res.name}>
                                    {res.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>
                    <div className="mt-3 ">
                      <div className="col">
                        <Controller
                          defaultValue={fields && fields[1]?.value}
                          name="neuromuscular"
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              variant="outlined"
                              error={errors.neuromuscular}
                            >
                              <InputLabel id="select">
                                {t("SystemReview.NeuroMuscular")}
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="select"
                                label={t("SystemReview.NeuroMuscular")}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  handleChange(e);
                                }}
                              >
                                {objectSelectForm.map((res) => (
                                  <MenuItem key={res.name} value={res.name}>
                                    {res.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            ) : Number(typeAppointment) === 1 ||
              Number(typeAppointment) === 4 ? (
              <React.Fragment>
                {loadData ? (
                  <Loading />
                ) : (
                  <>
                    <div className="mt-3">
                      <Controller
                        name={"head"}
                        rules={{ required: true }}
                        control={control}
                        defaultValue={fields && fields[0] && fields[0]?.value}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            onChange={(_, data) => {
                              if (data) {
                                onChange(data.name);
                              }
                            }}
                            options={objectSelectForm || []}
                            defaultValue={
                              objectSelectForm.filter(
                                (option) => option.name === fields[0]?.value
                              )[0]
                            }
                            noOptionsText={t("ListPermissions.NoData")}
                            getOptionLabel={(option) => option?.name}
                            renderOption={(option) => (
                              <React.Fragment>
                                <Typography variant="body2">
                                  {option?.name}
                                </Typography>
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={t("SystemReview.Head")}
                                error={errors.head}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        defaultValue={fields && fields[1]?.value}
                        name="head_observation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            multiline
                            rows={4}
                            variant="outlined"
                            label={t("SystemReview.Observations")}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        name={"neck"}
                        rules={{ required: true }}
                        control={control}
                        defaultValue={fields && fields[2]?.value}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            onChange={(_, data) => {
                              if (data) {
                                onChange(data.name);
                              }
                            }}
                            options={objectSelectForm || []}
                            defaultValue={
                              objectSelectForm.filter(
                                (option) => option.name === fields[2]?.value
                              )[0]
                            }
                            noOptionsText={t("ListPermissions.NoData")}
                            getOptionLabel={(option) => option?.name}
                            renderOption={(option) => (
                              <React.Fragment>
                                <Typography variant="body2">
                                  {option?.name}
                                </Typography>
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={t("SystemReview.Neck")}
                                error={errors.neck}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        defaultValue={fields && fields[3]?.value}
                        name="neck_observation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            multiline
                            rows={4}
                            variant="outlined"
                            label={t("SystemReview.Observations")}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        name={"torax"}
                        rules={{ required: true }}
                        control={control}
                        defaultValue={fields && fields[4]?.value}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            onChange={(_, data) => {
                              if (data) {
                                onChange(data.name);
                              }
                            }}
                            options={objectSelectForm || []}
                            defaultValue={
                              objectSelectForm.filter(
                                (option) => option.name === fields[4]?.value
                              )[0]
                            }
                            noOptionsText={t("ListPermissions.NoData")}
                            getOptionLabel={(option) => option?.name}
                            renderOption={(option) => (
                              <React.Fragment>
                                <Typography variant="body2">
                                  {option?.name}
                                </Typography>
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={t("SystemReview.Chest")}
                                error={errors.torax}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        defaultValue={fields && fields[5]?.value}
                        name="torax_observation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            multiline
                            rows={4}
                            variant="outlined"
                            label={t("SystemReview.Observations")}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        name={"extremities"}
                        rules={{ required: true }}
                        control={control}
                        defaultValue={fields && fields[6]?.value}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            onChange={(_, data) => {
                              if (data) {
                                onChange(data.name);
                              }
                            }}
                            options={objectSelectForm || []}
                            defaultValue={
                              objectSelectForm.filter(
                                (option) => option.name === fields[6]?.value
                              )[0]
                            }
                            noOptionsText={t("ListPermissions.NoData")}
                            getOptionLabel={(option) => option?.name}
                            renderOption={(option) => (
                              <React.Fragment>
                                <Typography variant="body2">
                                  {option?.name}
                                </Typography>
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={t("SystemReview.Extremities")}
                                error={errors.extremities}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        defaultValue={fields && fields[7]?.value}
                        name="extremities_observation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            multiline
                            rows={4}
                            variant="outlined"
                            label={t("SystemReview.Observations")}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        name={"neurological"}
                        rules={{ required: true }}
                        control={control}
                        defaultValue={fields && fields[8]?.value}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            onChange={(_, data) => {
                              if (data) {
                                onChange(data.name);
                              }
                            }}
                            options={objectSelectForm || []}
                            defaultValue={
                              objectSelectForm.filter(
                                (option) => option.name === fields[8]?.value
                              )[0]
                            }
                            noOptionsText={t("ListPermissions.NoData")}
                            getOptionLabel={(option) => option?.name}
                            renderOption={(option) => (
                              <React.Fragment>
                                <Typography variant="body2">
                                  {option?.name}
                                </Typography>
                              </React.Fragment>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={t("SystemReview.Neurological")}
                                error={errors.neurological}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-3">
                      <Controller
                        defaultValue={fields && fields[9]?.value}
                        name="neurological_observation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            multiline
                            rows={4}
                            variant="outlined"
                            label={t("SystemReview.Observations")}
                          />
                        )}
                      />
                    </div>
                  </>
                )}
              </React.Fragment>
            ) : null}
            <div className="mt-3 d-flex justify-content-end">
              <ButtonSave text={t("Btn.save")} loader={loadingFetchForm} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormSystemReview;
