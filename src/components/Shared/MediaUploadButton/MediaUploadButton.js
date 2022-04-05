import React from "react";

// UI
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const MediaUploadButton = ({ legend, openModal }) => {
  return (
    <Button
      style={{
        width: "100px",
        height: "120px",
        backgroundColor: "rgba(15, 41, 48, 0.04)",
      }}
      onClick={() => openModal(true)}
    >
      <div className="row d-flex justify-content-center align-items-center">
        <div>
          <AddIcon
            variant="outlined"
            size="small"
            style={{ color: "#38447E" }}
          />
        </div>
        <Typography variant="body2">{legend}</Typography>
      </div>
    </Button>
  );
};

export default MediaUploadButton;
