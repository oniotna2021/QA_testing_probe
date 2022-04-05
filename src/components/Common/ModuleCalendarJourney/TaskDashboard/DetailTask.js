import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

// UI
import Skeleton from "@material-ui/lab/Skeleton";

// Components
import FormCreateTask from "./FormCreateTask";
import FormDetailTask from "./FormDetailTask";

// Service
import { getTaskByUUID } from "services/VirtualJourney/Tasks";

// Utils
import { errorToast, mapErrors } from "utils/misc";

const DetailTask = ({ idTask, handleClose, setIsOpen }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [detailTask, setDetailTask] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    if (idTask && reload) {
      getTaskByUUID(idTask)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            Object.keys(data.data).length > 0
          ) {
            setDetailTask(data.data);
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
          setReload(false);
        });
    }
  }, [idTask, reload, enqueueSnackbar]);

  return (
    <>
      {isEdit ? (
        <FormCreateTask
          title="Editar tarea"
          handleClose={handleClose}
          setIsOpen={setIsOpen}
          defaultValue={detailTask}
          isEdit={true}
        />
      ) : Object.keys(detailTask).length > 0 ? (
        <FormDetailTask
          setIsEdit={setIsEdit}
          setIsOpen={setIsOpen}
          detailTask={detailTask}
          setReload={setReload}
        />
      ) : (
        <div className="mt-4">
          <Skeleton animation="wave" width="100%" height={100} />
          <Skeleton animation="wave" width="100%" height={100} />
          <Skeleton animation="wave" width="100%" height={100} />
        </div>
      )}
    </>
  );
};

export default DetailTask;
