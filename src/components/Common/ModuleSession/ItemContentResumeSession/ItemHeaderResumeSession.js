import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Internal dependencies
import { formatNameDate, casteMapNameArrayForString } from "utils/misc";
import React from "react";

const ItemHeaderResumeSession = ({
  data,
  onDelete,
  isExercise,
  isDetailPlan,
  permissionsActions,
}) => {
  return (
    <div className="container">
      <div className="d-flex justify-content-around align-items-center">
        {isExercise ? (
          <React.Fragment>
            <Typography variant="body1" style={{ width: 10 }}>
              {data.id}
            </Typography>
            <Typography variant="body1" style={{ width: 150 }}>
              {data.name}
            </Typography>
            <Typography variant="body1">
              {Number(data.brand_videos) === 1
                ? "BODYTECH"
                : Number(data.brand_videos) === 2
                ? "ATHLETIC"
                : "BODYTECH - ATHLETIC"}
            </Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography variant="body1" style={{ width: 200 }}>
              {data.name}
            </Typography>
            <Typography variant="body1">
              {data.trainer_name ? (
                <React.Fragment>
                  <p className="textCreatedSession">
                    Creado por:
                    <br></br>
                    {data.trainer_name}
                  </p>
                </React.Fragment>
              ) : (
                "Bodytech"
              )}
            </Typography>
            <Typography>
              {Number(data.brand_videos) === 1
                ? "BODYTECH"
                : Number(data.brand_videos) === 2
                ? "ATHLETIC"
                : "BODYTECH - ATHLETIC"}
            </Typography>
            <Typography variant="body2">
              {data.created_at && formatNameDate(data.created_at)}
            </Typography>
            <Typography variant="body2" style={{ width: 150 }}>
              {casteMapNameArrayForString(data.training_levels)}
            </Typography>
            {isDetailPlan ? null : (
              <ActionWithPermission isValid={permissionsActions?.delete}>
                <IconButton onClick={onDelete}>
                  <CloseIcon />
                </IconButton>
              </ActionWithPermission>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default ItemHeaderResumeSession;
