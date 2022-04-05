import React, { useEffect, useState } from "react";

// UI
import { Typography } from "@material-ui/core";

// custom
import styled from "@emotion/styled";

export const FieldItem = styled.div`
  width: 90%;
  position: absolute;
  border-radius: 10px;
  top: 0;
  left: 10px;
  height: ${({ days }) => `${days.length * 70}px`};
  background: ${({ availableDays }) =>
    availableDays > 3 ? "#eaf5e5" : "#FCF1EA"};
  padding: 10px 20px;
  z-index: 1;
`;

const AvailableCell = ({ fields, user, day }) => {
  const [currentField, setCurrentField] = useState();

  useEffect(() => {
    setCurrentField(
      fields.find(
        (field) =>
          field.user_id === user.id && field.calendar_days.at(0).id === day.id
      )
    );
  }, [fields, day.id, user.id]);

  return (
    <td style={{ position: "relative", padding: "5px 10px 5px 10px" }}>
      {currentField ? (
        <FieldItem
          days={currentField.calendar_days}
          availableDays={currentField.available_days}
        >
          <Typography variant="body2">
            <strong>{currentField.available_days}</strong> Días
          </Typography>
        </FieldItem>
      ) : (
        <div
          className="promotionLockedCell"
          style={{ width: "97%", height: "100%" }}
        ></div>
      )}
    </td>
  );
};

export default AvailableCell;
