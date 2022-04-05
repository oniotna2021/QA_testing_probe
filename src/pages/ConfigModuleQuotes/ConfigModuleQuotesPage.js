import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";

//UI
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Card, CardContent } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

//ICONS
import { IconCalendar } from "assets/icons/customize/config";

//COMPONENTS
import Loading from "components/Shared/Loading/Loading";
import { MessageView } from "components/Shared/MessageView/MessageView";
import FormAppointmentByMedical from "./FormAppointmentByMedical";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

//SERVICES
import {
  getQuotesByProfessionalID,
  startQuote,
  getQuotesByMonthForMedical,
} from "services/MedicalSoftware/Quotes";
import { availabilityMedicalProfesional } from "services/MedicalSoftware/MedicalProfesional";

// Utils
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors, formatPMorAM, tConv24 } from "utils/misc";

const StyledBadge = withStyles(() => ({
  badge: {
    right: 20,
    top: 33,
    height: "10px",
    minWidth: "10px",
    padding: "0 4px",
  },
}))(Badge);

const ConfigModuleQuotesPage = ({
  userId,
  venueIdDefaultProfile,
  listVenues,
}) => {
  const theme = useTheme();
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const option = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let currentDate = new Date();

  const [dataQuotes, setDataQuotes] = useState([]);
  const [loadData, setLoadData] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [quoteDays, setQuoteDays] = useState([]);
  const [isFilter, setIsFilter] = useState(false);
  const [hoursMedical, setHoursMedical] = useState([]);
  const dateText = selectedDate.toLocaleDateString("es-ES", option);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("");
  const [reload, setReload] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState([]);
  const [month, setMonth] = useState(String(`0${new Date().getMonth() + 1}`));
  const [selectedModality, setSelectedModality] = useState(0);

  let year = selectedDate.getFullYear();
  const { control } = useForm();

  const optionsModality = [
    { id: 2, name: "Presencial" },
    { id: 1, name: "Virtual" },
  ];

  //CONSULTAR CITAS POR ID DEL MEDICO
  useEffect(() => {
    let formatvenues = [];
    formatvenues = selectedVenues.map((venue) => {
      return venue.id;
    });
    setLoadData(true);
    getQuotesByProfessionalID(
      userId,
      format(selectedDate, "yyyy-MM-dd"),
      formatvenues
    )
      .then(({ data }) => {
        if (data && data.status === "success") {
          setDataQuotes(data?.data?.quotes);
        }
        setLoadData(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [
    userId,
    selectedDate,
    reload,
    month,
    enqueueSnackbar,
    selectedVenues,
    selectedModality,
  ]);

  //CONSULTAR CITAS POR MES
  useEffect(() => {
    let formatMonth =
      new Date(month).getMonth() + 1 > 9
        ? `${new Date(month).getMonth() + 1}`
        : `0${new Date(month).getMonth() + 1}`;
    getQuotesByMonthForMedical(year, formatMonth, userId)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setQuoteDays(
            data?.data.quotes_date.map((date) => {
              return Number(date?.quote_day.slice(8, 10));
            })
          );
        } else {
          setQuoteDays([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [userId, year, month, enqueueSnackbar, selectedVenues]);

  //CONSULTAR DISPONIBILIDAD DEL MEDICO
  useEffect(() => {
    if (selectedModality !== 0) {
      let data = {
        date: format(selectedDate, "yyyy-MM-dd"),
        id_medical: userId,
        id_venue: venueIdDefaultProfile,
        modality: selectedModality === 1 ? "virtual" : "presencial",
      };
      availabilityMedicalProfesional(data, selectedModality === 1)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data.availability !== null
          ) {
            setHoursMedical(data?.data?.availability);
          } else {
            setHoursMedical([]);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [
    userId,
    venueIdDefaultProfile,
    selectedDate,
    reload,
    month,
    enqueueSnackbar,
    selectedModality,
  ]);

  //INICIAR CITA
  const onInitHistory = (item) => {
    let data = {
      medical_professional_id: userId,
      quote_id: item.id,
    };
    startQuote(data)
      .then(({ data }) => {
        if (data && data.status === "success") {
          history.push(
            `/clinic-history/${item.id}/${item.type_quote}/${item.medical_professional_id}/${item.user_id}/${item.modality}`
          );
        } else {
          enqueueSnackbar(data.message[0].message, errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  const handleOpen = () => {
    setIsOpen(true);
  };
  return (
    <>
      <div className="container-fluid p-0">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between mt-3">
            <Typography variant="h4">{t("Menu.Title.Quotes")}</Typography>
            <IconButton
              style={{ background: "#F3F3F3", borderRadius: 10 }}
              onClick={() => setIsFilter(!isFilter)}
            >
              <IconCalendar color={theme.palette.primary.light} />
            </IconButton>
          </div>
          <div className="d-flex justify-content-start">
            <Autocomplete
              multiple
              includeInputInList={false}
              options={listVenues}
              onChange={(_, data) => setSelectedVenues(data)}
              style={{ width: "20%" }}
              getOptionLabel={(option) => `${option.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleccionar sede"
                  variant="outlined"
                  margin="normal"
                />
              )}
            />
          </div>
        </div>

        <div className="row">
          <div className={isFilter ? "col-9" : "col-12"}>
            {loadData ? (
              <Loading />
            ) : dataQuotes.length === 0 ? (
              <MessageView label={t("Message.NoVenuesForDay")} />
            ) : (
              dataQuotes.map((item) => (
                <div key={item?.id} className="mb-2">
                  <Card>
                    <CardContent className="p-3">
                      <div className="row d-flex justify-content-between align-items-center">
                        <div className="col-1">
                          <div className={classes.boxAppointment}>
                            <Typography
                              style={{ fontSize: "13px", fontWeight: "bold" }}
                              variant="body1"
                            >
                              {tConv24(item?.hour)}
                            </Typography>
                            <Typography
                              style={{ fontSize: "13px", fontWeight: "bold" }}
                              variant="body1"
                            >
                              {formatPMorAM(item?.hour)}
                            </Typography>
                          </div>
                        </div>
                        <div className="col-1 d-flex flex-column align-items-start ps-3">
                          <Typography
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            variant="body1"
                          >
                            Sede
                          </Typography>
                          <div style={{ width: "70px" }}>
                            <Tooltip title={item?.venue_name}>
                              <Typography
                                noWrap
                                style={{ fontSize: "12px" }}
                                variant="body1"
                              >
                                {item?.venue_name}
                              </Typography>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="col-1 d-flex flex-column align-items-start ps-2">
                          <Typography
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            variant="body1"
                          >
                            Riesgo
                          </Typography>
                          <Typography
                            style={{ fontSize: "9px" }}
                            variant="body1"
                          >
                            {item?.user?.risk?.risk}
                          </Typography>
                        </div>
                        <div className="col-2 d-flex flex-column align-items-start">
                          <Typography
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            variant="body1"
                          >
                            {item?.user?.first_name} {item?.user?.last_name}
                          </Typography>
                          <Typography
                            style={{ fontSize: "12px" }}
                            variant="body1"
                          >
                            {item?.user?.document_number}
                          </Typography>
                        </div>
                        <div className="col-2 d-flex flex-column align-items-start">
                          <Typography
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            variant="body1"
                          >
                            N. Teléfono
                          </Typography>
                          <Typography
                            style={{ fontSize: "12px" }}
                            variant="body1"
                          >
                            {item?.phone_number_user
                              ? item?.phone_number_user
                              : item?.user?.phone_number}
                          </Typography>
                        </div>
                        <div className="col-2 d-flex flex-column">
                          <Typography
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            variant="body1"
                          >
                            {item?.modality_name}
                          </Typography>
                          <Typography
                            style={{ fontSize: "12px" }}
                            variant="body1"
                          >
                            {item?.type_quote_name}
                          </Typography>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-center">
                          {item.is_finished === 0 &&
                          selectedDate.getDate() === currentDate.getDate() ? (
                            <Button
                              className={classes.buttonQuote}
                              onClick={() => onInitHistory(item)}
                              endIcon={
                                <ArrowForwardIosIcon style={{ fontSize: 15 }} />
                              }
                            >
                              <div className="d-flex justify-content-between">
                                <Typography>{t("Message.Init")}</Typography>
                              </div>
                            </Button>
                          ) : (
                            <Button disabled className={classes.buttonQuote}>
                              <div className="d-flex justify-content-between">
                                <Typography
                                  style={{
                                    fontSize: "14px",
                                    lineHeight: "10px",
                                  }}
                                >
                                  {selectedDate.getDate() >
                                  currentDate.getDate()
                                    ? "No disponible"
                                    : "Finalizado"}
                                </Typography>
                              </div>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
          <div className={isFilter ? "col-3 p-0 pe-5" : "d-none"}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
              <DatePicker
                autoOk
                disableToolbar
                variant="static"
                openTo="date"
                value={selectedDate}
                onMonthChange={setMonth}
                renderDay={(
                  day,
                  selectedDate,
                  isInCurrentMonth,
                  dayComponent
                ) => {
                  const isSelected =
                    quoteDays.includes(day.getDate()) && isInCurrentMonth;
                  return (
                    <div>
                      <StyledBadge
                        color="secondary"
                        badgeContent={isSelected ? "" : undefined}
                      >
                        {dayComponent}
                      </StyledBadge>
                    </div>
                  );
                }}
                onChange={handleDateChange}
              />
            </MuiPickersUtilsProvider>
            <div className="m-3">
              <Typography style={{ fontWeight: "bold", marginBottom: "20px" }}>
                {dateText}
              </Typography>
              <Controller
                rules={{ required: true }}
                control={control}
                name="modality"
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel id="select_modalidad">
                      {t("FormAppointmentByMedical.Modality")}
                    </InputLabel>
                    <Select
                      labelId="select_modalidad"
                      label={t("FormAppointmentByMedical.Modality")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setSelectedModality(e.target.value);
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
              {loadData ? (
                <Loading />
              ) : hoursMedical && hoursMedical.length === 0 ? (
                <MessageView label={t("Message.NoScheduleAvailable")} />
              ) : (
                <TableContainer style={{ height: "200px", width: "290px" }}>
                  <Table>
                    <TableBody>
                      {hoursMedical &&
                        hoursMedical.map((hour, idx) => (
                          <TableRow key={`hour-${idx}`}>
                            <TableCell
                              onClick={() => {
                                handleOpen();
                                setSelectedHour(hour.hour);
                              }}
                              className="cursor"
                            >
                              {hour.hour}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </div>
        </div>
      </div>
      <ShardComponentModal
        width="sm"
        body={
          <FormAppointmentByMedical
            venueIdDefaultProfile={venueIdDefaultProfile}
            date={selectedDate}
            setIsOpen={setIsOpen}
            isNew={true}
            userId={userId}
            defaultValueHour={selectedHour}
            reload={reload}
            setReload={setReload}
            selectedModality={selectedModality}
          />
        }
        isOpen={isOpen}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userId: auth.userId,
  listVenues: auth.venuesProfile,
  venueIdDefaultProfile: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(ConfigModuleQuotesPage);
