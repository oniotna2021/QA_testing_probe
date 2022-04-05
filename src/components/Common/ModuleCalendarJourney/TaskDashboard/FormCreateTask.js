import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { format, addDays } from "date-fns";

// UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import DatePicker from "components/Shared/DatePicker/DatePicker";

// Services
import { postTask, updateTask } from "services/VirtualJourney/Tasks";
import { getTypeTask } from "services/VirtualJourney/TypeTask";

// Utils
import { useStyles } from "utils/useStyles";
import { capitalize, successToast, mapErrors, errorToast } from "utils/misc";

const FormCreateTask = ({
  title,
  isEdit = false,
  handleClose,
  setIsOpen,
  defaultValue,
  currentDate,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [typesTask, setTypesTask] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTypeTask()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setTypesTask(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  const submitForm = (value) => {
    const dataForm = !isEdit
      ? {
          ...value,
          is_finished: 0,
          date: format(value.date, "yyyy-MM-dd"),
        }
      : {
          ...value,
          is_finished: 0,
          date: format(value.date, "yyyy-MM-dd"),
          task_steps_id: defaultValue?.task_steps.id,
        };
    const funcToFetch = isEdit ? updateTask : postTask;
    setLoading(true);
    funcToFetch(dataForm, defaultValue?.uuid)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          setLoading(false);
          handleClose();
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
          setLoading(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {title && <Typography variant="h6">{title}</Typography>}
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className="row mb-3 mx-0">
        <div className="col gx-0">
          <Controller
            control={control}
            rules={{ required: true }}
            defaultValue={defaultValue?.name}
            name="name"
            render={({ field }) => (
              <TextField
                {...field}
                error={errors.name}
                onChange={(e) => field.onChange(e.target.value)}
                variant="outlined"
                label={"Nombre de la tarea"}
              />
            )}
          />
        </div>
      </div>

      <div className="row mb-3 mx-0">
        <div className="col gx-0">
          <Controller
            rules={{ required: true }}
            control={control}
            name="task_types_id"
            defaultValue={defaultValue?.task_types_id?.id}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="task_types_id">Tipo de tarea</InputLabel>
                <Select
                  {...field}
                  error={errors.task_types_id}
                  labelId="task_types_id"
                  label={"Tipo de tarea"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {typesTask &&
                    typesTask.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
      </div>

      <div className="row mb-3 mx-0">
        <div className="col-6 gx-1">
          <Controller
            rules={{ required: true }}
            control={control}
            name="date"
            defaultValue={
              defaultValue?.date
                ? addDays(new Date(defaultValue?.date), 1)
                : currentDate
                ? currentDate
                : null
            }
            render={({ field }) => (
              <FormControl variant="outlined">
                <DatePicker
                  id="date-picker"
                  {...field}
                  placeholder="dd | mm | aa"
                  error={errors.date}
                  format="dd-MM-yyyy"
                  label="Fecha de entrega"
                />
              </FormControl>
            )}
          />
        </div>

        <div className="col-6 gx-1">
          <Controller
            rules={{ required: true }}
            control={control}
            name="priority"
            defaultValue={defaultValue?.priority}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel id="priority">Prioridad</InputLabel>
                <Select
                  {...field}
                  error={errors.priority}
                  labelId="priority"
                  label={"Prioridad"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {["alta", "medio", "bajo"].map((res) => (
                    <MenuItem key={res} value={res}>
                      {capitalize(res)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
      </div>

      <div className="row mb-0 mx-0">
        <div className="col gx-0">
          <Controller
            control={control}
            rules={{ required: true }}
            defaultValue={defaultValue?.description}
            name="description"
            render={({ field }) => (
              <TextField
                error={errors.description}
                variant="outlined"
                label={"Descripción"}
                rows={5}
                multiline
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <Button
          onClick={() => setIsOpen(false)}
          fullWidth
          className={classes.buttonBlock}
          style={{ fontWeight: "900" }}
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          className={classes.buttonBlock}
          style={{
            backgroundColor: "#007771",
            color: "#ffffff",
            fontWeight: "900",
            marginRight: 0,
          }}
          type="submit"
        >
          {loading ? (
            <CircularProgress size={30} color="secondary" />
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCreateTask;
