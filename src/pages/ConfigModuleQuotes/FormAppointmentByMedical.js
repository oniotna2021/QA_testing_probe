//REACT
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

//UI
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";

//CONPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//SERVICES
import { getUserInformation } from "services/MedicalSoftware/UserInformation";
import { getTypeAppointmentByMedical } from "services/MedicalSoftware/MedicalProfesional";
import {
  postAppointment,
  deleteAppointment,
} from "services/MedicalSoftware/Appointments";
import { authUsersDW } from "services/auth";

//DATE-FNS
import { format } from "date-fns";

//SWEET ALERT
import Swal from "sweetalert2";

// Utils
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors, successToast } from "utils/misc";

const optionsModality = [
  { id: 2, name: "Presencial" },
  { id: 1, name: "Virtual" },
];

const FormAppointment = ({
  setIsOpen,
  venueIdDefaultProfile,
  venueCountryId,
  isNew,
  userId,
  defaultValueHour,
  date,
  selectedEvent,
  reload,
  setReload,
  selectedModality,
  listTypeDocuments,
  brandId,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dateFormat = "yyyy-MM-dd";

  //STATES
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);
  const [dataTypeAppointment, setDataTypeAppointment] = useState([]); //TYPE APPOINTMENT
  const [documentNumber, setDocumentNumber] = useState(); //DOCUMENT NUMBER
  const [userInformation, setUserInformation] = useState([]); //USER INFORMATION
  const [error, setError] = useState("");
  const [errorUserNotFound, setErrorUserNotFound] = useState(false);
  const [loadingFetchingUserDW, setLoadingFetchingUserDW] = useState(false);
  const [typeDocument, setTypeDocument] = useState(
    listTypeDocuments ? listTypeDocuments[0]?.id : 0
  );

  //Forms
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      // document_number_user: 0,
      medical_professional_id: userId,
      id_venue: venueIdDefaultProfile,
      date: format(date, dateFormat),
      hour: defaultValueHour,
      type_quote: "",
      modality: selectedModality,
    },
  });

  const dateCurrent = date;
  const dateFormated = format(dateCurrent, dateFormat);

  //GET USER DATA
  useEffect(() => {
    if (documentNumber) {
      getUserInformation(documentNumber, typeDocument)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setErrorUserNotFound(false);
            setError("");
            setUserInformation(data.data);
          } else {
            setErrorUserNotFound(true);
            setUserInformation({});
            setError(mapErrors(data));
          }
        })
        .catch((err) => {
          setErrorUserNotFound(true);
          setUserInformation({});
          enqueueSnackbar(mapErrors(err), errorToast);
          setError(mapErrors(err));
        });
    }
  }, [documentNumber, enqueueSnackbar, typeDocument]);

  //CHANGE DOCUMENT NUMBER
  const handleChange = (e) => {
    setDocumentNumber(e.target.value);
  };

  //LOAD SELECTS
  useEffect(() => {
    getTypeAppointmentByMedical(userId)
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          setDataTypeAppointment(data.data[0]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar, userId]);

  //SEND DATA
  const onSubmit = (value) => {
    value.user_id = userInformation.user_id;
    setLoadingFetchForm(true);
    const functionCall = postAppointment;
    functionCall(value)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setIsOpen(false);
          setReload(!reload);
          enqueueSnackbar(
            t("Message.AppointmentScheduledCorrectly"),
            successToast
          );
        } else {
          setIsOpen(false);
          enqueueSnackbar(
            data.message[0].message ? data.message[0].message : data.message,
            errorToast
          );
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  const deleteForm = () => {
    Swal.fire({
      title: t("Message.AreYouSure"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Btn.CancelQuote"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAppointment(selectedEvent.id)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("FormAppointmentByMedical.EliminatedSuccess"),
              "success"
            );
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  // GET USERS DW
  const handleAuthDW = () => {
    setLoadingFetchingUserDW(true);
    const typeDocument = getValues().type_document;
    authUsersDW(documentNumber, typeDocument, brandId)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setError("");
          setUserInformation(data?.data);
          enqueueSnackbar("Usuario encontrado en DW", successToast);
        } else {
          setUserInformation({});
          setError(mapErrors(data));
        }
      })
      .catch((err) => {
        setError(mapErrors(err));
        setUserInformation({});
      })
      .finally(() => {
        setLoadingFetchingUserDW(false);
      });
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
          <Typography variant="body2">{dateFormated}</Typography>
          <Typography variant="body2">{defaultValueHour}</Typography>
        </div>
        <br></br>

        <div className="row mt-4">
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
                        label="No. de documento"
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
                      backgroundColor: "#b6cdfb",
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

            {error !== "" && <FormHelperText error>{error}</FormHelperText>}
          </div>

          {/*TEXT FIELD NOMBRE*/}
          <div className="col-12 mt-3">
            <TextField
              rules={{ required: true }}
              disabled={!isNew ? true : false}
              fullWidth
              variant="outlined"
              type="text"
              label={t("FormAppointmentByMedical.InputName")}
              value={
                userInformation &&
                userInformation.first_name &&
                userInformation.first_name !== ""
                  ? userInformation?.first_name
                  : ""
              }
            />
          </div>

          {/*TEXT FIELD APELLIDO*/}
          <div className="col-12 mt-3">
            <TextField
              rules={{ required: true }}
              disabled={!isNew ? true : false}
              fullWidth
              variant="outlined"
              type="text"
              label={t("DetailAfiliate.LabelLastName")}
              value={
                userInformation &&
                userInformation.last_name &&
                userInformation.last_name !== ""
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
                    labelid="select_tipo_cita"
                    label={t("FormAppointmentByMedical.TypeVenue")}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    {dataTypeAppointment.appointment_tipes &&
                      dataTypeAppointment.appointment_tipes.map((res) => (
                        <MenuItem
                          key={res.name_appointment_type_id}
                          value={res.appointment_type_id}
                        >
                          {res.name_appointment_type_id}
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
                    disabled={true}
                    labelId="select_modalidad"
                    label={t("FormAppointmentByMedical.Modality")}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.value);
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
                {t("Btn.CancelQuote")}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  userId: auth.userId,
  venueCountryId: auth.venueCountryIdDefault,
  listTypeDocuments: global.typesDocuments,
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(FormAppointment);
