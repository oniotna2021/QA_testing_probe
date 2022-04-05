import React, { useState, useEffect, useCallback } from "react";
import { format, isDate, addDays } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import Swal from "sweetalert2";

// UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import Tooltip from "@material-ui/core/Tooltip";

// Components
import DatePicker from "components/Shared/DatePicker/DatePicker";

//SERVICES
import { getUserInformation } from "services/MedicalSoftware/UserInformation";
import {
  postQuote,
  postAvailabilityByAppoitment,
} from "services/VirtualJourney/Quotes";
import { authUsersDW } from "services/auth";

// Utils
import { useStyles } from "utils/useStyles";
import { successToast, mapErrors, errorToast } from "utils/misc";

const listTypesQuotesMyCoach = [
  {
    name: "Bienvenida My coach",
    id: 6,
  },
  {
    name: "Seguimiento My coach",
    id: 7,
  },
  {
    name: "Cierre my coach",
    id: 8,
  },
];

const listTypesQuotesNutrition = [
  {
    name: "Bienvenida nutrición",
    id: 9,
  },
  {
    name: "Seguimiento My coach nutrición",
    id: 10,
  },
  {
    name: "Cierre my coach nutrición",
    id: 11,
  },
];

const FormQuote = ({
  listTypeDocuments,
  setIsOpen,
  handleClose,
  brandId,
  typeQuotes,
  userProfileId,
  userId,
  userParentId,
  defaultDate,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const [errorUserNotFound, setErrorUserNotFound] = useState(false);
  const [errorUser, setErrorUser] = useState("");
  const [loadingFetchingUserDW, setLoadingFetchingUserDW] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hours, setHours] = useState([]); //ARRAY HOURS
  const [option, setOption] = useState(null); //HOUR VALIDATION

  const [documentNumber, setDocumentNumber] = useState(); //DOCUMENT NUMBER
  const [userInformation, setUserInformation] = useState([]); //USER INFORMATION
  const [typeDocument, setTypeDocument] = useState(
    listTypeDocuments ? listTypeDocuments[0]?.id : 0
  );


  const listTypeQuotes = listTypesQuotesMyCoach.concat(listTypesQuotesNutrition);

  //GET AVAILABILITY MEDICAL
  const handleMedicalAvailability = useCallback(() => {
    if (isDate(getValues().date) && getValues().appointment_type_id) {
      const dataSelect = {
        appointment_type_id: getValues().appointment_type_id,
        employee_id: userParentId ? userParentId : userId,
        start_date: format(getValues().date, "yyyy-MM-dd"),
        end_date: format(getValues().date, "yyyy-MM-dd"),
      };
      setLoadingAvailability(true);
      postAvailabilityByAppoitment(dataSelect)
        .then(({ data }) => {
          if (data.status === "error") {
            Swal.fire({
              title: "¡Cuidado!",
              text: `${mapErrors(data)}`,
              icon: "warning",
            });
          } else if (data.status === "success") {
            if (data?.data?.length > 0) {
              setHours(data?.data);
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
  }, [getValues, setValue, userId]);

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

  //CHANGE DOCUMENT NUMBER
  const handleChange = (e) => {
    setDocumentNumber(e.target.value);
  };

  const handleHour = (e) => {
    setOption(e.target.value);
  };

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

  const submitForm = (value) => {
    const dataForm = {
      ...value,
      member_id: userInformation.user_id,
      date: format(value.date, "yyyy-MM-dd"),
    };
    setLoading(true);
    postQuote(dataForm, userParentId ? userParentId : userId)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Agendado correctamente", successToast);
          setLoading(false);
          handleClose();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
          setLoading(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Typography variant="h6">Agendar cita</Typography>
        </div>
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className="row m-0">
        {/*SELECT TIPO DE DOCUMENTO*/}
        <div className="col-3 p-0">
          <Controller
            rules={{ required: false }}
            control={control}
            name="type_document"
            defaultValue={typeDocument}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="select_type_document">Tipo</InputLabel>
                <Select
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
        </div>

        {/*TEXT FIELD NUMERO DE DOCUMENTO*/}
        <div className="col pe-0">
          <Controller
            rules={{ required: true }}
            control={control}
            name="document_number_user"
            render={({ field }) => (
              <>
                <TextField
                  {...field}
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

        <div className="col-3 pe-0">
          <Tooltip title="Buscar en DeporWin">
            <Button
              disabled={!errorUserNotFound}
              fullWidth
              onClick={handleAuthDW}
              variant="contained"
              size="medium"
              style={{
                fontSize: "11px",
                backgroundColor: "##0e0f0f",
                color: "#000",
                height: "100%",
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

        {errorUser !== "" && <FormHelperText error>{errorUser}</FormHelperText>}
      </div>

      <div className="row mt-3 mb-3 mx-0">
        <div className="col gx-0">
          <TextField
            value={
              userInformation &&
              userInformation?.first_name &&
              userInformation?.first_name !== ""
                ? userInformation?.first_name
                : ""
            }
            variant="outlined"
            label={"Nombres"}
            disabled={true}
          />
        </div>
      </div>

      <div className="row mb-3 mx-0">
        <div className="col gx-0">
          <TextField
            value={
              userInformation &&
              userInformation?.last_name &&
              userInformation?.last_name !== ""
                ? userInformation?.last_name
                : ""
            }
            variant="outlined"
            label={"Apellidos"}
            disabled={true}
          />
        </div>
      </div>

      <div className="row mb-3 mx-0">
        <div className="col gx-0">
          <Controller
            control={control}
            rules={{ required: false }}
            name="phone_number_user"
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.name}
                variant="outlined"
                label={"Teléfono"}
                type="number"
              />
            )}
          />
          {errors.phone_number_user && (
            <FormHelperText error>Campo requerido</FormHelperText>
          )}
        </div>
      </div>

      <div className="row mb-3 mx-0">
        <div className="col gx-0">
          <Controller
            rules={{ required: true }}
            control={control}
            name="appointment_type_id"
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="appointment_type_id">Tipo de cita</InputLabel>
                <Select
                  {...field}
                  error={errors.appointment_type_id}
                  labelId="appointment_type_id"
                  label={"Tipo de tarea"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleMedicalAvailability();
                  }}
                >
                  {listTypeQuotes.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {errors.appointment_type_id && (
            <FormHelperText error>Campo requerido</FormHelperText>
          )}
        </div>
      </div>

      <div className="d-flex">
        {/*TEXT FIELD FECHA*/}
        <div className="col-6 me-1">
          <Controller
            rules={{ required: true }}
            defaultValue={
              defaultDate ? addDays(new Date(defaultDate), 1) : null
            }
            control={control}
            name="date"
            render={({ field }) => (
              <FormControl>
                <DatePicker
                  {...field}
                  id="date"
                  onChange={(e) => {
                    field.onChange(e);
                    setValue("hour", null);
                    handleMedicalAvailability();
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
        <div className="col-6">
          <Controller
            rules={{ required: true }}
            control={control}
            // defaultValue={defaultValueHour || defaultValues?.hour}
            name="hour"
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="select_hora">Hora</InputLabel>
                <Select
                  labelId="select_hora"
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
                      {hour.hour}
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
      </div>

      <div className="mt-4 d-flex justify-content-between">
        <Button
          onClick={() => setIsOpen(false)}
          fullWidth
          className={classes.buttonBlock}
          style={{
            fontWeight: "700",
            backgroundColor: "#ffffff",
            color: "#000",
            borderRadius: 10,
            height: 43,
          }}
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          className={classes.buttonBlock}
          style={{
            backgroundColor: "#007771",
            color: "#ffffff",
            fontWeight: "700",
            marginRight: 0,
            borderRadius: 10,
            height: 43,
          }}
          type="submit"
        >
          {loading ? (
            <CircularProgress size={30} color="secondary" />
          ) : (
            "Crear cita"
          )}
        </Button>
      </div>
    </form>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  listTypeDocuments: global.typesDocuments,
  brandId: auth.brandId,
  typeQuotes: global.typeQuotes,
  userProfileId: auth.userProfileId,
  userId: auth.userId,
});

export default connect(mapStateToProps)(FormQuote);
