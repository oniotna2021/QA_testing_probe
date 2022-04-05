import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";

//COMPONENTS
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormAppointment from "components/Shared/FormAppointment/FormAppointment";
import ItemDoctor from "components/Common/ModuleQuotesGeneral/Calendar/ItemDoctor";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

// Services
import {
  getDiaryGeneralByMonthRefactored,
  getDiaryGeneralByMonthByAppointmentType,
} from "services/Reservations/diaryGeneral";

//CSS
import "index.css";

const FullCalendar = ({
  setFetchReload,
  fetchReload,
  profileId,
  currentDate,
  isMedical,
  venueId,
  nameCity,
  venueCityId,
  isVirtual,
  filterOption,
  idTypeQuote,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const [isNew, setIsNew] = useState(false);
  const [data, setData] = useState([]);
  const [isFull, setIsFull] = useState(false);

  let year = currentDate.getFullYear();
  let month =
    String(currentDate.getMonth() + 1).length === 2
      ? String(currentDate.getMonth() + 1)
      : String(`0${currentDate.getMonth() + 1}`);

  //GET

  useEffect(() => {
    if (fetchReload && venueId !== undefined && year && month && profileId) {
      const functToFetch =
        filterOption === "1"
          ? getDiaryGeneralByMonthByAppointmentType
          : getDiaryGeneralByMonthRefactored;
      functToFetch(
        venueId,
        year,
        month,
        filterOption === "1" ? idTypeQuote : profileId
      )
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setData(data?.data);
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
    }
  }, [
    fetchReload,
    setFetchReload,
    enqueueSnackbar,
    month,
    profileId,
    venueId,
    year,
    filterOption,
    idTypeQuote,
  ]);

  const onDateClick = (day) => {
    if (isMedical) {
      setSelectedDate(addDays(new Date(day), 1));
      setIsFull(true);
      setIsOpen(true);
      setIsNew(true);
    }
  };

  //DAY WEEKS
  const days = () => {
    const dateFormat = "iii";
    const days = [];
    let startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="column col-center"
          style={{ textTransform: "capitalize" }}
          key={i}
        >
          {format(addDays(startDate, i), dateFormat, { locale: es })}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  };

  //DAY CELLS
  const cells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "dd";
    const formatData = "yyyy-MM-dd";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = format(day, formatData);
        days.push(
          <div
            className={`column cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate)
                ? "selected"
                : ""
            }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <span className="number">{formattedDate}</span>
              {data && data.isArray &&
                data?.map(
                  (user) =>
                    user.dates.length > 0 &&
                    user.dates.map((date, idx) =>
                      date.activities > 0
                        ? date.date === cloneDay && (
                            <div
                              key={idx}
                              style={{
                                width: "40px",
                                display: "inline-block",
                                marginTop: "10px",
                                marginLeft: "6px",
                              }}
                            >
                              <ItemDoctor
                                key={idx}
                                data={user}
                                totalQuotes={date.activities}
                              />
                            </div>
                          )
                        : null
                    )
                )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {" "}
          {days}{" "}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  return (
    <>
      <div className="calendar">
        <div>{days()}</div>
        <div>{cells()}</div>
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
            date={selectedDate}
            setIsOpen={setIsOpen}
            isNew={isNew}
            isVirtual={isVirtual}
          />
        }
        isOpen={isOpen}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
  venueCityId: auth.venueCityIdDefault,
  nameCity: auth.venueCityNameDefault,
});

export default connect(mapStateToProps)(FullCalendar);
