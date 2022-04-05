//Icons
import CloseIcon from "@material-ui/icons/Close";
//UI
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import React from "react";

export const ShardComponentModal = ({
  title = "",
  body,
  isOpen,
  handleClose,
  viewButtonClose = true,
  width = "md",
  fullWidth = false,
  is_fullWidth,
  backgroundColorButtonClose,
  colorButtonClose = "black",
  style,
}) => {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={isOpen}
      maxWidth={width}
      fullWidth={fullWidth}
      fullScreen={is_fullWidth}
    >
      <div style={style}>
        {title && <DialogTitle id="simple-dialog-title">{title}</DialogTitle>}
        {handleClose && viewButtonClose ? (
          <IconButton
            aria-label="close"
            style={{
              position: "absolute",
              borderRadius: 0,
              right: 10,
              top: 6,
              color: colorButtonClose,
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
        <DialogContent>{body}</DialogContent>
      </div>
    </Dialog>
  );
};
