import React from "react";

//UI
import { Typography } from "@material-ui/core";

// icons
import { Flag } from "assets/icons/customize/config";

const CardDark = () => {
  return (
    <div
      style={{
        backgroundColor: "#F3EDF7",
        width: 150,
        height: 150,
        borderRadius: 20,
        margin: 10,
        padding: 10,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" className="mb-1">
        25,5
      </Typography>
      <div className="d-flex align-items-center justify-content-center">
        <Flag color="black" />
        <Typography className="ms-1">30,0</Typography>
      </div>
      <Typography>
        <strong>Meta mes</strong>
      </Typography>
      <Typography>Virtuales</Typography>
    </div>
  );
};

export default CardDark;
