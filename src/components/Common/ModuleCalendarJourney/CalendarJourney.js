import React, { useState } from "react";
import { addWeeks, subWeeks } from "date-fns";

// UI
import Button from "@material-ui/core/Button";
import { IconTaskJourney } from "assets/icons/customize/config";

// Components
import TaskDashboard from "./TaskDashboard/TaskDashboard";
import Calendar from "./Calendar/Calendar";
import HeaderJourney from "./HeaderJourney";
import CustomizedProgressBars from "components/Shared/CustomizedProgressBars/CustomizedProgressBars";

//Utils
import { useStyles } from "utils/useStyles";

const CalendarJourney = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [fetchReload, setFetchReload] = useState(false);
  const [fetchReloadQuotes, setFetchReloadQuotes] = useState(false);
  const [date, setDate] = useState(
    // startOfWeek(new Date(), { weekStartsOn: 1 })
    new Date()
  );
  const [dateInitEnd, setDateInitEnd] = useState({});
  const [isOpenCreateTask, setIsOpenCreateTask] = useState(false);

  const nextWeek = () => {
    setDate(addWeeks(date, 1));
  };

  const prevWeek = () => {
    setDate(subWeeks(date, 1));
  };

  return (
    <>
      <div className="container">
        <div style={{ height: 5 }}>
          {(fetchReload || loading) && (
            <CustomizedProgressBars color="primary" />
          )}
        </div>

        <div className="my-4 d-flex justify-content-between">
          <HeaderJourney
            currentDate={date}
            setDate={setDate}
            setFetchReload={setFetchReload}
            setFetchReloadQuotes={setFetchReloadQuotes}
          />

          <div>
            <Button
              onClick={() => setIsOpenCreateTask(true)}
              className={classes.buttonTask}
              startIcon={<IconTaskJourney color={"#3C3C3B"} />}
            >
              Crear tareas
            </Button>
          </div>
        </div>

        <div
          className={classes.cardDetailCollaborator}
          style={{ borderRadius: 12 }}
        >
          <TaskDashboard
            currentDate={date}
            dateInitEnd={dateInitEnd}
            setDateInitEnd={setDateInitEnd}
            nextWeek={nextWeek}
            prevWeek={prevWeek}
            fetchReload={fetchReload}
            setFetchReload={setFetchReload}
            setFetchReloadQuotes={setFetchReloadQuotes}
            setIsOpenCreateTask={setIsOpenCreateTask}
            isOpenCreateTask={isOpenCreateTask}
            setLoading={setLoading}
          />

          <div className={classes.divition}></div>

          <Calendar
            fetchReload={fetchReloadQuotes}
            setFetchReload={setFetchReloadQuotes}
            nextWeek={nextWeek}
            prevWeek={prevWeek}
            dateInitEnd={dateInitEnd}
          />
        </div>
      </div>
    </>
  );
};

export default CalendarJourney;
