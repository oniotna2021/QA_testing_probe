import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

//internal dependecies
import { tConv24, mapErrors, errorToast } from "utils/misc";
import { useStyles } from "utils/useStyles";

//SERVICES
import { startQuote } from "services/MedicalSoftware/Quotes";

//ICONS
import { IconArrowRight } from "assets/icons/customize/config";
import Loading from "../Loading/Loading";

const ListAppointments = ({ data, userId, loader }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedDate, handleDateChange] = useState(new Date());
  let currentDate = new Date();

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

  return (
    <div>
      {loader ? (
        <Loading />
      ) : (
        <>
          {data &&
            data.slice(0, 4).map((quote) => (
              <div
                style={{
                  borderRadius: 15,
                  height: 56,
                  background: "white",
                  marginRight: 30,
                  padding: 10,
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    background: "#4959A2",
                    width: 56,
                    color: "white",
                    borderRadius: 10,
                    height: "100%",
                    textAlign: "center",
                  }}
                >
                  <Typography style={{ paddingTop: 5 }}>
                    {tConv24(quote?.hour)}
                  </Typography>
                </div>
                <div className="d-flex align-items-center justify-content-between col-10">
                  <div className="d-flex align-items-center">
                    <Avatar style={{ marginLeft: 10 }} />
                    <Typography style={{ marginLeft: 10 }}>
                      {`${quote?.user?.first_name} ${quote?.user?.last_name}`}
                    </Typography>
                  </div>
                  {quote.is_finished === 0 &&
                  selectedDate.getDate() === currentDate.getDate() ? (
                    <Button
                      className={classes.buttonQuote}
                      onClick={() => onInitHistory(quote)}
                      endIcon={<IconArrowRight style={{ fontSize: 15 }} />}
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
                          {selectedDate.getDate() > currentDate.getDate()
                            ? "No disponible"
                            : "Finalizado"}
                        </Typography>
                      </div>
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default ListAppointments;
