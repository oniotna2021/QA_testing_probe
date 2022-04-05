import React from "react";

//UI
import { Typography } from "@material-ui/core";

// icons
import { Flag } from "assets/icons/customize/config";

const CardLight = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        width: 150,
        height: 150,
        borderRadius: 20,
        margin: 10,
        padding: 20,
      }}
    >
      <Typography className="mb-1">
        <strong>Elite Gold</strong>
      </Typography>
      <div className="d-flex align-items-center">
        <Flag color="#8D33D3" />
        <Typography className="ms-1">5 Un. / 8 Un.</Typography>
      </div>
      <Typography style={{ color: "#8D33D3" }}>
        <strong>$350.000</strong>
      </Typography>
    </div>
  );
};

export default CardLight;
