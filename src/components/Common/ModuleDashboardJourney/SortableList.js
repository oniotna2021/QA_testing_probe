import React from "react";
import Box from "@material-ui/core/Box";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import TaskItem from "./TaskItem";

const SortableItem = SortableElement(
  ({ item, handleClickTask, handleClickTaskToFinished, area }) => (
    <TaskItem
      handleClickTask={handleClickTask}
      handleClickTaskToFinished={handleClickTaskToFinished}
      number={item}
      item={item}
    />
  )
);

const SortableList = SortableContainer(
  ({ handleClickTaskToFinished, handleClickTask, area, items, isDragging }) => (
    <Box display="flex" flexDirection="column" bgcolor="background.paper">
      {items &&
        items.length > 0 &&
        items.map((item, index) => (
          <SortableItem
            area={area}
            key={item.id}
            index={index}
            item={item}
            collection={area}
            isDragging={isDragging}
            handleClickTask={handleClickTask}
            handleClickTaskToFinished={handleClickTaskToFinished}
          />
        ))}
    </Box>
  )
);

export default SortableList;
