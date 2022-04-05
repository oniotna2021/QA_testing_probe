import React from "react";

//UI
import Avatar from "@material-ui/core/Avatar";

//Styles
import { useStyles } from "utils/useStyles";

const AvatarUser = ({
  photo,
  isCenter,
  userEmail,
  handleUserMenuClick,
  anchorEl,
}) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      {handleUserMenuClick ? (
        <Avatar
          style={{ width: isCenter ? 100 : 38, height: isCenter ? 100 : 38 }}
          className={classes.avatarUSer}
          onClick={handleUserMenuClick}
          // anchorEl={anchorEl}
          aria-controls="menu"
          aria-haspopup="true"
        >
          {userEmail?.slice(0, 2)}
        </Avatar>
      ) : (
        <Avatar
          alt="Avatar user"
          src={photo}
          style={{ width: isCenter ? 100 : 38, height: isCenter ? 100 : 38 }}
          className={classes.avatarUSer}
        >
          {userEmail?.slice(0, 2)}
        </Avatar>
      )}
    </React.Fragment>
  );
};

export default AvatarUser;
