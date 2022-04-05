import React, { useState, useEffect, useMemo } from "react";
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
import ItemActivity from "components/Common/ModuleActivitiesCalendar/Calendar/ItemActivity";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

// Services
import { getActivitiesByVenueByMonth } from "services/Reservations/activitiesCalendar";

//CSS
import "index.css";

const FullCalendar = ({
  setFetchReload,
  fetchReload,
  currentDate,
  venueId,
  setListActivities,
  selectActivityId,
  handleClickAssingActivity,
  selectVenues,
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
    if (
      fetchReload &&
      (venueId !== undefined || selectVenues) &&
      year &&
      month
    ) {
      getActivitiesByVenueByMonth(
        venueId || (selectVenues === null ? 0 : selectVenues),
        year,
        month
      )
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setData(data?.data);
            setListActivities(
              data?.data.map((p) => ({ id: p.id, name: p.name_activity }))
            );
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
    enqueueSnackbar,
    month,
    venueId,
    year,
    setListActivities,
    setFetchReload,
    selectVenues,
  ]);

  useEffect(() => {
    setFetchReload(true);
  }, [venueId, setFetchReload]);

  const dataFilter = useMemo(() => {
    let dataArr = [...data];

    if (selectActivityId.length !== 0) {
      return data.filter((p) =>
        selectActivityId.some(
          (nameActivity) => p.name_activity === nameActivity
        )
      );
    }

    return dataArr;
  }, [data, selectActivityId]);

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
                : isSameDay(day, new Date())
                ? "selected"
                : ""
            }`}
            key={day}
            onClick={() => handleClickAssingActivity(cloneDay)}
          >
            <div style={{ marginTop: "12px", marginBottom: "20px" }}>
              <span className="number">{formattedDate}</span>
              {dataFilter &&
                dataFilter.map(
                  (activity) =>
                    activity.dates.length > 0 &&
                    activity.dates.map((date, idx) =>
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
                              <ItemActivity
                                key={idx}
                                data={activity}
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
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
  venueCityId: auth.venueCityIdDefault,
  nameCity: auth.venueCityNameDefault,
});

export default connect(mapStateToProps)(FullCalendar);
