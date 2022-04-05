//REACT
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

//SERVICES
import { getLoadForm } from "services/MedicalSoftware/LoadForms";
import { saveForms } from "services/MedicalSoftware/SaveForms";
import {
  getCitiesByCountry,
  getCountries,
} from "services/MedicalSoftware/Countries";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
import ElasticSearchAutocomplete from "components/Shared/ElasticSearchAutocomplete/ElasticSearchAutocomplete";

//UTILS
import {
  addFormsPercentToLocalStorage,
  mapErrors,
  errorToast,
  regexNumbersPositive,
} from "utils/misc";
import Swal from "sweetalert2";

export const FormResidenceAddress = ({
  setIsOpen,
  setReload,
  reload,
  setIsCompleted,
  relationship,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const formId = 3;
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  let percent = {};

  const [loadForm, setLoadForm] = useState(false);
  const [LoadingFetchForm, setLoadingFetchForm] = useState(false);
  const [fields, setFields] = useState([]);
  const [countryId, setCountryId] = useState(0);
  const [countries, setCountries] = useState([]);
  const [citis, setCitis] = useState([]);
  const [idDefaultCity, setIdDefaultCity] = useState("");
  const [defaultCityValue, setDefaultCityValue] = useState({});
  const [loadCities, setLoadCities] = useState(false);

  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  useEffect(() => {
    setLoadForm(true);
    getLoadForm(formId, appoiment_type_id, user_id, 1)
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          setFields(data.data[0].customInputFields);
          setIdDefaultCity(data.data[0]?.customInputFields[1]?.value);
          getCitiesByCountry(data.data[0].customInputFields[0].value).then(
            ({ data }) => {
              if (data.status === "success" && data.data) {
                setCitis(data.data);
              } else {
                if (data.status === "error") {
                  setCitis([]);
                }
              }
            }
          );
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

    getCountries()
      .then(({ data }) => {
        if (data && data.data && data.data.length > 0) {
          setCountries(data.data);
        } else {
          enqueueSnackbar(mapErrors(data.data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar, appoiment_type_id, user_id]);

  useEffect(() => {
    setLoadCities(true);
    getCitiesByCountry(countryId)
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          setCitis(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [countryId, enqueueSnackbar]);

  useEffect(() => {
    if (citis && citis.length > 0) {
      citis.forEach((city) => {
        if (Number(city.id) === Number(idDefaultCity)) {
          setDefaultCityValue({ id: city.id, name: city.name });
          setValue("city_id", city.id);
        }
      });
      setLoadCities(false);
    }
  }, [citis, idDefaultCity, setValue]);

  const handleChangeCountry = (e) => {
    setCountryId(e);
  };

  const onSubmit = (data) => {
    setLoadingFetchForm(true);
    let dataSubmit = {
      form_id: Number(formId),
      user_id: Number(user_id),
      quote_id: Number(quote_id),
      medical_professional_id: Number(medical_professional_id),
      customInputFields: [
        { id: 11, value: data.country_id },
        {
          id: 12,
          value: data.city_id.id ? data.city_id.id : defaultCityValue.id,
        },
        { id: 13, value: data.territorial_zone.id },
        { id: 15, value: data.phone_number },
        { id: 17, value: data.name_emergency_contact },
        { id: 18, value: data.phone_emergency_contact },
        { id: 19, value: data.relationship_emergency_contact.id },
      ],
    };

    saveForms(dataSubmit)
      .then((req) => {
        if (req && req.data && req.data.message === "success") {
          setIsOpen(false);
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
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
        setIsCompleted(1);
      })
      .catch((err) => {
        setLoadingFetchForm(false);
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
      });
  };

  const onError = () => {
    enqueueSnackbar(t("General.ErrorMessage"), {
      variant: "info",
      autoHideDuration: 2500,
    });
  };

  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    if (countries.length > 0 && fields.length > 0) {
      setValue(
        "country_id",
        countries.filter(
          (option) => Number(option.id) === Number(fields[0]?.value)
        )[0]
      );
      setLoading(false);
    }
  }, [countries, fields]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="d-flex flex-column align-items-center"
      >
        <div className="row d-flex align-items-center mb-4">
          <div className="col">
            <Typography variant="h5">
              {t("ResidenceAddress.ResidenceData")}
            </Typography>
          </div>
          <div className="col-1" style={{ marginRight: "12px" }}>
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        {loadForm ? (
          <Loading />
        ) : (
          <div className="row">
            <div className="col-12 mb-2">
              {loading ? (
                <Loading />
              ) : (
                <Controller
                  name={"country_id"}
                  rules={{ required: true }}
                  control={control}
                  defaultValue={fields && fields[0] && fields[0]?.value}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      onChange={(_, data) => {
                        if (data) {
                          onChange(data.id);
                          handleChangeCountry(data.id);
                        }
                      }}
                      options={countries || []}
                      defaultValue={value}
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
                          label={"País de residencia"}
                          error={errors.country_id}
                          variant="outlined"
                        />
                      )}
                    />
                  )}
                />
              )}
            </div>

            <div className="col-12 mb-2">
              {loadCities === false && (
                <Controller
                  name="city_id"
                  rules={{ required: true }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      onChange={(_, data) => {
                        onChange(data);
                        setValue("city_id", data);
                        setDefaultCityValue(data);
                      }}
                      options={citis}
                      defaultValue={defaultCityValue ? defaultCityValue : null}
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
                          label={t("ResidenceAddress.Municipality")}
                          error={errors.city_id}
                          variant="outlined"
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
            <div className="col-12 mb-2">
              <ElasticSearchAutocomplete
                control={control}
                elasticIndex="territorial_zone_all"
                name={"territorial_zone"}
                required={true}
                label={t("ResidenceAddress.TerritorialZone")}
                error={errors.territorial_zone}
                defaultValue={fields && fields[2] && fields[2]?.value}
                setValue={setValue}
              />
            </div>

            <div className="col-12 mb-2">
              <Controller
                name="phone_number"
                control={control}
                rules={{ required: true }}
                defaultValue={fields && fields[3] && fields[3]?.value}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onKeyUp={(e) => {
                      if (regexNumbersPositive.test(e.target.value)) {
                        field.onChange(e.target.value);
                      } else {
                        e.target.value = "";
                        field.onChange("");
                      }
                    }}
                    error={errors.phone_number ? true : false}
                    type="number"
                    inputProps={{ min: 1 }}
                    name="phone_number"
                    variant="outlined"
                    label="Teléfono"
                  />
                )}
              />
            </div>
            <div className="col-12 mb-2">
              <Controller
                name="name_emergency_contact"
                control={control}
                rules={{ required: true }}
                defaultValue={fields && fields[4] && fields[4]?.value}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={errors.name_emergency_contact ? true : false}
                    name="name_emergency_contact"
                    variant="outlined"
                    label="Nombre de contacto de emergencia"
                  />
                )}
              />
            </div>
            <div className="col-12 mb-2">
              <Controller
                name="phone_emergency_contact"
                control={control}
                rules={{ required: true }}
                defaultValue={fields && fields[5] && fields[5]?.value}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onKeyUp={(e) => {
                      if (regexNumbersPositive.test(e.target.value)) {
                        field.onChange(e.target.value);
                      } else {
                        e.target.value = "";
                        field.onChange("");
                      }
                    }}
                    error={errors.phone_emergency_contact ? true : false}
                    inputProps={{ min: 1 }}
                    name="phone_emergency_contact"
                    variant="outlined"
                    type="number"
                    label="Número de teléfono"
                  />
                )}
              />
            </div>
            <div className="col-12 mb-2">
              <ElasticSearchAutocomplete
                control={control}
                elasticIndex="kinship_all"
                name={"relationship_emergency_contact"}
                required={true}
                label={"Parentesco"}
                error={errors.relationship_emergency_contact}
                defaultValue={fields && fields[6] && fields[6]?.value}
                setValue={setValue}
              />
            </div>
            <div className="d-flex flex-row-reverse">
              <ButtonSave loader={LoadingFetchForm} text={t("Btn.save")} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
