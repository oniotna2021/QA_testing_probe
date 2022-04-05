import React from "react";

// UI
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import { IconAddUser } from "assets/icons/customize/config";

// Utils
import { useStyles } from "utils/useStyles";
import { capitalize } from "utils/misc";

const ItemDayCalendar = ({
  hour,
  dataItem,
  onClick,
  handleClickViewDetail,
  userType,
}) => {
  const classes = useStyles();

  return (
    <>
      <TableCell className={classes.cellHourCalendar}>
        <div className="d-flex flex-column justify-content-between">
          {dataItem.blocks[hour.id]?.map((specificHour, index) =>
            specificHour.activity_id !== null ? (
              <div
                key={index}
                style={{
                  minWidth: "100px",
                  backgroundColor:
                    specificHour.status === 1 ? specificHour.color : "#b9b9b9",
                  height:
                    index === 3 && specificHour.name_location ? "25px" : "10px",
                  margin: "0px",
                  padding: "0 0.5rem",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
                className={
                  specificHour.hasOwnProperty("statusBorder")
                    ? specificHour.statusBorder === true
                      ? classes.borderBottomSchedule
                      : ""
                    : classes.borderTopSchedule
                }
                onClick={() => onClick(specificHour.id, dataItem.id, "edit")}
              >
                {specificHour.name_location && (
                  <>
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ fontSize: 12, position: "relative" }}
                    >
                      <div
                        className="d-flex justify-content-between"
                        style={{ position: "relative" }}
                      >
                        <div>
                          <div className="d-flex">
                            <Tooltip
                              title={capitalize(specificHour.name_location)}
                            >
                              <Typography
                                variant="p"
                                style={{
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  width: 100,
                                  overflow: "hidden",
                                }}
                              >
                                {capitalize(specificHour.name_location)}
                              </Typography>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Typography
                          variant="p"
                          style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: 100,
                            overflow: "hidden",
                          }}
                        >
                          {specificHour.Bookings}/{specificHour.capacity}
                        </Typography>
                      </div>

                      {userType === 17 || userType === 41 ? (
                        ""
                      ) : (
                        <div>
                          {specificHour.status !== 0 && (
                            <div className="d-flex">
                              <Tooltip title={"Agendar afiliado"}>
                                <IconButton
                                  size="small"
                                  style={{ padding: 5, marginRight: 10 }}
                                  color="inherit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onClick(
                                      specificHour.id,
                                      dataItem.id,
                                      "reserve"
                                    );
                                  }}
                                  edge="start"
                                >
                                  <IconAddUser
                                    color="#000"
                                    width="13"
                                    height="13"
                                  />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title={"Aforo de la actividad"}>
                                <IconButton
                                  size="small"
                                  style={{ padding: 5, marginRight: 0 }}
                                  color="inherit"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickViewDetail(
                                      specificHour.activity_reservation_id,
                                      dataItem.name_activity,
                                      specificHour.start_date,
                                      specificHour.end_date
                                    );
                                  }}
                                  edge="start"
                                >
                                  <VisibilityIcon
                                    color="#ffffff"
                                    fontSize={"small"}
                                    style={{
                                      width: 17,
                                      height: 17,
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                key={index}
                onClick={() => console.log("click")}
                value={specificHour.hour_ini}
                id={dataItem.id}
                className={`btn btn-light`}
                style={{
                  minWidth: "100px",
                  height: "10px",
                  margin: "0px",
                  border: 0,
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                }}
              ></button>
            )
          )}
        </div>
      </TableCell>
    </>
  );
};

export default ItemDayCalendar;
