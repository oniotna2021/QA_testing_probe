import React from "react";

// UI
import { Card, Typography } from "@material-ui/core";
import { addDays } from "date-fns";

// icons
import { IconPlan } from "assets/icons/customize/config";
import Loading from "../Loading/Loading";

// translate
import { useTranslation } from "react-i18next";

const PlansInfoCard = ({ afiliatePlans, loadingPlans }) => {
  const { t } = useTranslation();
  const formatNameDate = (value) => {
    const date = addDays(new Date(value), 1);
    return date.toLocaleString("default", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="my-3">
      <div className="row p-3 m-0">
        <div className="d-flex align-items-center">
          <IconPlan color="#007771" />
          <Typography variant="h6" className="ms-2">
            {t("PlansInfoCard.TitlePlans")}
          </Typography>
        </div>
        {loadingPlans ? <Loading /> :
          afiliatePlans &&
          afiliatePlans.map((plan) => (
            <div className="row m-0 mt-3">
              <div className="col-4 p-0">
                <Typography>
                  {t("VirtualAfiliateDetail.VirtualJourneyPlan")}
                </Typography>
                <Typography>{t("PlansInfoCard.BeginPlans")}</Typography>
                <Typography>{t("PlansInfoCard.PlanActive")}</Typography>
                <Typography>{t("PlansInfoCard.DaysExpire")}</Typography>
                <Typography>Coach</Typography>
              </div>
              <div className="col-8 p-0 ps-4">
                <Typography>{plan?.type}</Typography>
                <Typography>{formatNameDate(plan?.start_date)}</Typography>
                <Typography>{plan?.status === 1 ? "Sí" : "No"}</Typography>
                <Typography>{plan?.days_to_expiration}</Typography>
                <Typography className="mt-4">{plan.coach_carterization ? plan.coach_carterization : "Sin asignar"}</Typography>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default PlansInfoCard;
