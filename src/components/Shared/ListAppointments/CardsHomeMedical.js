import React from "react";
import { useTranslation } from "react-i18next";

//ICONS
import {
  IconDailyAppointments,
  IconMonthlyAppointments,
  IconClosedAppointments,
  IconArrowRight,
} from "assets/icons/customize/config";

//UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

const CardsHomeMedical = ({ dataQuotes, quoteForMonth }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="col-8 p-0 d-flex justify-content-between">
        <div
          style={{
            width: "100%",
            height: 170,
            background: "white",
            borderRadius: 20,
            marginRight: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <IconDailyAppointments />
          <Typography variant="h3">
            {dataQuotes && dataQuotes?.length}
          </Typography>
          <Typography variant="body1" style={{ textAlign: "center" }}>
            {t("DetailAfiliate.Quotes")}
            <span style={{ display: "block", textAlign: "center" }}>
              {t("HomeMedical.Daily")}
            </span>
          </Typography>
        </div>
        <div
          style={{
            width: "100%",
            height: 170,
            background: "white",
            borderRadius: 20,
            marginRight: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <IconMonthlyAppointments />
          <Typography variant="h3">
            {quoteForMonth ? quoteForMonth : 0}
          </Typography>
          <Typography variant="body1" style={{ textAlign: "center" }}>
            {t("DetailAfiliate.Quotes")}
            <span style={{ display: "block", textAlign: "center" }}>mes</span>
          </Typography>
        </div>
        <div
          style={{
            width: "100%",
            height: 170,
            background: "white",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginRight: 30,
          }}
        >
          <IconClosedAppointments />
          <Typography variant="h3"> - </Typography>
          <Typography
            variant="body1"
            display="block"
            style={{ textAlign: "center" }}
          >
            {t("DetailAfiliate.Quotes")}
            <span style={{ display: "block", textAlign: "center" }}>
              {t("HomeMedical.Closed")}
            </span>
          </Typography>
        </div>
      </div>
      <div className="col-4 p-0">
        <div
          style={{
            width: "100%",
            height: 170,
            background: "white",
            borderRadius: 20,
            padding: 20,
          }}
        >
          <Typography variant="h6">
            {t("DetailAfiliate.Quotes")} abiertas
          </Typography>
          <Typography variant="body2">
            {t("HomeMedical.Recordatory")}
          </Typography>
          {/* <div
            style={{
              background: "#F3F3F3",
              borderRadius: 10,
              height: 48,
              marginTop: 20,
              padding: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>Quinito Mendez</Typography>
            <IconButton>
              <IconArrowRight />
            </IconButton>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default CardsHomeMedical;
