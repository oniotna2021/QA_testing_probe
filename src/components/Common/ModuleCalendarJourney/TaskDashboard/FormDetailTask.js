import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { useSnackbar } from "notistack";

// UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//Icons
import {
  IconTaskJourney,
  IconEditPencil,
  IconPersonUser,
  IconTypeTask,
  IconCalendarJourney,
} from "assets/icons/customize/config";

// Services
import { addTaskComments } from "services/VirtualJourney/ComentaryTask";

// Utils
import { useStyles } from "utils/useStyles";
import {
  capitalize,
  successToast,
  errorToast,
  mapErrors,
  returnColorPriority,
} from "utils/misc";

const FormDetailTask = ({ setIsOpen, setIsEdit, detailTask, setReload }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [coment, setComent] = useState("");

  const handleChangeStepTask = (value) => {
    console.log(value);
  };

  const handleSubmitComments = () => {
    setLoading(true);
    addTaskComments({ task_id: detailTask.id, comment: coment })
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Comentario guardado correctamente", successToast);
          setComent("");
          setReload(true);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Typography variant="h6">{detailTask?.name}</Typography>
          <Typography variant="p">{detailTask?.task_types_id?.name}</Typography>
        </div>
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className="row mb-3 mx-0">
        <div className="col gx-0">
          <FormControl variant="outlined">
            <InputLabel id="task_types_id">Estado</InputLabel>
            <Select
              labelId="task_types_id"
              label={"Estado"}
              onChange={(e) => {
                handleChangeStepTask(e.target.value);
              }}
              value={detailTask.task_steps.id}
            >
              {[
                {
                  name: detailTask.task_steps.name,
                  id: detailTask.task_steps.id,
                },
              ].map((res) => (
                <MenuItem key={res.name} value={res.id}>
                  {res.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className={`d-flex flex-column ${classes.containerDetailTask}`}>
        <div className="row my-1">
          <div className="col-6 d-flex justify-items-center">
            <div>
              <IconPersonUser />
            </div>
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              Responsable
            </Typography>
          </div>
          <div className="col-4 d-flex align-items-center">
            <Typography variant="body2">Virtual Test</Typography>
          </div>

          <div className="col-2 d-flex justify-content-end">
            <IconButton
              style={{ color: "#000", padding: 1 }}
              onClick={() => setIsEdit(true)}
            >
              <IconEditPencil color="rgba(60, 60, 59, 1)" />
            </IconButton>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-6 d-flex align-items-center">
            <div
              className={`${classes.dotTaskItemStatus} my-1 ms-1 me-2`}
              style={{
                backgroundColor: returnColorPriority(detailTask?.priority),
                padding: 6,
              }}
            ></div>
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              Prioridad
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body2" color="textPrimary">
              {capitalize(detailTask?.priority)}
            </Typography>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-6 d-flex align-items-center">
            <div className="me-1">
              <IconTypeTask color="#3C3C3B" />
            </div>
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              Tipo
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography variant="body2" color="textPrimary">
              {detailTask?.task_types_id?.name}
            </Typography>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-6 d-flex align-items-center">
            <div className="me-2">
              <IconCalendarJourney color={"#3C3C3B"} />
            </div>
            <Typography
              className={classes.textTitleItemsDetailTask}
              variant="body2"
            >
              Fecha
            </Typography>
          </div>
          <div className="col-6 d-flex align-items-center">
            <Typography
              variant="body2"
              color="textPrimary"
              className={classes.textBold}
            >
              {capitalize(
                format(addDays(new Date(detailTask?.date), 1), "iiii", {
                  locale: es,
                })
              )}
              <Typography
                variant="body2"
                color="textPrimary"
                style={{ fontWeight: "normal!important" }}
              >
                {format(addDays(new Date(detailTask?.date), 1), "PPP", {
                  locale: es,
                })}
              </Typography>
            </Typography>
          </div>
        </div>
      </div>

      <div
        className="row d-flex align-items-center mt-2"
        style={{ width: "100%" }}
      >
        <div className="col-4 d-flex justify-content-center">
          <IconTaskJourney color={"#3C3C3B"} />
        </div>

        <div className="col-8">
          <Typography variant="body2">{detailTask?.description}</Typography>
        </div>
      </div>

      <div className={classes.divition}></div>

      {detailTask["follow-up"].length > 0 && (
        <div
          style={{
            maxHeight: 150,
            overflowY: "auto",
            marginBottom: 20,
          }}
        >
          <div>
            {detailTask["follow-up"].map((item) => (
              <div
                className="d-flex justify-content-between align-items-center my-4"
                style={{ width: "100%" }}
              >
                <Typography variant="body2">{item?.text}</Typography>

                <Typography
                  variant="p"
                  style={{ fontSize: 12 }}
                  className={classes.textDate}
                >
                  {format(new Date(item?.date), "Pp")}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <TextField
          value={coment}
          onChange={(e) => setComent(e.target.value)}
          variant="outlined"
          label={"Comentarios"}
          rows={3}
          multiline
        />
      </div>

      {coment && (
        <div className="d-flex justify-content-end mt-2">
          <Button
            className={classes.buttonBlock}
            style={{
              backgroundColor: "#007771",
              color: "#ffffff",
              fontWeight: "900",
              marginRight: 0,
            }}
            onClick={handleSubmitComments}
          >
            {loading ? (
              <CircularProgress size={30} color="secondary" />
            ) : (
              "Comentar"
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default FormDetailTask;
