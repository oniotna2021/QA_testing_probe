import React from "react";
import { useStyles } from "utils/useStyles";

// UI
import { Avatar, Typography } from "@material-ui/core";

// styles
import styled from "@emotion/styled";

// ui
import Button from "@material-ui/core/Button";

const Container = styled.div`
  background-color: white;
  width: 100%;
  border-radius: 10px;
  padding: 0.5rem 3rem 0.5rem 3rem;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CloseButton = styled.div`
  background-color: #f3f3f3;
  padding: 5px 10px 5px 10px;
  border-radius: 10px;
  height: auto;
  cursor: pointer;
`;

const UserCard = ({ data, deleteReservation }) => {
  const classes = useStyles();
  return (
    <Container>
      <div className="row">
        <div className="col-1 d-flex align-items-center">
          <Avatar />
        </div>
        <div className="col-5 d-flex align-items-center">
          <Typography className="ms-4">
            <b>
              {data.first_name} {data.last_name}
            </b>
          </Typography>
        </div>

        <div className="col-3 d-flex align-items-center">
          <Typography className="ms-5">CC</Typography>
          <Typography className="ms-5">{data.document_number}</Typography>
        </div>

        <div className="col-3 d-flex justify-content-end">
          <Button
            style={{
              backgroundColor: "#8c33d3",
              color: "#ffffff",
              fontWeight: "700",
              marginRight: 0,
              borderRadius: 10,
              height: 43,
              width: 205,
            }}
            onClick={() => deleteReservation(data.id)}
          >
            Cancelar reserva
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default UserCard;
