import React from "react";

// UI
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import {
  TDGridCell,
  EventContainer,
  EventItemContainer,
} from "./WeekScheduleCalendar.styles";

//Components
import AvailableBlocks from "./AvailableBlocks";

//Utils
import { useStyles } from "utils/useStyles";
import { calculateInsetSchedules, convertH2M } from "utils/misc";

const EventItem = ({
  item,
  arrayDataQuotes,
  handleClickAvailableHour,
  handleClickEvent,
  viewHeaderDate,
  businessHour,
  itemEvent,
  eachMinuteCalendar,
}) => {
  const classes = useStyles();

  return (
    <TDGridCell bgColor={businessHour ? "#f9f9f9" : "#ffffff"} role="gridcell">
      <div style={{ minHeight: "100%", position: "relative" }}>
        <EventContainer>
          {businessHour && (
            <EventItemContainer>
              {arrayDataQuotes[item].activities.length > 0 &&
                arrayDataQuotes[item].activities.map(
                  (itemSchedule) =>
                    itemSchedule.status === 3 && (
                      <AvailableBlocks
                        eachMinuteCalendar={eachMinuteCalendar}
                        handleClickAvailableHour={handleClickAvailableHour}
                        itemSchedule={itemSchedule}
                        date={arrayDataQuotes[item]?.date}
                        viewHeaderDate={viewHeaderDate}
                      />
                    )
                )}
            </EventItemContainer>
          )}

          <EventItemContainer>
            {arrayDataQuotes[item].activities.length > 0 &&
              arrayDataQuotes[item].activities.map(
                (itemSchedule) =>
                  itemSchedule.status === 2 && (
                    <div
                      style={{
                        inset: calculateInsetSchedules({
                          initHour: itemSchedule.start_time,
                          finalHour: itemSchedule.end_time,
                          eachMinuteCalendar: eachMinuteCalendar,
                        }),
                        zIndex: 1,
                        position: "absolute",
                        cursor: "normal",
                        // background: "#f1f1f1",
                      }}
                    >
                      <div
                        style={{
                          // backgroundColor: "#ffffff",
                          padding: 5,
                          height: "100%",
                          borderRadius: 6,
                        }}
                        className="hourNoAvailable"
                      >
                        <div
                          className="d-flex flex-column"
                          style={{ height: "100%", padding: 15 }}
                        ></div>
                      </div>
                    </div>
                  )
              )}
          </EventItemContainer>

          <EventItemContainer>
            {arrayDataQuotes[item].activities.length > 0 &&
              arrayDataQuotes[item].activities.map(
                (itemSchedule, idx) =>
                  itemSchedule.status === 1 && (
                    <div
                      key={idx}
                      style={{
                        inset: calculateInsetSchedules({
                          initHour:
                            itemSchedule.hour || itemSchedule.start_time,
                          finalHour: itemSchedule.end_date_quote
                            ? itemSchedule.end_date_quote.split(" ")[1]
                            : itemSchedule.end_time,
                          eachMinuteCalendar: eachMinuteCalendar,
                        }),
                        zIndex: 1,
                        position: "absolute",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        handleClickEvent({
                          data: itemSchedule,
                          date: arrayDataQuotes[item]?.date,
                        })
                      }
                    >
                      {itemEvent.type !== "default" ? (
                        <itemEvent.EventCustom data={itemSchedule} />
                      ) : (
                        <div
                          style={{
                            backgroundColor: "#CCE4E3",
                            padding: 1,
                            height: "100%",
                            borderRadius: 6,
                          }}
                        >
                          <Tooltip
                            title={
                              itemSchedule.patient_name +
                              " - " +
                              itemSchedule.name_type_quote
                            }
                          >
                            {convertH2M(
                              itemSchedule.end_date_quote.split(" ")[1]
                            ) -
                              convertH2M(itemSchedule.hour) ===
                            10 ? (
                              <div
                                className="d-flex flex-column"
                                style={{ height: "100%", padding: "0.2px 5px" }}
                              >
                                <Typography
                                  variant="body1"
                                  noWrap
                                  style={{
                                    wordWrap: "break-word",
                                    height: 20,
                                    fontSize: "60%",
                                    lineHeight: 1,
                                  }}
                                >
                                  {itemSchedule.patient_name}
                                </Typography>
                              </div>
                            ) : (
                              <div
                                className="d-flex flex-column"
                                style={{ height: "100%", padding: "0.5px 5px" }}
                              >
                                <Typography
                                  variant="body1"
                                  style={{
                                    fontSize: "0.75rem",
                                    lineHeight: 1,
                                  }}
                                >
                                  {itemSchedule.patient_name}
                                </Typography>
                              </div>
                            )}
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  )
              )}
          </EventItemContainer>

          <EventContainer></EventContainer>
        </EventContainer>
      </div>
    </TDGridCell>
  );
};

export default EventItem;
