import React from "react";

import SortableListContainer from "components/Shared/SortableList/SortableListContainer";

import { reorderList } from "utils/misc";

const SortableList = ({
  listItems,
  setListItems,
  funcToOrder,
  permissionsActions,
  ...restProps
}) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const itemsReorder = reorderList(listItems, oldIndex, newIndex);

    const mapOrderItems = itemsReorder.map((i, index) => ({
      id: i.id,
      order: index,
    }));

    setListItems(itemsReorder);
    funcToOrder({ items: mapOrderItems });
  };

  return (
    <SortableListContainer
      items={listItems}
      onSortEnd={onSortEnd}
      useDragHandle={true}
      distance={20}
      disableAutoscroll={true}
      permissionsActions={permissionsActions}
      {...restProps}
    />
  );
};

export default SortableList;
