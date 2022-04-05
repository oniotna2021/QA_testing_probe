import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// UI
import { TextField, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FormControl, Select, InputLabel } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// utils
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  mapErrors,
  successToast,
  addKeyClinicalHistoryForm,
  infoToast,
} from "utils/misc";

//services
import { searchElastic } from "services/_elastic";
import { postWelcomeFormNutrition } from "services/VirtualJourney/WelcomeForm";

const NutritionBackgroundForm = ({
  setIsOpen,
  diagnosticType,
  setReloadInfo,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { user_id, quote_id } = useParams();
  const lastPositionForm = useSelector((state) =>
    state?.virtualJourney?.welcomeForm?.FormWelcomeIntervetionProcedure
      ? state?.virtualJourney?.welcomeForm?.FormWelcomeIntervetionProcedure
          .length
      : null
  );
  const savedForm = useSelector(
    (state) =>
      state?.virtualJourney?.welcomeForm?.FormWelcomeIntervetionProcedure &&
      state?.virtualJourney?.welcomeForm?.FormWelcomeIntervetionProcedure[
        lastPositionForm - 1
      ]
  );

  const [newDiagnosis, setNewDiagnosis] = useState(0);
  const [selectedDiagnosticOne, setSelectedDiagnosticOne] = useState({});
  const [selectedDiagnosticTwo, setSelectedDiagnosticTwo] = useState({});
  const [selectedDiagnosticThree, setSelectedDiagnosticThree] = useState({});
  const [selectedDiagnosticFour, setSelectedDiagnosticFour] = useState({});
  const [selectedDiagnosticFive, setSelectedDiagnosticFive] = useState({});
  const [elasticOptions, setElasticOptions] = useState([]);
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (savedForm && Object.keys(savedForm).length > 0) {
      searchElastic("diagnosis", {
        size: 12,
        query: {
          bool: {
            should: [
              {
                match: {
                  id: savedForm?.diagnostic_name_1
                    ? savedForm?.diagnostic_name_1
                    : "",
                },
              },
              {
                match: {
                  id: savedForm?.diagnostic_name_2
                    ? savedForm?.diagnostic_name_2
                    : "",
                },
              },
              {
                match: {
                  id: savedForm?.diagnostic_name_3
                    ? savedForm?.diagnostic_name_3
                    : "",
                },
              },
              {
                match: {
                  id: savedForm?.diagnostic_name_4
                    ? savedForm?.diagnostic_name_4
                    : "",
                },
              },
              {
                match: {
                  id: savedForm?.diagnostic_name_5
                    ? savedForm?.diagnostic_name_5
                    : "",
                },
              },
            ],
          },
        },
      }).then(({ data }) => {
        if (data && data.data) {
          setSelectedDiagnosticOne(data.data.hits.hits[0]);
          setSelectedDiagnosticTwo(data.data.hits.hits[1]);
          setSelectedDiagnosticThree(data.data.hits.hits[2]);
          setSelectedDiagnosticFour(data.data.hits.hits[3]);
          setSelectedDiagnosticFive(data.data.hits.hits[4]);
        }
      });
    }
  }, []);

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

  const onAddNewDiagnosis = () => {
    setNewDiagnosis(newDiagnosis + 1);
  };

  const onSubmit = (dataSubmit) => {
    setLoadingFetch(true);
    dataSubmit.user_id = user_id;
    dataSubmit.quote_id = quote_id;
    dataSubmit.form = 11;
    postWelcomeFormNutrition(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_11_${user_id}_${quote_id}`, 100);
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
        setLoadingFetch(false);
      });
  };

  const onError = () => {
    enqueueSnackbar("Debes llenar todos los campos", infoToast);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="d-flex justify-content-between align-items-center">
        {
          <Typography variant="h5">
            {t("NutritionBackgroundFrom.BackgroundNutri")}
          </Typography>
        }
        <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
      </div>
      <div className="col-12 my-3">
        <Controller
          name="diagnostic_name_1"
          control={control}
          rules={{ required: true }}
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
                  error={errors.diagnostic_name_1}
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
        <Controller
          defaultValue={savedForm?.diagnostic_type_1}
          name="diagnostic_type_1"
          rules={{ required: true }}
          control={control}
          render={({ field }) => (
            <FormControl variant="outlined" error={errors.diagnostic_type_1}>
              <InputLabel id="select">
                {t("InterventionDiagnosis.DiagnosisType")}
              </InputLabel>
              <Select
                labelId="select"
                {...field}
                label={t("InterventionDiagnosis.DiagnosisType")}
              >
                {diagnosticType.map((res) => (
                  <MenuItem key={res.name} value={res.id}>
                    {res.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </div>
      {newDiagnosis >= 1 && (
        <React.Fragment>
          <Divider />
          <div className="col-12 my-3">
            <Controller
              name="diagnostic_name_2"
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
                  value={selectedDiagnosticTwo ? selectedDiagnosticTwo : ""}
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
            <Controller
              name="diagnostic_type_2"
              control={control}
              defaultValue={savedForm?.diagnostic_type_2}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select">
                    {t("InterventionDiagnosis.DiagnosisType")}
                  </InputLabel>
                  <Select
                    labelId="select"
                    {...field}
                    label={t("InterventionDiagnosis.DiagnosisType")}
                  >
                    {diagnosticType.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </React.Fragment>
      )}
      {newDiagnosis >= 2 && (
        <React.Fragment>
          <Divider />
          <div className="col-12 my-3">
            <Controller
              name="diagnostic_name_3"
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  filterOptions={(opt, state) => opt}
                  onChange={(_, data) => {
                    onChange(Number(data?._source?.id));
                    setSelectedDiagnosticThree(data);
                  }}
                  options={elasticOptions}
                  value={selectedDiagnosticThree ? selectedDiagnosticThree : ""}
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
            <Controller
              name="diagnostic_type_3"
              control={control}
              defaultValue={savedForm?.diagnostic_type_3}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select">
                    {t("InterventionDiagnosis.DiagnosisType")}
                  </InputLabel>
                  <Select
                    labelId="select"
                    {...field}
                    label={t("InterventionDiagnosis.DiagnosisType")}
                  >
                    {diagnosticType.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </React.Fragment>
      )}
      {newDiagnosis >= 3 && (
        <React.Fragment>
          <Divider />
          <div className="col-12 my-3">
            <Controller
              name="diagnostic_name_4"
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  filterOptions={(opt, state) => opt}
                  onChange={(_, data) => {
                    onChange(Number(data?._source?.id));
                    setSelectedDiagnosticFour(data);
                  }}
                  options={elasticOptions}
                  value={selectedDiagnosticFour ? selectedDiagnosticFour : ""}
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
            <Controller
              name="diagnostic_type_4"
              control={control}
              defaultValue={savedForm?.diagnostic_type_4}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select">
                    {t("InterventionDiagnosis.DiagnosisType")}
                  </InputLabel>
                  <Select
                    labelId="select"
                    {...field}
                    label={t("InterventionDiagnosis.DiagnosisType")}
                  >
                    {diagnosticType.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </React.Fragment>
      )}
      {newDiagnosis >= 4 && (
        <React.Fragment>
          <Divider />
          <div className="col-12 my-3">
            <Controller
              name="diagnostic_name_5"
              control={control}
              render={({ field: { onChange } }) => (
                <Autocomplete
                  filterOptions={(opt, state) => opt}
                  onChange={(_, data) => {
                    onChange(Number(data?._source?.id));
                    setSelectedDiagnosticFive(data);
                  }}
                  options={elasticOptions}
                  value={selectedDiagnosticFive ? selectedDiagnosticFive : ""}
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
            <Controller
              name="diagnostic_type_5"
              defaultValue={savedForm?.diagnostic_type_5}
              control={control}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select">
                    {t("InterventionDiagnosis.DiagnosisType")}
                  </InputLabel>
                  <Select
                    labelId="select"
                    {...field}
                    label={t("InterventionDiagnosis.DiagnosisType")}
                  >
                    {diagnosticType.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </React.Fragment>
      )}
      <Button
        fullWidth
        disabled={newDiagnosis === 4}
        variant="contained"
        color="primary"
        onClick={onAddNewDiagnosis}
        endIcon={<AddIcon />}
      >
        {t("InterventionDiagnosis.NewDiagnosis")}
      </Button>
      <div className="d-flex justify-content-between mt-3">
        <Button className={classes.buttonBack} onClick={() => setIsOpen(false)}>
          {t("Btn.Back")}
        </Button>
        <ButtonSave
          text={t("Btn.save")}
          typeButton="submit"
          loader={loadingFetch}
        />
      </div>
    </form>
  );
};

export default NutritionBackgroundForm;
