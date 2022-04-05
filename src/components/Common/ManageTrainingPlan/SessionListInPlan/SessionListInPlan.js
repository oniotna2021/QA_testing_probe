import React, { useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

//Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";

//UI
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

//Componenents
import { CommonComponentAccordion } from "components/Shared/Accordion/Accordion";
import ItemContentResumeSession from "components/Common/ModuleSession/ItemContentResumeSession/ItemContentResumeSession";

//internal dependencies
import {
  onDeleteSessionInSelection,
  onResetSessionInSelection,
  setEditingSessionInPlan,
} from "modules/trainingPlan";
import { setInitsForm } from "modules/sessions";
import { uuidv4, reorderList } from "utils/misc";
import { ConfigNameRoutes } from "router/constants";

const SortableItem = SortableElement(
  ({ item, expanded, setExpanded, FormComponent, onDelete, ...restProps }) => (
    <ListItem ContainerComponent="div">
      <CommonComponentAccordion
        expanded={expanded}
        setExpanded={setExpanded}
        data={item}
        isDetail={false}
        isSession={false}
        isDraggable={true}
        onDelete={onDelete}
        form={
          <FormComponent
            setExpanded={setExpanded}
            defaultValue={item}
            isDetailAffiliate={false}
            isNoTitle={true}
            {...restProps}
          />
        }
      />
    </ListItem>
  )
);

const SortableListContainer = SortableContainer(
  ({ items, handleEditSession, onDeleteSelection, ...restProps }) => (
    <List component="div">
      {items.map((item, index) => (
        <SortableItem
          key={`acordion-session-${item.uuid}-${index}`}
          index={index}
          item={item}
          infoResumeSession={item}
          setIsEdit={() => handleEditSession(item)}
          onDelete={() => onDeleteSelection(item)}
          {...restProps}
        />
      ))}
    </List>
  )
);

const SortableList = ({ listItems, setListItems, ...restProps }) => {
  const onSortEnd = ({ oldIndex, newIndex }) => {
    const itemsReorder = reorderList(listItems, oldIndex, newIndex);

    setListItems(itemsReorder);
  };

  return (
    <SortableListContainer
      items={listItems}
      onSortEnd={onSortEnd}
      useDragHandle={true}
      distance={20}
      disableAutoscroll={true}
      {...restProps}
    />
  );
};

const SessionListInPlan = ({
  dataSessionsSelection,
  onDeleteSessionInSelection,
  setEditingSessionInPlan,
  onResetSessionInSelection,
}) => {
  const [expanded, setExpanded] = useState(false);
  const history = useHistory();

  const onDeleteSelection = (value) => {
    onDeleteSessionInSelection(value);
  };

  const handleEditSession = (item) => {
    setEditingSessionInPlan(true);
    history.push(
      ConfigNameRoutes.updateSessionRoute +
        item.uuid +
        "?token=" +
        uuidv4() +
        "&from=/create-plan-training" +
        ("&idForList=" + item.id)
    );
  };

  return (
    <React.Fragment>
      <List style={{ height: "60vh", overflow: "auto" }}>
        <SortableList
          listItems={dataSessionsSelection || []}
          setListItems={onResetSessionInSelection}
          expanded={expanded}
          setExpanded={setExpanded}
          FormComponent={ItemContentResumeSession}
          handleEditSession={handleEditSession}
          onDeleteSelection={onDeleteSelection}
        />
      </List>
    </React.Fragment>
  );
};

const mapStateToProps = ({ trainingPlan }) => ({
  dataSessionsSelection: trainingPlan.dataSessionsSelection,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onDeleteSessionInSelection,
      onResetSessionInSelection,
      setInitsForm,
      setEditingSessionInPlan,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SessionListInPlan);
