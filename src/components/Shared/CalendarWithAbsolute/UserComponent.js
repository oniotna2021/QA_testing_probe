import React, { useState } from "react";

// UI
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import CoachProfile from "./CoachProfile";

// icons
import { Star } from "./Icons";

const UserComponent = ({ userData }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div
        className="d-flex align-items-center my-2"
        style={{ cursor: "pointer" }}
        onClick={() => setOpenModal(true)}
      >
        <Avatar />
        <div
          className="ms-3"
          style={{
            width: 230,
            textAlign: "initial",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          <Typography>{userData?.name}</Typography>
          <div className="d-flex align-items-center">
            <Star color="#EEB795" />
            <Typography className="ms-1">
              {userData?.score.toFixed(1)}
            </Typography>
          </div>
        </div>
      </div>
      <ShardComponentModal
        width={"md"}
        handleClose={() => setOpenModal(false)}
        body={<CoachProfile userData={userData} setOpenModal={setOpenModal} />}
        isOpen={openModal}
      />
    </>
  );
};

export default UserComponent;
