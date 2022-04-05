import React, { Fragment } from "react";

//UI
import Badge from "@material-ui/core/Badge";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 30,
    height: 30,
    fontWeight: "bold",
    border: `1px solid ${theme.palette.background.paper}`,
    background: theme.palette.primary.main,
    marginLeft: "10px",
    marginBottom: "15px",
    fontSize: 14,
  },
}))(Avatar);

const ItemCalendar = ({ totalQuotes }) => {
  return (
    <Fragment>
      <Badge
        overlap="circle"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        badgeContent={<SmallAvatar>{totalQuotes}</SmallAvatar>}
      ></Badge>
    </Fragment>
  );
};

export default ItemCalendar;
