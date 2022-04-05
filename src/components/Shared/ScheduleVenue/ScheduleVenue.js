import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import { IconEditItem } from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";
import { Skeleton } from "@material-ui/lab";

// Services
import { getScheduleVenueById } from "services/Reservations/scheduleVenue";
import { getSchedulesByEmployee } from "services/Reservations/scheduleEmployee";

// conmponents
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import { FormVenueSchedule } from "components/Common/ModuleConfigReservations/Venues/FormsVenue";
import ItemsSchedules from "components/Shared/ScheduleVenue/ItemsSchedule";
import ItemScheduleUser from "components/Shared/ScheduleVenue/ItemsScheduleUser";

//Utils
import { mapErrors, setArrayWeeksDay, groupBy } from "utils/misc";
import ContainerPaginate from "./ContainerPaginate";

const useStyles = makeStyles((theme) => ({
  label: {
    fontWeight: "bold",
    marginLeft: 10,
    color: "rgba(60, 60, 59, 1)",
  },
  containerSchedule: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  boxSchedule: {
    borderRadius: "5px",
  },
}));

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
};

const ScheduleVenue = ({
  idVenue,
  idUser,
  isUser = false,
  isView = false,
  scheduleVirtual,
  isVirtual,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const [scheduleData, setScheduleData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (idVenue && load && !isUser && !isVirtual) {
      getScheduleVenueById(idVenue)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.schedules
          ) {
            setScheduleData(setArrayWeeksDay(data?.data?.schedules));
          } else if (data && data.status === "error" && data.data) {
            console.log(mapErrors(data?.data));
            // enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        })
        .catch((err) => {
          console.log(mapErrors(err));
          // enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoad(false);
        });
    }
  }, [idVenue, enqueueSnackbar, load, isUser, isVirtual]);

  useEffect(() => {
    if (idVenue && load && isUser && idUser && !isVirtual) {
      getSchedulesByEmployee(idVenue, idUser)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.schedules
          ) {
            const arrToSet = groupBy(data?.data?.schedules, "day_week_id");
            setScheduleData(arrToSet);
          } else if (data && data.status === "error" && data.data) {
            console.log(mapErrors(data?.data));
            // enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        })
        .catch((err) => {
          console.log(mapErrors(err));
          // enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoad(false);
        });
    }
  }, [idVenue, enqueueSnackbar, load, idUser, isUser, isVirtual]);

  useEffect(() => {
    setLoad(true);
  }, [idVenue]);

  useEffect(() => {
    if (idVenue === null && isVirtual && scheduleVirtual.length > 0) {
      const arrToSet = groupBy(scheduleVirtual, "day_week_id");
      setScheduleData(arrToSet);
      setLoad(false);
    }
  }, [isVirtual, idVenue, scheduleVirtual]);

  const handleChangeIsEdit = () => {
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsEdit(false);
    setIsOpen(false);
  };

  return (
    <div
      className={`${classes.containerSchedule}`}
      style={{ padding: isUser ? 0 : 10 }}
    >
      {!isView && (
        <div
          className={`d-flex justify-content-between align-items-center mb-2`}
        >
          <Typography className={classes.label} variant="body3">
            {t("HomeTrainingPlans.ScheduleVenue")}
          </Typography>

          <IconButton
            className={`me-2`}
            variant="outlined"
            size="medium"
            onClick={handleChangeIsEdit}
          >
            <IconEditItem color="#3C3C3B" width="25" height="25" />
          </IconButton>
        </div>
      )}
      <div
        className={`${classes.boxSchedule} d-flex ${
          isUser ? "flex-column align-items-center" : "justify-content-between"
        }`}
        style={{ padding: isUser ? 0 : 20 }}
      >
        {load ? (
          <Skeleton animation="wave" width="100%" height={100} />
        ) : (
          <>
            {isUser ? (
              <ContainerPaginate dataItems={scheduleData}>
                {({ itemsPaginate }) => (
                  <ItemScheduleUser scheduleData={itemsPaginate} />
                )}
              </ContainerPaginate>
            ) : (
              <ItemsSchedules scheduleData={scheduleData} />
            )}

            {scheduleData.length === 0 && (
              <Typography className={classes.labelSchedule} variant="body2">
                {isUser
                  ? t("HomeTrainingPlans.ScheduleUserEmpty")
                  : t("HomeTrainingPlans.ScheduleVenueEmpty")}
              </Typography>
            )}
          </>
        )}
      </div>

      <ShardComponentModal
        {...modalProps}
        body={
          <FormVenueSchedule
            setLoadSchedule={setLoad}
            idVenue={idVenue}
            isEdit={isEdit}
            setIsOpen={setIsOpen}
            scheduleVirtual={scheduleVirtual}
            isVirtual={isVirtual}
          />
        }
        isOpen={isOpen}
        handleClose={handleCloseModal}
        title={
          isEdit
            ? t("ListVenues.InputEditVenueSchedule")
            : t("ListVenues.InputCreateVenueSchedule")
        }
      />
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  isVirtual: auth.isVirtual,
});

export default connect(mapStateToProps)(ScheduleVenue);
