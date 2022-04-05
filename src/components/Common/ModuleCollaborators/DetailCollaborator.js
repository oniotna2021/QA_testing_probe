import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {
  IconMonthCalendar,
  IconDayCalendar,
  IconAgenda,
  IconBlockUserSchedule,
  IconForward,
  IconAsignados,
} from "assets/icons/customize/config";
import Skeleton from "@material-ui/lab/Skeleton";

// Components
import AvatarUser from "components/Shared/AvatarUser/AvatarUser";
import CardUserInformation from "./CardUserInformation";
import DayCalendar from "components/Common/ModuleCollaborators/Calendar/DayCalendar";
import FullCalendar from "components/Common/ModuleCollaborators/Calendar/FullCalendar";
import HeaderCalendar from "components/Common/ModuleCollaborators/Calendar/HeaderCalendar";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormNovelty from "./FormNovelty/FormNovelty";
import CustomizedProgressBars from "components/Shared/CustomizedProgressBars/CustomizedProgressBars";
import FormAssingActivity from "components/Common/ModuleCollaborators/FormAssingActivity";
import FormAppointment from "components/Shared/FormAppointment/FormAppointment";

// Service
import { getDetailEmployeeVenueById } from "services/Reservations/employess";

// Hooks
import useQueryParams from "hooks/useQueryParams";

//Utils
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors, isObjectEmpty } from "utils/misc";
import FormEnable from "./FormEnable/FormEnable";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
  style: { padding: "30px" },
};

