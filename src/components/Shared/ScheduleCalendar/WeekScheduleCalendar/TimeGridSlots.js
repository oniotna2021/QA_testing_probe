import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useTheme } from "@material-ui/core/styles";

// UI
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import { IconCalendar } from "assets/icons/customize/config";

// Utils
import { formatDateToHHMMSS } from "utils/misc";

const TimeGridSlots = ({
  classes,
  arrayHours,
  refHourNow,
  refHour,
  viewHeaderDate,
  dateWeeks,
}) => {
  const theme = useTheme();
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <Table>
        {viewHeaderDate && (
          <TableHead>
            <TableRow role="row">
              <TableCell>
                <div className="d-flex justify-content-center alig-content-center">
                  <IconCalendar color={theme.palette.black.main} />
                </div>
              </TableCell>
              {dateWeeks &&
                dateWeeks.map((item) => (
                  <TableCell
                    style={{ width: "100px" }}
                    key={"tb-" + item.nameDay}
                  >
                    <div className="d-flex justify-content-center align-items-center">
                      <Typography
                        style={{ marginRight: "5px" }}
                        className={classes.fontDayCalendar}
                      >
                        {item.nameDay}
                      </Typography>
                      <Typography className={classes.fontDayCalendar}>
                        {item.dayNumber}
                      </Typography>
                    </div>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
        )}

        <colgroup>
          <col style={{ width: 70 }} />
        </colgroup>

        <TableBody>
          {arrayHours.map((hour) => (
            <TableRow
              key={hour}
              ref={(element) => {
                if (
                  formatDateToHHMMSS(refHourNow.current) ===
                  formatDateToHHMMSS(hour)
                ) {
                  refHour.current = element;
                }
              }}
              style={{ borderBottom: "1px solid #ddd" }}
            >
              <tr>
                <td
                  style={{
                    minWidth: 70,
                    height: 40,
                    minHeight: 40,
                    maxHeight: 40,
                    borderBottom: 0,
                    verticalAlign: "middle",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        padding: "0",
                        display: "inline-block",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {format(hour, "p", { locale: es }).endsWith("30") ? (
                        ""
                      ) : (
                        <Typography
                          variant="body1"
                          className={classes.textBold}
                          style={{ fontSize: "0.875rem" }}
                        >
                          {format(hour, "p", { locale: es })}
                        </Typography>
                      )}
                    </div>
                  </div>
                </td>

                {/* <td
                          style={{
                            height: "40px",
                            minHeight: "40px",
                            maxHeight: "40px",
                            borderBottom: 0,
                            verticalAlign: "top",
                          }}
                        ></td> */}
              </tr>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TimeGridSlots;
