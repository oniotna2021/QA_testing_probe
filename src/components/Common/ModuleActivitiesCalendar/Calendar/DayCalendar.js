import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

//Components
import Loading from "components/Shared/Loading/Loading";
import ItemDayCalendar from "./ItemDayCalendar";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormReserveUser from "../FormReserveUser";
import FormRemoveActivity from "../FormRemoveActivity";

//ICONS
import { IconCalendar } from "assets/icons/customize/config";

//UI
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Typography } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

//Services
import { getActivitiesByVenueByDay } from "services/Reservations/activitiesCalendar";

// Utils
import { useStyles } from "utils/useStyles";
import {
  createBlockHours,
  generateRandomColor,
  errorToast,
  mapErrors,
  infoToast,
} from "utils/misc";

const hours = [
  { id: 4, hour: "4:00", realHour: "04:00:00" },
  { id: 5, hour: "5:00", realHour: "05:00:00" },
  { id: 6, hour: "6:00", realHour: "06:00:00" },
  { id: 7, hour: "7:00", realHour: "07:00:00" },
  { id: 8, hour: "8:00", realHour: "08:00:00" },
  { id: 9, hour: "9:00", realHour: "09:00:00" },
  { id: 10, hour: "10:00", realHour: "10:00:00" },
  { id: 11, hour: "11:00", realHour: "11:00:00" },
  { id: 12, hour: "12:00", realHour: "12:00:00" },
  { id: 13, hour: "13:00", realHour: "13:00:00" },
  { id: 14, hour: "14:00", realHour: "14:00:00" },
  { id: 15, hour: "15:00", realHour: "15:00:00" },
  { id: 16, hour: "16:00", realHour: "16:00:00" },
  { id: 17, hour: "17:00", realHour: "17:00:00" },
  { id: 18, hour: "18:00", realHour: "18:00:00" },
  { id: 19, hour: "19:00", realHour: "19:00:00" },
  { id: 20, hour: "20:00", realHour: "20:00:00" },
  { id: 21, hour: "21:00", realHour: "21:00:00" },
  { id: 22, hour: "22:00", realHour: "22:00:00" },
  { id: 23, hour: "23:00", realHour: "23:00:00" },
];

const arrayHours = [
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
];

