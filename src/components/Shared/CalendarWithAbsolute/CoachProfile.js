import React, { useContext, useState } from "react";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import format from "date-fns/format";
import { makeStyles } from "@material-ui/core/styles";

// ui
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import { CircularProgress } from "@material-ui/core";

// icons
import { Star } from "./Icons";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ScheduleSession from "./ScheduleSession";

const useStyles = makeStyles(() => ({
  cancel: {
    width: "188px",
    height: "48px",
    border: "1px solid #8D33D3",
    borderRadius: "10px",
    color: "#8D33D3",
  },
  reserva: {
    width: "188px",
    height: "48px",
    background: "#8D33D3",
    borderRadius: "10px",
    color: "#ffff",
    "&:hover": {
      background: "#8D33D3",
    },
  },
}));

const CoachProfile = ({ userData, setOpenModal }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [openReserva, setOpenReserva] = useState(false);

  const data = [
    {
      name: "Benito Benitez",
      age: "27 años",
      title: "DEPORTÓLOGO, AUMENTO MUSCULAR",
      stars: "3.0",
      description:
        "Entrenador especializado en ganancia muscular y rehabilitación articular.",
    },
  ];

  const start_date = startOfWeek(new Date());
  const end_date = endOfWeek(new Date());

  const reserveLessons = () => {
    console.log("ok");
  };

  return (
    <Container>
      <div className="d-flex mt-5">
        <div className="d-flex align-items-center">
          <Avatar style={{ width: "2.4em", height: "2.4em" }} />
        </div>
        <div className="ms-3">
          {data.map((item) => (
            <>
              <div>
                <p style={{ margin: "0em" }}>
                  <b>{userData.name}</b>
                </p>
                <p style={{ margin: 0 }}>{item.age}</p>
              </div>
              <div className="d-flex align-items-center">
                <Star color="#D1ADED" />
                <p
                  style={{ margin: "0px 5px 0px 5px" }}
                >{`${userData.score}.0`}</p>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="my-5">
        {data.map((item, i) => (
          <div>
            <p>
              <b>{item.title}</b>
            </p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between mb-4">
        <div>
          <Button
            className={classes.cancel}
            onClick={() => setOpenModal(false)}
          >
            Cancelar
          </Button>
        </div>
        <div>
          <Button
            className={classes.reserva}
            onClick={() => setOpenReserva(true)}
          >
            Reservar
            {isLoading && (
              <div className="ms-3 pt-2">
                <CircularProgress size={20} color="white" />
              </div>
            )}
          </Button>
        </div>
      </div>
      <ShardComponentModal
        title={"Reservar sesión"}
        width={"md"}
        handleClose={() => setOpenReserva(false)}
        body={<ScheduleSession setOpenReserva={setOpenReserva} />}
        isOpen={openReserva}
      />
    </Container>
  );
};

export default CoachProfile;
