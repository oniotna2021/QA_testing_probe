import React from "react";

// UI
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

// Utils
import { useStyles } from "utils/useStyles";

const ItemDayCalendar = ({ hour, dataItem, onClick, onDateClick }) => {
  const classes = useStyles();

  return (
    <>
      <TableCell className={classes.cellHourCalendar}>
        <div className="d-flex flex-column justify-content-between">
          {dataItem.blocks[hour.id]?.map((specificHour, index) => (
            <>
              {specificHour.status === 2 && (
                <div
                  key={index}
                  className="hourNoAvailable"
                  style={{
                    minWidth: "100px",
                    backgroundColor: "#f1f1f1",
                    height: "10px",
                    margin: "0",
                    padding: "0 0.5rem",
                    cursor: "default",
                    fontSize: "12px",
                  }}
                ></div>
              )}

              {specificHour.status === 1 &&
                (specificHour.activity_id !== null ? (
                  <div
                    key={index}
                    style={{
                      minWidth: "100px",
                      backgroundColor: specificHour.color,
                      height:
                        index === 3 && specificHour.activity_name
                          ? "17px"
                          : "10px",
                      margin: "0px",
                      padding: "0 0.5rem",
                      cursor: "pointer",
                      fontSize: "12px",
                      position: "relative",
                    }}
                    className={
                      specificHour.hasOwnProperty("statusBorder")
                        ? specificHour.statusBorder === true
                          ? classes.borderBottomSchedule
                          : ""
                        : classes.borderTopSchedule
                    }
                    onClick={(e) => onClick(e, dataItem?.id)}
                    id={
                      specificHour.schedule_activity_has_location_id ||
                      specificHour?.id
                    }
                  >
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        fontSize: 12,
                        position: "absolute",
                        zIndex: 999,
                      }}
                    >
                      <div
                        className="d-flex justify-content-between"
                        style={{ position: "relative" }}
                      >
                        <div className="d-flex">
                          <Tooltip
                            title={
                              specificHour.activity_name !== null
                                ? `${specificHour.activity_name}`
                                : `Actividad`
                            }
                          >
                            <Typography
                              id={
                                specificHour.schedule_activity_has_location_id ||
                                specificHour?.id
                              }
                              variant="p"
                              style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: 100,
                                overflow: "hidden",
                              }}
                            >
                              {specificHour.activity_name !== null
                                ? `${specificHour.activity_name}`
                                : `Actividad`}
                            </Typography>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    key={index}
                    onClick={(e) => {
                      onDateClick(
                        e,
                        dataItem?.profile_appointment_types,
                        dataItem?.venues
                      );
                    }}
                    value={specificHour.hour_ini}
                    id={dataItem.id}
                    className={`btn btn-light ${classes.quoteAvailable}`}
                    style={{
                      minWidth: "100px",
                      height: "10px",
                      margin: "0px",
                      border: 0,
                      cursor: "pointer",
                    }}
                  ></button>
                ))}

              {specificHour.status === 3 && (
                <button
                  key={index}
                  onClick={(e) => {
                    onDateClick(
                      e,
                      dataItem?.profile_appointment_types,
                      dataItem?.venues
                    );
                  }}
                  value={specificHour.hour_ini}
                  id={dataItem.id}
                  className={`btn btn-light ${classes.quoteAvailable}`}
                  style={{
                    minWidth: "100px",
                    height: "10px",
                    margin: "0px",
                    border: 0,
                    cursor: "pointer",
                  }}
                ></button>
              )}

              {!specificHour.status && (
                <button
                  key={index}
                  onClick={(e) => {
                    onDateClick(
                      e,
                      dataItem?.profile_appointment_types,
                      dataItem?.venues
                    );
                  }}
                  value={specificHour.hour_ini}
                  id={dataItem.id}
                  className={`btn btn-light ${classes.quoteAvailable}`}
                  style={{
                    minWidth: "100px",
                    height: "10px",
                    margin: "0px",
                    border: 0,
                    cursor: "pointer",
                  }}
                ></button>
              )}
            </>
          ))}
        </div>
      </TableCell>
    </>
  );
};

export default ItemDayCalendar;
