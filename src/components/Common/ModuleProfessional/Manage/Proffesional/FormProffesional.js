import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

//UI
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Autocomplete from "@material-ui/lab/Autocomplete";

//Components
import DropzoneImage from "components/Shared/DropzoneImage/DropzoneImage";
import DropMedia from "components/Shared/Dropzone/DropMedia";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import VenuesScheduleByEmployee from "../../List/Proffesional/VenuesScheduleByEmployee";
import FormAddDate from "./FormAddDate";

// Hooks
import useAutocomplete from "hooks/useAutocomplete";

//Services
import {
  postMedicalProfessional,
  putUserCollaborator,
} from "services/Professional/MedicalProfessional";
import { getRoles } from "services/SuperAdmin/Roles";
import { getGenderIdentity } from "services/MedicalSoftware/GenderIdentity";
import {
  getCitiesByCountryCrud,
  getTypeDocumentByCountry,
} from "services/MedicalSoftware/Countries";
import { getAllTypeOfContract } from "services/Reservations/typeOfContract";
import { getAllCompaniesByOrganization } from "services/GeneralConfig/Company";
import { getAllBrandsByCompanies } from "services/GeneralConfig/Brands";

// hooks
import { useSearchElasticCollaboratorsNutrition } from "hooks/useSearchElasticCollaboratorsNutrition";

// Images
import AddIcon from "@material-ui/icons/Add";

//utils
import { useStyles } from "utils/useStyles";
import {
  successToast,
  errorToast,
  mapErrors,
  setFormData,
  regexOnlyPositiveNumbers,
} from "utils/misc";
import Loading from "components/Shared/Loading/Loading";