const DetailCollaborator = ({ venueId, nameCity, venueCityId }) => {
  const theme = useTheme();
  const history = useHistory();
  const { user_id } = useParams();
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [dataUser, setDataUser] = useState({});
  const [isOpen, setIsOpen] = useState(true);
  const [idModal, setIdModal] = useState(0);
  const [fetchReload, setFetchReload] = useState(true);
  const [reloadDataUser, setReloadDataUser] = useState(true);

  // from fullCalendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpenAssingActivity, setIsOpenAssingActivity] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [isOpenAssingQuote, setIsOpenAssingQuote] = useState(false);

  // Calendar Props
  const [isFullCalendar, setIsFullCalendar] = useQueryParams(
    "fullCalendar",
    "true",
    history
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateWeekCalendar, setDateWeekCalendar] = useState(null);

  useEffect(() => {
    const getUserInformation = () => {
      getDetailEmployeeVenueById(user_id)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setDataUser(data?.data);
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
          setLoading(false);
          setReloadDataUser(false);
        });
    };

    if (reloadDataUser) {
      getUserInformation();
    }
  }, [user_id, reloadDataUser, enqueueSnackbar]);

  useEffect(() => {
    setFetchReload(true);
  }, [venueId]);

  const handleClickAssingActivity = () => {
    setIdModal(1);
    setIsOpen(true);
  };

  const handleClickModal = (numberModal) => {
    setIdModal(numberModal);
    setIsOpen(true);
  };

  const handleChangeIsFullCalendar = (value) => {
    if (!value) {
      setIsFullCalendar("false");
    } else {
      setCurrentDate(new Date());
      setSelectedDate(new Date());
      setIsFullCalendar("true");
    }
    setFetchReload(true);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div style={{ height: 5, marginBottom: 7 }}>
            {fetchReload && <CustomizedProgressBars color="primary" />}
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-4 d-flex align-items-center justify-content-center">
                {loading && isObjectEmpty(dataUser) ? (
                  <Skeleton
                    animation="wave"
                    variant="circle"
                    width={100}
                    height={100}
                  />
                ) : (
                  <AvatarUser
                    photo={dataUser?.photo}
                    isCenter={true}
                    userEmail={`${dataUser.first_name} ${dataUser.last_name}`}
                  />
                )}
              </div>

              <div className="col d-flex flex-column justify-items-center justify-content-center">
                <div>
                  <Typography variant="body1">
                    {/* { loading && isObjectEmpty(dataUser) ? <Skeleton animation="wave" /> : `Último ingreso, 16 de Julio 2021`} */}
                  </Typography>
                </div>
                <div>
                  <Typography className={classes.textBold} variant="body1">
                    {loading && isObjectEmpty(dataUser) ? (
                      <Skeleton animation="wave" />
                    ) : (
                      `${dataUser.first_name} ${dataUser.last_name}`
                    )}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="col d-flex justify-content-end">
            <div className="d-flex justify-content-between align-items-center">
              <div className="me-4">
                <Button
                  onClick={() => handleClickModal(3)}
                  className={classes.buttonNews}
                  startIcon={<IconAgenda color={theme.palette.primary.main} />}
                >
                  {t("DetailCollaborator.ButtonEnable")}
                </Button>
              </div>

              <div className="me-4">
                <Button
                  onClick={() => handleClickModal(2)}
                  className={classes.buttonNews}
                  startIcon={
                    <IconBlockUserSchedule color={theme.palette.primary.main} />
                  }
                >
                  {t("DetailCollaborator.ButtonNovelties")}
                </Button>
              </div>

              <div>
                <div
                  className="col d-flex justify-content-end"
                  style={{ marginRight: "12px" }}
                >
                  <IconButton onClick={() => handleChangeIsFullCalendar(true)}>
                    <IconMonthCalendar color={theme.palette.black.main} />
                  </IconButton>
                  <IconButton onClick={() => handleChangeIsFullCalendar(false)}>
                    <IconDayCalendar color={theme.palette.black.main} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-4"></div>
          <div className="col-8 mb-4">
            <HeaderCalendar
              dateWeekCalendar={dateWeekCalendar}
              setDateWeekCalendar={setDateWeekCalendar}
              isFullCalendar={isFullCalendar}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              setFetchReload={setFetchReload}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <div className="d-flex flex-column">
              <CardUserInformation
                dataUser={dataUser}
                setFetchReload={setFetchReload}
                setReloadDataUser={setReloadDataUser}
              />
            </div>
            <Button
              onClick={() => history.push(`/partners-journey/${user_id}`)}
              color="primary"
              variant="contained"
              fullWidth
              className={classes.asignadosButton}
            >
              <IconAsignados />
              <p className={classes.asignadosButtonText}>Usuarios asignados</p>
              <IconForward />
            </Button>
          </div>
          <div className="col-8">
            {isFullCalendar === "true" ? (
              <FullCalendar
                dataUser={dataUser}
                setFetchReload={setFetchReload}
                fetchReload={fetchReload}
                userId={user_id}
                currentDate={currentDate}
                handleClickAssingActivity={handleClickAssingActivity}
                // changes
                handleChangeIsFullCalendar={handleChangeIsFullCalendar}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                setIsOpenAssingActivity={setIsOpenAssingActivity}
                setDateWeekCalendar={setDateWeekCalendar}
                setCurrentDate={setCurrentDate}
                setIsFull={setIsFull}
                setIsOpenAssingQuote={setIsOpenAssingQuote}
                setIsNew={setIsNew}
              />
            ) : (
              <DayCalendar
                dataUser={dataUser}
                dateWeekCalendar={dateWeekCalendar}
                setFetchReload={setFetchReload}
                fetchReload={fetchReload}
                userId={user_id}
                currentDate={currentDate}
                handleClickAssingActivity={handleClickAssingActivity}
                // changes
                setIsOpenAssingActivity={setIsOpenAssingActivity}
                setSelectedDate={setSelectedDate}
                setCurrentDate={setCurrentDate}
              />
            )}
          </div>
        </div>
      </div>

      {idModal === 2 && (
        <ShardComponentModal
          fullWidth
          {...modalProps}
          body={
            <FormNovelty
              setFetchReload={setFetchReload}
              userId={user_id}
              setIsOpen={setIsOpen}
              handleClose={() => {
                setFetchReload(true);
                setIsOpen(false);
              }}
            />
          }
          isOpen={isOpen}
        />
      )}

      {idModal === 3 && (
        <ShardComponentModal
          fullWidth
          {...modalProps}
          body={
            <FormEnable
              title={t("DetailCollaborator.ButtonEnable")}
              setFetchReload={setFetchReload}
              userId={user_id}
              setIsOpen={setIsOpen}
              handleClose={() => {
                setFetchReload(true);
                setIsOpen(false);
              }}
            />
          }
          isOpen={isOpen}
        />
      )}

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <FormAssingActivity
            handleClose={() => {
              setFetchReload(true);
              setIsOpenAssingActivity(false);
            }}
            setFetchReload={setFetchReload}
            selectedDate={selectedDate}
            userId={user_id}
            setIsOpen={setIsOpen}
            venueId={venueId}
          />
        }
        isOpen={isOpenAssingActivity}
        handleClose={() => setIsOpenAssingActivity(false)}
        title={"Asignar actividad"}
      />

      <ShardComponentModal
        width="sm"
        body={
          <FormAppointment
            venueCityIdDefault={venueCityId}
            venueCityNameDefault={nameCity}
            venueIdDefaultProfile={venueId}
            isFull={isFull}
            handleClose={() => {
              setIsOpenAssingQuote(false);
              setFetchReload(true);
            }}
            date={selectedDate}
            setIsOpen={setIsOpenAssingQuote}
            isNew={isNew}
            defaultValues={{
              hour: "",
              date: null,
              id_medical: user_id,
              profile_appointment_types: dataUser?.profile_appointment_types,
              venues: dataUser?.venues,
            }}
          />
        }
        isOpen={isOpenAssingQuote}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
  venueCityId: auth.venueCityIdDefault,
  nameCity: auth.venueCityNameDefault,
});

export default connect(mapStateToProps)(DetailCollaborator);
