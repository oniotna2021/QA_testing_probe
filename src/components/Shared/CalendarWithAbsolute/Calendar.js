import React, { useState, useEffect } from "react";

// UI
import Card from "@material-ui/core/Card";
import { Typography } from "@material-ui/core";

// custom
import { Container, TableBody } from "./Calendar.styles";

// icons
import { Calendar } from "./Icons";

// components
import UserComponent from "./UserComponent";
import AvailableCell from "./AvailableCell";

const CalendarComponent = ({ dataForm, isMobile, schedData }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    schedData.forEach((user) => {
      setFields((prev) => prev.concat(user.schedule));
    });
  }, []);

  return (
    <Card
      className="ps-2 mt-5 table-responsive"
      style={{
        border: "none",
        boxShadow: "none",
      }}
    >
      <Container isMobile={isMobile}>
        <thead>
          <tr>
            <th style={{ width: 100 }}>
              <Calendar />
            </th>
            {schedData?.map((user) => {
              return (
                <th style={{ padding: 10 }}>
                  <UserComponent userData={user} />
                </th>
              );
            })}
          </tr>
        </thead>
        <TableBody>
          {dataForm &&
            dataForm?.day_weeks?.map((day) => {
              return (
                <tr>
                  <td className="d-flex justify-content-center align-items-center">
                    <Typography variant="body2">
                      <strong>
                        {day?.name?.toString().substring(0, 2).toUpperCase()}
                      </strong>
                    </Typography>
                  </td>
                  {schedData.map((user) => {
                    return (
                      <AvailableCell fields={fields} user={user} day={day} />
                    );
                  })}
                </tr>
              );
            })}
        </TableBody>
      </Container>
    </Card>
  );
};

export default CalendarComponent;
