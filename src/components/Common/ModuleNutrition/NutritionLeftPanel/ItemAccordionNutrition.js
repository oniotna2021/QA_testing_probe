import React from "react";
import { useTranslation } from "react-i18next";
//UI
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//UTILS
import { useStyles } from "utils/useStyles";

const ItemAccordionNutrition = ({ data }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{data?.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div classes="d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center">
              <Typography style={{ width: 100 }} className={classes.fontGray}>
                {t("ListNutritionGoals.NutritionGoal")}
              </Typography>
              <Typography style={{ width: 200 }} variant="body2">
                {data?.goal[0]?.name || data?.goal}
              </Typography>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Typography style={{ width: 100 }} className={classes.fontGray}>
                {t("FormRecipe.SelectFeedingType")}
              </Typography>
              <Typography style={{ width: 200 }} variant="body2">
                {data?.type_alimentation[0]?.name || data?.type_alimentation}
              </Typography>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
export default ItemAccordionNutrition;
