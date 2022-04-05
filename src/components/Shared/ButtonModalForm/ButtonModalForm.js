import React from "react";

import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { ButtonBase } from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";

import { IconEditItem } from "assets/icons/customize/config";

import { useStyles } from "utils/useStyles";

const ButtonModalForm = ({
  idM,
  textBold = false,
  isCheck = false,
  title,
  url_image,
  onClick,
  bgColor = "rgba(60, 60, 59, 0.1)",
  isEdit = false,
  isAssing = false,
  color,
  marginLeft = "ms-4",
  quotes,
  isActivity,
  statusActivity,
  lockCapacity,
}) => {
  const classes = useStyles();

  return (
    <ButtonBase
      disabled={isCheck}
      onClick={() => {
        onClick(idM);
      }}
      className="d-flex align-items-center justify-content-between p-3 pointer mt-3"
      style={{ backgroundColor: bgColor, borderRadius: 10, width: "100%" }}
    >
      <div className="d-flex align-items-center">
        {isActivity && (
          <div
            className={
              statusActivity ? classes.pointActive : classes.pointDisable
            }
          ></div>
        )}
        {url_image && (
          <div className={classes.thumb}>
            <div className={classes.thumbInner}>
              <img src={url_image} className={classes.img} alt="img" />
            </div>
          </div>
        )}
        <Typography
          className={`${marginLeft} ${textBold ? classes.textBold : ""}`}
        >
          {title}
        </Typography>

        {quotes && (
          <Typography className={`${marginLeft}`}>
            {`${quotes} Citas`}
          </Typography>
        )}
        {lockCapacity && <p className="mx-4">Incumplimiento de Aforo</p>}
      </div>
      {isEdit ? (
        <IconEditItem color={color} />
      ) : isAssing ? (
        isCheck ? (
          <CheckIcon color={color} />
        ) : (
          <IconButton>
            <ArrowForwardIosIcon fontSize="small" color={color} />
          </IconButton>
        )
      ) : (
        <AddIcon />
      )}
    </ButtonBase>
  );
};

export default ButtonModalForm;
