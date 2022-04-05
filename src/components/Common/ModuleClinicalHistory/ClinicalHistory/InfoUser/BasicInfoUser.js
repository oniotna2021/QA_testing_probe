import React from "react";

//hooks
import useSearchUserById from "hooks/useSearchUserById";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";

//UI
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

//icons
import { IconProfile } from "assets/icons/customize/config";

//utils
import { useStyles } from "utils/useStyles";

const BasicInfoUser = ({ user_id }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [userInfo] = useSearchUserById(user_id);
  const classes = useStyles();

  //CALC AGE USER
  let currentDate = new Date();
  let formatBirth = new Date(userInfo?.birthdate);
  let age = Math.floor(
    (currentDate - formatBirth) / (1000 * 60 * 60 * 24) / 365
  );

  return (
    <div>
      <div className="mb-3">
        <Accordion expanded={true}>
          <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
            <IconProfile color={theme.palette.black.main} />
            <Typography className="ms-3">
              <b>{t("DetailClinicHistory.Identification")}</b>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="row">
              <div className="d-flex justify-content-start align-items-center">
                <Typography style={{ width: 40 }} className={classes.fontSlug}>
                  {t("DetailClinicHistory.Name")}
                </Typography>
                <Typography style={{ width: 130, marginLeft: 130, fontSize: 14 }}>
                  {userInfo?.first_name ? userInfo?.first_name : "-"}
                </Typography>
              </div>
              <div className="d-flex justify-content-start align-items-center">
                <Typography style={{ width: 40 }} className={classes.fontSlug}>
                  {t("DetailAfiliate.LabelLastName")}
                </Typography>
                <Typography style={{ width: 130, marginLeft: 130, fontSize: 14 }}>
                  {userInfo?.last_name ? userInfo?.last_name : "-"}
                </Typography>
              </div>
              <div className="d-flex justify-content-start align-items-center">
                <Typography style={{ width: 40 }} className={classes.fontSlug}>
                  {t("FormProfessional.InputDocumentNumber")}
                </Typography>
                <Typography style={{ width: 130, marginLeft: 130, fontSize: 14 }}>
                  {userInfo?.document_number ? userInfo?.document_number : "-"}
                </Typography>
              </div>
              <div className="d-flex justify-content-start align-items-center">
                <Typography style={{ width: 120 }} className={classes.fontSlug}>
                  {t("DetailClinicHistory.DateBorn")}
                </Typography>
                <Typography style={{ width: 130, marginLeft: 50, fontSize: 14 }}>
                  {userInfo?.birthdate ? userInfo?.birthdate : "-"}
                </Typography>
              </div>
              <div className="d-flex justify-content-start align-items-center">
                <Typography style={{ width: 40 }} className={classes.fontSlug}>
                  {t("DetailClinicHistory.Phone")}
                </Typography>
                <Typography style={{ width: 130, marginLeft: 130, fontSize: 14 }}>
                  {userInfo?.mobile_phone ? userInfo?.mobile_phone : "-"}
                </Typography>
              </div>
              <div className="d-flex justify-content-start align-items-center">
                <Typography style={{ width: 41 }} className={classes.fontSlug}>
                  {t("DetailClinicHistory.Email")}
                </Typography>
                <Tooltip title={userInfo?.email ? userInfo?.email : "-"} placement='bottom' arrow>
                  <Typography
                    noWrap
                    style={{ width: 160, marginLeft: 130, fontSize: 14 }}
                  >
                    {userInfo?.email}
                  </Typography>
                </Tooltip>
              </div>
              <div className="d-flex justify-content-start align-items-center">
                <Typography style={{ width: 40 }} className={classes.fontSlug}>
                  {t("MedicalSuggestions.TitleAge")}
                </Typography>
                <Typography style={{ width: 130, marginLeft: 130, fontSize: 14 }}>
                  {`${age} años`}
                </Typography>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default BasicInfoUser;
