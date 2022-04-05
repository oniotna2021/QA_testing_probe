import React from "react";

// UI
import { Typography } from "@material-ui/core";

// icons
import { IconProfile, IconEditPencil } from "assets/icons/customize/config";

const CardItem = ({ title, status, Icon = IconProfile }) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(204, 228, 227, .3)",
        width: 500,
        padding: 20,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        cursor: "pointer",
      }}
    >
      <div className="d-flex align-items-center">
        <div className="me-3">
          <Icon width="25" height="25" color="black" />
        </div>
        <div>
          <Typography variant="body1">
            <b>{title}</b>
          </Typography>
          <Typography variant="body2">{status}</Typography>
        </div>
      </div>
      <IconEditPencil color="black" />
    </div>
  );
};

export default CardItem;
