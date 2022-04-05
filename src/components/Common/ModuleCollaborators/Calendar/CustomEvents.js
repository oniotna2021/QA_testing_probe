import React from "react";

import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

import { generateRandomColor } from "utils/misc";

export const EventActivity = ({ data }) => {
  return (
    <div
      style={{
        backgroundColor: data.activity_color
          ? data.activity_color
          : generateRandomColor(),
        padding: 1,
        height: "100%",
        borderRadius: 6,
      }}
    >
      <Tooltip title={data.activity_name + " - " + data.location_name}>
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
            className="lineCampText"
          >
            {data.activity_name}
          </Typography>
        </div>
      </Tooltip>
    </div>
  );
};

export const EventQuote = ({ data }) => {
  return (
    <div
      style={{
        backgroundColor: data.color ? data.color : generateRandomColor(),
        padding: 1,
        height: "100%",
        borderRadius: 6,
      }}
    >
      <Tooltip
        title={
          data?.patient?.first_name
            ? data?.patient?.first_name + " " + data?.patient?.last_name
            : data?.patient_name
        }
      >
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
            noWrap
          >
            {data?.patient?.first_name} {data?.patient?.last_name}{" "}
            {data?.patient_name}
          </Typography>
        </div>
      </Tooltip>
    </div>
  );
};
