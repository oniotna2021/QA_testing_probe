import React from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Tooltip from "@material-ui/core/Tooltip";

//utils
import { useStyles } from "utils/useStyles";
import { formatNameDate } from "utils/misc";

const ReasonMedicalInfo = ({ fieldsReason }) => {
  
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className="mb-3">
      <Accordion>
        <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
          <Typography>
            <b>{t("DetailClinicHistory.ReasonToConsult")}</b>
            <Typography style={{ fontSize: 12 }}>
              {fieldsReason?.created_at
                ? formatNameDate(fieldsReason?.created_at)
                : t("Message.EmptyDataRecords")}
            </Typography>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="row">
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 120 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.Modality")}
              </Typography>
              <Typography noWrap style={{ width: 150, marginLeft: 50, fontSize: 14 }}>
                {fieldsReason?.modality_name || "-"}
              </Typography>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 140 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.CustomerService")}
              </Typography>
              <Tooltip
                title={fieldsReason?.attention_service_name || "-"}
                arrow
              >
                <Typography noWrap style={{ width: 170, marginLeft: 30, fontSize: 14 }}>
                  {fieldsReason?.attention_service_name || "-"}
                </Typography>
              </Tooltip>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 120 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.PlaceOfCare")}
              </Typography>
              <Typography noWrap style={{ width: 170, marginLeft: 50, fontSize: 14 }}>
                {fieldsReason?.attention_place_name || "-"}
              </Typography>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 120 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.FrontDoor")}
              </Typography>
              <Tooltip title={fieldsReason?.input_door_name || "-"} arrow>
                <Typography noWrap style={{ width: 170, marginLeft: 50, fontSize: 14 }}>
                  {fieldsReason?.input_door_name || "-"}
                </Typography>
              </Tooltip>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 120 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.Cause")}
              </Typography>
              <Tooltip title={fieldsReason?.cause_name || "-"} arrow>
                <Typography noWrap style={{ width: 170, marginLeft: 50, fontSize: 14 }}>
                  {fieldsReason?.cause_name || "-"}
                </Typography>
              </Tooltip>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 120 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.TypeOfCause")}
              </Typography>
              <Tooltip title={fieldsReason?.type_of_query_name || "-"} arrow>
                <Typography noWrap style={{ width: 170, marginLeft: 50, fontSize: 14 }}>
                  {fieldsReason?.type_of_query_name || "-"}
                </Typography>
              </Tooltip>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 120 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.BodytechTarget")}
              </Typography>
              <Tooltip
                title={fieldsReason?.bodytech_objective_name || "-"}
                arrow
              >
                <Typography noWrap style={{ width: 170, marginLeft: 50, fontSize: 14 }}>
                  {fieldsReason?.bodytech_objective_name || "-"}
                </Typography>
              </Tooltip>
            </div>
            <div className="d-flex justify-content-start align-items-center">
              <Typography style={{ width: 120 }} className={classes.fontSlug}>
                {t("DetailClinicHistory.ReasonToConsult")}
              </Typography>
              <Tooltip title={fieldsReason?.reason_of_query || "-"} arrow>
                <Typography noWrap style={{ width: 170, marginLeft: 50, fontSize: 14 }}>
                  {fieldsReason?.reason_of_query || "-"}
                </Typography>
              </Tooltip>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ReasonMedicalInfo;
