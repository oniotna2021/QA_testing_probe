import React from "react";
import { useForm } from "react-hook-form";

//UI
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

//Components
import { CommonComponentSimpleForm } from "../../../../Shared/SimpleForm/SimpleForm";
import { TrainersForm } from "../../../../../config/Forms/ConfigForms";

//IMPORTS
import { useSnackbar } from "notistack";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

//Services
import {
  postTrainers,
  putTrainers,
  deleteTrainers,
} from "../../../../../services/TrainingPlan/Trainers";

//Swal
import Swal from "sweetalert2";

export const FormTrainers = ({ type, defaultValue, setExpanded }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, control, reset } = useForm();

  const onSubmit = (value) => {
    const functionCall = type === "Nuevo" ? postTrainers : putTrainers;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          reset();
        } else {
          enqueueSnackbar(mapErrors(data.data?.message), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  const deleteForm = () => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "¡Sí, bórralo!",
    })
      .then((result) => {
        if (result.isConfirmed) {
          deleteTrainers(defaultValue.id)
            .then((req) => {
              Swal.fire(
                "¡Eliminado!",
                "Su registro ha sido eliminado.",
                "success"
              );
            })
            .catch((err) => {
              enqueueSnackbar(mapErrors(err), errorToast);
            });
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <div className="row justify-content-end mb-3">
          <div className="col-1">
            <IconButton
              color="primary"
              fullWidth
              variant="outlined"
              onClick={deleteForm}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      )}
      <div className="row gx-3 mt-3">
        <div className="col">
          <CommonComponentSimpleForm
            form={TrainersForm}
            control={control}
            defaultValue={defaultValue}
          />
        </div>
        <div className="col">
          <Button
            color="primary"
            className="mb-3"
            fullWidth
            variant="contained"
            type="submit"
          >
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
};
