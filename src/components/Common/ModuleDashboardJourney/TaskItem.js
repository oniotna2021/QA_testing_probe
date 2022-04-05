import React from "react";
import { useStyles } from "utils/useStyles";

// UI
import Typography from "@material-ui/core/Typography";
import {
  IconDragAndDrop,
  IconCheckCircle,
} from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";

// Utils
import { returnColorPriority } from "utils/misc";

import { SortableHandle } from "react-sortable-hoc";

const DragHandle = SortableHandle(() => (
  <IconButton style={{ cursor: "move", hover: "none" }} className="p-2">
    <IconDragAndDrop width="15" height="20" color="#CECECE" />
  </IconButton>
));

const TaskItem = ({ item, handleClickTask, handleClickTaskToFinished }) => {
  const classes = useStyles();

  return (
    <div
      className={`d-flex justify-content-between ${classes.taskItem} mb-2`}
      onClick={() => {
        handleClickTask(item.uuid);
      }}
      style={{ padding: "12px 16px", minHeight: 72 }}
    >
      <div className="d-flex align-items-center my-1">
        <div className="me-2">
          <DragHandle />
        </div>

        <Typography variant="p" style={{ userSelect: "none" }}>
          {item?.name}
        </Typography>
      </div>

      <div className="d-flex flex-column justify-content-between align-items-center">
        <div
          className={`${classes.dotTaskItemStatus} my-1`}
          style={{
            backgroundColor: returnColorPriority(item?.priority),
          }}
        ></div>

        <div className="d-flex justify-content-end align-items-center">
          {item.task_steps.name === "Terminado" ? (
            <IconCheckCircle />
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleClickTaskToFinished(item, "finish");
              }}
              className={classes.circleCheck}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
