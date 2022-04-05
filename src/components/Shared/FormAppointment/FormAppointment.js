import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { addDays, format } from "date-fns";
import Swal from "sweetalert2";
import { connect } from "react-redux";

//UI
import Tooltip from "@material-ui/core/Tooltip";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";

//CONPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ControlledSelectAutocomplete from "components/Shared/ControlledSelectAutocomplete/ControlledSelectAutocomplete";
import DatePicker from "components/Shared/DatePicker/DatePicker";

//SERVICES
import { getUserInformation } from "services/MedicalSoftware/UserInformation";
import {
  postAppointment,
  deleteAppointment,
} from "services/MedicalSoftware/Appointments";
import { getMedicalProfesionalByVenueAndTypeAppointment } from "services/MedicalSoftware/MedicalProfesional";
import { availabilityMedicalProfesional } from "services/MedicalSoftware/MedicalProfesional";
import { getVenuesByCity } from "services/MedicalSoftware/VenuesAndTrainers";
import { authUsersDW } from "services/auth";

// Hooks
import useAutocomplete from "hooks/useAutocomplete";

//UTILS
import { useStyles } from "utils/useStyles";
import { successToast, errorToast, mapErrors } from "utils/misc";
import { isDate } from "date-fns/fp";

const optionsModality = [
  { id: "presencial", name: "Presencial" },
  { id: "virtual", name: "Virtual" },
];

