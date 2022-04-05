import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

// UI
import {
  FormControl,
  IconButton,
  InputLabel,
  Select,
  Typography,
} from "@material-ui/core";

// icons
import {
  IconSearch,
  ArrowLeftHour,
  ArrowRightHour,
} from "assets/icons/customize/config";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// components
import UserCard from "./Cards/UserCard";
import Loading from "components/Shared/Loading/Loading";
import CustomDatePicker from "components/Shared/CustomDatePicker/CustomDatePicker";

// Hooks
import useQueryParams from "hooks/useQueryParams";
import useCustomDatePicker from "hooks/useCustomDatePicker";

// Services
import {
  getDataReservationAfiliate,
  getDateReservation,
  deleteReservationByUser,
} from "services/Reservations/ReserveInVenue";

// Utils
import { mapErrors } from "utils/misc";

const Capacity = ({ venueIdDefaultProfile }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [reload, setReload] = useState(true);
  const [dataReservation, setDataReservation] = useState([]);
  const [hourReservation, setHourReservation] = useState([]);
  const [load, setLoading] = useState(false);
  const [currentHour, setCurrentHour] = useState(0);
  const [hourBar, setHourBar] = useQueryParams("hourBar", "", history);

  const { isOpenDatePicker, handleChangeOpenModal, date, setDate } =
    useCustomDatePicker();

  // fecha y hora actual
  let hoy = format(date, "yyy-MM-dd");
  let date_real = format(date, "dd MMMM yyy", { locale: es });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    //hora de la reserva
    getDateReservation(venueIdDefaultProfile, hoy)
      .then(({ data }) => {
        if (data && data.status === "success") {
          setHourReservation(data.data.map((x) => x.hour));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [venueIdDefaultProfile, hoy]);

  useEffect(() => {
    if (hourReservation.length > 0) {
      if (!hourBar || !hourReservation[currentHour]) {
        setHourBar(hourReservation[0]);
        return;
      }

      const findIndexHour = hourReservation.findIndex((h) => h === hourBar);
      setCurrentHour(findIndexHour);
    }
  }, [hourReservation, setHourBar, hourBar, currentHour]);

  useEffect(() => {
    if (hourBar && reload) {
      setLoading(true);
      getDataReservationAfiliate(venueIdDefaultProfile, hoy, hourBar)
        .then(({ data }) => {
          if (data && data.status === "success") {
            setDataReservation(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          setReload(false);
        });
    }
  }, [venueIdDefaultProfile, hoy, reload, hourBar]);

  const onBackHour = () => {
    setHourBar(hourReservation[currentHour - 1]);
    setCurrentHour((prev) => (prev = prev - 1));
    setReload(true);
  };

  const onNextHour = () => {
    setHourBar(hourReservation[currentHour + 1]);
    setCurrentHour((prev) => (prev = prev + 1));
    setReload(true);
  };

  const deleteReservation = (id) => {
    Swal.fire({
      title: t("Message.AreYouSureCancelReserve"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, elimínalo",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReservationByUser(id)
          .then(({ data }) => {
            if (data.status === "error") {
              Swal.fire(t("Message.ErrorOcurred"), mapErrors(data), "error");
            } else {
              Swal.fire(
                t("Message.Eliminated"),
                t("Message.EliminatedSuccess"),
                "success"
              );
              setReload(true);
            }
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  const handleChangeDate = (date) => {
    setDate(date);
    setReload(true);
    setHourReservation([]);
    setDataReservation([]);
    setHourBar("");
    handleChangeOpenModal();
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <Typography variant="h6" className="me-3">
                Aforo
              </Typography>
            </div>

            <div className="d-flex align-items-center">
              <IconButton
                style={{
                  backgroundColor: "#f3f3f3",
                  borderRadius: 10,
                  marginRight: 20,
                }}
              >
                <IconSearch color="black" />
              </IconButton>

              <FormControl variant="outlined" style={{ width: "15rem" }}>
                <InputLabel id="document_type_id">Filtrar por</InputLabel>
                <Select
                  disabled={false}
                  labelId="document_type_id"
                  label={"Filtrar por"}
                >
                  {/* {optionsTypesDocument.map((res) => (
                  <MenuItem key={res.name} value={res.id}>
                    {res.name}
                  </MenuItem>
                ))} */}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="col-12 d-flex justify-content-between mt-4">
            <div className="d-flex align-items-center">
              <Typography>{`Hoy, ${date_real}`}</Typography>
              <IconButton
                style={{
                  backgroundColor: "#f3f3f3",
                  borderRadius: 10,
                  marginLeft: 20,
                  padding: "4px",
                }}
                onClick={() => handleChangeOpenModal()}
              >
                <ExpandMoreIcon color="black" />
              </IconButton>
            </div>

            <div
              style={{ minWidth: 200 }}
              className="d-flex justify-content-between"
            >
              <div>
                <IconButton
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#f3f3f3",
                    borderRadius: 10,
                    marginRight: 20,
                  }}
                  onClick={onBackHour}
                  disabled={currentHour === 0}
                >
                  <ArrowLeftHour />
                </IconButton>
              </div>
              <div className="d-flex align-items-center">
                {hourReservation.length > 0 &&
                  currentHour !== null &&
                  hourReservation[currentHour] &&
                  hourBar &&
                  format(
                    new Date(`2021-08-18T${hourReservation[currentHour]}`),
                    "hh:mm aaa"
                  )}
              </div>
              <div>
                <IconButton
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#f3f3f3",
                    borderRadius: 10,
                    marginLeft: 20,
                  }}
                  onClick={onNextHour}
                  disabled={currentHour === hourReservation.length - 1}
                >
                  <ArrowRightHour />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          {load ? (
            <Loading />
          ) : (
            <div className="col">
              {dataReservation &&
                dataReservation.map((item) => (
                  <UserCard deleteReservation={deleteReservation} data={item} />
                ))}
            </div>
          )}
        </div>
      </div>

      <CustomDatePicker
        date={date}
        handleChangeDate={handleChangeDate}
        handleChangeOpenModal={handleChangeOpenModal}
        isOpenDatePicker={isOpenDatePicker}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueIdDefaultProfile: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(Capacity);
