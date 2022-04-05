//REACT
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";
import { searchElastic } from "services/_elastic";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
import ElasticSearchAutocomplete from "components/Shared/ElasticSearchAutocomplete/ElasticSearchAutocomplete";

//UTILS
import {
  errorToast,
  addFormsPercentToLocalStorage,
  mapErrors,
} from "utils/misc";
import Swal from "sweetalert2";

export const FormBasicInformation = ({
  setIsOpen,
  setReload,
  reload,
  setCompleteBasicInformation,
  linkTypes,
  territorialEntities,
  disability,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const formId = 4;
  const [fields, setFields] = useState([]);
  const [options, setOptions] = useState([]);
  const [epsOptions, setEpsOptions] = useState([]);
  const [epsTerm, setEpsTerm] = useState("");
  const [term, setTerm] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);
  const [loadForm, setLoadForm] = useState(false);
  const [loadElastic, setLoadElastic] = useState(false);
  const [loadEPS, setLoadEPS] = useState(false);

  let percent = {};
  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  useEffect(() => {
    setLoadForm(true);
    getLoadForm(formId, appoiment_type_id, user_id, 1)
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          setFields(data.data[0].customInputFields);
          setLoadElastic(true);
          setLoadEPS(true);
          searchElastic("occupation", {
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query:
                        data.data[0].customInputFields &&
                        data.data[0].customInputFields[0] &&
                        data.data[0].customInputFields[0].value
                          ? data.data[0].customInputFields[0].value
                          : 0,
                      fields: ["id"],
                    },
                  },
                ],
              },
            },
          }).then(({ data }) => {
            if (data && data.data) {
              setValue("occupation", data.data.hits.hits[0]);
            }
            setLoadElastic(false);
          });
          searchElastic("health_promoting_entity", {
            query: {
              bool: {
                must: [
                  {
                    multi_match: {
                      query:
                        data.data[0].customInputFields &&
                        data.data[0].customInputFields[1] &&
                        data.data[0].customInputFields[1].value
                          ? data.data[0].customInputFields[1].value
                          : 0,
                      fields: ["id"],
                    },
                  },
                ],
              },
            },
          }).then(({ data }) => {
            if (data && data.data) {
              setValue("eps", data.data.hits.hits[0]);
            }
            setLoadEPS(false);
          });
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
  }, [appoiment_type_id, enqueueSnackbar, setValue, user_id]);

  useEffect(() => {
    const setFilterValue = (value) => {
      setOptions([]);
      if (value) {
        searchElastic("occupation", {
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
              setOptions(data.data.hits.hits);
            } else {
              setOptions([]);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
          });
      } else {
        setOptions([]);
      }
    };

    if (term) {
      setFilterValue(term);
    }
  }, [term, enqueueSnackbar]);

  // search elastic EPS

  useEffect(() => {
    searchElastic("health_promoting_entity", {
      query: {
        match_all: {},
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setEpsOptions(data.data.hits.hits);
        } else {
          setEpsOptions([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setEpsOptions([]);
      });

    const setFilterValue = (value) => {
      setEpsOptions([]);
      if (value) {
        searchElastic("health_promoting_entity", {
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
              setEpsOptions(data.data.hits.hits);
            } else {
              setEpsOptions([]);
            }
          })
          .catch((err) => {
            enqueueSnackbar(mapErrors(err), errorToast);
            setEpsOptions([]);
          });
      } else {
        setEpsOptions([]);
      }
    };

    if (epsTerm) {
      setFilterValue(epsTerm);
    }
  }, [epsTerm, enqueueSnackbar]);

  useEffect(() => {
    searchElastic("occupation", {
      from: 0,
      size: 20,
      query: {
        match_all: {},
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setOptions(data.data.hits.hits);
        } else {
          setOptions([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setEpsOptions([]);
      });
  }, [enqueueSnackbar]);

  const onSubmit = (data) => {
    data.occupation = Number(data.occupation._source.id);
    data.eps = Number(data.eps._source.id);
    data.type_vinculation = Number(data.type_vinculation.id);
    data.territorial_entity = Number(data.territorial_entity.id);
    data.disability_category = Number(data.disability_category.id);

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
          setCompleteBasicInformation(1);
          percent = { id: formId, completed: req.data.data.percent };
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
    enqueueSnackbar(t("Message.AlertFields"), {
      variant: "info",
      autoHideDuration: 2500,
    });
  };

  useEffect(() => {
    if (fields.length > 0) {
      addFormsPercentToLocalStorage({ id: formId, completed: 100 });
    }
  }, [fields]);

  return (
    <div className="container p-3">
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="row d-flex align-items-center mb-4">
          <div className="col">
            <Typography variant="h5">
              {t("DetailClinicHistory.BasicInformation")}
            </Typography>
          </div>
          <div className="col-1" style={{ marginRight: "12px" }}>
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        <div>
          {loadForm ? (
            <Loading />
          ) : (
            <div className="row m-0">
              <div className="col-12">
                {loadElastic ? (
                  <Loading />
                ) : (
                  <Controller
                    control={control}
                    name="occupation"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        onChange={(_, data) => onChange(data)}
                        options={options}
                        filterOptions={(opt, state) => opt}
                        defaultValue={value}
                        noOptionsText={t("ListPermissions.NoData")}
                        getOptionLabel={(option) =>
                          option && option._source && option._source?.name
                        }
                        renderOption={(option) => (
                          <React.Fragment>
                            <Typography variant="body2">
                              {option &&
                                option._source &&
                                `${option._source.external_code} - ${option._source?.name}`}
                            </Typography>
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={errors.occupation}
                            label={t("DetailClinicHistory.Ocupation")}
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
                )}
              </div>
              {loadEPS ? (
                <Loading />
              ) : (
                <div className="col-12 mb-1">
                  {/* Autocomplete EPS */}
                  <Controller
                    rules={{ required: true }}
                    control={control}
                    name="eps"
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        onChange={(_, data) => onChange(data)}
                        filterOptions={(opt, state) => opt}
                        className="mb-2"
                        options={epsOptions}
                        defaultValue={value}
                        noOptionsText={"No hay entidades"}
                        getOptionLabel={(option) =>
                          option && option._source && option._source?.name
                        }
                        renderOption={(option) => (
                          <React.Fragment>
                            <Typography variant="body2">
                              {option &&
                                option._source &&
                                `${option._source.external_code} - ${option._source?.name}`}
                            </Typography>
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <>
                            <TextField
                              className={"mt-3"}
                              {...params}
                              error={errors.eps ? true : false}
                              label={t("ListEPS.TitleEPS")}
                              variant="outlined"
                              value={epsTerm}
                              onChange={({ target }) =>
                                setEpsTerm(target.value)
                              }
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: "new-password", // disable autocomplete and autofill
                              }}
                            />
                          </>
                        )}
                      />
                    )}
                  />
                </div>
              )}

              <div className="col-12 mb-3">
                <ElasticSearchAutocomplete
                  control={control}
                  elasticIndex="type_of_relationship_all"
                  name={"type_vinculation"}
                  required={true}
                  label={t("BasicInformation.SelectTypeVinculation")}
                  error={errors.type_vinculation}
                  defaultValue={fields && fields[2] && fields[2]?.value}
                  setValue={setValue}
                />
              </div>
              <div className="col-12 mb-3">
                <ElasticSearchAutocomplete
                  control={control}
                  elasticIndex="territorial_entity_all"
                  name={"territorial_entity"}
                  required={true}
                  label={t("ListTerritorialEntity.TitleTerritorialEntity")}
                  error={errors.territorial_entity}
                  defaultValue={fields && fields[3] && fields[3]?.value}
                  setValue={setValue}
                />
              </div>
              <div className="col-12 mb-3">
                <ElasticSearchAutocomplete
                  control={control}
                  elasticIndex="disability_all"
                  name={"disability_category"}
                  required={true}
                  label={t("BasicInformation.SelectCategoryTerritorial")}
                  error={errors.disability_category}
                  defaultValue={fields && fields[4] && fields[4]?.value}
                  setValue={setValue}
                />
                {/* <Controller
                  rules={{ required: true }}
                  control={control}
                  name="disability_category"
                  defaultValue={fields && fields[4] && fields[4]?.value}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.disability_category ? true : false}
                    >
                      <InputLabel id="disability_category">
                        {t("BasicInformation.SelectCategoryTerritorial")}
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="disability_category"
                        label={t("BasicInformation.SelectCategoryTerritorial")}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        name="disability_category"
                      >
                        {disability.map((res) => (
                          <MenuItem key={res.name} value={res.id}>
                            {res.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                /> */}
              </div>
              <div className="d-flex justify-content-end">
                <ButtonSave loader={loadingFetchForm} text={t("Btn.save")} />
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
