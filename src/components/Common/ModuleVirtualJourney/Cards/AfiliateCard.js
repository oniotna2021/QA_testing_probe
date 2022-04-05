import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

// UI
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

// icons
import {
  IconMedical,
  IconWeightlifting,
  IconRecipes,
} from "assets/icons/customize/config";

// styles
import styled from "@emotion/styled";
import { Avatar } from "@material-ui/core";

// translate
import { useTranslation } from "react-i18next";

const ButtonDetail = styled.div`
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  background-color: #cce4e3;
  cursor: pointer;
  margin: 0 10px;
`;

const AfiliateCard = ({
  user_name,
  next_appointment,
  brand_name,
  mycoach,
  nutrition,
  user_id,
  appointment_id,
  isFrom360,
  document_number,
  isFromDocumentSearch,
  first_name,
  last_name,
  userType,
}) => {
  const history = useHistory();
  const { t } = useTranslation();

  const isCoachRol = (userType === 29 && isFromDocumentSearch) || mycoach;
  const isNutritionRol = (userType === 30 && isFromDocumentSearch) || nutrition;

  return (
    <div>
      <Accordion className="mt-3" style={{ borderRadius: 10 }}>
        <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
          <div className="d-flex align-items-center" style={{ width: "100%" }}>
            <div className="d-flex align-items-center col-4">
              <Avatar />
              <Typography className="ms-3" variant="body2">
                <b>
                  {isFromDocumentSearch
                    ? `${first_name} ${last_name}`
                    : user_name}
                </b>
              </Typography>
            </div>

            <div className="d-flex col-4">
              <Typography variant="body2" className="me-2">
                {brand_name}
              </Typography>
              {mycoach && nutrition ? (
                <Typography variant="body2">
                  {t("AfiliateCards.VirtualJourney")}
                </Typography>
              ) : mycoach ? (
                <Typography variant="body2">
                  {t("AfiliateCards.VirtualJourney")}
                </Typography>
              ) : nutrition ? (
                <Typography variant="body2">
                  {t("AfiliateCards.VirtualJourneyCoachNutrition")}
                </Typography>
              ) : null}
            </div>

            <div className="col-4">
              <Typography variant="body2">
                <b>{next_appointment}</b>
              </Typography>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div
            className="d-flex justify-content-center"
            style={{ width: "100%" }}
          >
            <ButtonDetail
              onClick={() =>
                history.push(
                  `/detail-virtual-afiliate/${user_id}/${appointment_id}${
                    isFrom360 ? "/0" : ""
                  }`
                )
              }
            >
              <IconMedical color="black" />
              <Typography className="ms-3">
                <b>{t("AfiliateCards.VirtualJourney360")}</b>
              </Typography>
            </ButtonDetail>

            {isNutritionRol && (
              <ButtonDetail
                onClick={() => {
                  history.push(`nutrition/${user_id}`);
                }}
              >
                <IconRecipes color="black" />
                <Typography className="ms-3">
                  <b>{t("AfiliateCards.VirtualJourneyNutritionPlan")}</b>
                </Typography>
              </ButtonDetail>
            )}

            {isCoachRol && (
              <ButtonDetail
                onClick={() =>
                  history.push(
                    `/create-plan-training-for-afiliate/${document_number}`
                  )
                }
              >
                <IconWeightlifting color="black" width="20" height="20" />
                <Typography className="ms-3">
                  <b>{t("AfiliateCards.VirtualJourneyTrainingPlan")}</b>
                </Typography>
              </ButtonDetail>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(AfiliateCard);