const FormProfessional = ({
  defaultValue,
  setLoad,
  idDetail,
  isEdit,
  setExpanded,
  listCountries,
  brandId,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [selectedTypeContract, setSeletTypeContract] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(0);
  const [selectedCity, setSelectedCity] = useState(0);
  const [citis, setCitis] = useState([]);
  const [files, setFiles] = useState([]);
  const [typeDocuments, setTypeDocuments] = useState([]);
  const [isOpenSignature, setIsOpenSignature] = useState(false);
  const [biologicalSex, setBiologicalSex] = useState([]);
  const [signaturePadBase64, setSignaturePadBase64] = useState(null);
  const [roles, setRoles] = useState([]);
  const [typesContracts, setTypesContract] = useState([]);
  const [isForTurns, setIsForTurns] = useState(false);
  const [isMedical, setIsMedical] = useState(false);
  const [venuesSchedule, setVenuesSchedule] = useState([]);
  const [idUser, setIdUser] = useState(idDetail || "");
  const [isCreated, setIsCreated] = useState(false);
  const [filesSignature, setFilesSignature] = useState([]);
  const [valueCity] = useAutocomplete(citis, selectedCity);
  // changes
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [brands, setBrands] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [isLoadingFetchBrands, setIsLoadingFetchBrands] = useState(false);
  const [selectedRole, setSelectedRole] = useState(
    defaultValue?.user_profiles_id
  );
  const [isCoachNutrition, setIsCoachNutrition] = useState();

  // //states Modal FormAddDate
  const [isOpenAddDate, setIsOpenAddDate] = useState(false);
  const [selectDaysWeek, setSelectDaysWeek] = useState([]);

  const [
    setTerm,
    options,
    searchLoader,
    searchElasticAll,
    defaultNutri,
    searchAll,
  ] = useSearchElasticCollaboratorsNutrition(
    defaultValue?.nutritionist_id ? defaultValue?.nutritionist_id : ""
  );
  const [dataElastic, setDataElastic] = useState([]);
  const [loadNutricionist, setLoadNutricionist] = useState(false);

  useEffect(() => {
    getGenderIdentity()
      .then(({ data }) => {
        if (data && data.status === "success" && data.data.items.length > 0) {
          setBiologicalSex(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getRoles()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setRoles(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getAllTypeOfContract()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setTypesContract(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getAllCompaniesByOrganization()
      .then(({ data }) => {
        if (data.status === "success") {
          setCompanies(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [setTypesContract, enqueueSnackbar]);

  useEffect(() => {
    if (selectedCountry) {
      getCitiesByCountryCrud(selectedCountry)
        .then(({ data }) => {
          if (data && data.data && data.data.length > 0) setCitis(data.data);
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });

      getTypeDocumentByCountry(selectedCountry)
        .then(({ data }) => {
          if (data && data.data && data.data.length > 0)
            setTypeDocuments(data.data);
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [selectedCountry, enqueueSnackbar]);

  useEffect(() => {
    if (filesSignature.length > 0) {
      let file = filesSignature[0];
      let reader = new FileReader();
      reader.onloadend = function () {
        setSignaturePadBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [filesSignature]);

  useEffect(() => {
    if (isEdit && Object.keys(defaultValue).lenght !== 0) {
      setValue("name", defaultValue?.first_name);
      setValue("last_name", defaultValue?.last_name);
      setValue("document_type", defaultValue?.document_type_id);
      setValue("document_number", defaultValue?.document_number);
      setValue("email", defaultValue?.email);
      setValue("birthdate", defaultValue?.birthdate);
      setValue("ext", defaultValue?.ext);
      setValue("phone_number", defaultValue?.phone_number);
      setValue("type_contract", defaultValue?.type_contract_id);
      setSeletTypeContract(defaultValue?.type_contract_id);
      setValue("address", defaultValue?.address);
      setValue("professional_card", defaultValue?.professional_card);

      if (defaultValue?.digital_signature !== null) {
        setSignaturePadBase64(defaultValue?.digital_signature);
      }

      if (defaultValue?.user_profiles_id && roles.length !== 0) {
        const rolSelect = roles.find(
          (rol) => rol.id === defaultValue?.user_profiles_id
        );
        if (rolSelect) {
          setIsMedical(rolSelect.is_medical === 1 ? true : false);
        }
      }

      if (defaultValue?.id_country) {
        setSelectedCountry(defaultValue?.id_country);
      }

      if (defaultValue?.id_city) {
        setSelectedCity(defaultValue?.id_city);
      }

      if (defaultValue?.user_profiles_id === 30) {
        setIsCoachNutrition(defaultValue?.user_profiles_id);
      }

      if (defaultValue?.nutritionist_id) {
        setDataElastic(defaultValue?.nutritionist_id);
      }
    }
  }, [isEdit, setValue, defaultValue, roles]);

  useEffect(() => {
    if (isEdit && idDetail && defaultValue) {
      if (Object.keys(defaultValue).length !== 0) {
        setIsCreated(true);
      }
    }
  }, [idDetail, isEdit, defaultValue]);

  const fetchBrands = (companies) => {
    setIsLoadingFetchBrands(true);
    getAllBrandsByCompanies(companies)
      .then(({ data }) => {
        setBrands(data.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoadingFetchBrands(false));
  };

  useEffect(() => {
    fetchBrands(defaultValue?.companies?.map((company) => company.company_id));
  }, []);

  useEffect(() => {
    setLoadNutricionist(true);
    setTimeout(() => {
      if (options && options?.length > 0) {
        setDataElastic(
          options.filter(
            (idnutricionista) =>
              Number(idnutricionista._source.user_id) ===
              defaultValue?.nutritionist_id
          )
        );
      }
      setLoadNutricionist(false);
    }, 100);
  }, [defaultValue, options]);

  const onSubmit = (value) => {
    if (isCreated && !isEdit) {
      setExpanded(false);
      setLoad(true);
      return;
    }
    let dataEdit = {};

    const dataSubmitFormData = {
      name: value.name,
      birthdate: value.birthdate,
      genre: value.genre,
      document_number: value.document_number,
      document_type_id: value.document_type,
      phone: value.phone,
      companies: value.companies,
      rol: value.rol,
      lastname: value.last_name,
      id_country: value.country,
      city_id: value.city,
      address: value.address,
      email: value.email,
      brands_collaborator: value.brands_collaborator,
      type_contract: value.type_contract,
      password: value.password,
      terms_data: true,
    };

    if (value?.brands_collaborator?.length > 0) {
      dataSubmitFormData.brands_collaborator = JSON.stringify(
        value.brands_collaborator.map((brand) => {
          return { brand_id: brand.id };
        })
      );
    } else {
      delete dataSubmitFormData.brands_collaborator;
    }

    if (isMedical) {
      if (
        String(value?.professional_card) !==
        String(defaultValue?.professional_card)
      ) {
        if (signaturePadBase64 === null) {
          enqueueSnackbar(t("FormProfessional.WarningMessageInputSignature"), {
            variant: "info",
            autoHideDuration: 2500,
          });
          return;
        }
        dataSubmitFormData.professional_card = value.professional_card;
        dataSubmitFormData.digital_signature = signaturePadBase64;
      } else {
        dataSubmitFormData.professional_card = value.professional_card;
      }

      if (signaturePadBase64) {
        dataSubmitFormData.digital_signature = signaturePadBase64;
      }
    }

    if (value.days_available) {
      dataSubmitFormData.days_available = JSON.stringify(value.days_available);
    }

    if (value.total_hours_per_day) {
      dataSubmitFormData.total_hours_per_day = value.total_hours_per_day;
    }

    if (value.hourly_value_day_week) {
      dataSubmitFormData.hourly_value_day_week = value.hourly_value_day_week;
    }

    if (value.hourly_value_weekend_day) {
      dataSubmitFormData.hourly_value_weekend_day =
        value.hourly_value_weekend_day;
    }

    if (value.ext) {
      dataSubmitFormData.ext = value.ext;
    }

    if (files[0]) {
      dataSubmitFormData.photo = files[0];
    }

    if (value.nutritionist_id) {
      dataSubmitFormData.nutritionist_id = Number(value.nutritionist_id);
    }

    if (isEdit) {
      dataEdit = {
        document_number: value.document_number,
        birthdate: value.birthdate,
        document_type_id: value.document_type,
        email: value.email,
        lastname: value.last_name,
        name: value.name,
        phone: value.phone,
        address: value.address,
        id_country: value.country,
        city_id: value.city,
        genre: value.genre,
        type_contract: value.type_contract,
        rol: value.rol,
      };

      if (value?.brands_collaborator?.length > 0) {
        dataEdit.brands_collaborator = JSON.stringify(
          value.brands_collaborator.map((brand) => {
            return { brand_id: brand.id };
          })
        );
      } else {
        if (isEdit) {
          dataEdit.brands_collaborator = JSON.stringify([]);
        } else {
          delete dataEdit.brands_collaborator;
        }
      }

      if (isMedical) {
        if (
          String(value?.professional_card) !==
          String(defaultValue?.professional_card)
        ) {
          if (signaturePadBase64 === null) {
            enqueueSnackbar(
              t("FormProfessional.WarningMessageInputSignature"),
              { variant: "info", autoHideDuration: 2500 }
            );
            return;
          }

          dataEdit = {
            ...dataEdit,
            professional_card: value.professional_card,
            digital_signature: signaturePadBase64,
          };
        } else {
          dataEdit = {
            ...dataEdit,
            professional_card: value.professional_card,
          };
        }

        if (signaturePadBase64) {
          dataEdit = { ...dataEdit, digital_signature: signaturePadBase64 };
        }
      }

      if (value.password) {
        dataEdit = { ...dataEdit, password: value.password };
      }

      if (value.ext) {
        dataEdit = { ...dataEdit, ext: value.ext };
      }

      if (value.nutritionist_id) {
        dataEdit = { ...dataEdit, nutritionist_id: value.nutritionist_id };
      }

      if (files[0]) {
        dataEdit = { ...dataEdit, photo: files[0] };
      }

      if (value.days_available) {
        dataEdit = {
          ...dataEdit,
          days_available: JSON.stringify(value.days_available),
        };
      }

      if (value.total_hours_per_day) {
        dataEdit = {
          ...dataEdit,
          total_hours_per_day: value.total_hours_per_day,
        };
      }

      if (value.hourly_value_day_week) {
        dataEdit = {
          ...dataEdit,
          hourly_value_day_week: value.hourly_value_day_week,
        };
      }

      if (value.hourly_value_weekend_day) {
        dataEdit = {
          ...dataEdit,
          hourly_value_weekend_day: value.hourly_value_weekend_day,
        };
      }
    }
    setLoadingFetch(true);

    const functionCall = isEdit ? putUserCollaborator : postMedicalProfessional;
    functionCall(
      isEdit ? setFormData(dataEdit) : setFormData(dataSubmitFormData),
      idUser
    )
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar(t("FormProfessional.UserSavedSuccess"), successToast);
          if (isEdit) {
            setExpanded(false);
            setLoad(true);
          } else {
            setIsCreated(true);
            setIdUser(Number(data?.data?.user_id));
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

  const setIsForTurnForTypeContract = (value) => {
    setIsForTurns(value === 1 ? true : false);
  };

  const setIsMedicalForRol = (value) => {
    setIsMedical(value === 1 ? true : false);
  };

  const handleChangeRol = (id) => {
    if (id) {
      const rolSelect = roles.find((rol) => rol.id === id);
      setIsCoachNutrition(rolSelect.id);
      setIsMedicalForRol(rolSelect.is_medical);
    }
  };

  const handleChangeTypeContract = (id) => {
    if (id) {
      const typeContractSelect = typesContracts.find(
        (typeContract) => typeContract.id === id
      );
      setIsForTurnForTypeContract(typeContractSelect.check_hourly_shift);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <div className="row">
            {!isEdit && (
              <div class="col-1 d-flex align-items-start">
                <DropzoneImage files={files} setFiles={setFiles} />
              </div>
            )}

            <div className="col d-flex justify-content-center p-0">
              <div className="row row-cols-2">
                <div className="col">
                  {/* Nombre */}
                  <div>
                    <Controller
                      rules={{ required: true }}
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          variant="outlined"
                          label={t("FormProfessional.InputName")}
                        />
                      )}
                    />
                    {errors?.name && (
                      <FormHelperText error={true}>
                        {t("Field.required")}
                      </FormHelperText>
                    )}
                  </div>
                  {/* Cumpleaños */}
                  <div className="row mt-4 g-0">
                    <div className="col-8">
                      <div className="me-2">
                        <Controller
                          rules={{ required: true }}
                          name="birthdate"
                          defaultValue={defaultValue?.birthdate}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                              type="date"
                              label={t("FormProfessional.InputBirthdate")}
                            />
                          )}
                        />
                        {errors?.birthdate && (
                          <FormHelperText error={true}>
                            {t("Field.required")}
                          </FormHelperText>
                        )}
                      </div>
                    </div>
                    {/* Genero */}
                    <div className="col-4">
                      <Controller
                        name="genre"
                        defaultValue={defaultValue?.genre}
                        rules={{ required: true }}
                        control={control}
                        render={({ field }) => (
                          <FormControl variant="outlined">
                            <InputLabel id="select">
                              {t("FormProfessional.InputGender")}
                            </InputLabel>
                            <Select
                              labelId="select"
                              label={t("FormProfessional.InputGender")}
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                              }}
                            >
                              {biologicalSex.map((res) => (
                                <MenuItem key={res.name} value={res.name}>
                                  {res.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                      {errors?.genre && (
                        <FormHelperText error={true}>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </div>
                  </div>
                  {/* Documento de Id */}
                  <div className="row mt-4 g-0">
                    <div className="col-4">
                      <div className="me-2">
                        <Controller
                          rules={{ required: true }}
                          name="document_type"
                          defaultValue={defaultValue?.document_type_id}
                          control={control}
                          render={({ field }) => (
                            <FormControl variant="outlined">
                              <InputLabel id="select">
                                {t("FormProfessional.InputType")}
                              </InputLabel>
                              <Select
                                labelId="select"
                                label={t("FormProfessional.InputType")}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                }}
                              >
                                {typeDocuments.map((res) => (
                                  <MenuItem key={res.name} value={res.id}>
                                    {res.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                        {errors?.document_type && (
                          <FormHelperText error={true}>
                            {t("Field.required")}
                          </FormHelperText>
                        )}
                      </div>
                    </div>
                    {/* Numero de Documento */}
                    <div className="col-8">
                      <Controller
                        rules={{ required: true }}
                        name="document_number"
                        defaultValue={defaultValue?.document_number}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("FormProfessional.InputDocumentNumber")}
                            variant="outlined"
                          />
                        )}
                      />
                      {errors?.document_number && (
                        <FormHelperText error={true}>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </div>
                  </div>
                  {selectedCountry === 0 && (
                    <FormHelperText error={true}>
                      {t("FormProfessional.InputWarningDocumentNumber")}
                    </FormHelperText>
                  )}

                  <div className="row m-0">
                    {/* Extension */}
                    <div className="col-5 p-0 mt-4">
                      <Controller
                        rules={{ required: false }}
                        name="ext"
                        defaultValue={defaultValue?.ext}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("FormProfessional.Ext")}
                            onKeyUp={(e) => {
                              if (
                                regexOnlyPositiveNumbers.test(e.target.value)
                              ) {
                                field.onChange(e.target.value);
                              } else {
                                e.target.value = "";
                                field.onChange("");
                              }
                            }}
                          />
                        )}
                      />
                    </div>

                    {/* Telèfono */}
                    <div className="col-7 pe-0 mt-4">
                      <Controller
                        rules={{ required: true }}
                        name="phone"
                        defaultValue={defaultValue?.phone_number}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("AffiliatesLead.InputCellNumber")}
                          />
                        )}
                      />
                      {errors?.phone && (
                        <FormHelperText error={true}>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </div>
                  </div>
                  {/* Compañias */}
                  <div className="mt-3">
                    {companies?.length > 0 && (
                      <Controller
                        name="companies"
                        rules={{ required: false }}
                        control={control}
                        defaultValue={companies?.filter((company) =>
                          defaultValue?.companies?.some(
                            (defaultCompany) =>
                              defaultCompany.company_id === company.id
                          )
                        )}
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            onChange={(_, data) => {
                              onChange(data);
                              fetchBrands(data?.map((company) => company.id));
                            }}
                            multiple={true}
                            options={companies || []}
                            defaultValue={companies?.filter((company) =>
                              defaultValue?.companies?.some(
                                (defaultCompany) =>
                                  defaultCompany.company_id === company.id
                              )
                            )}
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
                                label={t("EditPriceForm.Company")}
                                error={errors.company_id}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    )}
                  </div>
                  {/* Rol */}
                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      name="rol"
                      defaultValue={defaultValue?.user_profiles_id}
                      control={control}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="select">
                            {t("FormProfessional.InputRol")}
                          </InputLabel>
                          <Select
                            labelId="select"
                            label={t("FormProfessional.InputRol")}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleChangeRol(e.target.value);
                              setSelectedRole(e.target.value);
                            }}
                          >
                            {roles &&
                              roles.map((res) => (
                                <MenuItem key={res.name} value={res.id}>
                                  {res.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                    {errors?.rol && (
                      <FormHelperText error={true}>
                        {t("Field.required")}
                      </FormHelperText>
                    )}
                  </div>
                  {/* Padrino de Nutricion */}
                  {searchAll ? (
                    <Loading />
                  ) : (
                    isCoachNutrition === 30 &&
                    selectedCountry === 1 && (
                      <div className="mt-4">
                        <Controller
                          rules={{ required: true }}
                          control={control}
                          name="nutritionist_id"
                          defaultValue={dataElastic}
                          render={({ field: { onChange } }) => (
                            <FormControl variant="outlined">
                              <Autocomplete
                                options={options}
                                filterOptions={(opt, state) => opt}
                                defaultValue={defaultNutri}
                                placeholder={"Padrino de Nutricion"}
                                className={classes.listItem}
                                getOptionLabel={(option) =>
                                  `${option?._source?.first_name +
                                  " " +
                                  option?._source?.last_name
                                  }`
                                }
                                onChange={(_, data, e) => {
                                  onChange(data?._source?.user_id);
                                  setDataElastic(data);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    onChange={(e) => {
                                      setTerm(e.target.value);
                                      searchElasticAll();
                                    }}
                                    label={"Padrino de Nutricion"}
                                    variant="outlined"
                                  />
                                )}
                              />
                            </FormControl>
                          )}
                        />
                        {errors?.nutritionist_id && (
                          <FormHelperText error={true}>
                            {t("Field.required")}
                          </FormHelperText>
                        )}
                      </div>
                    )
                  )}
                  {/* Botón info de Nómina */}
                  <div className="mt-3">
                    <Button
                      style={{ background: "#3c3c3b", color: "#ffff" }}
                      loader={loadingFetch}
                      size={"large"}
                      onClick={() => setIsOpenAddDate(true)}
                    >
                      {t("FormProfessional.InfoNom")}
                    </Button>
                  </div>
                  {isMedical && (
                    <div className="mt-4">
                      <Controller
                        rules={{ required: true }}
                        defaultValue={defaultValue?.professional_card}
                        className="col-12"
                        name="professional_card"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t(
                              "FormProfessional.InputNumberProfessional"
                            )}
                            variant="outlined"
                            type="text"
                          />
                        )}
                      />
                      {errors?.professional_card && (
                        <FormHelperText error={true}>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                </div>
                {/* Apellido */}
                <div className="col">
                  <div>
                    <Controller
                      rules={{ required: true }}
                      name="last_name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("DetailAfiliate.LabelLastName")}
                          variant="outlined"
                        />
                      )}
                    />
                    {errors?.last_name && (
                      <FormHelperText error={true}>
                        {t("Field.required")}
                      </FormHelperText>
                    )}
                  </div>
                  {/* Pais */}
                  <div className="mt-4">
                    <div className="row g-0">
                      <div className="col-4">
                        <div className="me-2">
                          <Controller
                            rules={{ required: true }}
                            name="country"
                            defaultValue={defaultValue?.id_country}
                            control={control}
                            render={({ field }) => (
                              <FormControl variant="outlined">
                                <InputLabel id="select">
                                  {t("FormProfessional.InputCountry")}
                                </InputLabel>
                                <Select
                                  labelId="select"
                                  label={t("FormProfessional.InputCountry")}
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    setSelectedCountry(e.target.value);
                                    setValue("city", null);
                                  }}
                                >
                                  {listCountries &&
                                    listCountries.map((res) => (
                                      <MenuItem key={res.name} value={res.id}>
                                        {res.name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                          {errors?.country && (
                            <FormHelperText error={true}>
                              {t("Field.required")}
                            </FormHelperText>
                          )}
                        </div>
                      </div>
                      {/* Ciudad */}
                      <div className="col-8">
                        <Controller
                          rules={{ required: true }}
                          name="city"
                          control={control}
                          defaultValue={defaultValue?.id_city}
                          render={({ field }) => (
                            <FormControl variant="outlined">
                              <Autocomplete
                                placeholder={t("FormZones.City")}
                                className={classes.listItem}
                                disableClearable={true}
                                getOptionLabel={(option) => `${option.name}`}
                                getOptionSelected={(option, value) =>
                                  Number(value) === option.id
                                }
                                aria-label="seleccionar ciudad"
                                id="controllable-select-venue"
                                options={citis}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={"Ciudad"}
                                    variant="outlined"
                                  />
                                )}
                                {...field}
                                onChange={(_, e) => {
                                  field.onChange(e.id);
                                  setSelectedCity(e.id);
                                }}
                                value={valueCity}
                              />
                            </FormControl>
                          )}
                        />
                        {errors?.city && (
                          <FormHelperText error={true}>
                            {t("Field.required")}
                          </FormHelperText>
                        )}
                      </div>
                      {selectedCountry === 0 && (
                        <FormHelperText error={true}>
                          {t("FormProfessional.InputWarningCity")}
                        </FormHelperText>
                      )}
                    </div>
                  </div>
                  {/* Direccion */}
                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      name="address"
                      defaultValue={defaultValue?.address}
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("DetailVenue.Address")}
                          variant="outlined"
                        />
                      )}
                    />
                    {errors?.address && (
                      <FormHelperText error={true}>
                        {t("Field.required")}
                      </FormHelperText>
                    )}
                  </div>
                  {/* Email */}
                  <div className="mt-4">
                    <Controller
                      rules={{ required: true }}
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("ListProfessional.Email")}
                          variant="outlined"
                        />
                      )}
                    />
                    {errors?.email && (
                      <FormHelperText error={true}>
                        {t("Field.required")}
                      </FormHelperText>
                    )}
                  </div>
                  {/* Marcas */}
                  <div className="mt-3">
                    {isLoadingFetchBrands ? (
                      <Loading />
                    ) : brands.length > 0 ? (
                      <Controller
                        name="brands_collaborator"
                        rules={{ required: false }}
                        control={control}
                        defaultValue={
                          selectedCompanies.length > 0
                            ? []
                            : brands?.filter((brand) =>
                              defaultValue?.brands?.some(
                                (defaultBrand) =>
                                  defaultBrand.brand_id === brand.id
                              )
                            )
                        }
                        render={({ field: { onChange } }) => (
                          <Autocomplete
                            onChange={(_, data) => {
                              onChange(data);
                            }}
                            multiple={true}
                            options={brands || []}
                            defaultValue={
                              selectedCompanies.length > 0
                                ? []
                                : brands?.filter((brand) =>
                                  defaultValue?.brands?.some(
                                    (defaultBrand) =>
                                      defaultBrand.brand_id === brand.id
                                  )
                                )
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
                                label={"Marcas"}
                                error={errors.brands}
                                variant="outlined"
                              />
                            )}
                          />
                        )}
                      />
                    ) : (
                      <span className="p-5">
                        {t("FormProfessional.NotTrademarks")}
                      </span>
                    )}
                  </div>
                  {/* Contrato */}
                  <div className="row row-cols-2 mt-4 g-0">
                    <div className="col">
                      <div className="me-2">
                        <Controller
                          name="type_contract"
                          defaultValue={defaultValue?.type_contract}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <FormControl variant="outlined">
                              <InputLabel id="type_contract">
                                {t("FormProfessional.SelectTypeContract")}
                              </InputLabel>
                              <Select
                                labelId="type_contract"
                                label={t("FormProfessional.SelectTypeContract")}
                                {...field}
                                onChange={(e) => {
                                  setSeletTypeContract(e.target.value);
                                  field.onChange(e.target.value);
                                  handleChangeTypeContract(e.target.value);
                                }}
                                value={selectedTypeContract}
                              >
                                {typesContracts &&
                                  typesContracts.map((res) => (
                                    <MenuItem key={res.name} value={res.id}>
                                      {res.name}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          )}
                        />
                        {errors?.type_contract && (
                          <FormHelperText error={true}>
                            {t("Field.required")}
                          </FormHelperText>
                        )}
                      </div>
                    </div>
                    {/* Contraseña */}
                    <div className="col">
                      <Controller
                        rules={{ required: isEdit ? false : true }}
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("LogIn.password")}
                            variant="outlined"
                            type="password"
                          />
                        )}
                      />
                      {errors?.password && (
                        <FormHelperText error={true}>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </div>
                  </div>

                  {isMedical && (
                    <div className="mt-4">
                      <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        style={{ height: "56px" }}
                        endIcon={<AddIcon />}
                        onClick={() => setIsOpenSignature(true)}
                      >
                        {t("FormProfessional.InputSignature")}
                      </Button>
                    </div>
                  )}

                  {isMedical && (
                    <div className="row mt-4">
                      {signaturePadBase64 && (
                        <div className="col">
                          <Typography variant="body1" className="mb-3">
                            {t("FormProfessional.InputDigitalSignature")}
                          </Typography>
                          <img
                            alt="signature"
                            style={{
                              maxWidth: "50%",
                              height: "50%",
                              marginBottom: "10px",
                            }}
                            src={signaturePadBase64}
                          />
                          <div className="col">
                            <Button
                              variant="contained"
                              color="default"
                              onClick={() => {
                                setSignaturePadBase64("");
                              }}
                            >
                              {t("Btn.Delete")}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isCreated && (
            <div className="mt-4">
              <VenuesScheduleByEmployee
                isForTurns={isForTurns}
                venues={venuesSchedule}
                setVenues={setVenuesSchedule}
                idUser={idUser}
                isEdit={isEdit}
                selectedCity={selectedCity}
                brandId={brandId}
                brands={getValues("brands_collaborator")}
                permissionsActions={permissionsActions}
              />
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            <ButtonSave
              text={isEdit ? "Guardar" : "Crear"}
              loader={loadingFetch}
            />
          </div>
        </>
      </form>

      <ShardComponentModal
        isOpen={isOpenSignature}
        handleClose={() => setIsOpenSignature(false)}
        fullWidth
        width="sm"
        body={
          <React.Fragment>
            <Typography variant="h5">
              {t("FormProfessional.InputSignature")}
            </Typography>
            <DropMedia
              isColaboratorSignature={true}
              files={filesSignature}
              setFiles={setFilesSignature}
              type="image"
            />
            <div className="d-flex justify-content-end">
              <Button
                variant="contained"
                className={classes.button}
                color="primary"
                onClick={() => {
                  setIsOpenSignature(false);
                }}
              >
                {t("Btn.save")}
              </Button>
            </div>
          </React.Fragment>
        }
      />

      <ShardComponentModal
        title={t("FormProfessional.InfoNom")}
        isOpen={isOpenAddDate}
        handleClose={() => setIsOpenAddDate(false)}
        fullWidth
        width="sm"
        body={
          <FormAddDate
            isEdit={isEdit}
            selectDaysWeek={selectDaysWeek}
            setSelectDaysWeek={setSelectDaysWeek}
            defaultValue={defaultValue}
            control={control}
            setIsOpenAddDate={setIsOpenAddDate}
          />
        }
      />
    </>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  listCountries: global.countries,
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(FormProfessional);
