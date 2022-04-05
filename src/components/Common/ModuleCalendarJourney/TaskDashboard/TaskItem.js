import React from "react";
import { useStyles } from "utils/useStyles";

// UI
import Typography from "@material-ui/core/Typography";
import TableCell from "@material-ui/core/TableCell";
import {
  IconDragAndDrop,
  IconCheckCircle,
} from "assets/icons/customize/config";

// Utils
import { returnColorPriority } from "utils/misc";

const TaskItem = ({ number, item, handleClickTask, handleChangeTaskStep }) => {
  const classes = useStyles();

  return (
    <>
      {item[number] ? (
        <TableCell
          style={{ border: "none", padding: "5px 10px", maxWidth: 90 }}
        >
          <div
            key={number}
            className={`d-flex flex-column ${classes.taskItem}`}
            onClick={() => handleClickTask(item[number].uuid)}
          >
            <div className="d-flex justify-content-end align-items-center">
              <div
                className={`${classes.dotTaskItemStatus} my-1`}
                style={{
                  backgroundColor: returnColorPriority(item[number].priority),
                }}
              ></div>
            </div>

            <div
              className="d-flex align-items-center my-1"
              style={{ maxWidth: 120 }}
            >
              {/* <div className="me-2">
                <IconDragAndDrop color="#CECECE" />
              </div> */}

              <Typography noWrap variant="p">
                {item[number].name}
              </Typography>
            </div>

            <div className="d-flex justify-content-end align-items-center">
              {item?.task_steps?.name === "Terminado" ? (
                <IconCheckCircle width={12} height={12} />
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeTaskStep(item[number], "finish");
                  }}
                  className={classes.circleCheck}
                ></div>
              )}
            </div>
          </div>
        </TableCell>
      ) : (
        <TableCell style={{ border: "none", padding: "5px 10px" }}>
          <div className={`d-flex flex-column ${classes.taskItemEmpty}`}></div>
        </TableCell>
      )}
    </>
  );
};

export default TaskItem;
