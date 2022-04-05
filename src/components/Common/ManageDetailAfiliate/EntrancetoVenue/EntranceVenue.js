import React, { useState, useEffect } from "react";
import { addDays, format } from "date-fns";

// components
import Tooltip from "@material-ui/core/Tooltip";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";

// styled
import {
  Point,
  Table,
  TableCol,
  TableCel,
  BoxPoint,
  Text,
} from "./EntranceVenue.style";
import { useTheme } from "@material-ui/core";
import { es } from "date-fns/locale";

const EntranceVenue = ({ logsAccessAfiliate, logsDay }) => {
  const theme = useTheme();
  const [dataFormated, setDataFormated] = useState([]);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    let temporalData = [];
    logsDay.forEach((date) => {
      temporalData.push({
        date: date,
        points: logsAccessAfiliate.filter(
          (item) => item.created_at.substring(0, 10) === date
        ),
      });
    });
    setDataFormated(temporalData);
  }, [logsDay, logsAccessAfiliate]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static" color="transparent">
        <Table>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="none"
            variant="scrollable"
            scrollButtons="on"
          >
            {dataFormated?.map((item) => (
              <TableCol>
                <BoxPoint>
                  {item?.points?.map((x) => (
                    <Tooltip
                      title={
                        <p>
                          <b>Sede:</b> {x.venue_name}
                          <br></br>
                          <b>Tipo:</b> {x.access_type}
                          <br></br>
                          <b>Fecha:</b> {x.created_at.substring(0, 10)}
                          <br></br>
                          <b>Hora:</b>{" "}
                          {`${format(addDays(new Date(x.created_at), 0), "p", {
                            local: es,
                          })}`}
                        </p>
                      }
                      arrow
                    >
                      <div className="m-1">
                        <Point color={theme.palette.black.main}></Point>
                      </div>
                    </Tooltip>
                  ))}
                </BoxPoint>
                <Divider />
                <TableCel>
                  {
                    <Text>{`${format(addDays(new Date(item.date), 1), "eee", {
                      locale: es,
                    })}`}</Text>
                  }
                </TableCel>
                <TableCel>
                  {
                    <Text>{`${format(addDays(new Date(item.date), 1), "dd", {
                      locale: es,
                    })}`}</Text>
                  }
                </TableCel>
              </TableCol>
            ))}
          </Tabs>
        </Table>
      </AppBar>
    </>
  );
};

export default EntranceVenue;
