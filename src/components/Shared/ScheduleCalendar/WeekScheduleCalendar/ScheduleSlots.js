import React from "react";

// UI
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import { ContainerAbsolute } from "./WeekScheduleCalendar.styles";

// Components
import EventItem from "./EventItem";

const ScheduleSlots = React.memo(
  ({
    arrayDataQuotes,
    handleClickEvent,
    handleClickAvailableHour,
    viewHeaderDate,
    businessHour,
    dateWeeks,
    itemEvent,
    eachMinuteCalendar,
  }) => {
    return (
      <ContainerAbsolute>
        <Table style={{ tableLayout: "fixed", height: "100%" }}>
          {viewHeaderDate && (
            <TableHead>
              <TableRow role="row">
                <TableCell style={{ height: 53 }}></TableCell>
              </TableRow>
            </TableHead>
          )}

          <colgroup>
            <col style={{ width: 70 }} />
          </colgroup>

          <tbody role="presentation">
            <tr role="row">
              <td>
                <div style={{ minHeight: "100%", position: "relative" }}>
                  <div
                    style={{
                      bottom: 0,
                      overflow: "hidden",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  ></div>
                </div>
              </td>

              {arrayDataQuotes.length > 0 &&
                (dateWeeks || [0, 1, 2, 3, 4, 5, 6]).map((_, index) => (
                  <EventItem
                    key={index}
                    arrayDataQuotes={arrayDataQuotes}
                    item={index}
                    handleClickAvailableHour={handleClickAvailableHour}
                    handleClickEvent={handleClickEvent}
                    viewHeaderDate={viewHeaderDate}
                    businessHour={businessHour}
                    itemEvent={itemEvent}
                    eachMinuteCalendar={eachMinuteCalendar}
                  />
                ))}
            </tr>
          </tbody>
        </Table>
      </ContainerAbsolute>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.arrayDataQuotes === nextProps.arrayDataQuotes;
  }
);

export default ScheduleSlots;
