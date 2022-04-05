//REACT
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

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
import { searchElastic } from "services/_elastic";
import { postWelcomeFormNutrition } from "services/VirtualJourney/WelcomeForm";
import { getMasterAutoCompleteSelect } from "services/VirtualJourney/GetMasterAutocomplete";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//UTILS
import {
  errorToast,
  mapErrors,
  successToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";

const BasicInformationForm = ({
  setIsOpen,
  setReloadInfo,
  linkTypes,
  disability,
  userType,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const savedForm = useSelector((state) => state.virtualJourney.welcomeForm);

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
  const [territorialEntities, setTerritorialEntities] = useState([]);
  const [loadElastic, setLoadElastic] = useState(false);
  const [loadEPS, setLoadEPS] = useState(false);

  const dispatch = useDispatch();

  let { user_id, quote_id } = useParams();

  useEffect(() => {
    if (Object.keys(savedForm).length > 0) {
      setLoadElastic(true);
      setLoadEPS(true);
      searchElastic("occupation", {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: savedForm?.occupation ? savedForm?.occupation : 0,
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
                  query: savedForm && savedForm?.eps ? savedForm?.eps : 0,
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
    }
  }, []);

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

  useEffect(() => {
    getMasterAutoCompleteSelect(14).then(({ data }) =>
      setTerritorialEntities(data.data.items)
    );
  }, []);

  const onSubmit = (data) => {
    data.occupation = Number(data.occupation._source.id);
    data.eps = Number(data.eps._source.id);
    data.user_id = user_id;
    data.form = 8;
    data.quote_id = quote_id;
    setLoadingFetchForm(true);
    postWelcomeFormNutrition(data)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_8_${user_id}_${quote_id}`, 100);
          dispatch(updateWelcomeForm(data.data));
          setIsOpen(false);
          setReloadInfo((prev) => !prev);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingFetchForm(false);
      });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), {
      variant: "info",
      autoHideDuration: 2500,
    });
  };

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

              {userType === 30 && (
                <>
                  <div className="col-12 mb-3">
                    <Controller
                      rules={{ required: userType === 30 ? true : false }}
                      control={control}
                      name="type_vinculation"
                      defaultValue={savedForm?.type_vinculation}
                      render={({ field }) => (
                        <FormControl
                          variant="outlined"
                          error={errors.type_vinculation ? true : false}
                        >
                          <InputLabel id="type_vinculation">
                            {t("BasicInformation.SelectTypeVinculation")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="type_vinculation"
                            label={t("BasicInformation.SelectTypeVinculation")}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            name="type_vinculation"
                          >
                            {linkTypes &&
                              linkTypes?.map((res) => (
                                <MenuItem key={res.name} value={res.id}>
                                  {res.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <Controller
                      rules={{ required: userType === 30 ? true : false }}
                      control={control}
                      name="territorial_entity"
                      defaultValue={savedForm?.territorial_entity}
                      render={({ field }) => (
                        <FormControl
                          variant="outlined"
                          error={errors.territorial_entity ? true : false}
                        >
                          <InputLabel id="territorial_entity">
                            {t("ListTerritorialEntity.TitleTerritorialEntity")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="territorial_entity"
                            label={t(
                              "ListTerritorialEntity.TitleTerritorialEntity"
                            )}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            name="territorial_entity"
                          >
                            {territorialEntities &&
                              territorialEntities?.map((res) => (
                                <MenuItem key={res.name} value={res.id}>
                                  {res.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <Controller
                      rules={{ required: userType === 30 ? true : false }}
                      control={control}
                      name="disability_category"
                      defaultValue={savedForm?.disability_category}
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
                            label={t(
                              "BasicInformation.SelectCategoryTerritorial"
                            )}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                            name="disability_category"
                          >
                            {disability &&
                              disability?.map((res) => (
                                <MenuItem key={res.name} value={res.id}>
                                  {res.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              )}
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

export default BasicInformationForm;
