import React from "react";
import { useHistory, useParams } from "react-router-dom";

//UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

//ICONS
import { IconArrowRight } from "assets/icons/customize/config";

//UTILS
import { useStyles } from "utils/useStyles";

const ItemListUserNutritionHistory = ({
  start_date,
  end_date,
  nutritionPlanId,
  nutritionPlanName
}) => {
  const classes = useStyles();
  let history = useHistory();
  let { id } = useParams();
  return (
    <div className={classes.itemNutritionUser}>
      <div className={classes.boxDate}>
        <Typography style={{ fontSize: 9, color: "" }}>
          Inicio del plan
        </Typography>
        <Typography style={{ fontSize: 12, color: "" }}>{start_date}</Typography>
        <Typography style={{ fontSize: 9, color: "" }}>Fin del plan</Typography>
        <Typography style={{ fontSize: 12, color: "" }}>{end_date}</Typography>
      </div>
      <div className="d-flex justify-content-between align-items-center ms-5" style={{ width: '100%' }}>
        <Typography>{nutritionPlanName}</Typography>
        <IconButton onClick={()=>history.push(`/nutrition/${id}/${nutritionPlanId}`)}>
          <IconArrowRight />
        </IconButton>
      </div>
    </div>
  );
};

export default ItemListUserNutritionHistory;
