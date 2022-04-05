import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import DatePicker from "components/Shared/DatePicker/DatePicker";

// redux
import { useSelector } from "react-redux";

// Services
import { authUsersDW } from "services/auth";
import { getUserInformation } from "services/MedicalSoftware/UserInformation";
import {
  reserveInVenue,
  getReserveInVenueByDate,
} from "services/Reservations/ReserveInVenue";
import {
  addReserveGroupLesson,
  getReserveGroupLessonsByVenue,
} from "services/Reservations/reservationUser";

// Utils
import { useStyles } from "utils/useStyles";
import { mapErrors, successToast, errorToast } from "utils/misc";
import Loading from "../Loading/Loading";

const CreateBookingAfiliate = ({
  listTypeDocuments,
  setIsOpen,
  brandId,
  isLoading,
  setIsLoading,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const [listActivities, setListActivities] = useState([]);
  const [idActivity, setIdActivity] = useState(null);

  //USER INFORMATION
  const [errorUser, setErrorUser] = useState("");
  const [userInformation, setUserInformation] = useState({});
  const [documentNumber, setDocumentNumber] = useState(); //DOCUMENT NUMBER
  const [typeDocument, setTypeDocument] = useState(
    listTypeDocuments ? listTypeDocuments[0]?.id : 0
  );
  const [errorUserNotFound, setErrorUserNotFound] = useState(false);
  const [loadingFetchingUserDW, setLoadingFetchingUserDW] = useState(false);

  const [value, setValue] = useState("groupClass");
  const [valueDate, setValueDate] = useState(new Date());
  const venueId = useSelector((state) => state.auth.venueIdDefaultProfile);

  //HOURS
  const [hours, setHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [isFetchingHours, setIsFetchingHours] = useState(false);

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

  // GET USERS DW
  const handleAuthDW = () => {
    setLoadingFetchingUserDW(true);
    authUsersDW(documentNumber, typeDocument, brandId)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setErrorUser("");
          setUserInformation(data?.data);
          enqueueSnackbar(
            t("FormReserveUser.FindSuccessUserInDW"),
            successToast
          );
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

  useEffect(() => {
    if (userInformation.user_id && value === "reserveVenue") {
      setIsFetchingHours(true);
      getReserveInVenueByDate({
        venueId: venueId,
        date: format(valueDate, "yyyy-MM-dd"),
        userId: userInformation.user_id,
      })
        .then(({ data }) => setHours(data.data))
        .catch((err) => console.log(err))
        .finally(() => setIsFetchingHours(false));
    }
  }, [valueDate, userInformation, venueId, value]);

  useEffect(() => {
    if (venueId && value === "groupClass" && valueDate) {
      getReserveGroupLessonsByVenue(venueId, valueDate.getDay())
        .then(({ data }) => setListActivities(data.data))
        .catch((err) => console.log(err));
    }
  }, [valueDate, userInformation, venueId, value]);

  const onSubmit = (values) => {
    setIsLoading(true);

    if (value === "groupClass") {
      const dataSubmit = {
        type_document: typeDocument,
        nro_document: userInformation.document_number,
        schedule_activity_uuid: idActivity,
        date: format(valueDate, "yyyy-MM-dd"),
        hour: selectedHour,
        client_id: userInformation.user_id,
      };

      addReserveGroupLesson(dataSubmit)
        .then(({ data }) => {
          if (data && data.status === "success") {
            enqueueSnackbar(t("Message.ReservationSuccess"), successToast);
            setIsOpen(false);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => setIsLoading(false));
      return;
    }

    const payload = {
      venue_id: venueId,
      date: format(valueDate, "yyyy-MM-dd"),
      hour: selectedHour,
      client_id: userInformation.user_id,
    };

    reserveInVenue(payload)
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar(data.message, successToast);
          setIsOpen(false);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setIsLoading(false));
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleChangeActivity = (value) => {
    setIdActivity(value);
    const findActivity = listActivities.find((p) => p.uuid === value);
    if (Boolean(findActivity)) {
      setSelectedHour(findActivity.start_time);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex justify-content-start align-items-center">
          <Typography className="me-2" variant="h6">
            {t("HomeTrainingPlans.CreateBooking")}
          </Typography>
          <Typography
            variant="body1"
            style={{ fontWeight: "bold", lineHeight: "1.6" }}
          >
            {format(new Date(), "PP", {
              locale: es,
            })}
          </Typography>
        </div>
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className="d-flex justify-content-around">
        <div className="d-flex justify-content-between align-items-center">
          <Radio
            checked={value === "groupClass"}
            onChange={handleChange}
            value="groupClass"
            name="radio-button-demo"
            inputProps={{ "aria-label": "A" }}
          />
          <Typography variant="body2">Clase grupal</Typography>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Radio
            checked={value === "reserveVenue"}
            onChange={handleChange}
            value="reserveVenue"
            label="Reserva sede"
            name="radio-button-demo"
            inputProps={{ "aria-label": "B" }}
          />
          <Typography variant="body2">Reserva sede</Typography>
        </div>
      </div>

      {value === "groupClass" && (
        <div className="mt-4">
          <FormControl>
            <DatePicker
              isDisablePass={true}
              onChange={(value) => setValueDate(value)}
              value={valueDate}
              id="date-picker"
              placeholder="dd | mm | yyyy"
              format="dd-MM-yyyy"
            />
          </FormControl>
        </div>
      )}

      <div className="mt-4">
        {value === "groupClass" && (
          <div className="row gx-0">
            <FormControl variant="outlined">
              <InputLabel id="select_type_document">Actividad</InputLabel>
              <Select
                labelId="select_type_document"
                label="Actividad"
                value={idActivity}
                onChange={(e) => handleChangeActivity(e.target.value)}
              >
                {listActivities &&
                  listActivities.map((res, idx) => (
                    <MenuItem key={idx} value={res.uuid}>
                      {res.name_activity} {res.name_location} --{" "}
                      {res.start_time}
                      {" / "}
                      {res.end_time}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
        <div className="row mt-4 ms-0">
          <div className="col-3 ps-0">
            <Controller
              rules={{ required: true }}
              control={control}
              name="type_document"
              defaultValue={10}
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

          <div className="col-9 gx-0">
            <div className="row gx-0 ms-0">
              <div className="col me-2">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="nro_document"
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        fullWidth
                        variant="outlined"
                        label={t("AffiliatesLead.InputNroDocument")}
                        type="text"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setDocumentNumber(e.target.value);
                        }}
                      />
                    </>
                  )}
                />
                {errors.document_number_user && (
                  <FormHelperText error>Campo requerido</FormHelperText>
                )}
              </div>

              <div className="col-2 d-flex justify-content-end">
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
                      t("Message.SearchInDeporwin")
                    )}
                  </Button>
                </Tooltip>
              </div>
            </div>

            {errorUser !== "" && (
              <FormHelperText error>{errorUser}</FormHelperText>
            )}
          </div>
        </div>
        <div className="row mt-4 gx-0">
          <TextField
            fullWidth
            variant="outlined"
            label={t("QuotationsConfig.NameCard")}
            disabled={true}
            type="text"
            value={
              Object.keys(userInformation).length > 0
                ? `${userInformation?.first_name} ${userInformation?.last_name}`
                : ""
            }
          />
        </div>
        {value === "reserveVenue" && (
          <div className="row mt-4 ms-0">
            <div className="col ps-0">
              <FormControl>
                <DatePicker
                  isDisablePass={true}
                  onChange={(value) => setValueDate(value)}
                  value={valueDate}
                  id="date-picker"
                  placeholder="dd | mm | yyyy"
                  format="dd-MM-yyyy"
                />
              </FormControl>
            </div>

            <div className="col-6 pe-0">
              {isFetchingHours ? (
                <Loading />
              ) : (
                <FormControl variant="outlined">
                  <InputLabel id="select_type_document">
                    Horas disponibles
                  </InputLabel>
                  <Select
                    labelId="select_type_document"
                    label="Horas disponibles"
                    onChange={(e) => setSelectedHour(e.target.value)}
                  >
                    {hours?.map((res, idx) => (
                      <MenuItem key={idx} value={res.hour}>
                        {res.text}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-between mt-4">
          <>
            <Button
              fullWidth
              className={classes.buttonBlock}
              onClick={() => setIsOpen(false)}
            >
              {t("Btn.Cancel")}
            </Button>
            <ButtonSave
              loader={isLoading}
              fullWidth={true}
              text={t("Btn.scheduleUser")}
              onClick={handleSubmit(onSubmit)}
            />
          </>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  listTypeDocuments: global.typesDocuments,
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(CreateBookingAfiliate);
