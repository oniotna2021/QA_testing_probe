import React from "react";
import { SortableElement } from "react-sortable-hoc";
import ListItem from "@material-ui/core/ListItem";

import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";

const SortableItem = SortableElement(
  ({
    item,
    expanded,
    setExpanded,
    FormComponent,
    permissionsActions,
    ...restProps
  }) => (
    <ListItem ContainerComponent="div">
      <CommonComponentAccordion
        expanded={expanded}
        setExpanded={setExpanded}
        data={item}
        form={
          <FormComponent
            setExpanded={setExpanded}
            defaultValue={item}
            permissionsActions={permissionsActions}
            {...restProps}
          />
        }
        isDraggable={true}
      />
    </ListItem>
  )
);

export default SortableItem;
