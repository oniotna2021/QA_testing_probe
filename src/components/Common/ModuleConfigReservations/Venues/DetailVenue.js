import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// UI
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

// Components
import Loading from "components/Shared/Loading/Loading";
import { IconEditItem, IconDeleteItem } from "assets/icons/customize/config";
import FormVenue from "components/Common/ModuleConfigReservations/Venues/FormVenue";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

// Components Form
import {
  FormVenueTurnsWorking,
  FormsVenueActivities,
  FormVenueLocation,
} from "components/Common/ModuleConfigReservations/Venues/FormsVenue";

//Swal
import Swal from "sweetalert2";

// Service
import { getVenueByUUID, deleteVenue } from "services/Reservations/venues";
import { getScheduleVenueById } from "services/Reservations/scheduleVenue";

//Utils
import { errorToast, mapErrors, setArrayWeeksDay } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

const useStyles = makeStyles((theme) => ({
  boxMarginLeft: {
    marginLeft: 52,
  },
  backgroundDescription: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  descriptionLabel: {
    marginLeft: 20,
    color: "rgba(60, 60, 59, 1)",
  },
  label: {
    marginRight: 10,
    color: "rgba(60, 60, 59, 1)",
  },
  pill: {
    backgroundColor: "#3C3C3B",
    padding: 5,
    color: "#ffffff",
    borderRadius: 10,
    marginRight: 4,
    marginBottom: 4,
  },
  buttonIcon: {
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
  },
  boxSchedule: {
    backgroundColor: "#F3F3F3",
    padding: "20px",
    borderRadius: "5px",
  },
  labelSchedule: {
    fontWeight: "bold",
    textAlign: "center",
  },
  alignSchedule: {
    textAlign: "center",
  },
}));

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
};

