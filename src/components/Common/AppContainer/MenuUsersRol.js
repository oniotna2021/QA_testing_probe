import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import Typography from "@material-ui/core/Typography";

import { IconMenuUser } from "assets/icons/customize/config";

import {
  LogoTrainingMin,
  LogoMedicalMin,
  LogoCounterMin,
} from "assets/icons/logos/config";
import ButtonBase from "@material-ui/core/ButtonBase";

const useStyles = makeStyles(() => ({
  buttonItem: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 2px",
    padding: 10,
    borderRadius: 10,
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const MenuUsersRol = ({ colorIcon, handleChangeRol }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "customized-menu" : undefined;

  return (
    <div>
      <IconButton
        color="inherit"
        aria-describedby={id}
        onClick={handleClickOpen}
        edge="start"
        style={{ marginRight: 20 }}
      >
        <IconMenuUser color={colorIcon} />
      </IconButton>

      <StyledMenu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        style={{ margin: 0 }}
      >
        <div className="d-flex justify-content-between" style={{ padding: 5 }}>
          <ButtonBase className={classes.buttonItem}>
            <LogoTrainingMin width={25} height={30} />
            <Typography variant="body2" component="p">
              Trainer
            </Typography>
          </ButtonBase>
          <ButtonBase className={classes.buttonItem}>
            <LogoMedicalMin width={25} height={30} />
            <Typography variant="body2" component="p">
              Medical
            </Typography>
          </ButtonBase>
          <ButtonBase className={classes.buttonItem}>
            <LogoCounterMin width={25} height={30} />
            <Typography variant="body2" component="p">
              Counter
            </Typography>
          </ButtonBase>
        </div>
      </StyledMenu>
    </div>
  );
};

export default MenuUsersRol;
