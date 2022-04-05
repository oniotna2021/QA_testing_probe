import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  labelSchedule: {
    fontWeight: "bold",
    textAlign: "center",
  },
  alignSchedule: {
    textAlign: "center",
  },
}));

const ItemsSchedule = ({ scheduleData }) => {
  const classes = useStyles();

  return (
    scheduleData &&
    scheduleData.map((schedule, index) => (
      <div key={index} className="text-center">
        <Typography className={classes.labelSchedule} variant="body2">
          {schedule.name}
        </Typography>
        <Typography className={classes.alignSchedule} variant="body2">
          {schedule.start_time}
        </Typography>
        <Typography className={classes.alignSchedule} variant="body2">
          {schedule.end_time}
        </Typography>
      </div>
    ))
  );
};

export default ItemsSchedule;
