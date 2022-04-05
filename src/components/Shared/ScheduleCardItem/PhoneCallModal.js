import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

// UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Skeleton from "@material-ui/lab/Skeleton";

//service
import {
  getHistoryByQuoteAffiliate,
  postCallQuoteAffiliate,
} from "services/affiliates";

// components
import ButtonSave from "../ButtonSave/ButtonSave";

// utils
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  mapErrors,
  checkVariable,
  capitalize,
  successToast,
} from "utils/misc";

const PhoneCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  box-shadow: 0px 0px 6px 0px #cbc7c7;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const PhoneCallModal = ({ setIsOpen, idQuote, setOptionSelection }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [fetchReload, setFetchReload] = useState(true);
  const [detailQuote, setDetailQuote] = useState({});

  useEffect(() => {
    if (idQuote && fetchReload) {
      getHistoryByQuoteAffiliate(idQuote)
        .then(({ data }) => {
          if (data.data) {
            setDetailQuote(data.data);
          } else {
            setDetailQuote({});
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setFetchReload(false);
        });
    }
  }, [idQuote, enqueueSnackbar, fetchReload]);

  const handleClickCallQuote = () => {
    postCallQuoteAffiliate({ quote_id: idQuote })
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar("Llamada iniciada", successToast);
          // history.push(
          //   `/detail-virtual-afiliate/${detailQuote.user_id}/${idQuote}/${detailQuote.type_quote}`
          // );
          // setOptionSelection(1);
          // setIsOpen(false);
        } else {
          enqueueSnackbar("La llamada no pudo ser iniciada", errorToast);
          setFetchReload(true);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setFetchReload(true);
      });
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        {
          <Typography variant="h5">
            {detailQuote?.user_name && capitalize(detailQuote?.user_name)}
          </Typography>
        }
        <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
      </div>

      {Object.keys(detailQuote).length > 0 ? (
        <>
          <Typography>{detailQuote?.type_quote_name.trim()}</Typography>

          <div
            className="mt-4 mb-3"
            style={{
              backgroundColor: "#F3F3F3",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Typography className={`${classes.textTitleItemsDetailTask} mb-2`}>
              Último registro
            </Typography>
            <div className="row">
              <div className="row">
                <div className="col">
                  <Typography
                    variant="body2"
                    className={classes.textTitleItemsDetailTask}
                  >
                    Duración
                  </Typography>
                </div>

                <div className="col">
                  {checkVariable(detailQuote?.last_record?.duration)}
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <Typography
                    className={classes.textTitleItemsDetailTask}
                    variant="body2"
                  >
                    Fecha
                  </Typography>
                </div>

                <div className="col">
                  <Typography variant="body2">
                    <b>
                      {detailQuote?.last_record?.date
                        ? capitalize(
                          format(
                            addDays(
                              new Date(detailQuote?.last_record?.date),
                              1
                            ),
                            "eeee",
                            {
                              locale: es,
                            }
                          )
                        )
                        : null}
                    </b>{" "}
                    {detailQuote?.last_record?.date
                      ? format(
                        addDays(new Date(detailQuote?.last_record?.date), 1),
                        "PPP",
                        {
                          locale: es,
                        }
                      )
                      : "----"}
                  </Typography>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <Typography
                    className={classes.textTitleItemsDetailTask}
                    variant="body2"
                  >
                    Hora
                  </Typography>
                </div>

                <div className="col">
                  {checkVariable(detailQuote?.last_record?.hour)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {detailQuote.history.length > 0 ? (
              detailQuote.history.map((item, idx) => (
                <PhoneCard key={idx}>
                  <div className="d-flex align-items-center">
                    <div
                      className="me-5"
                      style={{
                        borderRight: "solid 1px #CECECE",
                        paddingRight: 30,
                        paddingLeft: 30,
                      }}
                    >
                      <Typography align="center">
                        <b>
                          {item.date
                            ? format(addDays(new Date(item.date), 1), "dd", {
                              locale: es,
                            })
                            : "----"}
                        </b>
                      </Typography>
                      <Typography
                        className={classes.textUppercase}
                        align="center"
                      >
                        {item.date
                          ? format(addDays(new Date(item.date), 1), "MMM", {
                            locale: es,
                          })
                          : "----"}
                      </Typography>
                    </div>
                    <Typography>
                      <b>{item.duration} </b>
                    </Typography>
                  </div>

                  <div
                    style={{
                      padding: "10px 20px 10px 20px",
                      minWidth: 110,
                      backgroundColor:
                        item.status === "exitosa" ? "#B3D6D4" : "#F7C3C3",
                      borderRadius: 10,
                      marginRight: 20,
                      textAlign: "center",
                    }}
                  >
                    <b>{capitalize(item.status)}</b>
                  </div>
                </PhoneCard>
              ))
            ) : (
              <div className="mt-4" style={{ textAlign: "center" }}>
                <Typography>
                  <b>No hay historial de llamadas</b>
                </Typography>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between mt-5 container row">
            <Button
              className={classes.buttonBack}
              onClick={() => setIsOpen(false)}
            >
              {t("Btn.Back")}
            </Button>
            <ButtonSave
              disabled={["finished", "fallido", "canceled", "exitosa"].some(
                (p) => p === detailQuote.status_quote
              )}
              text="Llamar"
              onClick={handleClickCallQuote}
            />
          </div>
        </>
      ) : (
        <div className="mt-4">
          <Skeleton animation="wave" width="100%" height={100} />
          <Skeleton animation="wave" width="100%" height={100} />
          <Skeleton animation="wave" width="100%" height={100} />
        </div>
      )}
    </div>
  );
};

export default PhoneCallModal;
