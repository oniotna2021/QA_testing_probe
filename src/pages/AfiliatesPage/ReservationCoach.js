import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

//Components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormAfiliateLead from "components/Common/ManageDetailAfiliate/FormAfiliateLead";
import Calendar from "components/Shared/CalendarWithAbsolute/Calendar";

//UI
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

// icons
import { IconSearch } from "assets/icons/customize/config";

//UTILS
import { errorToast, mapErrors } from "utils/misc";
import ItemUserPriorization from "components/Shared/ItemUserPriorization/ItemUserPriorization";

// services
import { getScheduleTrainers } from "services/Reservations/ReservationTrainer";

const useStyles = makeStyles(() => ({
  icon: {
    width: "48px",
    height: "48px",
    background: "#F3F3F3",
    borderRadius: "10px",
  },
  horarios: {
    background: "#F3F3F3",
    borderRadius: "10px",
  },
}));

const dataSubmit = {
  product_id: 1,
  venue_id: 2,
  activity_id: 1,
  day_weeks: [
    { day_week_id: 1, name: "Lunes", time: "08:00" },
    { day_week_id: 4, name: "Jueves", time: "08:00" },
  ],
};

const ReservationCoach = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [schedData, setSchedData] = useState([]);
  const [dataForm, setDataForm] = useState([]);

  useEffect(() => {
    getScheduleTrainers(dataSubmit)
      .then(({ data }) => {
        if (data) {
          console.log(data.data);
          setSchedData(data.data);
          setDataForm(dataSubmit);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <Typography variant="h4">Reservar sesiones</Typography>
        </div>
        <div className="row mt-4">
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body1">Entrenadores disponibles</Typography>
          </div>
          <div className="col-1 d-flex justify-content-center">
            <IconButton className={classes.icon}>
              <IconSearch color="#3c3c3b" />
            </IconButton>
          </div>
          <div className={`col-5 ${classes.horarios}`}></div>
        </div>

        <div className="row">
          <Calendar schedData={schedData} dataForm={dataForm} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReservationCoach;
