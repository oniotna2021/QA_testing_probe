import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";



//Components
import Loading from "components/Shared/Loading/Loading";
import ItemDayCalendar from "./ItemDayCalendar";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormAppointment from "components/Shared/FormAppointment/FormAppointment";
import FormDeleteAppointment from "components/Shared/FormAppointment/FormDeleteAppointment";
import DetailActivityModal from "components/Common/ModuleCollaborators/Calendar/DetailActivityModal";

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
import {
  getDiaryGeneralByDayRefactored,
  getDiaryGeneralByDayByAppointmentType,
} from "services/Reservations/diaryGeneral";

// Utils
import { useStyles } from "utils/useStyles";
import {
  createBlockHours,
  generateRandomColor,
  errorToast,
  mapErrors,
  sortStatus,
} from "utils/misc";

const hours = [
  // { id: 1, hour: '1:00', realHour: '01:00:00', color: 'rgb(141 51 211 / 30%)' },
  // { id: 2, hour: '2:00', realHour: '02:00:00', color: 'rgb(141 51 211 / 30%)' },
  // { id: 3, hour: '3:00', realHour: '03:00:00', color: 'rgb(141 51 211 / 30%)' },
  { id: 4, hour: "4:00", realHour: "04:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 5, hour: "5:00", realHour: "05:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 6, hour: "6:00", realHour: "06:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 7, hour: "7:00", realHour: "07:00:00", color: "rgb(141 51 211 / 30%)" },
  { id: 8, hour: "8:00", realHour: "08:00:00", color: "rgb(98 149 250 / 30%)" },
  {
    id: 9,
    hour: "9:00",
    realHour: "09:00:00",
    color: "rgb(148 201 122 / 30%)",
  },
  {
    id: 10,
    hour: "10:00",
    realHour: "10:00:00",
    color: "rgb(98 149 250 / 30%)",
  },
  {
    id: 11,
    hour: "11:00",
    realHour: "11:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 12,
    hour: "12:00",
    realHour: "12:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 13,
    hour: "13:00",
    realHour: "13:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 14,
    hour: "14:00",
    realHour: "14:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 15,
    hour: "15:00",
    realHour: "15:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 16,
    hour: "16:00",
    realHour: "16:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 17,
    hour: "17:00",
    realHour: "17:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 18,
    hour: "18:00",
    realHour: "18:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 19,
    hour: "19:00",
    realHour: "19:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 20,
    hour: "20:00",
    realHour: "20:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 21,
    hour: "21:00",
    realHour: "21:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 22,
    hour: "22:00",
    realHour: "22:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  {
    id: 23,
    hour: "23:00",
    realHour: "23:00:00",
    color: "rgb(141 51 211 / 30%)",
  },
  // { id: 24, hour: '24:00', realHour: '24:00:00', color: 'rgb(141 51 211 / 30%)' },
];

const arrayHours = [
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
  { hour_ini: "", hour_end: "", activity_name: null, activity_id: null },
];

const DayCalendar = ({
  venueId,
  nameCity,
  venueCityId,
  fetchReload,
  setFetchReload,
  currentDate,
  profileId,
  userId,
  isVirtual,
  filterOption,
  idTypeQuote,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  const [loadingFetch, setLoadingFetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [dataSchedules, setDataSchedules] = useState([]);
  const [selectHour, setSelectHour] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [dataSelect, setDataSelect] = useState({
    hour: "",
    id_medical: "",
    date: currentDate,
  });
  const [idQuote, setIdQuote] = useState("");
  const [openActivityDetail, setOpenActivityDetail] = useState(false);
  const [dataDetailActivity, setDataDetailActivity] = useState({});

  const formatCurrentDate = format(currentDate, "yyyy-MM-dd");

  useEffect(() => {
    if (
      fetchReload &&
      profileId &&
      formatCurrentDate &&
      venueId !== undefined
    ) {
      setLoadingFetch(true);
      const functToFetch =
        filterOption === "1"
          ? getDiaryGeneralByDayByAppointmentType
          : getDiaryGeneralByDayRefactored;
      functToFetch(
        isVirtual ? null : venueId,
        formatCurrentDate,
        filterOption === "1" ? idTypeQuote : profileId
      )
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setDataUsers(data.data);

            const dataSchedule = data.data.map((user) => {
              const dataSchedules = user.activities;
              const reorderSchedule = sortStatus(dataSchedules) || [];

              const activitiesMap =
                reorderSchedule.map((activity, idx) => {
                  const colour = activity?.activity_color
                    ? activity.activity_color
                    : generateRandomColor();
                  if (activity?.hour) {
                    const endTimeString = activity.end_date_quote
                      ? activity?.end_date_quote.split(" ")[1]
                      : activity?.end_time;
                    return {
                      ...activity,
                      is_quote: true,
                      activity_id: activity.id,
                      activity_name: `${activity?.patient?.first_name} ${activity?.patient?.last_name} - ${activity?.name_modality}`,
                      start_time: activity.hour,
                      end_time: endTimeString,
                      color: colour,
                    };
                  }
                  return {
                    ...activity,
                    id: idx,
                    is_quote: false,
                    color: colour,
                  };
                }, arrayHours) || [];

              return {
                ...user,
                blocks: createBlockHours(
                  activitiesMap,
                  arrayHours,
                  undefined,
                  undefined,
                  user?.end_time_schedule,
                  user?.start_time_schedule
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
    userId,
    fetchReload,
    setFetchReload,
    enqueueSnackbar,
    formatCurrentDate,
    profileId,
    isVirtual,
    filterOption,
    idTypeQuote,
  ]);

  const onDateClick = (event, appoitmentTypes, venues) => {
    const medicals = [3, 7, 8, 9, 10, 11];
    if (filterOption === "1" ? true : medicals.some((p) => p === profileId)) {
      setIsFull(false);
      setDataSelect({
        ...dataSelect,
        hour: event.target.value,
        id_medical: event.target.id,
        date: formatCurrentDate,
        profile_appointment_types: appoitmentTypes,
        venues: venues ? venues : null,
      });
      setSelectHour(event.target.value);
      setIsOpen(true);
      setIsNew(true);
    }
  };

  const onDetailActivityClick = (idActivity, idUser) => {
    const dataActivity = dataSchedules.find((p) => p.id === idUser);
    const findActivityData = dataActivity.activities.find(
      (a) => a.schedule_activity_has_location_id === Number(idActivity)
    );
    if (Object.keys(findActivityData).length > 0) {
      setDataDetailActivity({ ...findActivityData, date: formatCurrentDate });
      setOpenActivityDetail(true);
    }
  };

  const onQuoteClick = (e, idUser) => {
    const medicals = [3, 7, 8, 9, 10, 11];
    if (filterOption === "1" ? true : medicals.some((p) => p === profileId)) {
      setIdQuote(e.target.id);
      setOpenDelete(true);
      return;
    }

    onDetailActivityClick(e.target.id, idUser);
  };

  return (
    <>
      <div className="calendar">
        {loadingFetch && dataUsers.length === 0 ? (
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
                  {dataUsers &&
                    dataUsers.map((item) => (
                      <TableCell
                        style={{ width: "300px" }}
                        key={"tb-" + item.id}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <Avatar className="me-2" src={item.photo}></Avatar>
                          <Typography
                            noWrap
                            className={classes.fotnDayCalendar}
                          >
                            <b>
                              {item.first_name} {item.last_name}
                            </b>
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

                      {dataSchedules &&
                        dataSchedules.map((item, i) => (
                          <ItemDayCalendar
                            key={i}
                            hour={hour}
                            dataItem={item}
                            onClick={onQuoteClick}
                            onDateClick={onDateClick}
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
        body={
          <FormAppointment
            venueCityIdDefault={venueCityId}
            venueCityNameDefault={nameCity}
            venueIdDefaultProfile={venueId}
            isFull={isFull}
            handleClose={() => {
              setIsOpen(false);
              setFetchReload(true);
            }}
            date={currentDate}
            setIsOpen={setIsOpen}
            isNew={isNew}
            defaultValueHour={selectHour}
            defaultValues={dataSelect}
            isVirtual={isVirtual}
          />
        }
        isOpen={isOpen}
      />

      <ShardComponentModal
        width="xs"
        fullWidth="true"
        body={
          <FormDeleteAppointment
            setIsOpen={setOpenDelete}
            idQuote={idQuote}
            setFetchReload={setFetchReload}
          />
        }
        isOpen={openDelete}
      />

      <ShardComponentModal
        width="xs"
        fullWidth="true"
        body={
          <DetailActivityModal
            setIsOpen={setOpenActivityDetail}
            dataDetailActivity={dataDetailActivity}
            setFetchReload={setFetchReload}
            canEdit={false}
          />
        }
        isOpen={openActivityDetail}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
  venueCityId: auth.venueCityIdDefault,
  nameCity: auth.venueCityNameDefault,
});

export default connect(mapStateToProps)(DayCalendar);
