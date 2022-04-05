import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import slugify from "slugify";
import { useTranslation } from "react-i18next";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import FormAddress from "components/Common/ModuleQuotations/QuotationConfig/Modals/FormAddress";
//Services
import { createUserLead } from "services/affiliates";
import { getUserInformation } from "services/MedicalSoftware/UserInformation";
import { getAllCountries } from "services/GeneralConfig/Countries";
import {
  getCitiesByCountryCrud,
  getVenuesByCity,
} from "services/MedicalSoftware/Countries";
//Icons
import { IconLocation, IconArrowNext } from "assets/icons/customize/config";
// hooks
import useDebounce from "hooks/useDebounce";

//utils
import { useStyles } from "utils/useStyles";
import {
  successToast,
  errorToast,
  mapErrors,
  optionsTypesDocument,
  regexNumbersPositive,
} from "utils/misc";


const FormAfiliateLead = ({
  isEdit = false,
  setIsOpen,
  handlerClose,
  fromQuotationConfig,
  handleUserSelection,
  selectedUserInfo
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  //states
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [venuesList, setVenuesList] = useState([]);
  const [currentCountryId, setCurrentCountryId] = useState();
  const [currentCityId, setCurrentCityId] = useState("");
  const [venueActive, setVenueActive] = useState({});
  const [userSelectForm, setUserSelectForm] = useState(null);
  const watchDocumentNumber = watch('document_number');
  const debouncedFilterDocumentNumber = useDebounce(watchDocumentNumber, 500);


  //modal open map adress
  const [openMapAddress, setOpenMapAddress] = useState(false);

  const onSubmit = (values) => {

    if (fromQuotationConfig && userSelectForm) {
      let venueCategorie = venueActive ? venueActive.id_category : null;
      if (!venueCategorie) {
        venueCategorie = venuesList.find(x => x.id === values.venue_id).id_category;
      }
      handleUserSelection({ venueId: values.venue_id, categoryId: venueCategorie, ...userSelectForm });
      return
    }

    const dataForm = {
      ...values,
    };

    setLoadingFetch(true);
    const functionCall = isEdit ? "" : createUserLead;
    functionCall(isEdit ? values : dataForm, values?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          if (fromQuotationConfig) {
            getUserInformation(values.document_number)
              .then((userInfo) => {
                enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
                handleUserSelection({ venueId: values.venue_id, categoryId: venueActive ? venueActive.id_category : null, ...userInfo.data.data });
              })
              .catch((err) => enqueueSnackbar(mapErrors(err), errorToast));
          } else {
            enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
            setIsOpen(false);
          }
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoadingFetch(false);
      });
  };

  // Lista de paises
  useEffect(() => {
    getAllCountries().then(({ data }) => {
      if (data && data.status === "success") {
        setCountryList(data.data);
      }
    });
  }, []);

  useEffect(() => {
    setVenuesList([]);
    getCitiesByCountryCrud(currentCountryId).then(({ data }) => {
      if (data && data.status === "success") {
        setCityList(data.data);
      } else {
        setCityList([]);
      }
    });
  }, [currentCountryId]);

  useEffect(() => {
    getVenuesByCity(currentCityId).then(({ data }) => {
      if (data && data.status === "success") {
        setVenuesList(data.data);
      } else {
        setVenuesList([]);
      }
    });
  }, [currentCityId]);

  useEffect(() => {
    if (fromQuotationConfig && debouncedFilterDocumentNumber) {
      getUserInformation(debouncedFilterDocumentNumber)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setUserSelectForm(data.data);
          } else {
            setUserSelectForm(null);
          }
        }).catch((err) => { });
    }
  }, [fromQuotationConfig, debouncedFilterDocumentNumber])


  useEffect(() => {
    if (selectedUserInfo && fromQuotationConfig) {
      setUserSelectForm(selectedUserInfo);
      setValue('document_number', selectedUserInfo.document_number);
      setCurrentCountryId(selectedUserInfo.country_id);
      setCurrentCityId(selectedUserInfo.city_id);
      setValue('country_id', selectedUserInfo.country_id);
      setValue('city_id', selectedUserInfo.city_id);
      setVenueActive({ id: selectedUserInfo.venueId });
    }
  }, [fromQuotationConfig, selectedUserInfo])

  useEffect(() => {
    if (venueActive) {
      setValue('venue_id', venueActive.id)
    }
  }, [venueActive])


  if (openMapAddress) {
    return <FormAddress
      venueActive={venueActive}
      setVenueActive={setVenueActive}
      currentCityId={currentCityId}
      t={t}
      handlerClose={() => setOpenMapAddress(false)}
    />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="row m-0">
        <div className="col-md-4">
          <Controller
            rules={{ required: true }}
            control={control}
            name="document_type_id"
            defaultValue={10}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="document_type_id">
                  {t("FormProfessional.InputType")}
                </InputLabel>
                <Select
                  disabled={false}
                  labelId="document_type_id"
                  label={t("FormProfessional.InputType")}
                  {...field}
                  onChange={(e) => {
                    if (e.target.value === 30) {
                      setIsTextInput(true);
                    } else {
                      setIsTextInput(false);
                    }
                    field.onChange(e.target.value);
                  }}
                >
                  {optionsTypesDocument.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        {
          errors.document_type_id && (
            <FormHelperText error>{t("Field.required")}</FormHelperText>
          )
        }
        <div className="col-8">
          <Controller
            rules={{ required: true, minLength: 5 }}
            control={control}
            name="document_number"
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  disabled={false}
                  fullWidth
                  variant="outlined"
                  type={isTextInput ? "text" : "number"}
                  inputProps={{ min: 0 }}
                  onKeyUp={(e) => {
                    if (isTextInput) return;

                    if (regexNumbersPositive.test(e.target.value)) {
                      field.onChange(e.target.value);
                    } else {
                      e.target.value = "";
                      field.onChange("");
                    }
                  }}
                  label={t("FormAfiliateLead.labelNumDocument")}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              </>
            )}
          />
          {errors.document_number && (
            <FormHelperText error>{t("Field.required")}</FormHelperText>
          )}
        </div>
      </div>

      {userSelectForm &&
        <div className="row m-0">
          <div className="col-md-12 mt-3">
            <Typography variant="body1">
              <strong> {t("Quotation.AddUser.Name")}: </strong>{" "}
              {userSelectForm.first_name + " " + userSelectForm.last_name}
            </Typography>
            <Typography variant="body1">
              <strong> {t("Quotation.AddUser.Email")}: </strong>{" "}
              {userSelectForm.email}
            </Typography>
            <Typography variant="body1">
              <strong> {userSelectForm.document_type_name}: </strong>{" "}
              {userSelectForm.document_number}
            </Typography>
          </div>
        </div>
      }

      {!userSelectForm && <div className="row m-0">

        <div className="col-md-6 mt-3">
          <Controller
            rules={{ required: true }}
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl variant="outlined">
                <TextField
                  {...field}
                  fullWidth
                  id={slugify("name", { lower: true })}
                  type="text"
                  label={t("AffiliatesLead.InputName")}
                  rows={1}
                  variant="outlined"
                />
                {errors.name && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>

        <div className="col-md-6 mt-3">
          <Controller
            rules={{ required: true }}
            control={control}
            name="lastname"
            render={({ field }) => (
              <FormControl variant="outlined">
                <TextField
                  {...field}
                  fullWidth
                  type="text"
                  label={t("AffiliatesLead.InputLastName")}
                  rows={1}
                  variant="outlined"
                />
                {errors.name && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>

        <div className="col-md-12 mt-3">
          <Controller
            rules={{ required: true }}
            control={control}
            name="phone"
            render={({ field }) => (
              <FormControl variant="outlined">
                <TextField
                  {...field}
                  fullWidth
                  type="text"
                  label={t("AffiliatesLead.InputCellNumber")}
                  rows={1}
                  variant="outlined"
                />
                {errors.name && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>

        <div className="col-12">
          <div className="mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="email"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("email", { lower: true })}
                    type="text"
                    placeholder={"FormProfessional.InputType"}
                    label={t("AffiliatesLead.InputEmail")}
                    rows={1}
                    variant="outlined"
                  />
                  {errors.email && (
                    <FormHelperText error>{t("Field.required")}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
        </div>
      </div>
      }

      <div className="row m-0">
        {/* country */}
        <div className="col-6 mt-3">
          <Controller
            rules={{ required: true }}
            control={control}
            name="country_id"
            value={1}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="country_id">{"País"}</InputLabel>
                <Select
                  {...field}
                  disabled={false}
                  labelId="country_id"
                  label={"País"}
                  onChange={(e) => {
                    setCurrentCountryId(e.target.value);
                    field.onChange(e.target.value);
                  }}
                >
                  {countryList.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {errors.document_type_id && (
            <FormHelperText error>{t("Field.required")}</FormHelperText>
          )}
        </div>
        {/* city */}
        <div className="col-6 mt-3">
          <div>
            <Controller
              rules={{ required: true }}
              control={control}
              name="city_id"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="city_id">{"Ciudad"}</InputLabel>
                  <Select
                    disabled={cityList.length > 0 ? false : true}
                    labelId="city_id"
                    label={"Ciudad"}
                    {...field}
                    onChange={(e) => {
                      setCurrentCityId(e.target.value);
                      field.onChange(e.target.value);
                    }}
                  >
                    {cityList.map((res) => (
                      <MenuItem key={res.id} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {errors.document_type_id && (
            <FormHelperText error>{t("Field.required")}</FormHelperText>
          )}
        </div>

        {currentCityId && <div className="col-12 mt-3">
          <Button
            className={classes.buttonAddress}
            variant="outlined"
            fullWidth
            onClick={() => setOpenMapAddress(true)}
            startIcon={<IconLocation />}
            endIcon={<IconArrowNext />}
          >
            {"Ingresar dirección de residencia"}
          </Button>
        </div>}
        {/* Venues */}
        <div className="col-12 mt-3">
          <div>
            <Controller
              rules={{ required: true }}
              control={control}
              name="venue_id"
              defaultValue={venueActive?.id}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="venue_id">{"Sede"}</InputLabel>
                  <Select
                    disabled={venuesList.length > 0 ? false : true}
                    labelId="venue_id"
                    label={"Sede"}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    {venuesList.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {errors.document_type_id && (
            <FormHelperText error>{t("Field.required")}</FormHelperText>
          )}
        </div>

        <div className="col-6 mt-4">
          {fromQuotationConfig && (
            <Button
              className={classes.buttonCancelPromotions}
              onClick={() => handlerClose()}
              fullWidth
              variant="outlined"
            >
              {t("Btn.Cancel")}
            </Button>
          )}
        </div>
        <div className="col-6 mt-4">
          <ButtonSave loader={loadingFetch} text={t("Btn.save")} fullWidth />
        </div>
      </div>
    </form >
  );
};

export default FormAfiliateLead;
