import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { addDays } from "date-fns/esm";
import { connect } from "react-redux";

// UI
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import DatePicker from "components/Shared/DatePicker/DatePicker";
import TimePicker from "components/Shared/TimePicker/TimePicker";

// Services
import { authUsersDW } from "services/auth";
import { getUserInformation } from "services/MedicalSoftware/UserInformation";
import { addReserveGroupLesson } from "services/Reservations/reservationUser";

// Utils
import { useStyles } from "utils/useStyles";
import { mapErrors, successToast, errorToast, infoToast } from "utils/misc";

const propsTimePicker = {
  ampm: true,
  inputVariant: "outlined",
  margin: "normal",
  minutesStep: 5,
  mask: "__:__ _M",
  KeyboardButtonProps: { "aria-label": "change time" },
  emptyLabel: null,
  showTodayButton: true,
  todayLabel: "Hora actual",
  invalidLabel: "Hora inválida",
  InputAdornmentProps: { position: "start" },
};

const FormReserveUser = ({
  handleClose,
  dataDetailActivity,
  listTypeDocuments,
  brandId,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      schedule_activity_uuid: dataDetailActivity?.uuid,
      date: dataDetailActivity?.date,
      hour: dataDetailActivity?.start_time,
      client_id: null,
    },
  });

  //USER INFORMATION
  const [errorUser, setErrorUser] = useState("");
  const [userInformation, setUserInformation] = useState({});
  const [documentNumber, setDocumentNumber] = useState(); //DOCUMENT NUMBER
  const [typeDocument, setTypeDocument] = useState(
    listTypeDocuments ? listTypeDocuments[0]?.id : 0
  );
  const [errorUserNotFound, setErrorUserNotFound] = useState(false);
  const [loadingFetchingUserDW, setLoadingFetchingUserDW] = useState(false);

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

  //CHANGE DOCUMENT NUMBER
  const handleChange = (e) => {
    setDocumentNumber(e.target.value);
  };

  const addReserveUser = (value) => {
    if (!userInformation.user_id) {
      enqueueSnackbar(t("FormReserveUser.FindWarningUser"), infoToast);
      return;
    }

    const formValue = {
      ...value,
      client_id: userInformation.user_id,
    };
    setLoading(true);
    addReserveGroupLesson(formValue)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar(t("Message.ReservationSuccess"), successToast);
          handleClose();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(addReserveUser)}>
      <div className="row gx-0">
        <FormControl variant="outlined">
          <InputLabel id="select_type_document">Tipo</InputLabel>
          <Select
            labelId="select_type_document"
            label="Tipo"
            disabled={true}
            value={dataDetailActivity.activity_name}
          >
            {[dataDetailActivity.activity_name].map((res) => (
              <MenuItem key={res} value={res}>
                {res}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="row mt-4">
        <div className="col-3 ">
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
          <div className="row gx-0">
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
          type="text"
          value={
            Object.keys(userInformation).length > 0
              ? `${userInformation?.first_name} ${userInformation?.last_name}`
              : ""
          }
          disabled={true}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <FormControl>
            <DatePicker
              value={
                dataDetailActivity.date
                  ? addDays(new Date(dataDetailActivity.date), 1)
                  : null
              }
              id="date-picker"
              placeholder={"Fecha"}
              disabled={true}
            />
          </FormControl>
        </div>

        <div>
          <FormControl>
            <TimePicker
              id="time-picker-2"
              label={t("label.InitialOur")}
              name="start_time"
              value={
                dataDetailActivity.start_time
                  ? new Date(`2021-08-18T${dataDetailActivity.start_time}`)
                  : null
              }
              disabled={true}
              {...propsTimePicker}
            />
          </FormControl>
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <>
          <Button fullWidth className={classes.buttonBlock}>
            {t("Btn.Cancel")}
          </Button>
          <ButtonSave
            loader={loading}
            fullWidth={true}
            text={t("Btn.scheduleUser")}
          />
        </>
      </div>
    </form>
  );
};

const mapStateToProps = ({ auth, global }) => ({
  listTypeDocuments: global.typesDocuments,
  brandId: auth.brandId,
});

export default connect(mapStateToProps)(FormReserveUser);
