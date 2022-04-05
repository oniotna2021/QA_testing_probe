import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useSnackbar } from "notistack";

// Components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import CustomizedProgressBars from "components/Shared/CustomizedProgressBars/CustomizedProgressBars";
import FormCreateTask from "components/Common/ModuleCalendarJourney/TaskDashboard/FormCreateTask";
import DetailTask from "components/Common/ModuleCalendarJourney/TaskDashboard/DetailTask";
import Header from "./Header";
import Dashboard from "./Dashboard";

// Services
import { getTaskByDate, updateTask } from "services/VirtualJourney/Tasks";

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

const DashboardJourney = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [fetchReload, setFetchReload] = useState(true);
  const [isOpenDetailTask, setIsOpenDetailTask] = useState(false);
  const [isOpenCreateTask, setIsOpenCreateTask] = useState(false);
  const [idTask, setIdTask] = useState(null);
  const [date, setDate] = useState(new Date());
  const [listTask, setListTask] = useState({});

  useEffect(() => {
    if (fetchReload) {
      getTaskByDate(format(date, "yyyy-MM-dd"))
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            Object.keys(data.data).length > 0
          ) {
            setListTask(data.data);
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
  }, [date, fetchReload, enqueueSnackbar]);

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

  const handleClickTask = (uuid) => {
    if (uuid === null) {
      setIsOpenCreateTask(true);
      return;
    }
    setIdTask(uuid);
    setIsOpenDetailTask(true);
  };

  return (
    <>
      <div className="container">
        <div style={{ height: 5, marginBottom: 0 }}>
          {(fetchReload || loading) && (
            <CustomizedProgressBars color="primary" />
          )}
        </div>

        <Header
          currentDate={date}
          setDate={setDate}
          setFetchReload={setFetchReload}
        />

        <div
          className={classes.cardDetailCollaborator}
          style={{ borderRadius: 12, padding: "20px 25px" }}
        >
          <Dashboard
            handleChangeTaskStep={handleChangeTaskStep}
            handleClickTask={handleClickTask}
            listTask={listTask}
          />
        </div>
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
            currentDate={date}
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

export default DashboardJourney;