const DetailVenue = ({
  idDetail,
  setLoad,
  setExpanded,
  isEdit,
  setIsEdit,
  files,
  setFiles,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const [dataDetail, setDataDetail] = useState({});
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);
  const [modalID, setModalId] = useState(0);
  const [idVenue, setIdVenue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (() => {
      getVenueByUUID(idDetail)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setDataDetail(data?.data);
            setIdVenue(data?.data?.id);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    })();
  }, [idDetail, enqueueSnackbar]);

  useEffect(() => {
    if (idVenue && loadingSchedule) {
      getScheduleVenueById(idVenue)
        .then(({ data }) => {
          if (data.status === "success" && data?.data?.schedules) {
            setScheduleData(setArrayWeeksDay(data?.data?.schedules));
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoadingSchedule(false);
        });
    }
  }, [idVenue, enqueueSnackbar, loadingSchedule]);

  const deleteForm = () => {
    Swal.fire({
      title: t("Message.AreYouSure"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Message.YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteVenue(idDetail)
          .then((req) => {
            Swal.fire(
              t("Message.Eliminated"),
              t("Message.EliminatedSuccess"),
              "success"
            );
            setLoad(true);
          })
          .catch((err) => {
            Swal.fire(t("Message.ErrorOcurred"), mapErrors(err), "error");
          });
      }
    });
  };

  const handleChangeIsEdit = () => {
    setIsEdit(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setModalId(0);
  };

  const handleClickModal = (id) => {
    setIsOpen(true);
    setModalId(id);
  };

  return (
    <>
      <div>
        {Object.keys(dataDetail).length === 0 ? (
          <Loading />
        ) : isEdit ? (
          <FormVenue
            files={files}
            setFiles={setFiles}
            dataItem={dataDetail}
            defaultValue={dataDetail}
            isEdit={true}
            setExpanded={setExpanded}
            setLoad={setLoad}
          />
        ) : (
          <div className="row gx-4">
            <div className="col-5">
              <div className="row">
                <div className="col-6">
                  <Typography className={classes.label} variant="body3">
                    {t("DetailVenue.Address")}
                  </Typography>
                  <Typography variant="body2">{dataDetail.address}</Typography>
                </div>

                <div className="col-6">
                  <Typography className={classes.label} variant="body3">
                    {t("DetailVenue.GymCapacity")}
                  </Typography>
                  <Typography variant="body2">{dataDetail.capacity}</Typography>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-6">
                  <Typography className={classes.label} variant="body3">
                    {t("DetailVenue.CapacityCloseZone")}
                  </Typography>
                  <Typography variant="body2">
                    {dataDetail.capacity_closed_zone
                      ? dataDetail.capacity_closed_zone
                      : "----"}
                  </Typography>
                </div>

                <div className="col-6">
                  <Typography className={classes.label} variant="body3">
                    {t("DetailVenue.CapacityTrainingZone")}
                  </Typography>
                  <Typography variant="body2">
                    {dataDetail.gym_capacity}
                  </Typography>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-6">
                  <Typography className={classes.label} variant="body3">
                    {t("DetailVenue.CellPhone")}
                  </Typography>
                  <Typography variant="body2">
                    {dataDetail.phone_number}
                  </Typography>
                </div>

                <div className="col-6">
                  <Typography className={classes.label} variant="body3">
                    {t("DetailVenue.CDHS")}
                  </Typography>
                  <Typography variant="body2">
                    {" "}
                    {dataDetail.enabling_code
                      ? dataDetail.enabling_code
                      : "----"}{" "}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="col-5">
              <Typography className={classes.label} variant="body3">
                {t("DetailVenue.Schedule")}
              </Typography>
              <div
                className={`${classes.boxSchedule} d-flex justify-content-between mt-2`}
              >
                {loadingSchedule ? (
                  <Loading />
                ) : (
                  <>
                    {scheduleData &&
                      scheduleData.map((schedule, index) => (
                        <div key={index} className="text-center">
                          <Typography
                            className={classes.labelSchedule}
                            variant="body2"
                          >
                            {schedule.name}
                          </Typography>
                          <Typography
                            className={classes.alignSchedule}
                            variant="body2"
                          >
                            {schedule.start_time}
                          </Typography>
                          <Typography
                            className={classes.alignSchedule}
                            variant="body2"
                          >
                            {schedule.end_time}
                          </Typography>
                        </div>
                      ))}
                    {scheduleData.length === 0 && (
                      <Typography
                        className={classes.labelSchedule}
                        variant="body2"
                      >
                        {t("HomeTrainingPlans.ScheduleVenueEmpty")}
                      </Typography>
                    )}
                  </>
                )}
              </div>

              <div className="row mt-3 gx-2">
                <div className="col-4">
                  <ButtonSave
                    onClick={() => handleClickModal(3)}
                    style={{ width: "100%" }}
                    text={t("DetailVenue.Turns")}
                    typeButton="button"
                  />
                </div>
                <div className="col-4">
                  <ButtonSave
                    onClick={() => handleClickModal(2)}
                    style={{ width: "100%" }}
                    text={t("DetailVenue.Locations")}
                    typeButton="button"
                  />
                </div>
                <div className="col-4">
                  <ButtonSave
                    onClick={() => handleClickModal(4)}
                    style={{ width: "100%" }}
                    text={t("ListActivities.Container")}
                    typeButton="button"
                  />
                </div>
              </div>
            </div>

            <div className="col-2 d-flex justify-content-end">
              <div className="d-flex column align-content-center align-items-end">
                <ActionWithPermission isValid={permissionsActions.edit}>
                  <IconButton
                    className={`${classes.buttonIcon} me-2`}
                    variant="outlined"
                    size="medium"
                    onClick={handleChangeIsEdit}
                  >
                    <IconEditItem color="#3C3C3B" width="25" height="25" />
                  </IconButton>
                </ActionWithPermission>

                <ActionWithPermission isValid={permissionsActions.delete}>
                  <IconButton
                    className={classes.buttonIcon}
                    variant="outlined"
                    size="medium"
                    onClick={deleteForm}
                  >
                    <IconDeleteItem color="#3C3C3B" width="25" height="25" />
                  </IconButton>
                </ActionWithPermission>
              </div>
            </div>
          </div>
        )}
      </div>

      {modalID === 2 && (
        <ShardComponentModal
          {...modalProps}
          body={
            <FormVenueLocation
              files={files}
              idVenue={idVenue}
              isEdit={false}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
          handleClose={handleCloseModal}
          title={t("ListVenues.InputCreateVenueLocation")}
        />
      )}
      {modalID === 3 && (
        <ShardComponentModal
          {...modalProps}
          body={
            <FormVenueTurnsWorking
              idVenue={idVenue}
              isEdit={false}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
          handleClose={handleCloseModal}
          title={t("ListVenues.InputCreateVenueTurnsWorking")}
        />
      )}
      {modalID === 4 && (
        <ShardComponentModal
          {...modalProps}
          body={
            <FormsVenueActivities
              idVenue={idVenue}
              isEdit={false}
              setIsOpen={setIsOpen}
            />
          }
          isOpen={isOpen}
          handleClose={handleCloseModal}
          title={t("ListVenues.InputSelectActivities")}
        />
      )}
    </>
  );
};

export default DetailVenue;
