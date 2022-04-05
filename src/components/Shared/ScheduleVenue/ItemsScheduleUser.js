import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";

import { formatToHHMM } from "utils/misc";

const useStyles = makeStyles((theme) => ({
  labelSchedule: {
    fontWeight: "bold",
    textAlign: "center",
  },
  alignSchedule: {
    textAlign: "center",
  },
  borderSchedule: {
    borderBottom: "1px solid #747474",
  },
}));

const daysWeek = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sáb", "Dom", "Fes"];

const ItemsSchedule = ({ scheduleData }) => {
  const classes = useStyles();

  return (
    scheduleData &&
    scheduleData.map((schedule, index) => (
      <div className={`d-flex flex-column`} key={index}>
        {schedule.map((item, indexS) => (
          <Box
            key={index}
            className={`text-center mb-3 ${
              schedule.length - 1 === indexS ? "s" : classes.borderSchedule
            } pb-3`}
          >
            {indexS === 0 && (
              <Typography className={classes.labelSchedule} variant="body2">
                {daysWeek[item.day_week_id - 1]}
              </Typography>
            )}

            <Typography className={classes.alignSchedule} variant="body2">
              {formatToHHMM(item.start_time)}
            </Typography>
            <Typography className={classes.alignSchedule} variant="body2">
              {formatToHHMM(item.end_time)}
            </Typography>
          </Box>
        ))}
      </div>
    ))
  );
};

export default ItemsSchedule;
