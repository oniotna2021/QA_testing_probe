import React, { useState, useEffect } from "react";
import { format, addDays, eachDayOfInterval, getDate, isToday } from "date-fns";
import { useSnackbar } from "notistack";
import { es } from "date-fns/locale";
import { useHistory } from "react-router-dom";

// UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { IconTaskJourney } from "assets/icons/customize/config";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";

// Components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormCreateTask from "./FormCreateTask";
import DetailTask from "./DetailTask";
import TaskItem from "./TaskItem";

// Service
import { getTaskByDateRange, updateTask } from "services/VirtualJourney/Tasks";

//Utils
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors, successToast } from "utils/misc";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
  style: { padding: "30px" },
};

const Calendar = ({
  currentDate,
  nextWeek,
  prevWeek,
  dateInitEnd,
  setDateInitEnd,
  setFetchReload,
  setIsOpenCreateTask,
  isOpenCreateTask,
  fetchReload,
  setFetchReloadQuotes,
  setLoading,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [dateWeeks, setDateWeeks] = useState([]);
  const [isOpenDetailTask, setIsOpenDetailTask] = useState(false);
  const [idTask, setIdTask] = useState(null);
  const [dataTask, setDataTask] = useState([]);

  useEffect(() => {
    const setDaysToWeek = () => {
      const dateInit = currentDate;
      const dayEnd = addDays(currentDate, 6);

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
      setFetchReload(true);
      setFetchReloadQuotes(true);
    };

    setDaysToWeek();
  }, [currentDate, setDateInitEnd, setFetchReload, setFetchReloadQuotes]);

  useEffect(() => {
    if (Object.keys(dateInitEnd).length > 0 && fetchReload) {
      getTaskByDateRange(dateInitEnd.dateInit, dateInitEnd.dateEnd)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            Object.keys(data.data).length > 0
          ) {
            setDataTask(data.data);
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
  }, [dateInitEnd, enqueueSnackbar, fetchReload, setFetchReload]);

  const handleClickTask = (id) => {
    setIdTask(id);
    setIsOpenDetailTask(true);
  };

  const handleChangeTaskStep = (item, type = "finish", idStep = 1) => {
    const taskStepId = type === "finish" ? item?.task_steps.id : idStep;
    const isFinished = type === "finish" ? 1 : 0;

    const dataForm = {
      name: item.name,
      priority: item.priority,
      is_finished: isFinished,
      description: item.description,
      date: item.date,
      task_types_id: item.task_types_id.id,
      task_steps_id: taskStepId,
    };

    setLoading(true);
    updateTask(dataForm, item?.uuid)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar(
            type === "finish"
              ? "Tarea finalizada"
              : type === "process"
              ? "Tarea en proceso"
              : "Tarea pendiente",
            successToast
          );
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setFetchReload(true);
        setLoading(false);
      });
  };

  const handleClickTaskDashboard = () => {
    history.push("/dashboard-journey");
  };

  return (
    <>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <IconButton
            onClick={prevWeek}
            style={{ transform: "rotate(-180deg)" }}
            className={`me-4 ${classes.buttonArrowForward}`}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          <div
            onClick={handleClickTaskDashboard}
            className={`d-flex align-items-center`}
            style={{ cursor: "pointer" }}
          >
            <div className="me-2">
              <IconTaskJourney color={"#3C3C3B"} width="24" height="24" />
            </div>

            <Typography variant="p" className={classes.textBold}>
              Tareas
            </Typography>
          </div>
        </div>

        <div>
          <IconButton
            onClick={nextWeek}
            className={`ms-3 ${classes.buttonArrowForward}`}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <div>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell style={{ border: "none", width: 145 }}>
                <div className="d-flex justify-content-center alig-content-center"></div>
              </TableCell>
              {dateWeeks &&
                dateWeeks.map((item) => (
                  <TableCell
                    style={{
                      width: "300px",
                      border: "none",
                    }}
                    key={"tb-" + item.nameDay}
                  >
                    <div
                      className={`d-flex justify-content-center align-items-center ${
                        isToday(item.date) ? classes.dateNow : ""
                      }`}
                    >
                      <Typography
                        style={{ marginRight: "5px" }}
                        className={`${classes.textBold} ${classes.fontDayCalendar}`}
                      >
                        {item.nameDay}
                      </Typography>
                      <Typography className={classes.fontDayCalendar}>
                        {item.dayNumber}
                      </Typography>
                    </div>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(dataTask).length === 0
              ? [0, 1, 2].map((item) => (
                  <TableRow key={item}>
                    <TableCell
                      style={{
                        padding: "0 16px",
                        width: "100px",
                        border: "none",
                      }}
                    >
                      <div className="d-flex justify-content-center align-content-center">
                        <b>{item + 1}</b>
                      </div>
                    </TableCell>

                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <TableCell
                        key={i}
                        style={{ border: "none", padding: "5px 10px" }}
                      >
                        <Skeleton animation="wave" width="100%" height={80} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : [0, 1, 2].map((item) => (
                  <TableRow key={item}>
                    <TableCell
                      style={{
                        padding: "0 16px",
                        width: "100px",
                        border: "none",
                      }}
                    >
                      <div className="d-flex justify-content-center align-content-center">
                        <b>{item + 1}</b>
                      </div>
                    </TableCell>

                    {Object.keys(dataTask).length > 0 &&
                      Object.entries(dataTask).map(([key, value]) => (
                        <TaskItem
                          handleClickTask={handleClickTask}
                          key={key}
                          number={item}
                          item={value}
                          handleChangeTaskStep={handleChangeTaskStep}
                        />
                      ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <FormCreateTask
            handleClose={() => {
              setFetchReload(true);
              setIsOpenCreateTask(false);
            }}
            setIsOpen={setIsOpenCreateTask}
            title="Crear tarea"
          />
        }
        isOpen={isOpenCreateTask}
      />

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <DetailTask
            idTask={idTask}
            handleClose={() => {
              setFetchReload(true);
              setIsOpenDetailTask(false);
            }}
            setIsOpen={setIsOpenDetailTask}
          />
        }
        isOpen={isOpenDetailTask}
      />
    </>
  );
};

export default Calendar;