const FormAppointment = ({
  setIsOpen,
  venueIdDefaultProfile,
  venueCityNameDefault,
  venueCityIdDefault,
  isNew,
  defaultValues,
  defaultValueHour,
  date,
  selectedEvent,
  handleClose,
  venueCountryId,
  holidays,
  listTypeDocuments,
  listCities,
  isVirtual,
  typeQuotes,
  brandId,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  //STATES
  const [typeDocument, setTypeDocument] = useState(
    listTypeDocuments ? listTypeDocuments[0]?.id : 0
  );
  const [errorUserNotFound, setErrorUserNotFound] = useState(false);
  const [loadingFetchingUserDW, setLoadingFetchingUserDW] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);

  //! REMOVE
  // const [dataTypeAppointment, setDataTypeAppointment] = useState([]); //TYPE APPOINTMENT
  const [dataMedicalProfesional, setDataMedicalProfesional] = useState([]); //MEDICAL PROFESSIONAL
  const [documentNumber, setDocumentNumber] = useState(); //DOCUMENT NUMBER
  const [userInformation, setUserInformation] = useState([]); //USER INFORMATION
  const [hours, setHours] = useState([]); //ARRAY HOURS
  const [option, setOption] = useState(null); //HOUR VALIDATION

  const [venueId, setVenueId] = useState(venueIdDefaultProfile || 0);
  const [cityId, setCityId] = useState(venueCountryId);
  const [venues, setVenues] = useState([]);
  const [typeAppointment, setTypeAppointment] = useState(0);
  const [modality, setModality] = useState(defaultValues?.modality || "");
  const [errorUser, setErrorUser] = useState("");

  // States autocomplete
  const [valueVenue] = useAutocomplete(venues, venueId);
  const [valueCity] = useAutocomplete(listCities, cityId);

  const dateCurrent = date;
  const dateFormat = "yyyy-MM-dd";
  const dateFormated = format(dateCurrent, dateFormat);

  //Forms
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      modality: defaultValues?.modality || "",
      id_venue: venueIdDefaultProfile,
      date: defaultValues?.date
        ? addDays(new Date(defaultValues?.date), 1)
        : new Date(date),
      hour: defaultValueHour || defaultValues?.hour,
      medical_professional_id: defaultValues?.id_medical,
      type_quote: "",
    },
  });

  //GET AVAILABILITY MEDICAL
  const handleMedical = useCallback(() => {
    if (
      isDate(getValues().date) &&
      (modality.length > 0 || getValues().modality.length > 0)
    ) {
      const dataSelect = {
        id_venue: isVirtual ? null : venueId,
        date: format(getValues().date, "yyyy-MM-dd"),
        id_medical:
          getValues()?.medical_professional_id &&
          Number(getValues()?.medical_professional_id),
        modality: modality || getValues().modality,
      };
      setLoadingAvailability(true);
      availabilityMedicalProfesional(dataSelect, isVirtual)
        .then(({ data }) => {
          if (data.status === "error") {
            Swal.fire({
              title: "¡Cuidado!",
              text: `${mapErrors(data)}`,
              icon: "warning",
            });
          } else if (data.status === "success") {
            if (holidays.some((holiday) => dataSelect.date === holiday.date)) {
              Swal.fire({
                title: "¡Cuidado!",
                text: `El día seleccionado es día festivo`,
                icon: "warning",
              });
              setHours(data?.data.availability);
            } else if (data?.data?.availability?.length > 0) {
              setHours(data?.data.availability);
              setValue("hour", null);
              setOption(null);
            } else {
              setValue("hour", null);
              setOption(null);
              setHours([]);
              Swal.fire({
                title: "¡Cuidado!",
                text: `Este médico no tiene horario disponible`,
                icon: "warning",
              });
            }
          }
        })
        .catch((err) => {
          setValue("hour", null);
          setHours([]);
          setOption(null);
          Swal.fire({
            title: "¡Cuidado!",
            text: `${mapErrors(err)}`,
            icon: "warning",
          });
        })
        .finally(() => {
          setLoadingAvailability(false);
        });
    }
  }, [getValues, venueId, setValue, modality, holidays, isVirtual]);

  //GET USER DATA
  useEffect(() => {
    if (documentNumber) {
      getUserInformation(documentNumber, typeDocument)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setErrorUserNotFound(false);
            setErrorUser("");
            setUserInformation(data.data);
          } else {
            setErrorUserNotFound(true);
            setUserInformation({});
            setErrorUser(mapErrors(data));
          }
        })
        .catch((err) => {
          setErrorUserNotFound(true);
          setUserInformation({});
          enqueueSnackbar(mapErrors(err), errorToast);
          setErrorUser(mapErrors(err));
        });
    }
  }, [documentNumber, typeDocument, enqueueSnackbar]);

  //GET VENUES BY CITY
  useEffect(() => {
    if (cityId) {
      getVenuesByCity(cityId)
        .then(({ data }) => {
          if (data.status === "success" && data.data && data.data.length > 0) {
            setVenues(data.data);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, cityId]);

  // GET MEDICALS PROFESIONAL BY ID
  useEffect(() => {
    if (venueId !== null) {
      getMedicalProfesionalByVenueAndTypeAppointment(venueId, typeAppointment)
        .then(({ data }) => {
          if (data.status === "success" && data.data && data.data.length > 0) {
            setDataMedicalProfesional(data.data);
          } else {
            setValue("medical_professional_id", null);
            setDataMedicalProfesional([]);
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setValue("hour", null);
          setOption(null);
          setHours([]);
        });
    }
  }, [venueId, enqueueSnackbar, typeAppointment, setValue]);

  const optionsFilteredTypeQuotes = useMemo(() => {
    const arrayToReturn = [...typeQuotes];

    if (defaultValues?.profile_appointment_types) {
      const filterDataType = typeQuotes.filter((p) =>
        defaultValues?.profile_appointment_types.some((type) => p.id === type)
      );
      setValue("type_quote", filterDataType[0]?.id);
      setTypeAppointment(filterDataType[0]?.id);
      return filterDataType;
    }

    return arrayToReturn;
  }, [defaultValues, setValue, typeQuotes]);

  // GET USERS DW
  const handleAuthDW = () => {
    setLoadingFetchingUserDW(true);
    authUsersDW(documentNumber, typeDocument, brandId)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setErrorUser("");
          setUserInformation(data?.data);
          enqueueSnackbar("Usuario encontrado en DW", successToast);
        } else {
          setUserInformation({});
          setErrorUser(mapErrors(data));
        }
      })
      .catch((err) => {
        setErrorUser(mapErrors(err));
        setUserInformation({});
      })
      .finally(() => {
        setLoadingFetchingUserDW(false);
      });
  };

  //CHANGE DOCUMENT NUMBER
  const handleChange = (e) => {
    setDocumentNumber(e.target.value);
  };

  const handleHour = (e) => {
    setOption(e.target.value);
  };

  //SEND DATA
  const onSubmit = (value) => {
    value.user_id = userInformation.user_id;
    setLoadingFetchForm(true);
    const valueForm = {
      ...value,
      modality: modality === "virtual" ? 1 : 2,
      id_venue: isVirtual
        ? null
        : value.id_venue && value.id_venue.id
        ? value.id_venue.id
        : value.id_venue,
      date: format(getValues().date, "yyyy-MM-dd"),
    };
    postAppointment(valueForm, isVirtual)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Cita agendada correctamente", successToast);
          handleClose();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
          setLoadingFetchForm(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetchForm(false);
      });
  };

  const deleteForm = () => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancelar cita",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAppointment(selectedEvent.id).then((req) => {
          Swal.fire("¡Eliminado!", "Su cita ha sido cancelada.", "success");
        });
      }
    });
  };

  const handleChangeCity = (_, e) => {
    setCityId(e.id);
    setVenueId(null);
    setValue("id_venue", null);
    setValue("medical_professional_id", null);
    setValue("hour", null);
    setOption(null);
    setHours([]);
  };

  const handleChangeVenue = (_, e) => {
    setVenueId(e.id);
    setValue("id_venue", e);
    setValue("medical_professional_id", null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column align-items-center"
      >
        <div className="row d-flex justify-content-end">
          <div className="col d-flex justify-content-between align-items-center">
            <Typography variant="h5">
              {t("FormAppointmentByMedical.MakeAnAppointment")}
            </Typography>

            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>
        <div className="row d-flex justify-content-start">
          <Typography variant="body2">
            {defaultValues?.date || dateFormated}{" "}
            {!isVirtual && venueCityNameDefault && `- ${venueCityNameDefault}`}
          </Typography>
        </div>
        <br></br>

        <div className="row mt-4">
          {/*SELECT TIPO DE DOCUMENTO*/}
          <div className="col-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="type_document"
              defaultValue={typeDocument}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select_type_document">Tipo</InputLabel>
                  <Select
                    disabled={!isNew ? true : false}
                    labelId="select_type_document"
                    label="Tipo"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setTypeDocument(e.target.value);
                    }}
                    value={typeDocument}
                  >
                    {listTypeDocuments &&
                      listTypeDocuments.map((res) => (
                        <MenuItem key={res.id} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.type_document && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>

          {/*TEXT FIELD NUMERO DE DOCUMENTO*/}
          <div className="col-9 gx-0">
            <div className="row">
              <div className="col">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  defaultValue={selectedEvent}
                  name="document_number_user"
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        disabled={!isNew ? true : false}
                        fullWidth
                        variant="outlined"
                        label="No de documento"
                        type="text"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleChange(e);
                        }}
                      />
                    </>
                  )}
                />
                {errors.document_number_user && (
                  <FormHelperText error>Campo requerido</FormHelperText>
                )}
              </div>

              <div className="col-2 d-flex gx-0 mx-0">
                <Tooltip title="Buscar en DeporWin">
                  <Button
                    disabled={!errorUserNotFound}
                    fullWidth
                    onClick={handleAuthDW}
                    variant="contained"
                    size="medium"
                    style={{
                      fontSize: "11px",
                      backgroundColor: "#ddc2f2",
                      color: "#000",
                    }}
                  >
                    {loadingFetchingUserDW ? (
                      <CircularProgress color="white" />
                    ) : (
                      "Buscar en DW"
                    )}
                  </Button>
                </Tooltip>
              </div>
            </div>

            {errorUser !== "" && (
              <FormHelperText error>{errorUser}</FormHelperText>
            )}
          </div>

          {/*TEXT FIELD NOMBRE*/}
          <div className="col-12 mt-3">
            <TextField
              rules={{ required: true }}
              fullWidth
              variant="outlined"
              disabled={true}
              type="text"
              label={"Nombres"}
              value={
                userInformation &&
                userInformation?.first_name &&
                userInformation?.first_name !== ""
                  ? userInformation?.first_name
                  : ""
              }
            />
          </div>

          {/*TEXT FIELD APELLIDO*/}
          <div className="col-12 mt-3">
            <TextField
              rules={{ required: true }}
              disabled={true}
              fullWidth
              variant="outlined"
              type="text"
              label={"Apellidos"}
              value={
                userInformation &&
                userInformation?.last_name &&
                userInformation?.last_name !== ""
                  ? userInformation?.last_name
                  : ""
              }
            />
          </div>

          <div className="col-12 mt-3">
            <Controller
              rules={{ required: false }}
              control={control}
              name="phone_number_user"
              render={({ field }) => (
                <>
                  <TextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    label="Telefono"
                    type="text"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  />
                </>
              )}
            />
          </div>

          {/* SELECT CITIES BY COUNTRY */}
          {!isVirtual && (
            <div className="col-12 mt-3">
              <FormControl variant="outlined">
                <Autocomplete
                  placeholder={"Ciudad"}
                  className={classes.listItem}
                  value={valueCity}
                  onChange={handleChangeCity}
                  disableClearable={true}
                  getOptionLabel={(option) => `${option.name}`}
                  getOptionSelected={(option, value) =>
                    Number(value) === option.id
                  }
                  aria-label="seleccionar ciudad"
                  id="controllable-select-venue"
                  options={listCities}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={"Ciudad"}
                      variant="outlined"
                    />
                  )}
                />
              </FormControl>
            </div>
          )}

          {/* SELECT VENUES BY CITY */}
          {!isVirtual && (
            <div className="col-12 mt-3">
              <FormControl variant="outlined">
                <Autocomplete
                  placeholder={"Sede"}
                  className={classes.listItem}
                  value={valueVenue}
                  onChange={handleChangeVenue}
                  disableClearable={true}
                  getOptionLabel={(option) => `${option.name}`}
                  getOptionSelected={(option, value) =>
                    Number(value) === option.id
                  }
                  aria-label="seleccionar sede"
                  id="controllable-select-venue"
                  options={venues}
                  renderInput={(params) => (
                    <TextField {...params} label={"Sede"} variant="outlined" />
                  )}
                />
              </FormControl>
            </div>
          )}

          {/*SELECT TIPO DE CITA*/}
          <div className="col-6 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="type_quote"
              defaultValue={selectedEvent}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select_tipo_cita">Tipo de cita</InputLabel>
                  <Select
                    disabled={!isNew ? true : false}
                    labelid="select_tipo_cita"
                    label="Tipo de cita"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setTypeAppointment(Number(e.target.value));
                      setValue("medical_professional_id", null);
                    }}
                  >
                    {optionsFilteredTypeQuotes &&
                      optionsFilteredTypeQuotes.map((res) => (
                        <MenuItem key={res.name} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.type_quote && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>

          {/*SELECT MODALIDAD*/}
          <div className="col-6 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="modality"
              defaultValue={selectedEvent}
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select_modalidad">Modalidad</InputLabel>
                  <Select
                    disabled={!isNew ? true : false}
                    labelId="select_modalidad"
                    label="Modalidad"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setModality(e.target.value);
                    }}
                  >
                    {optionsModality.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {errors.modality && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>

          {/* SELECT MÉDICO DISPONIBLE */}
          <div className="col-12 mt-3">
            <ControlledSelectAutocomplete
              control={control}
              name="medical_professional_id"
              options={dataMedicalProfesional || []}
              getOptionLabel={(option) =>
                `${option.first_name} ${option.last_name}`
              }
              getOptionSelected={(option, value) => Number(value) === option.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Medicos disponibles")}
                  variant="outlined"
                  margin="normal"
                />
              )}
              setValue={setValue}
              required={true}
              disabled={
                venueId === undefined || defaultValues?.id_medical
                  ? true
                  : false
              }
              defaultValue={defaultValues?.id_medical}
              multiple={false}
              handleMedical={handleMedical}
              setHours={setHours}
              setOption={setOption}
            />
            {!typeAppointment && (
              <FormHelperText error>
                Debes seleccionar el tipo de cita para que salgan los médicos
                disponibles
              </FormHelperText>
            )}
            {errors.medical_professional_id && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>

          {/*TEXT FIELD FECHA*/}
          <div className="col-6 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              // defaultValue={
              //   defaultValues?.date
              //     ? addDays(new Date(defaultValues?.date), 1)
              //     : addDays(new Date(date), 1)
              // }
              name="date"
              render={({ field }) => (
                <FormControl>
                  <DatePicker
                    {...field}
                    id="date"
                    onChange={(e) => {
                      field.onChange(e);
                      setValue("hour", null);
                      handleMedical();
                    }}
                  />
                </FormControl>
              )}
            />
            {errors.date && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>

          {/*SELECT HORA*/}
          <div className="col-6 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={defaultValueHour || defaultValues?.hour}
              name="hour"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel id="select_hora">Hora</InputLabel>
                  <Select
                    labelId="select_hora"
                    disabled={!isNew ? true : false}
                    label="Hora"
                    {...field}
                    value={option}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleHour(e);
                    }}
                  >
                    {hours.map((hour, idx) => (
                      <MenuItem key={idx} value={hour.hour}>
                        {hours.available !== 0 ? hour.hour : "No disponible"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {loadingAvailability && (
              <FormHelperText error={false}>
                {" "}
                Buscando disponibilidad...
              </FormHelperText>
            )}
            {errors.hour && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </div>

          {/*BUTTONS*/}
          {isNew ? (
            <div className="d-flex justify-content-end mt-3">
              <ButtonSave loader={loadingFetchForm} text={t("Btn.schedule")} />
            </div>
          ) : (
            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="contained"
                className={classes.button}
                size="medium"
                color="primary"
                onClick={deleteForm}
              >
                Cancelar cita
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  venueId: auth.venueIdDefaultProfile,
  venueCityId: auth.venueCityIdDefault,
  nameCity: auth.venueCityNameDefault,
  venueCountryId: auth.venueCountryIdDefault,
  holidays: global.holidays,
  listTypeDocuments: global.typesDocuments,
  listCities: global.cities,
  typeQuotes: global.typeQuotes,
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(FormAppointment);
