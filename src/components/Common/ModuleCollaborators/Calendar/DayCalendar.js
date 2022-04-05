import React, { useState, useEffect } from "react";
import { format, addDays, eachDayOfInterval, getDate } from "date-fns";
import { connect } from "react-redux";
import { es } from "date-fns/locale";
import { useSnackbar } from "notistack";

//Components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormDeleteAppointment from "components/Shared/FormAppointment/FormDeleteAppointment";
import FormAppointment from "components/Shared/FormAppointment/FormAppointment";
import DetailActivityModal from "./DetailActivityModal";
import CalendarContainer from "components/Shared/ScheduleCalendar/Calendar";
import { EventActivity, EventQuote } from "./CustomEvents";
import FormQuote from "components/Common/ModuleCalendarJourney/Calendar/FormQuote";

//Services
import { getActivitiesByWeekRefractored } from "services/Reservations/activitiesUser";
import { getQuotesByRangeDate } from "services/VirtualJourney/Quotes";

// Utils
import { errorToast, mapErrors } from "utils/misc";
import DetailQuote from "components/Common/ModuleCalendarJourney/Calendar/DetailQuote";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
  style: {
    padding: "20px 15px",
  },
};

const DayCalendar = ({
  dateWeekCalendar,
  dataUser,
  fetchReload,
  setFetchReload,
  currentDate,
  userId,
  venueId,
  setIsOpenAssingActivity,
  setSelectedDate,
  setIsOpenAssingQuote,
  venueCityId,
  nameCity,
  userType,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [dateWeeks, setDateWeeks] = useState([]);

  const [openActivityDetail, setOpenActivityDetail] = useState(false);
  const [dataDetailActivity, setDataDetailActivity] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [dataSchedules, setDataSchedules] = useState([]);
  const [selectHour, setSelectHour] = useState("");
  const [isFull, setIsFull] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [dataSelect, setDataSelect] = useState({
    hour: "",
    id_medical: "",
    date: currentDate,
    profile_appointment_types: dataUser?.profile_appointment_types,
    venues: dataUser?.venues,
  });
  const [idQuote, setIdQuote] = useState("");
  const [dateInitEnd, setDateInitEnd] = useState({});

  // Journey
  const [isOpenDetailQuote, setIsOpenDetailQuote] = useState(false);
  const [isOpenCreateQuote, setIsOpenCreateQuote] = useState(false);
  const [quote, setQuote] = useState({});

  useEffect(() => {
    const setDaysToWeek = () => {
      const dateInit = dateWeekCalendar;
      const dayEnd = addDays(dateWeekCalendar, 6);

      const arrayDaysWeek = eachDayOfInterval({
        start: dateInit,
        end: dayEnd,
      });

      const dateFormat = "iii";
      setDateWeeks(
        arrayDaysWeek.map((dayWeek) => ({
          nameDay: format(dayWeek, dateFormat, { locale: es }),
          dayNumber: getDate(dayWeek),
          date: dayWeek,
          dateFormat: format(dayWeek, "yyyy-MM-dd"),
        }))
      );

      setDateInitEnd({
        dateInit: format(dateInit, "yyyy-MM-dd"),
        dateEnd: format(dayEnd, "yyyy-MM-dd"),
      });
    };

    if (dateWeekCalendar !== null) {
      setDaysToWeek();
      setFetchReload(true);
    }
  }, [dateWeekCalendar, setFetchReload]);

  useEffect(() => {
    if (
      fetchReload &&
      Object.keys(dateInitEnd).length > 0 &&
      Object.keys(dataUser).length > 0
    ) {
      if (
        dataUser.user_profiles_id === 29 ||
        dataUser.user_profiles_id === 30
      ) {
        const listTypesQuotes =
          dataUser.user_profiles_id === 29 ? "6,7,8" : "9,10,11";
        getQuotesByRangeDate(
          dateInitEnd.dateInit,
          dateInitEnd.dateEnd,
          listTypesQuotes,
          userId
        )
          .then(({ data }) => {
            if (
              data &&
              data.status === "success" &&
              data.data &&
              data.data.length > 0
            ) {
              setDataSchedules(data.data[0].activities);
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
            setFetchReload(false);
          });
        return;
      }

      getActivitiesByWeekRefractored(
        `[${userId}]`,
        venueId,
        dateInitEnd.dateInit,
        dateInitEnd.dateEnd
      )
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setDataSchedules(data.data[0].activities);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setFetchReload(false);
        });
    }
  }, [
    venueId,
    userId,
    dateInitEnd,
    fetchReload,
    setFetchReload,
    enqueueSnackbar,
    dataUser,
  ]);

  const onDetailActivityClick = (data, date) => {
    setDataDetailActivity({
      ...data,
      date: date,
      activity_id: data?.id,
    });
    setOpenActivityDetail(true);
  };

  const handleClickQuoteOrActivity = ({ data, date }) => {
    if (dataUser.user_profiles_id === 29 || dataUser.user_profiles_id === 30) {
      setQuote({
        idQuote: data.id,
        medicalProfessionalId: data.medical_professional_id,
        userId: data.user_id,
        phoneNumberUser: data.phone_number_user,
      });
      setIsOpenDetailQuote(true);
      return;
    }

    if (dataUser?.is_medical) {
      setIdQuote(data.id);
      setOpenDelete(true);
      return;
    }
    onDetailActivityClick(data, date);
  };

  const handleClickNewQuoteOrActivity = ({ data, date, hour }) => {
    // if (dataUser.user_profiles_id === 29 || dataUser.user_profiles_id === 30)
    //   return;

    if (userType === 39 || userType === 37) {
      setIsOpenCreateQuote((prev) => (prev = true));
      return;
    }

    if (dataUser?.is_medical) {
      setIsFull(false);
      setDataSelect({
        ...dataSelect,
        hour: hour,
        id_medical: userId,
        date: date,
        profile_appointment_types: dataUser?.profile_appointment_types,
        venues: dataUser.venues ? dataUser?.venues : null,
        modality: data.modality,
      });
      setSelectHour(hour);
      setIsOpen(true);
      setIsNew(true);
      return;
    }

    setIsOpenAssingActivity(true);
    setSelectedDate(addDays(new Date(date), 1));
  };

  const CustomItemRender = ({ data }) =>
    dataUser.is_medical ? (
      <EventQuote data={data} />
    ) : (
      <EventActivity data={data} />
    );

  const typeEventRenderer =
    dataUser.user_profiles_id === 29 || dataUser.user_profiles_id === 30
      ? "default"
      : "custom";

  const renderMinuteCalendar =
    dataUser.user_profiles_id === 29 || dataUser.user_profiles_id === 30
      ? 30
      : 60;

  return (
    <>
      <div className="calendar" style={{ height: "100%" }}>
        <div style={{ height: "100%" }}>
          <CalendarContainer
            type="week"
            rangeDate={{ start: 4, end: 23 }}
            eachMinuteCalendar={renderMinuteCalendar}
            handleClickAvailableHour={handleClickNewQuoteOrActivity}
            handleClickEvent={handleClickQuoteOrActivity}
            dataEvents={dataSchedules}
            scrollToHourNow={false}
            viewHeaderDate={true}
            businessHour={true}
            dateWeeks={dateWeeks}
            itemEvent={{
              type: typeEventRenderer,
              EventCustom: CustomItemRender,
            }}
          />
        </div>
      </div>

      <ShardComponentModal
        width="sm"
        body={
          <FormAppointment
            isFull={isFull}
            handleClose={() => {
              setFetchReload(true);
              setIsOpen(false);
            }}
            venueCityIdDefault={venueCityId}
            venueCityNameDefault={nameCity}
            venueIdDefaultProfile={venueId}
            date={currentDate}
            setIsOpen={setIsOpen}
            isNew={isNew}
            defaultValueHour={selectHour}
            defaultValues={dataSelect}
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
          />
        }
        isOpen={openActivityDetail}
      />

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <DetailQuote
            setCalendarReload={setFetchReload}
            isViewUserTowerControl={true}
            quote={quote}
            handleClose={() => {
              setFetchReload(true);
              setIsOpenDetailQuote(false);
            }}
            setIsOpen={setIsOpenDetailQuote}
            shouldInitQuote={false}
          />
        }
        isOpen={isOpenDetailQuote}
      />
      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <FormQuote
            handleClose={() => {
              setFetchReload(true);
              setIsOpenDetailQuote(false);
            }}
            userParentId={dataUser.id}
            setIsOpen={setIsOpenCreateQuote}
            shouldInitQuote={false}
          />
        }
        isOpen={isOpenCreateQuote}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
  venueCityId: auth.venueCityIdDefault,
  nameCity: auth.venueCityNameDefault,
  userType: auth.userType,
});

export default connect(mapStateToProps)(DayCalendar);
