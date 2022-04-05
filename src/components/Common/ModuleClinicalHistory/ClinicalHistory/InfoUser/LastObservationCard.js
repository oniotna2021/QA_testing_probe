import React from "react";
import { useTranslation } from "react-i18next";

//UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

//utils
import { regexHTML, formatNameDate } from "utils/misc";
import { addDays } from "date-fns";

const LastObservationCard = ({ lastObservations }) => {
  const { t } = useTranslation();

  return (
    <div>
      <Card>
        <CardContent>
          <Typography>
            <b>{t("DetailClinicHistory.LastObservation")}</b>
          </Typography>
          <Typography style={{ fontSize: 12 }}>
            {lastObservations
              ? formatNameDate(addDays(new Date(lastObservations.date), 1))
              : t("Message.EmptyDataRecords")}
          </Typography>
          {regexHTML.test(lastObservations?.observation) ? (
            <div
              style={{
                width: "100%",
                height: "150px",
                overflowY: "scroll",
              }}
              dangerouslySetInnerHTML={{
                __html: lastObservations?.observation,
              }}
            ></div>
          ) : (
            <Typography>
              {lastObservations ? lastObservations.observation : ""}
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LastObservationCard;
