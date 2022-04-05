import React, { useMemo, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

// ui
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Loading from "components/Shared/Loading/Loading";

// services
import { startQuote } from "services/MedicalSoftware/Quotes";
import { deleteAppointment } from "services/MedicalSoftware/Appointments";

// translate
import { useTranslation } from "react-i18next";

// utils
import { useStyles } from "utils/useStyles";
import {
  capitalize,
  mapErrors,
  errorToast,
  infoToast,
  successToast,
} from "utils/misc";

const FormDetailQuote = ({
  setIsOpen,
  detailQuote = {},
  quote,
  setReload = false,
  setIsReasing,
  userId,
  shouldInitQuote,
  isViewUserTowerControl = false,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [loadingCancelButton, setLoadingCancelButton] = useState(false);

  const checkStatus = useMemo(() => {
    if (Object.keys(detailQuote).length > 0) {
      let isActive = detailQuote?.is_active;
      let isStarted = detailQuote?.is_started;
      let isFinished = detailQuote?.is_finished;

      return isFinished
        ? "Finalizada"
        : isStarted
          ? "En Ejecución"
          : isActive
            ? "Activa"
            : "Desactivada";
    }

    return "----";
  }, [detailQuote]);

  const handleClickInitQuote = () => {
    if (!quote?.phoneNumberUser) {
      enqueueSnackbar("No hay número de teléfono registrado", infoToast);
      return;
    }

    setLoading(true);
    let data = {
      medical_professional_id: userId,
      quote_id: quote.idQuote,
    };
    startQuote(data)
      .then(({ data }) => {
        if (data && data.status === "success") {
          history.push(
            `/detail-virtual-afiliate/${quote.userId}/${quote.idQuote}/${detailQuote.type_quote}`
          );
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

  const handleClickCancelQuote = () => {
    setLoadingCancelButton(true);
    deleteAppointment(quote.idQuote).then(({ data }) => {
      if (data && data.status === "success") {
        enqueueSnackbar("Cita cancelada correctamente", successToast);
        setIsOpen((prev) => (prev = false));
        setReload((prev) => (prev = true));
      } else {
        enqueueSnackbar(mapErrors(data), errorToast);
      }
    }).catch((err) => {
      console.log(err)
    }).finally(() => {
      setLoadingCancelButton(false);
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Typography variant="h6">
            {t("FormDeleteApointment.Appointmentinformation")}
          </Typography>
        </div>
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className="row my-1">
        <div className="col-6 d-flex justify-items-center">
          <Typography
            className={classes.textTitleItemsDetailTask}
            variant="body2"
          >
            {t("FormDeleteApointment.Patient")}
          </Typography>
        </div>
        <div className="col-6 d-flex align-items-center">
          <Typography variant="body2">
            {detailQuote?.client_first_name}{" "}
            {detailQuote?.client_last_name.split(" ")[0]}
          </Typography>
        </div>
      </div>

      <div className="row my-1">
        <div className="col-6 d-flex justify-items-center">
          <Typography
            className={classes.textTitleItemsDetailTask}
            variant="body2"
          >
            {t("VirtualAfiliateList.DocumentNumber")}
          </Typography>
        </div>
        <div className="col-6 d-flex align-items-center">
          <Typography variant="body2">
            {detailQuote?.["number-document"]}
          </Typography>
        </div>
      </div>

      <div className="row my-1">
        <div className="col-6 d-flex justify-items-center">
          <Typography
            className={classes.textTitleItemsDetailTask}
            variant="body2"
          >
            {t("ListProfessional.CellNumber")}
          </Typography>
        </div>
        <div className="col-6 d-flex align-items-center">
          <Typography variant="body2">{quote?.phoneNumberUser}</Typography>
        </div>
      </div>

      <div className={`d-flex flex-column mt-4 ${classes.containerDetailTask}`}>
        <div className="row my-1">
          <div className="col-6 d-flex justify-items-center">
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              {t("FormDetailQuote.LabelMedic")}
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body2">
              {detailQuote?.medical_professional_first_name}{" "}
              {detailQuote?.medical_professional_last_name}
            </Typography>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-6 d-flex justify-items-center">
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              {t("FormAppointmentByMedical.TypeVenue")}
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body2">
              {detailQuote?.type_quote_name}
            </Typography>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-6 d-flex justify-items-center">
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              {t("MedicalSuggestions.StatusQuote")}
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body2">{checkStatus}</Typography>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-6 d-flex justify-items-center">
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              {t("DetailClinicHistory.LastDate")}
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body2" color="textPrimary">
              <b>
                {capitalize(
                  format(addDays(new Date(detailQuote?.date), 1), "iiii", {
                    locale: es,
                  })
                )}
              </b>{" "}
              {format(addDays(new Date(detailQuote?.date), 1), "PPP", {
                locale: es,
              })}
            </Typography>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-6 d-flex justify-items-center">
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              {t("NutritionPlan.FormNutrition.InputHour")}
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body2" color="textPrimary">
              {format(new Date(`2021-08-18T${detailQuote.hour}`), "p")}
            </Typography>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-between">
        {isViewUserTowerControl && (
          <div className="row m-0">
            <div className="col-6 ps-0">
              <Button
                onClick={() => handleClickCancelQuote()}
                fullWidth
                className={classes.buttonBlock}
                style={{
                  fontWeight: "700",
                  backgroundColor: detailQuote?.is_finished
                    ? "#afafaf"
                    : "#4DA09C",
                  color: "#ffffff",
                  borderRadius: 10,
                  height: 43,
                }}
                disabled={detailQuote?.is_finished ? true : false}
              >{loadingCancelButton ?
                <Loading />
                : 'Cancelar cita'}
              </Button>
            </div>
            <div className="col-6 pe-0">
              <Button
                onClick={() => setIsReasing(true)}
                fullWidth
                className={classes.buttonBlock}
                style={{
                  fontWeight: "700",
                  backgroundColor: detailQuote?.is_finished
                    ? "#afafaf"
                    : "#4DA09C",
                  color: "#ffffff",
                  borderRadius: 10,
                  height: 43,
                }}
                disabled={detailQuote?.is_finished ? true : false}
              >
                {t("FormDetailQuote.RescheduleAppoinment")}
              </Button>
            </div>
          </div>
        )}
        {!isViewUserTowerControl && (
          <Button
            onClick={() => setIsReasing(true)}
            fullWidth
            className={classes.buttonBlock}
            style={{
              fontWeight: "700",
              backgroundColor: detailQuote?.is_finished ? "#afafaf" : "#4DA09C",
              color: "#ffffff",
              borderRadius: 10,
              height: 43,
            }}
            disabled={detailQuote?.is_finished ? true : false}
          >
            {t("FormDetailQuote.RescheduleAppoinment")}
          </Button>
        )}

        {shouldInitQuote && (
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
            onClick={handleClickInitQuote}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={30} color="secondary" />
            ) : (
              "Iniciar cita"
            )}
          </Button>
        )}
      </div>
      {!isViewUserTowerControl &&
        <div className="my-2">
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
            onClick={() => handleClickCancelQuote()}
            disabled={loading}
          >
            {loadingCancelButton ?
              <Loading />
              : 'Cancelar cita'}
          </Button>
        </div>}
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userId: auth.userId,
});

export default connect(mapStateToProps)(FormDetailQuote);
