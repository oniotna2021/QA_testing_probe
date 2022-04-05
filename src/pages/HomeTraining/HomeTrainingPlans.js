import { ChartOne, ChartTwo } from "assets/images/charts";
//ICONS
import {
  IconArrowRightMin,
  IconHomeBrokenHeart,
  IconHomeContainer,
  IconHomeHeart,
} from "assets/icons/customize/config";
import React, { useEffect, useState } from "react";
import { errorToast, mapErrors, testCapacityData } from "utils/misc";
import {
  getQuotesByMonthForMedical,
  getQuotesByProfessionalID,
} from "services/MedicalSoftware/Quotes";

// import TurnsWorkingVenue from "components/Shared/TurnsWorkingVenue/TurnsWorkingVenue";
import ActivitiesVenue from "components/Shared/ActivitiesVenue/ActivitiesVenue";
//Components
import AvatarUser from "components/Shared/AvatarUser/AvatarUser";
import Box from "@material-ui/core/Box";
//UI
import Button from "@material-ui/core/Button";
import CardsHomeMedical from "components/Shared/ListAppointments/CardsHomeMedical";
//Routes
import { ConfigNameRoutes } from "router/constants";
import CreateBookingAfiliate from "components/Shared/CreateBookingAfiliate";
// Charts
import { CustomBarChart } from "components/Shared/Charts/CustomBarChart";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import ListAppointments from "components/Shared/ListAppointments/ListAppointments";
import ListCollaborators from "components/Shared/ListCollaborators/ListCollaborators";
import ListUsersWithoutPlan from "components/Shared/ListUsersWithoutPlan/ListUsersWithoutPlan";
import Loading from "components/Shared/Loading/Loading";
import Rating from "@material-ui/lab/Rating";
import ScheduleVenue from "components/Shared/ScheduleVenue/ScheduleVenue";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { format } from "date-fns";
import { getDateReservation } from "services/Reservations/ReserveInVenue";
//Services
import { getSessionsForTrainer } from "services/TrainingPlan/Sessions";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
//UTILS
import { useStyles } from "utils/useStyles";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const HomeTrainingPlans = ({
  userId,
  venueIdDefaultProfile,
  userStar,
  userType,
  userProfileName,
  userProfileId,
  userEmail,
  userNameRole,
  isVirtual,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const classes = useStyles();
  const { t } = useTranslation();
  const [dataSessions, setDataSessions] = useState([]);
  const [dataQuotes, setDataQuotes] = useState([]);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [loadData, setLoadData] = useState(false);
  const [month, setMonth] = useState(String(`0${new Date().getMonth() + 1}`));
  const [quoteForMonth, setQuoteFormMonth] = useState([]);
  const [reload, setReload] = useState(false);
  const [hourCapacity, setHourCapacity] = useState();
  const [isLoading, setIsLoading] = useState(false);

  let year = selectedDate.getFullYear();
  let currentDate = new Date();
  // fecha y hora actual
  let hoy = format(new Date(), "yyy-MM-dd");

  const dataH = [
    {
      hour: "10:00:00",
      total: 1,
    },
  ];
  useEffect(() => {
    if (venueIdDefaultProfile && venueIdDefaultProfile !== null) {
      setLoadData(true);
      getQuotesByProfessionalID(
        userId,
        format(currentDate, "yyyy-MM-dd"),
        venueIdDefaultProfile
      )
        .then(({ data }) => {
          if (data && data.status === "success") {
            setDataQuotes(data?.data?.quotes);
          }
          setLoadData(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userId !== undefined && userId !== null) {
      let formatMonth =
        new Date(month).getMonth() + 1 > 9
          ? `${new Date(month).getMonth() + 1}`
          : `0${new Date(month).getMonth() + 1}`;
      getQuotesByMonthForMedical(year, formatMonth, userId)
        .then(({ data }) => {
          if (data && data.status === "success") {
            setQuoteFormMonth(
              data?.data.quotes_date.reduce((total, quote) => {
                return Number(total + Number(quote.total));
              }, 0)
            );
          } else {
            setQuoteFormMonth([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userId, year, month, enqueueSnackbar]);

  useEffect(() => {
    if (userId) {
      getSessionsForTrainer(userId, 5, 1)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data?.data?.items
          ) {
            setDataSessions(data.data.items);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, userId]);

  useEffect(() => {
    // hora y aforo
    if (venueIdDefaultProfile && venueIdDefaultProfile !== null) {
      getDateReservation(venueIdDefaultProfile, hoy)
        .then(({ data }) => {
          if (data && data.status === "success") {
            setHourCapacity(
              data.data.map((x) => {
                return {
                  hour: format(new Date(`2021-08-18T${x.hour}`), "hh:mm aaa"),
                  total: x.total,
                };
              })
            );
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [venueIdDefaultProfile, hoy, isLoading]);

  const goListCompleted = () => {
    history.push(ConfigNameRoutes.listSessions);
  };

  const goListAppointments = () => {
    history.push(ConfigNameRoutes.quotes);
  };

  return (
    <div className="container">
      <div className="row m-0">
        <div className="col-9 p-0">
          <div className="row">
            <div className="col-12 p-0" style={{ position: "relative" }}>
              <div className={classes.imageContainer}>
                <IconHomeContainer />
              </div>
              <div className={classes.containerImageTrainer}>
                <div className="d-flex flex-column align-items-end">
                  <Typography variant="h5">
                    {t("HomeTrainingPlans.Hi")}, {userProfileName}!
                  </Typography>
                  <Typography variant="h6">{userNameRole}</Typography>
                  <Typography variant="body2" style={{ marginTop: 20 }}>
                    {t("HomeTrainingPlans.MemberTime")}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {(userProfileId === 5 || userProfileId === 4) && (
            <div className="row mt-5">
              <div className="col-12">
                <div className="d-flex justify-content-between">
                  <Button
                    component={Link}
                    to={ConfigNameRoutes.listSessions}
                    className={classes.buttonConfig}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <IconHomeHeart color={theme.palette.primary.light} />
                      <Typography variant="h6" align="center">
                        {t("HomeTrainingPlans.ConfigureSession")}
                      </Typography>
                    </div>
                  </Button>

                  <Button
                    component={Link}
                    to={ConfigNameRoutes.createTraining}
                    className={classes.buttonConfig}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <IconHomeHeart color={theme.palette.primary.light} />
                      <Typography variant="h6" align="center">
                        {t("TrainingPlan.title")}
                      </Typography>
                    </div>
                  </Button>
                  <Button
                    component={Link}
                    to={ConfigNameRoutes.exercices}
                    className={classes.buttonConfig}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <IconHomeBrokenHeart
                        color={theme.palette.primary.light}
                      />
                      <Typography variant="h6" align="center">
                        {t("HomeTrainingPlans.ConfigureExercise")}
                      </Typography>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {(userProfileId === 6 || userProfileId === 14) && !isVirtual && (
            <div className="row mt-4">
              <div className="col-6 p-0 pe-3">
                <ScheduleVenue idVenue={venueIdDefaultProfile} />
              </div>

              <div className="col-3 p-0 pe-3">
                <CreateBookingAfiliate
                  idVenue={venueIdDefaultProfile}
                  setIsLoading={setIsLoading}
                  isLoading={isLoading}
                />
                {/* <TurnsWorkingVenue idVenue={venueIdDefaultProfile} /> */}
              </div>
              <div className="col-3 p-0">
                <ActivitiesVenue idVenue={venueIdDefaultProfile} />
              </div>
            </div>
          )}

          {(userProfileId === 5 || userProfileId === 4) && (
            <div className="row mt-5">
              <div className="col-7 pe-3">
                <div className={classes.containerChart}>
                  {t("Affiliates.Title")}
                  <div className="mt-4">
                    <ChartTwo />
                  </div>
                </div>
              </div>
              <div className="col-5 p-0">
                <div className={classes.containerChart}>
                  <Typography variant="body1">
                    {t("HomeTrainingPlans.Use")}
                  </Typography>
                  <div className="mt-4 ms-4">
                    <ChartOne />
                  </div>
                </div>
              </div>
            </div>
          )}

          {userProfileId === 6 && (
            <div className="row mt-3">
              <div className="col-6 p-0 pe-3">
                <div className={classes.containerChart}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                      <Typography className="me-3">
                        <b>{t("ListLocation.Capacity")} </b>
                      </Typography>

                      {/* <Typography>150 personas</Typography> */}
                    </div>

                    <IconButton
                      style={{ backgroundColor: "#F3F3F3", borderRadius: 10 }}
                      onClick={() => history.push("/maximum-capacity")}
                    >
                      <IconArrowRightMin color="black" />
                    </IconButton>
                  </div>

                  <div
                    className="mt-4"
                    style={{ width: "100%", height: "215px" }}
                  >
                    {isLoading ? (
                      <Loading />
                    ) : (
                      <CustomBarChart data={hourCapacity} />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-6 p-0">
                <ListUsersWithoutPlan
                  venueIdDefaultProfile={venueIdDefaultProfile}
                  reload={reload}
                  setReload={setReload}
                />
              </div>
            </div>
          )}

          {userType === 3 && (
            <div className="row m-0 mt-3">
              <CardsHomeMedical
                dataQuotes={dataQuotes}
                quoteForMonth={quoteForMonth}
              />
              <div className="col-8 p-0 mt-3">
                <div
                  className="d-flex justify-content-between mb-3 align-items-center"
                  style={{ marginRight: 30 }}
                >
                  <Typography style={{ fontWeight: "bold" }}>
                    {t("HomeTrainingPlans.UpcomingAppointments")}
                  </Typography>
                  <IconButton onClick={() => goListAppointments()}>
                    <Typography variant="body1">
                      {t("HomeTrainingPlans.SeeAll")}
                    </Typography>
                  </IconButton>
                </div>
                <ListAppointments
                  data={dataQuotes}
                  userId={userId}
                  loader={loadData}
                />
              </div>
            </div>
          )}
        </div>
        <div className="col-3 mt-4">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <div className="mt-3 d-flex flex-column align-items-center">
              <AvatarUser isCenter={true} userEmail={userEmail} />
              <br></br>
              <Typography variant="p">{userProfileName}</Typography>
              <Typography variant="p">{userNameRole}</Typography>
            </div>
          </div>
          <div className="row m-0 mt-4">
            <div className="d-flex flex-row justify-content-center">
              <Rating name="read-only" value={userStar} readOnly />
            </div>
          </div>
          {(userProfileId === 5 || userProfileId === 4) && (
            <div className="row m-0 mt-4">
              <div className="d-flex flex-column align-items-center">
                <Typography variant="h6">
                  {t("HomeTrainingPlans.History")}
                </Typography>
                <Typography variant="p">
                  {t("HomeTrainingPlans.CreateSessions")}
                </Typography>
              </div>
            </div>
          )}
          <div className="row m-0 mt-4">
            {(userProfileId === 5 || userProfileId === 4) && (
              <div className="d-flex flex-column align-items-center">
                {dataSessions.length === 0 ? (
                  <Box
                    style={{ height: "50vh" }}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Typography variant="body2" component="h6">
                      {t("DataEmpty")}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {dataSessions &&
                      dataSessions.map((x) => (
                        <div
                          key={`item-session-` + x.id}
                          className={classes.itemSesion}
                        >
                          {x.name}
                        </div>
                      ))}

                    <div
                      onClick={goListCompleted}
                      className={classes.buttonCollaborator}
                      style={{ width: "70%" }}
                    >
                      <div className="d-flex justify-content-between align-items-center p-1">
                        <Typography
                          className={classes.fontCardSchedule}
                          variant="body1"
                        >
                          {t("HomeTrainingPlans.SeeAll")}
                        </Typography>

                        <Button>
                          <IconArrowRightMin
                            color="#3C3C3B"
                            width="10"
                            height="20"
                          />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {(userProfileId === 6 || userProfileId === 14) && (
              <div className="d-flex flex-column mt-4">
                <Typography variant="h6">
                  {t("Menu.Title.Collaborators")}
                </Typography>

                <ListCollaborators idVenue={venueIdDefaultProfile} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userProfileName: auth.userProfileName,
  userType: auth.userType,
  userId: auth.userId,
  userEmail: auth.userEmail,
  userStar: auth.userStar,
  venueIdDefaultProfile: auth.venueIdDefaultProfile,
  userNameRole: auth.userNameRole,
  userProfileId: auth.userProfileId,
  isVirtual: auth.isVirtual,
});

export default connect(mapStateToProps)(HomeTrainingPlans);
