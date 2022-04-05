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

// components
import ItemCalendar from "components/Common/ModuleCollaborators/Calendar/ItemCalendar";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

//SERVICES
import { getActivitiesByUserRefactored } from "services/Reservations/activitiesUser";
import { getQuotesByMonth } from "services/VirtualJourney/Quotes";

//CSS
import "index.css";

const FullCalendar = ({
  fetchReload,
  dataUser,
  setFetchReload,
  currentDate,
  userId,
  venueId,
  handleChangeIsFullCalendar,
  selectedDate,
  setSelectedDate,
  setCurrentDate,
  setIsFull,
  setIsNew,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);

  let year = currentDate.getFullYear();
  let month =
    String(currentDate.getMonth() + 1).length === 2
      ? String(currentDate.getMonth() + 1)
      : String(`0${currentDate.getMonth() + 1}`);

  //GET
  useEffect(() => {
    if (fetchReload && Object.keys(dataUser).length > 0) {
      if (
        dataUser.user_profiles_id === 29 ||
        dataUser.user_profiles_id === 30
      ) {
        const listTypesQuotes =
          dataUser.user_profiles_id === 29 ? "6,7,8" : "9,10,11";

        getQuotesByMonth(`${userId}`, month, year, listTypesQuotes)
          .then(({ data }) => {
            if (data.status === "success" && data.data) {
              setData(data?.data[0]?.schedules || data?.data[0]?.dates);
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

        return;
      }

      getActivitiesByUserRefactored(`[${userId}]`, venueId, month, year)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setData(data?.data[0]?.schedules || data?.data[0]?.dates);
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
    fetchReload,
    setFetchReload,
    year,
    month,
    userId,
    venueId,
    enqueueSnackbar,
    dataUser,
  ]);

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

  const onDateClick = (day) => {
    if (fetchReload) return;

    if (dataUser.is_medical) {
      setSelectedDate(addDays(new Date(day), 1));
      setCurrentDate(addDays(new Date(day), 1));
      setIsFull(true);
      setIsNew(true);
      handleChangeIsFullCalendar(false);
      return;
    }

    setSelectedDate(addDays(new Date(day), 1));
    setCurrentDate(addDays(new Date(day), 1));
    setIsFull(true);
    setIsNew(true);
    handleChangeIsFullCalendar(false);
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

        const returnJsxDay = (day, formattedDate) => {
          if (
            data &&
            data.find(
              (dateToFind) =>
                (dateToFind.date || dateToFind.quote_day) === cloneDay
            )?.status === 1
          ) {
            return (
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
                <span className="number">{formattedDate}</span>
                {data &&
                  data.map(
                    (date, idx) =>
                      (date.date || date.quote_day) === cloneDay && (
                        <div
                          style={{
                            display: "inline-block",
                            marginTop: "40px",
                            marginLeft: "10px",
                          }}
                        >
                          {(date.date || date.quote_day) === cloneDay &&
                            (date.activities > 0 || date.total > 0) && (
                              <ItemCalendar
                                key={idx}
                                data={date}
                                totalQuotes={date.activities || date.total}
                              />
                            )}
                        </div>
                      )
                  )}
              </div>
            );
          } else if (
            data &&
            data.find(
              (dateToFind) =>
                (dateToFind.date || dateToFind.quote_day) === cloneDay
            )?.status === 2
          ) {
            return (
              <div
                className={`column cell ${
                  !isSameMonth(day, monthStart)
                    ? "disabled"
                    : isSameDay(day, selectedDate)
                    ? "selected"
                    : ""
                }`}
                key={day}
                style={{ padding: "0px", cursor: "default" }}
              >
                <span className="number">{formattedDate}</span>
                <div
                  className="hourNoAvailable"
                  style={{
                    display: "inline-block",
                    height: "100%",
                    width: "100%",
                  }}
                ></div>
              </div>
            );
          } else if (
            data &&
            data.find(
              (dateToFind) =>
                (dateToFind.date || dateToFind.quote_day) === cloneDay
            )?.status === 0
          ) {
            return (
              <div
                className={`column cell disabled`}
                key={day}
                style={{
                  padding: "0px",
                  cursor: "default",
                  backgroundColor: "#F9F9F9",
                }}
              >
                <span className="number">{formattedDate}</span>
              </div>
            );
          }

          return (
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
              <span className="number">{formattedDate}</span>
              {data &&
                data.map(
                  (date, idx) =>
                    (date.date || date.quote_day) === cloneDay && (
                      <div
                        style={{
                          display: "inline-block",
                          marginTop: "60px",
                          marginLeft: "10px",
                        }}
                      >
                        {(date.date || date.quote_day) === cloneDay &&
                          (date.activities > 0 || date.total > 0) && (
                            <ItemCalendar
                              key={idx}
                              data={date}
                              totalQuotes={date.activities || date.total}
                            />
                          )}
                      </div>
                    )
                )}
            </div>
          );
        };

        days.push(returnJsxDay(day, formattedDate));
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
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
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(FullCalendar);