const DayCalendar = ({
  venueId,
  fetchReload,
  setFetchReload,
  currentDate,
  selectActivityId,
  setListActivities,
  selectVenues,
  userType,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const { t } = useTranslation();

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [dataActivities, setDataActivities] = useState([]);
  const [dataSchedules, setDataSchedules] = useState([]);

  const [openFormReserveUser, setOpenFormReserveUser] = useState(false);
  const [openActivityDetail, setOpenActivityDetail] = useState(false);
  const [dataDetailActivity, setDataDetailActivity] = useState({});

  const formatCurrentDate = format(currentDate, "yyyy-MM-dd");

  useEffect(() => {
    if (
      fetchReload &&
      formatCurrentDate &&
      (venueId !== undefined || selectVenues)
    ) {
      setLoadingFetch(true);
      getActivitiesByVenueByDay(
        venueId || (selectVenues === null ? 0 : selectVenues),
        formatCurrentDate
      )
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setDataActivities(data.data);
            setListActivities(
              data?.data.map((p) => ({ id: p.id, name: p.name_activity }))
            );
            const dataSchedule = data.data.map((activity) => {
              const colour = activity?.activity_color
                ? activity?.activity_color
                : generateRandomColor();
              return {
                ...activity,
                blocks: createBlockHours(
                  activity.dates.map((schedule, idx) => {
                    return {
                      ...schedule,
                      activity_id: idx,
                      activity_name: `${activity.name_activity}`,
                      start_time: schedule.start_time,
                      end_time: schedule.end_time,
                      start_date: schedule.start_time,
                      end_date: schedule.end_time,
                      is_quote: false,
                      color: colour,
                    };
                  }) || [],
                  arrayHours
                ),
              };
            });

            setDataSchedules(dataSchedule);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoadingFetch(false);
          setFetchReload(false);
        });
    }
  }, [
    venueId,
    fetchReload,
    setFetchReload,
    enqueueSnackbar,
    formatCurrentDate,
    setListActivities,
    selectVenues,
  ]);

  useEffect(() => {
    setFetchReload(true);
  }, [venueId, setFetchReload]);

  const dataFilter = useMemo(() => {
    let dataArr = [...dataActivities];

    if (selectActivityId.length !== 0) {
      return dataActivities.filter((p) =>
        selectActivityId.some(
          (nameActivity) => p.name_activity === nameActivity
        )
      );
    }

    return dataArr;
  }, [dataActivities, selectActivityId]);

  const dataFilterSchedules = useMemo(() => {
    let dataArr = [...dataSchedules];

    if (selectActivityId.length !== 0) {
      return dataSchedules.filter((p) =>
        selectActivityId.some(
          (nameActivity) => p.name_activity === nameActivity
        )
      );
    }

    return dataArr;
  }, [dataSchedules, selectActivityId]);

  const onDetailActivityClick = (activityIdDetail, idActivity, type) => {
    const dataActivity = dataSchedules.find((p) => p.id === idActivity);
    const findActivityData = dataActivity.dates.find(
      (a) => a.id === Number(activityIdDetail)
    );
    if (Object.keys(findActivityData).length > 0) {
      setDataDetailActivity({
        ...findActivityData,
        location_name: findActivityData.name_location,
        activity_name: dataActivity.name_activity,
        date: formatCurrentDate,
      });
      if (type === "edit") {
        setOpenActivityDetail(true);
        return;
      }
      setOpenFormReserveUser(true);
    }
  };

  const handleClickViewDetail = (id, nameActivity, startTime, endTime) => {
    if (id === "") {
      enqueueSnackbar(
        t("FormReserveUserActivity.MessageEmptyReservations"),
        infoToast
      );
      return;
    }
    const formatCurrentDate = format(currentDate, "yyyy-MM-dd");
    history.push(
      `/group-activity-detail/${id}?date=${formatCurrentDate}&nameActivity=${nameActivity}&startTime=${startTime}&endTime=${endTime}`
    );
  };

  return (
    <>
      <div className="calendar">
        {loadingFetch && dataFilterSchedules.length === 0 ? (
          <Loading />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table stickyHeader={true}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <div className="d-flex justify-content-center alig-content-center">
                      <IconCalendar color={theme.palette.black.main} />
                    </div>
                  </TableCell>
                  {dataFilter &&
                    dataFilter.map((item) => (
                      <TableCell
                        style={{ width: "300px" }}
                        key={"tb-" + item.id}
                      >
                        <div className="d-flex justify-content-center align-items-center">
                          <Avatar className="me-2" src={item.img}></Avatar>
                          <Typography
                            noWrap
                            className={classes.fotnDayCalendar}
                          >
                            <b>{item.name_activity}</b>
                          </Typography>
                        </div>
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {hours &&
                  hours.map((hour) => (
                    <TableRow key={hour.id} role="checkbox">
                      <TableCell style={{ padding: "0 16px", width: "100px" }}>
                        <div className="d-flex justify-content-center align-content-center">
                          <b>{hour.hour}</b>
                        </div>
                      </TableCell>

                      {dataFilterSchedules &&
                        dataFilterSchedules.map((item, i) => (
                          <ItemDayCalendar
                            key={i}
                            hour={hour}
                            dataItem={item}
                            userType={userType}
                            onClick={onDetailActivityClick}
                            handleClickViewDetail={handleClickViewDetail}
                          />
                        ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <ShardComponentModal
        width="sm"
        fullWidth="true"
        handleClose={() => setOpenFormReserveUser(false)}
        title={t("Btn.scheduleUser")}
        body={
          <FormReserveUser
            setIsOpen={setOpenFormReserveUser}
            dataDetailActivity={dataDetailActivity}
            handleClose={() => {
              setFetchReload(true);
              setOpenFormReserveUser(false);
            }}
          />
        }
        isOpen={openFormReserveUser}
      />

      {/* <ShardComponentModal
        width="xs"
        fullWidth="true"
        body={
          <DetailActivityModal
            setIsOpen={setOpenActivityDetail}
            dataDetailActivity={dataDetailActivity}
            setFetchReload={setFetchReload}
          />
        }
        isOpen={openActivityDetail}
      /> */}

      <ShardComponentModal
        width="xs"
        fullWidth="true"
        body={
          <FormRemoveActivity
            isCalendar={true}
            userType={userType}
            setIsOpen={setOpenActivityDetail}
            dataDetailActivity={dataDetailActivity}
            setFetchReload={setFetchReload}
          />
        }
        isOpen={openActivityDetail}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
  venueId: auth.venueIdDefaultProfile,
  venueCityId: auth.venueCityIdDefault,
  nameCity: auth.venueCityNameDefault,
});

export default connect(mapStateToProps)(DayCalendar);
