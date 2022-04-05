import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
import ElasticSearchAutocomplete from "components/Shared/ElasticSearchAutocomplete/ElasticSearchAutocomplete";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";

//SERVICES
import { searchElastic } from "services/_elastic";
import { saveForms } from "services/MedicalSoftware/SaveForms";
import { getLoadForm } from "services/MedicalSoftware/LoadForms";

//UTILS
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  mapErrors,
  addFormsPercentToLocalStorage,
  infoToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";
import Swal from "sweetalert2";
import { set } from "date-fns";

/* 
    FUNCTION: form to save information in clinical history ( Intervention, Diagnosis and Procedure )
    PROPERTIES: {
        from useParams => quote_id, medical_professional_id, user_id
        from props component => setIsOpen - function, reload - boolean, setReload - function
    }
*/

const FormInterventionDiagnosisProcedure = ({
  setIsOpen,
  reload,
  setReload,
  completeIntervention,
  setCompleteIntervention,
  typeHealthTechnology,
  diagnosticType,
  myCoachIntervention,
  healthTechnology,
  healthEducation,
  goalsIntervention,
}) => {
  const formId = 16;
  let percent = {};
  let { quote_id, medical_professional_id, user_id, appoiment_type_id } =
    useParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [elasticOptions, setElasticOptions] = useState([]);
  const [isEducation, setIsEducation] = useState("");
  const [positiveControl, setPositiveControl] = useState();
  const [procedures, setProcedures] = useState([]);
  const [fields, setFields] = useState([]);
  const [loadForm, setLoadForm] = useState(false);

  const [selectedDiagnosticOne, setSelectedDiagnosticOne] = useState({});
  const [selectedDiagnosticTwo, setSelectedDiagnosticTwo] = useState({});
  const [selectedDiagnosticThree, setSelectedDiagnosticThree] = useState({});
  const [selectedDiagnosticFour, setSelectedDiagnosticFour] = useState({});
  const [selectedDiagnosticFive, setSelectedDiagnosticFive] = useState({});
  const [selectedDiagnosticSix, setSelectedDiagnosticSix] = useState({});
  const [selectedDiagnosticSeven, setSelectedDiagnosticSeven] = useState({});
  const [selectedDiagnosticEight, setSelectedDiagnosticEight] = useState({});
  const [selectedDiagnosticNine, setSelectedDiagnosticNine] = useState({});
  const [selectedDiagnosticTen, setSelectedDiagnosticTen] = useState({});
  const [selectedDiagnosticEleven, setSelectedDiagnosticEleven] = useState({});
  const [selectedDiagnosticTwelve, setSelectedDiagnosticTwelve] = useState({});

  const [selectedProcedure, setSelectedProcedure] = useState({});

  const [term, setTerm] = useState("");
  const [termProcedure, setTermProcedure] = useState("");
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);
  const [newDiagnosis, setNewDiagnosis] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const [loading, setLoading] = useState(false);
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
          setIsEducation(data.data[0].customInputFields[13].value);
          if (completeIntervention === 1) {
            searchElastic("procedure", {
              query: {
                bool: {
                  must: [
                    {
                      multi_match: {
                        query:
                          data.data[0].customInputFields &&
                          data.data[0].customInputFields[0] &&
                          data.data[0].customInputFields[17].value
                            ? data.data[0].customInputFields[17].value
                            : "",
                        fields: ["id"],
                      },
                    },
                  ],
                },
              },
            }).then(({ data }) => {
              if (data && data.data) {
                console.log(data.data);
                setSelectedProcedure(data.data.hits.hits[0]);
                setValue("procedure", data.data?.hits?.hits[0]?._source?.id);
              } else {
                setSelectedProcedure({});
              }
              //setLoadElastic(false)
            });
            searchElastic("diagnosis", {
              size: 12,
              query: {
                bool: {
                  should: [
                    {
                      match: {
                        id: data.data[0].customInputFields[1].value
                          ? data.data[0].customInputFields[1].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[3].value
                          ? data.data[0].customInputFields[3].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[5].value
                          ? data.data[0].customInputFields[5].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[7].value
                          ? data.data[0].customInputFields[7].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[9].value
                          ? data.data[0].customInputFields[9].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[18].value
                          ? data.data[0].customInputFields[18].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[20].value
                          ? data.data[0].customInputFields[20].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[22].value
                          ? data.data[0].customInputFields[22].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[24].value
                          ? data.data[0].customInputFields[24].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[26].value
                          ? data.data[0].customInputFields[26].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[28].value
                          ? data.data[0].customInputFields[28].value
                          : "",
                      },
                    },
                    {
                      match: {
                        id: data.data[0].customInputFields[30].value
                          ? data.data[0].customInputFields[30].value
                          : "",
                      },
                    },
                  ],
                },
              },
            }).then(({ data }) => {
              if (data && data.data) {
                setSelectedDiagnosticOne(data.data.hits.hits[0]);
                setValue(
                  "diagnosis_name_1",
                  data.data.hits.hits[0]?._source?.id
                );
                setSelectedDiagnosticTwo(data.data.hits.hits[1]);
                setValue(
                  "diagnosis_name_2",
                  data.data.hits.hits[1]?._source?.id
                );
                setSelectedDiagnosticThree(data.data.hits.hits[2]);
                setValue(
                  "diagnosis_name_3",
                  data.data.hits.hits[2]?._source?.id
                );
                setSelectedDiagnosticFour(data.data.hits.hits[3]);
                setValue(
                  "diagnosis_name_4",
                  data.data.hits.hits[3]?._source?.id
                );
                setSelectedDiagnosticFive(data.data.hits.hits[4]);
                setValue(
                  "diagnosis_name_5",
                  data.data.hits.hits[4]?._source?.id
                );
                setSelectedDiagnosticSix(data.data.hits.hits[5]);
                setValue(
                  "diagnosis_name_6",
                  data.data.hits.hits[5]?._source?.id
                );
                setSelectedDiagnosticSeven(data.data.hits.hits[6]);
                setValue(
                  "diagnosis_name_7",
                  data.data.hits.hits[6]?._source?.id
                );
                setSelectedDiagnosticEight(data.data.hits.hits[7]);
                setValue(
                  "diagnosis_name_8",
                  data.data.hits.hits[7]?._source?.id
                );
                setSelectedDiagnosticNine(data.data.hits.hits[8]);
                setValue(
                  "diagnosis_name_9",
                  data.data.hits.hits[8]?._source?.id
                );
                setSelectedDiagnosticTen(data.data.hits.hits[9]);
                setValue(
                  "diagnosis_name_10",
                  data.data.hits.hits[9]?._source?.id
                );
                setSelectedDiagnosticEleven(data.data.hits.hits[10]);
                setValue(
                  "diagnosis_name_11",
                  data.data.hits.hits[10]?._source?.id
                );
                setSelectedDiagnosticTwelve(data.data.hits.hits[11]);
                setValue(
                  "diagnosis_name_12",
                  data.data.hits.hits[11]?._source?.id
                );
              } else {
                setSelectedDiagnosticOne({});
              }
              //setLoadElastic(false)
            });
          }
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
    searchElastic("diagnosis", {
      from: 0,
      size: 20,
      query: {
        match_all: {},
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setElasticOptions(data.data.hits.hits);
        } else {
          setElasticOptions([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    searchElastic("procedure", {
      from: 0,
      size: 20,
      query: {
        match_all: {},
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setProcedures(data.data.hits.hits);
        } else {
          setProcedures([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [appoiment_type_id, completeIntervention, enqueueSnackbar, user_id]);

  //filter diagnosis elastic
  useEffect(() => {
    setLoading(true);
    const setFilterValue = (value) => {
      setElasticOptions([]);
      if (value) {
        searchElastic("diagnosis", {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: value,
                    fields: ["name", "external_code"],
                    fuzziness: "2",
                  },
                },
              ],
            },
          },
        })
          .then(({ data }) => {
            if (data && data.data) {
              setElasticOptions(data.data.hits.hits);
              setLoading(false);
            } else {
              setElasticOptions([]);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
          });
      } else {
        setElasticOptions([]);
      }
    };

    if (term) {
      setFilterValue(term);
    }
  }, [term, enqueueSnackbar]);

  //filter procedure elastic
  useEffect(() => {
    const setFilterValue = (value) => {
      setProcedures([]);
      if (value) {
        searchElastic("procedure", {
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: value,
                    fields: ["name", "external_code"],
                    fuzziness: "2",
                  },
                },
              ],
            },
          },
        })
          .then(({ data }) => {
            if (data && data.data) {
              setProcedures(data.data.hits.hits);
            } else {
              setProcedures([]);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
          });
      } else {
        setProcedures([]);
      }
    };

    if (termProcedure) {
      setFilterValue(termProcedure);
    }
  }, [termProcedure, enqueueSnackbar]);

  const onAddNewDiagnosis = () => {
    setNewDiagnosis(newDiagnosis + 1);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = (value) => {
    setLoadingFetchForm(true);

    let dataSubmit = {
      form_id: Number(formId),
      user_id: Number(user_id),
      quote_id: Number(quote_id),
      medical_professional_id: Number(medical_professional_id),
      customInputFields: [
        { id: 207, value: value.health_technology.id },
        { id: 208, value: value.diagnosis_name_1 },
        { id: 209, value: value.diagnosis_type_1?.id },
        { id: 210, value: value.diagnosis_name_2 },
        { id: 211, value: value.diagnosis_type_2?.id },
        { id: 212, value: value.diagnosis_name_3 },
        { id: 213, value: value.diagnosis_type_3?.id },
        { id: 214, value: value.diagnosis_name_4 },
        { id: 215, value: value.diagnosis_type_4?.id },
        { id: 216, value: value.diagnosis_name_5 },
        { id: 217, value: value.diagnosis_type_5?.id },
        { id: 258, value: value.diagnosis_name_6 },
        { id: 259, value: value.diagnosis_type_6?.id },
        { id: 260, value: value.diagnosis_name_7 },
        { id: 261, value: value.diagnosis_type_7?.id },
        { id: 262, value: value.diagnosis_name_8 },
        { id: 263, value: value.diagnosis_type_8?.id },
        { id: 264, value: value.diagnosis_name_9 },
        { id: 265, value: value.diagnosis_type_9?.id },
        { id: 266, value: value.diagnosis_name_10 },
        { id: 267, value: value.diagnosis_type_10?.id },
        { id: 268, value: value.diagnosis_name_11 },
        { id: 269, value: value.diagnosis_type_11?.id },
        { id: 270, value: value.diagnosis_name_12 },
        { id: 271, value: value.diagnosis_type_12?.id },
        { id: 218, value: value.my_coach_intervention?.id },
        { id: 219, value: value.intervention_description },
        { id: 220, value: value.type_health_technology?.id },
        { id: 221, value: isEducation },
        { id: 222, value: value.type_goal?.id },
        { id: 223, value: value.description_goal },
        { id: 224, value: value.health_education?.id },
        { id: 238, value: value.procedure },
        { id: 239, value: value.positive_control },
      ],
    };
    saveForms(dataSubmit)
      .then((req) => {
        if (req && req.data && req.data.message === "success") {
          setCompleteIntervention(1);
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          percent = { id: formId, completed: req.data.data.percent };
          addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
          addFormsPercentToLocalStorage(percent);
          setIsOpen(false);
        } else {
          Swal.fire({
            title: mapErrors(req.data),
            icon: "success",
          });
        }
        setLoadingFetchForm(false);
        setReload(!reload);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "success",
        });
        setLoadingFetchForm(false);
      });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <div>
      {loadForm ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Typography variant="h6">
              {t("InterventionDiagnosis.IntervetionDiagnosisAndProcedure")}
            </Typography>
            <div style={{ marginRight: "12px" }}>
              <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
            </div>
          </div>
          {activeStep === 0 ? (
            <div className="row m-0">
              <div className="col-12 mb-3">
                <ElasticSearchAutocomplete
                  control={control}
                  elasticIndex="health_technology_all"
                  name={"health_technology"}
                  required={true}
                  label={t("InterventionDiagnosis.HealthTechnology")}
                  error={errors.health_technology}
                  defaultValue={fields && fields[0] && fields[0]?.value}
                  setValue={setValue}
                />
              </div>

              <div className="col-12 mb-3">
                <Controller
                  name="procedure"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      filterOptions={(opt, state) => opt}
                      onChange={(e, data) => {
                        onChange(data?._source?.id);
                        setSelectedProcedure(data);
                      }}
                      options={procedures}
                      noOptionsText={t("Message.EmptyDatas")}
                      getOptionLabel={(option) => option._source?.name}
                      value={selectedProcedure ? selectedProcedure : ""}
                      renderOption={(option) => (
                        <React.Fragment>
                          <Typography variant="body2">{`${option._source.external_code} - ${option._source?.name}`}</Typography>
                        </React.Fragment>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("InterventionDiagnosis.Procedure")}
                          variant="outlined"
                          value={term}
                          onChange={({ target }) =>
                            setTermProcedure(target.value)
                          }
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  )}
                  defaultValue={selectedProcedure}
                />
              </div>
              {appoiment_type_id === "3" && (
                <>
                  <div className="col-12">
                    <Controller
                      name="positive_control"
                      control={control}
                      defau
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          row
                          value={positiveControl}
                          name="education"
                          onChange={(e) => setPositiveControl(e.target.value)}
                        >
                          <div className="col d-flex align-items-center">
                            <Typography>
                              {t("InterventionDiagnosis.Control")}
                            </Typography>
                            <div className=" col d-flex justify-content-end">
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label={t("Btn.Yes")}
                              />
                              <FormControlLabel
                                value="0"
                                control={<Radio color="primary" />}
                                label={t("Btn.Not")}
                              />
                            </div>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </>
              )}
              <Divider />
              <div className="col-12 my-3">
                <Controller
                  name="diagnosis_name_1"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <Autocomplete
                      loading={loading}
                      loadingText="Cargando..."
                      onChange={(e, data) => {
                        onChange(data?._source?.id);
                        setSelectedDiagnosticOne(data);
                      }}
                      options={elasticOptions}
                      noOptionsText={t("Message.EmptyDatas")}
                      filterOptions={(opt, state) => opt}
                      getOptionLabel={(option) => option._source?.name}
                      value={selectedDiagnosticOne ? selectedDiagnosticOne : ""}
                      renderOption={(option) => (
                        <Typography variant="body2">{`${option._source.external_code} - ${option._source?.name}`}</Typography>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("InterventionDiagnosis.DiagnosisName")}
                          variant="outlined"
                          value={term}
                          onChange={({ target }) => setTerm(target.value)}
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  )}
                  defaultValue={selectedDiagnosticOne}
                />
              </div>
              <div className="col-12 mb-3">
                <ElasticSearchAutocomplete
                  control={control}
                  elasticIndex="type_of_diagnosis_all"
                  name={"diagnosis_type_1"}
                  required={true}
                  label={t("InterventionDiagnosis.DiagnosisType")}
                  error={errors.diagnosis_type_1}
                  defaultValue={fields && fields[2] && fields[2]?.value}
                  setValue={setValue}
                />
              </div>
              {newDiagnosis >= 1 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_2"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticTwo(data);
                          }}
                          options={elasticOptions}
                          noOptionsText={t("Message.EmptyDatas")}
                          value={
                            selectedDiagnosticTwo ? selectedDiagnosticTwo : ""
                          }
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_2"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_2}
                      defaultValue={fields && fields[4] && fields[4]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 2 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_3"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticThree(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticThree
                              ? selectedDiagnosticThree
                              : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_3"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_3}
                      defaultValue={fields && fields[6] && fields[6]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 3 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_4"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticFour(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticFour ? selectedDiagnosticFour : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_4"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_4}
                      defaultValue={fields && fields[8] && fields[8]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 4 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_5"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticFive(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticFive ? selectedDiagnosticFive : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_5"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_5}
                      defaultValue={fields && fields[10] && fields[10]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 5 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_6"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticSix(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticSix ? selectedDiagnosticSix : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_6"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_6}
                      defaultValue={fields && fields[19] && fields[19]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 6 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_7"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticSeven(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticSeven
                              ? selectedDiagnosticSeven
                              : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_7"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_7}
                      defaultValue={fields && fields[21] && fields[21]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 7 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_8"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticEight(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticEight
                              ? selectedDiagnosticEight
                              : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_8"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_8}
                      defaultValue={fields && fields[23] && fields[23]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 8 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_9"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticNine(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticNine ? selectedDiagnosticNine : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_9"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_9}
                      defaultValue={fields && fields[25] && fields[25]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 9 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_10"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticTen(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticTen ? selectedDiagnosticTen : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_10"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_10}
                      defaultValue={fields && fields[27] && fields[27]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 10 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_11"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticEleven(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticEleven
                              ? selectedDiagnosticEleven
                              : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_11"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_11}
                      defaultValue={fields && fields[29] && fields[29]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              {newDiagnosis >= 11 && (
                <React.Fragment>
                  <Divider />
                  <div className="col-12 my-3">
                    <Controller
                      name="diagnosis_name_12"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Autocomplete
                          filterOptions={(opt, state) => opt}
                          onChange={(_, data) => {
                            onChange(Number(data?._source?.id));
                            setSelectedDiagnosticTwelve(data);
                          }}
                          options={elasticOptions}
                          value={
                            selectedDiagnosticTwelve
                              ? selectedDiagnosticTwelve
                              : ""
                          }
                          noOptionsText={t("Message.EmptyDatas")}
                          getOptionLabel={(option) => option._source?.name}
                          renderOption={(option) => (
                            <React.Fragment>
                              <Typography variant="body2">{`${option._source?.external_code} - ${option._source?.name}`}</Typography>
                            </React.Fragment>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t("InterventionDiagnosis.DiagnosisName")}
                              variant="outlined"
                              value={term}
                              onChange={({ target }) => setTerm(target.value)}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="type_of_diagnosis_all"
                      name={"diagnosis_type_12"}
                      required={true}
                      label={t("InterventionDiagnosis.DiagnosisType")}
                      error={errors.diagnosis_type_12}
                      defaultValue={fields && fields[31] && fields[31]?.value}
                      setValue={setValue}
                    />
                  </div>
                </React.Fragment>
              )}
              <div className="col-12">
                <Button
                  fullWidth
                  disabled={newDiagnosis === 11}
                  variant="contained"
                  color="primary"
                  onClick={onAddNewDiagnosis}
                  endIcon={<AddIcon />}
                >
                  {t("InterventionDiagnosis.NewDiagnosis")}
                </Button>
              </div>
            </div>
          ) : activeStep === 1 ? (
            <React.Fragment>
              <div></div>
              <div className="row m-0">
                {appoiment_type_id === "2" && (
                  <div className="col-12">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="my_coach_intervention_all"
                      name={"my_coach_intervention"}
                      required={true}
                      label={t("InterventionDiagnosis.InterventionMyCoach")}
                      error={errors.my_coach_intervention}
                      defaultValue={fields && fields[32] && fields[32]?.value}
                      setValue={setValue}
                    />
                    {/* <Controller
                      name="my_coach_intervention"
                      control={control}
                      defaultValue={fields && fields[32] && fields[32]?.value}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="select">
                            {t("InterventionDiagnosis.InterventionMyCoach")}
                          </InputLabel>
                          <Select
                            labelId="select"
                            {...field}
                            label={t(
                              "InterventionDiagnosis.InterventionMyCoach"
                            )}
                          >
                            {myCoachIntervention.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    /> */}
                  </div>
                )}
                <div className="col-12 mt-3">
                  <Controller
                    name="intervention_description"
                    defaultValue={fields && fields[11] && fields[11]?.value}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        label={t(
                          "InterventionDiagnosis.InterventionDescription"
                        )}
                        variant="outlined"
                      />
                    )}
                  />
                </div>
                <div className="col-12 mt-3">
                  <ElasticSearchAutocomplete
                    control={control}
                    elasticIndex="types_of_health_technology_all"
                    name={"type_health_technology"}
                    required={true}
                    label={t("InterventionDiagnosis.TypeOfTecnologyInHealth")}
                    error={errors.type_health_technology}
                    defaultValue={fields && fields[12] && fields[12]?.value}
                    setValue={setValue}
                  />
                  {/* <Controller
                    name="type_health_technology"
                    control={control}
                    defaultValue={fields && fields[12] && fields[12]?.value}
                    render={({ field }) => (
                      <FormControl variant="outlined">
                        <InputLabel id="select">
                          {t("InterventionDiagnosis.TypeOfTecnologyInHealth")}
                        </InputLabel>
                        <Select
                          labelId="select"
                          {...field}
                          label={t(
                            "InterventionDiagnosis.TypeOfTecnologyInHealth"
                          )}
                        >
                          {typeHealthTechnology.map((res) => (
                            <MenuItem key={res.name} value={res.id}>
                              {res.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  /> */}
                </div>
                <div className="col-12 mt-3">
                  <Controller
                    name="education"
                    control={control}
                    defaultValue={isEducation}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        row
                        value={isEducation}
                        name="education"
                        onChange={(e) => setIsEducation(e.target.value)}
                      >
                        <div className="col d-flex align-items-center">
                          <Typography>
                            {t("InterventionDiagnosis.EducationInHealth")}
                          </Typography>
                          <div className=" col d-flex justify-content-end">
                            <FormControlLabel
                              value="Si"
                              control={<Radio color="primary" />}
                              label={t("Btn.Yes")}
                            />
                            <FormControlLabel
                              value="No"
                              control={<Radio color="primary" />}
                              label={t("Btn.Not")}
                            />
                          </div>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                {isEducation === "Si" ? (
                  <div className="col-12 mt-3">
                    <ElasticSearchAutocomplete
                      control={control}
                      elasticIndex="health_education_all"
                      name={"health_education"}
                      required={true}
                      label={t("InterventionDiagnosis.Education")}
                      error={errors.health_education}
                      defaultValue={fields && fields[16] && fields[16]?.value}
                      setValue={setValue}
                    />
                    {/* <Controller
                      name="health_education"
                      control={control}
                      defaultValue={fields && fields[16] && fields[16]?.value}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="select">
                            {t("InterventionDiagnosis.Education")}
                          </InputLabel>
                          <Select
                            labelId="select"
                            {...field}
                            label={t("InterventionDiagnosis.Education")}
                          >
                            {healthEducation.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    /> */}
                  </div>
                ) : null}
                <div className="col-12 mt-3">
                  <ElasticSearchAutocomplete
                    control={control}
                    elasticIndex="goals_all"
                    name={"type_goal"}
                    required={true}
                    label={t("InterventionDiagnosis.TypeOfGoal")}
                    error={errors.type_goal}
                    defaultValue={fields && fields[14] && fields[14]?.value}
                    setValue={setValue}
                  />
                  {/* <Controller
                    name="type_goal"
                    control={control}
                    defaultValue={fields && fields[14] && fields[14]?.value}
                    render={({ field }) => (
                      <FormControl variant="outlined">
                        <InputLabel id="select">
                          {t("InterventionDiagnosis.TypeOfGoal")}
                        </InputLabel>
                        <Select
                          labelId="select"
                          {...field}
                          label={t("InterventionDiagnosis.TypeOfGoal")}
                        >
                          {goalsIntervention.map((res) => (
                            <MenuItem key={res.name} value={res.id}>
                              {res.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  /> */}
                </div>
                <div className="col-12 mt-3">
                  <Controller
                    name="description_goal"
                    control={control}
                    defaultValue={fields && fields[15] && fields[15]?.value}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("InterventionDiagnosis.GoalSetting")}
                      />
                    )}
                  />
                </div>
              </div>
            </React.Fragment>
          ) : null}
          <div className="row m-0 pt-4">
            <div className="d-flex justify-content-between">
              <Button
                disabled={activeStep === 0}
                className={classes.buttonBack}
                onClick={handleBack}
              >
                {t("Btn.Back")}
              </Button>
              {activeStep === 1 && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <ButtonSave loader={loadingFetchForm} text="Guardar" />
                </form>
              )}
              {activeStep !== 1 && (
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(handleNext, onError)}
                >
                  {t("Btn.Next")}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FormInterventionDiagnosisProcedure;
