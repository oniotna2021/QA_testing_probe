import React, { useState } from "react";

//UI
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
//utils
import { useStyles } from "utils/useStyles";

const ItemHealthCondition = ({
  title,
  validation,
  name,
  observation,
  subTitle,
  isNoRemovable,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="d-flex col-12 justify-content-between align-items-center mb-1">
        <Typography className={classes.fontSlug} style={{ width: 180 }}>
          {title}
        </Typography>
        <Typography style={{ fontSize: 14 }}>{validation || "-"}</Typography>
        {validation === "Si" && isNoRemovable === false ? (
          <IconButton
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "#F3F3F3",
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        ) : (
          <div style={{ width: 24 }}></div>
        )}
      </div>
      {open ? (
        <div
          className="my-2 ms-3 p-2"
          style={{ background: "#F3F3F3", borderRadius: 10 }}
        >
          <Typography style={{ fontWeight: "bold" }}>{subTitle}</Typography>
          <Typography>{name}</Typography>
          <Typography style={{ fontWeight: "bold" }}>Observacion:</Typography>
          <Typography noWrap>{observation}</Typography>
        </div>
      ) : null}
    </>
  );
};

export default ItemHealthCondition;
