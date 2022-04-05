import React from "react";
import { SortableContainer } from "react-sortable-hoc";
import List from "@material-ui/core/List";

import SortableItem from "components/Shared/SortableList/SortableItem";

const SortableListContainer = SortableContainer(
  ({ items, permissionsActions, ...restProps }) => (
    <List component="div">
      {items.map((item, index) => (
        <SortableItem
          key={item.id}
          index={index}
          item={item}
          {...restProps}
          permissionsActions={permissionsActions}
        />
      ))}
    </List>
  )
);

export default SortableListContainer;
