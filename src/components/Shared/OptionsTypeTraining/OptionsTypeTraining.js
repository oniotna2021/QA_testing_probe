import React, { useState } from "react";

//Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useTranslation } from "react-i18next";

//UI
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import {
  SortableContainer,
  SortableHandle,
  SortableElement,
} from "react-sortable-hoc";

// Modules
import { reorderTrainingSteps } from "modules/common";

// Utils
import { reorderList, generateIDForTypeTraining } from "utils/misc";

const DragHandle = SortableHandle(({ color, style }) => (
  <IconButton style={style} className="p-2">
    <DragIndicatorIcon
      style={{ width: "20px", cursor: "move" }}
      color={color}
    />
  </IconButton>
));

const SortableItem = SortableElement(
  ({
    item,
    isDynamic,
    deleteTrainingStep,
    selectedOption,
    training_step_id,
  }) => (
    <div>
      <Button
        onClick={() => selectedOption(item)}
        size="small"
        color={training_step_id === item?._id ? "primary" : ""}
        style={{
          marginRight: "5px",
          minHeight: "40px",
          display: "flex",
          justifyContent: "center",
          minWidth: "120px",
        }}
        variant="contained"
        startIcon={
          <DragHandle
            style={{ display: isDynamic ? "inherit" : "none" }}
            color="#ffff"
          />
        }
        endIcon={
          <IconButton
            style={{ display: isDynamic ? "inherit" : "none" }}
            size="small"
            className="p-2"
          >
            <DeleteIcon
              style={{ width: "20px" }}
              onClick={() => deleteTrainingStep(item._id)}
              color={""}
            />
          </IconButton>
        }
      >
        {item?.name}
      </Button>
    </div>
  )
);

const SortableListContainer = SortableContainer(
  ({
    isDynamic,
    trainingSteps,
    trainingStepsSelected,
    addTrainingStep,
    ...restProps
  }) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    return (
      <div
        id="container-list-steps"
        className="d-flex g-2 mt-3"
        style={{ width: "100%", overflowX: "auto" }}
      >
        <>
          {trainingStepsSelected &&
            trainingStepsSelected.map((item, idx) => (
              <SortableItem
                disabled={!isDynamic}
                id={"item_" + idx}
                index={idx}
                key={`item-${idx}`}
                item={item}
                isDynamic={isDynamic}
                {...restProps}
              />
            ))}

          {isDynamic && (
            <div>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                size="medium"
                style={{ height: "100%", width: "150px" }}
                color={"# "}
                fullWidth
                variant="contained"
                endIcon={<AddIcon color="#000" />}
              >
                {t("OptionsTypeTraining.Button.Add")}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {trainingSteps &&
                  trainingSteps.map((item, idx) => (
                    <MenuItem
                      key={idx}
                      onClick={() => {
                        addTrainingStep(item);
                        handleClose();
                      }}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
              </Menu>
            </div>
          )}
        </>
      </div>
    );
  }
);

const OptionsTypeTraining = ({
  isDynamic = true,
  selectedOption,
  dataViewStepsDiagram,
  trainingStepsSelected,
  trainingSteps = [],
  training_step_id,
  reorderTrainingSteps,
}) => {
  const addTrainingStep = (dataStep) => {
    let randomNumber = generateIDForTypeTraining();
    const mapArray = [
      ...trainingStepsSelected,
      { ...dataStep, _id: randomNumber, diagram: {} },
    ];

    reorderTrainingSteps(
      mapArray.map((item, idx) => ({ ...item, order: idx + 1 }))
    );
    selectedOption({ ...dataStep, _id: randomNumber, diagram: {} });
  };

  const deleteTrainingStep = (idStep) => {
    reorderTrainingSteps(
      trainingStepsSelected.filter((item) => item._id !== idStep)
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const itemsReorder = reorderList(trainingStepsSelected, oldIndex, newIndex);
    const mapOrderItems = itemsReorder.map((i, index) => ({
      ...i,
      order: index + 1,
    }));
    reorderTrainingSteps(mapOrderItems);
  };

  const getContainer = () => {
    return document.getElementById("container-list-steps");
  };

  return (
    <div>
      <SortableListContainer
        trainingSteps={trainingSteps}
        trainingStepsSelected={dataViewStepsDiagram || trainingStepsSelected}
        training_step_id={training_step_id}
        selectedOption={selectedOption}
        onSortEnd={onSortEnd}
        useDragHandle={false}
        axis="x"
        lockAxis="x"
        distance={10}
        getContainer={getContainer}
        addTrainingStep={addTrainingStep}
        deleteTrainingStep={deleteTrainingStep}
        isDynamic={isDynamic}
      />
    </div>
  );
};

const mapStateToProps = ({ common, sessions }) => ({
  trainingSteps: common.trainingSteps,
  trainingStepsSelected: common.trainingStepsSelected,
  training_step_id: sessions.training_step_id,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      reorderTrainingSteps,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(OptionsTypeTraining));
