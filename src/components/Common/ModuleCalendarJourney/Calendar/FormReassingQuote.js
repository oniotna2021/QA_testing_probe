import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { useSnackbar } from "notistack";
import Swal from "sweetalert2";

// UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import DatePicker from "components/Shared/DatePicker/DatePicker";

// Services
import { reasingQuote } from "services/VirtualJourney/Quotes";
import { postAvailabilityByAppoitment } from "services/VirtualJourney/Quotes";

// Utils
import { useStyles } from "utils/useStyles";
import { successToast, mapErrors, errorToast } from "utils/misc";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import Loading from "components/Shared/Loading/Loading";

const FormReassingQuote = ({
  title,
  setIsOpen,
  setIsReasing,
  detailQuote,
  handleClose,
  idQuote,
}) => {
  const classes = useStyles();
  const listReasons = useSelector((state) => state.global.listReasons);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState(
    addDays(new Date(detailQuote.date), 1)
  );

  const [typeReasonUuid, setTypeReasonUuid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingDate, setFetchingDate] = useState(false);
  const [hours, setHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState();

  useEffect(() => {
    setFetchingDate(true);
    const dataSelect = {
      appointment_type_id: detailQuote.type_quote,
      employee_id: detailQuote.employee_id,
      start_date: format(selectedDate, "yyyy-MM-dd"),
      end_date: format(selectedDate, "yyyy-MM-dd"),
    };
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
          } else {
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
        setHours([]);
        Swal.fire({
          title: "¡Cuidado!",
          text: `${mapErrors(err)}`,
          icon: "warning",
        });
      })
      .finally(() => {
        setFetchingDate(false);
      });
  }, [selectedDate]);

  const handleClickReasingQuote = () => {
    setIsLoading(true);
    const dataForm = {
      quote_id: idQuote,
      date: format(selectedDate, "yyyy-MM-dd"),
      hour: selectedHour,
      reason_schedule_change_uuid: typeReasonUuid,
    };
    reasingQuote(dataForm)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Reagendado correctamente", successToast);
          handleClose();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex justify-content-start align-items-center">
          <Typography className="me-1" variant="h6">
            {title}
          </Typography>
          <Typography variant="body1">
            {format(addDays(new Date(detailQuote?.date), 1), "PP", {
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

      <div className="my-4">
        <Typography className="me-1" variant="body2">
          Selecciona el día y hora de reprogramación.
        </Typography>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <FormControl variant="outlined" className="me-2">
          <DatePicker
            id="date-picker-start_date"
            value={selectedDate}
            defaultValue={new Date(detailQuote.date)}
            onChange={(date) => setSelectedDate(date)}
            placeholder="dd | mm | aa"
            format="dd-MM-yyyy"
          />
        </FormControl>

        {fetchingDate ? (
          <Loading />
        ) : (
          <FormControl variant="outlined">
            <InputLabel id="select">Hora</InputLabel>
            <Select
              labelId="select"
              label="Hora"
              onChange={(e) => {
                setSelectedHour(e.target.value);
              }}
            >
              {hours?.map((item) => (
                <MenuItem key={`item-${item?.id}`} value={item?.hour}>
                  {item?.hour}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <div className="mt-4">
        <div className="col">
          <FormControl variant="outlined">
            <InputLabel id="select">
              ¿Por qué motivo quieres reprogramar la cita?
            </InputLabel>
            <Select
              labelId="select"
              label="¿Por qué motivo quieres reprogramar la cita?n"
              onChange={(e) => {
                setTypeReasonUuid(e.target.value);
              }}
            >
              {listReasons &&
                listReasons?.map((item) => (
                  <MenuItem key={`item-${item?.uuid}`} value={item?.uuid}>
                    {item?.description}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-between">
        <Button
          onClick={() => setIsReasing(false)}
          fullWidth
          className={classes.buttonBlock}
          style={{
            fontWeight: "900",
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
            fontWeight: "900",
            marginRight: 0,
            borderRadius: 10,
            height: 43,
          }}
          onClick={handleClickReasingQuote}
        >
          {isLoading ? (
            <CircularProgress size={30} color="secondary" />
          ) : (
            "Reprogramar"
          )}
        </Button>
      </div>
    </>
  );
};

export default FormReassingQuote;
