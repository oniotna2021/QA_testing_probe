import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

//UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

//COMPONENTS
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import DetailTrainingPlanByAfiliate from "components/Common/ManageDetailAfiliate/DetailTrainingPlanByAfiliate";

//ICONS
import { IconEyeView } from 'assets/icons/customize/config'

//UTILS
import { useStyles } from "utils/useStyles";

const CardItemTraining = ({
  isList,
  title_1,
  title_2,
  description,
  action,
  dataPlan = true,
  id_plan,
  isNutritionalPlan,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  let history = useHistory();
  let { id } = useParams();

  return (
    <div className={classes.cardList}>
      {isList ? (
        <div className="row d-flex align-items-center">
          <div className="col-md-4">
            <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>
              {title_1}
            </Typography>
          </div>
          <div className="col-md-2">
            <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>
              {title_2}
            </Typography>
          </div>
          <div className="col-md-2">
            <Typography style={{ fontWeight: "bold", fontSize: "14px" }}>
              {description}
            </Typography>
          </div>

          {action &&
            <div className="col-md-3 d-flex justify-content-end">
              {action}
            </div>
          }

          <div className="col-md-1">
            <IconButton
              onClick={() => {
                if (isNutritionalPlan) {
                  history.push(`/nutrition/${id}/${id_plan}`);
                } else {
                  setIsOpen(true);
                }
              }}
            >
              {<IconEyeView />}
            </IconButton>
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-between align-items-center">
          <div className={classes.boxItem}>
            <Typography>{title_1}</Typography>
            <Typography>{title_2}</Typography>
          </div>
          <Typography>{description}</Typography>
          <IconButton
            onClick={() => {
              if (isNutritionalPlan) {
                history.push(`/nutrition/${id}/${id_plan}`);
              } else {
                setIsOpen(true);
              }
            }}
          >
            {<ArrowForwardIosIcon />}
          </IconButton>
        </div>
      )}
      <ShardComponentModal
        body={
          <DetailTrainingPlanByAfiliate
            dataPlan={dataPlan}
            setIsOpen={setIsOpen}
            isDetailAffiliate={false}
          />
        }
        isOpen={isOpen}
      />
    </div>
  );
};

export default CardItemTraining;
