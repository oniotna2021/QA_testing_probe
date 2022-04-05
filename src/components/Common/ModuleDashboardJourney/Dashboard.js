import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Grid, Card, CardContent, IconButton, Button } from "@material-ui/core";
import SortableList from "./SortableList";

import { reorderList } from "utils/misc";

import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";

import { useStyles } from "utils/useStyles";
import { removeItemFromArr } from "utils/misc";

const SortingItems = ({
  stepsTaskUser,
  handleChangeTaskStep,
  handleClickTask,
  listTask,
}) => {
  const classes = useStyles();

  const [itemsPendings, setItemsPendings] = useState([]);
  const [itemsInProcess, setItemsInProcess] = useState([]);
  const [itemsFinished, setItemsFinished] = useState([]);

  useEffect(() => {
    if (Object.keys(listTask).length > 0) {
      setItemsPendings(listTask["Pendientes"]);
      setItemsInProcess(listTask["En proceso"]);
      setItemsFinished(listTask["Terminado"]);
    }
  }, [listTask]);

  const [draggingItem, setDraggingItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sourceArea, setSourceArea] = useState(null);
  const [targetArea, setTargetArea] = useState(null);
  const pendingRef = useRef();
  const inProcessRef = useRef();
  const finishedRef = useRef();

  const handleAreaMouseEnter = (area) => {
    if (isDragging === true) {
      setTargetArea(area);
    } else {
      setSourceArea(area);
      setTargetArea(area);
    }
  };

  const handleDragStart = (e) => {
    const collection = e.node.sortableInfo.collection;
    setIsDragging(true);
    if (collection === "PENDING") {
      setDraggingItem(itemsPendings[e.index]);
    } else if (collection === "IN_PROCESS") {
      setDraggingItem(itemsInProcess[e.index]);
    } else if (collection === "FINISHED") {
      setDraggingItem(itemsFinished[e.index]);
    }
  };

  const handleDragEnd = (e) => {
    if (e.collection === targetArea) {
      switch (e.collection) {
        case "PENDING":
          setItemsPendings((itemsPendings) =>
            reorderList(itemsPendings, e.oldIndex, e.newIndex)
          );
          break;

        case "IN_PROCESS":
          setItemsInProcess((itemsInProcess) =>
            reorderList(itemsInProcess, e.oldIndex, e.newIndex)
          );
          break;

        case "FINISHED":
          setItemsFinished((itemsFinished) =>
            reorderList(itemsFinished, e.oldIndex, e.newIndex)
          );
          break;

        default:
          return;
      }
    } else {
      switch (e.collection) {
        case "PENDING":
          if (targetArea !== null) {
            setItemsPendings((itemsPendings) =>
              removeItemFromArr(itemsPendings, draggingItem?.id)
            );
          }
          if (targetArea === "IN_PROCESS") {
            setItemsInProcess((itemsInProcess) => [
              ...itemsInProcess,
              draggingItem,
            ]);
            handleChangeTaskStep(
              draggingItem,
              "process",
              stepsTaskUser.inProcess.id
            );
          } else if (targetArea === "FINISHED") {
            setItemsFinished((itemsFinished) => [
              ...itemsFinished,
              draggingItem,
            ]);
            handleChangeTaskStep(draggingItem, "finish");
          }
          break;

        case "IN_PROCESS":
          if (targetArea !== null) {
            setItemsInProcess((itemsInProcess) =>
              removeItemFromArr(itemsInProcess, draggingItem?.id)
            );
          }

          if (targetArea === "PENDING") {
            setItemsPendings((itemsPendings) => [
              ...itemsPendings,
              draggingItem,
            ]);
            handleChangeTaskStep(
              draggingItem,
              "pending",
              stepsTaskUser.pending.id
            );
          } else if (targetArea === "FINISHED") {
            setItemsFinished((itemsFinished) => [
              ...itemsFinished,
              draggingItem,
            ]);
            handleChangeTaskStep(draggingItem, "finish");
          }
          break;

        case "FINISHED":
          if (targetArea !== null) {
            setItemsFinished((itemsFinished) =>
              removeItemFromArr(itemsFinished, draggingItem?.id)
            );
          }

          if (targetArea === "PENDING") {
            setItemsPendings((itemsPendings) => [
              ...itemsPendings,
              draggingItem,
            ]);
            handleChangeTaskStep(
              draggingItem,
              "pending",
              stepsTaskUser.pending.id
            );
          } else if (targetArea === "IN_PROCESS") {
            setItemsInProcess((itemsInProcess) => [
              ...itemsInProcess,
              draggingItem,
            ]);
            handleChangeTaskStep(
              draggingItem,
              "process",
              stepsTaskUser.inProcess.id
            );
          }
          break;

        default:
          return;
      }
    }

    setIsDragging(false);
    setDraggingItem(null);
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <div
          className="d-flex justify-content-between align-items-center mb-4 mx-4"
          style={{ height: 40 }}
        >
          <Typography
            variant="body1"
            className={classes.textBold}
            style={{ userSelect: "none" }}
          >
            Pendientes
          </Typography>

          <IconButton
            onClick={() => handleClickTask(null)}
            style={{
              backgroundColor: "#F3F3F3",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <AddIcon fontSize="small" style={{ color: "#000", fontSize: 14 }} />
          </IconButton>
        </div>
        <Card
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "rgba(145, 158, 171, 0.05)",
            border: "1px solid rgba(249, 249, 249, 1)",
            minHeight: "450px",
            position: "relative",
          }}
          onMouseEnter={() => handleAreaMouseEnter("PENDING")}
        >
          <CardContent>
            <SortableList
              axis="y"
              area="PENDING"
              items={itemsPendings}
              draggingItem={draggingItem}
              isDragging={isDragging}
              sourceArea={sourceArea}
              targetArea={targetArea}
              ref={pendingRef}
              selfRef={pendingRef}
              otherRef={inProcessRef}
              otherTwoRef={finishedRef}
              updateBeforeSortStart={handleDragStart}
              onSortEnd={handleDragEnd}
              handleClickTask={handleClickTask}
              handleClickTaskToFinished={handleChangeTaskStep}
              useDragHandle={false}
              distance={10}
            />
          </CardContent>

          <div
            className="d-flex justify-content-center"
            style={{ position: "absolute", bottom: 0, right: 0, width: "100%" }}
          >
            <Button
              onClick={() => handleClickTask(null)}
              style={{
                backgroundColor: "#007771",
                color: "#ffffff",
                width: 300,
                margin: "10px auto",
              }}
              startIcon={
                <AddIcon
                  fontSize="small"
                  style={{ color: "#ffffff", fontSize: 14 }}
                />
              }
            >
              Agregar Tarea
            </Button>
          </div>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <div
          className="d-flex justify-content-between align-items-center mb-4 mx-4"
          style={{ height: 40 }}
        >
          <Typography
            variant="body1"
            className={classes.textBold}
            style={{ userSelect: "none" }}
          >
            En proceso
          </Typography>
        </div>
        <Card
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "rgba(145, 158, 171, 0.05)",
            border: "1px solid rgba(249, 249, 249, 1)",
            minHeight: "450px",
          }}
          onMouseEnter={() => handleAreaMouseEnter("IN_PROCESS")}
        >
          <CardContent>
            <SortableList
              axis="y"
              area="IN_PROCESS"
              items={itemsInProcess}
              draggingItem={draggingItem}
              isDragging={isDragging}
              sourceArea={sourceArea}
              targetArea={targetArea}
              ref={inProcessRef}
              selfRef={inProcessRef}
              otherRef={pendingRef}
              otherTwoRef={finishedRef}
              updateBeforeSortStart={handleDragStart}
              onSortEnd={handleDragEnd}
              handleClickTask={handleClickTask}
              handleClickTaskToFinished={handleChangeTaskStep}
              useDragHandle={false}
              distance={10}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={4}>
        <div
          className="d-flex justify-content-between align-items-center mb-4 mx-4"
          style={{ height: 40 }}
        >
          <Typography
            variant="body1"
            className={classes.textBold}
            style={{ userSelect: "none" }}
          >
            Terminado
          </Typography>
        </div>
        <Card
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "rgba(145, 158, 171, 0.05)",
            border: "1px solid rgba(249, 249, 249, 1)",
            minHeight: "450px",
          }}
          onMouseEnter={() => handleAreaMouseEnter("FINISHED")}
        >
          <CardContent>
            <SortableList
              axis="y"
              area="FINISHED"
              items={itemsFinished}
              draggingItem={draggingItem}
              isDragging={isDragging}
              sourceArea={sourceArea}
              targetArea={targetArea}
              ref={finishedRef}
              selfRef={finishedRef}
              otherRef={inProcessRef}
              otherTwoRef={pendingRef}
              updateBeforeSortStart={handleDragStart}
              onSortEnd={handleDragEnd}
              handleClickTask={handleClickTask}
              handleClickTaskToFinished={handleChangeTaskStep}
              distance={10}
              useDragHandle={false}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = ({ global }) => ({
  stepsTaskUser: global.stepsTaskUser,
});

export default connect(mapStateToProps)(SortingItems);
