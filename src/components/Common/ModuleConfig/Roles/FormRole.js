import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { RoleForm } from "config/Forms/AdminForms";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

//Services
import {
  postRole,
  putRole,
  deleteRole,
  getRoleById,
} from "services/SuperAdmin/Roles";
import { getTypeAppointment } from "services/MedicalSoftware/TypeAppointment";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//utils
import {
  successToast,
  errorToast,
  mapErrors,
  regexOnlyPositiveNumbers,
  DataAppoinmentMycoach,
  DataAppoinmentMycoachVirtual,
} from "utils/misc";

const useStyles = makeStyles(() => ({
  inputText: {
    "& .MuiOutlinedInput-input": {
      textAlign: "center",
    },
  },
  buttonSave: {
    background: "#3c3c3b",
    color: "#fff",
    height: "50px",
  },
}));

export const FormRole = ({
  type,
  isEdit,
  defaultValue,
  setExpanded,
  reload,
  setReload,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [typeAppointment, setTypeAppointment] = useState([]);
  const [selectRole, setSelectRole] = useState();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [dataEdit, setDataEdit] = useState();
  const [loader, setLoader] = useState();
  const [isMedical, setIsMedical] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [isCoachVirtual, setIsCoachVirtual] = useState(false);

  useEffect(() => {
    getTypeAppointment()
      .then(({ data }) => {
        if (data && data.status === "success" && data.data.length > 0) {
          setTypeAppointment(data.data);
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

  useEffect(() => {
    //info de editar
    if (isEdit) {
      setLoader(true);
      getRoleById(defaultValue && defaultValue.id)
        .then(({ data }) => {
          if (data.data && data.status === "success") {
            setDataEdit(data.data);
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
          setLoader(false);
        });
    }
  }, [enqueueSnackbar, defaultValue, isEdit]);

  useEffect(() => {
    if (defaultValue && defaultValue.is_medical === 1) {
      setIsMedical(true);
    }

    if (
      dataEdit &&
      dataEdit.virtual_appointment_types[0]?.appointment_type_id === 6
    ) {
      setIsCoach(true);
    }

    if (
      dataEdit &&
      dataEdit.virtual_appointment_types[0]?.appointment_type_id === 9
    ) {
      setIsCoachVirtual(true);
    }
  }, [dataEdit, defaultValue]);

  const onSubmit = (value) => {
    if (type === "Nuevo" && !permissionsActions?.create) {
      return;
    } else if (type !== "Nuevo" && !permissionsActions?.edit) {
      return;
    }

    setLoadingFetch(true);
    let dataSubmit = {
      name: value.name,
      is_medical: isMedical ? 1 : 0,
      appoiment_types: isMedical
        ? value.typeAppointments
          ? value.typeAppointments.map((x) => {
              return { id: x.id };
            })
          : []
        : [],
    };

    if (isCoach) {
      dataSubmit.virtual_appointment_types = DataAppoinmentMycoach?.map(
        (item, index) => {
          return {
            user_profile_id: 29,
            id: item && item.id,
            capacity: value && value[`capacity_mycoach_${index}`],
          };
        }
      );
    } else if (isCoachVirtual) {
      dataSubmit.virtual_appointment_types = DataAppoinmentMycoachVirtual?.map(
        (item, index) => {
          return {
            user_profile_id: 34,
            id: item && item?.id,
            capacity: value && value[`capacity_mycoach_virtual_${index}`],
          };
        }
      );
    }
    if (defaultValue && defaultValue.virtual_appointment_types) {
      setSelectRole(defaultValue.virtual_appointment_types[0].user_profile_id);
    }

    const functionCall = type === "Nuevo" ? postRole : putRole;
    functionCall(dataSubmit, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setReload(!reload);
          reset();
        } else {
          enqueueSnackbar(data.message, errorToast);
        }
        setLoadingFetch(false);
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
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRole(defaultValue.id).then((req) => {
          Swal.fire("¡Eliminado!", "Su registro ha sido eliminado.", "success");
          setReload(!reload);
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {type !== "Nuevo" && (
        <ActionWithPermission isValid={permissionsActions.delete}>
          <div className="row justify-content-end mb-3 ms-0">
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
        </ActionWithPermission>
      )}

      {loader ? (
        <Loading />
      ) : (
        <div className="row align-items-end m-0">
          <div className="col p-0">
            <CommonComponentSimpleForm
              form={RoleForm}
              control={control}
              defaultValue={defaultValue}
            />
            <Controller
              rules={{ required: false }}
              control={control}
              name="user_profile_id"
              defaultValue={isEdit ? selectRole : ""}
              render={({ field }) => (
                <FormGroup row>
                  <FormControlLabel
                    label="¿Es médico?"
                    control={
                      <Checkbox
                        disabled={isCoach || isCoachVirtual}
                        onChange={(event) => setIsMedical(event.target.checked)}
                        name="medical_role"
                        color="primary"
                        checked={isMedical}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Rol my coach"
                    control={
                      <Checkbox
                        disabled={isMedical || isCoachVirtual}
                        onChange={(event) => setIsCoach(event.target.checked)}
                        name="mycoach_role"
                        color="primary"
                        checked={isCoach}
                      />
                    }
                  />
                  <FormControlLabel
                    label="Rol my coach virtual"
                    control={
                      <Checkbox
                        disabled={isMedical || isCoach}
                        onChange={(event) =>
                          setIsCoachVirtual(event.target.checked)
                        }
                        name="mycoach_virtual_role"
                        color="primary"
                        checked={isCoachVirtual}
                      />
                    }
                  />
                </FormGroup>
              )}
            />

            {isMedical ? (
              <ControlledAutocomplete
                control={control}
                name="typeAppointments"
                options={typeAppointment || []}
                getOptionLabel={(option) => `${option.name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("MedicalSuggestions.InputTypeQuote")}
                    variant="outlined"
                    margin="normal"
                  />
                )}
                defaultValue={defaultValue?.medicalProfileAppointmentTypes}
              />
            ) : isCoach ? (
              <div className="row">
                <div className="col-12 my-3">
                  <b>Tipos de cita</b>
                </div>
                {DataAppoinmentMycoach &&
                  DataAppoinmentMycoach.map((appoinment, index) => (
                    <>
                      <div
                        key={`capacity_mycoach_${index}`}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <p>{appoinment?.name}</p>
                        <div className="col-6 d-flex justify-content-between align-items-center">
                          <p>Capacidad</p>
                          <div className="col-6">
                            <Controller
                              name={`capacity_mycoach_${index}`}
                              rules={{ required: true }}
                              defaultValue={
                                dataEdit
                                  ? dataEdit?.virtual_appointment_types[0]
                                      ?.appointment_type_id === 6
                                    ? dataEdit?.virtual_appointment_types[index]
                                        ?.capacity
                                    : []
                                  : []
                              }
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  error={errors[`capacity_mycoach_${index}`]}
                                  className={classes.inputText}
                                  variant="outlined"
                                  type="text"
                                  placeholder={"---"}
                                  onKeyUp={(e) => {
                                    if (
                                      regexOnlyPositiveNumbers.test(
                                        e.target.value
                                      )
                                    ) {
                                      field.onChange(e.target.value);
                                    } else {
                                      e.target.value = "";
                                      field.onChange("");
                                    }
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            ) : isCoachVirtual ? (
              <div className="row">
                <div className="col-12 my-3">
                  <b>Tipos de cita</b>
                </div>
                {DataAppoinmentMycoachVirtual &&
                  DataAppoinmentMycoachVirtual.map(
                    (appoinmentVirtual, index) => (
                      <div
                        key={`capacity_mycoach_virtual_${index}`}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <p>{appoinmentVirtual?.name}</p>
                        <div className="col-6 d-flex justify-content-between align-items-center">
                          <p>Capacidad</p>
                          <div className="col-6">
                            <Controller
                              name={`capacity_mycoach_virtual_${index}`}
                              rules={{ required: true }}
                              defaultValue={
                                dataEdit
                                  ? dataEdit?.virtual_appointment_types[0]
                                      ?.appointment_type_id === 9
                                    ? dataEdit?.virtual_appointment_types[index]
                                        ?.capacity
                                    : []
                                  : []
                              }
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  error={
                                    errors[`capacity_mycoach_virtual_${index}`]
                                  }
                                  className={classes.inputText}
                                  variant="outlined"
                                  type="text"
                                  placeholder={"---"}
                                  onKeyUp={(e) => {
                                    if (
                                      regexOnlyPositiveNumbers.test(
                                        e.target.value
                                      )
                                    ) {
                                      field.onChange(e.target.value);
                                    } else {
                                      e.target.value = "";
                                      field.onChange("");
                                    }
                                  }}
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}
              </div>
            ) : (
              ""
            )}
          </div>

          <ActionWithPermission
            isValid={
              type === "Nuevo"
                ? permissionsActions?.create
                : permissionsActions?.edit
            }
          >
            <div className="col-2">
              <ButtonSave
                style={{ width: "100%" }}
                classes={classes.button}
                text={t("Btn.save")}
                loader={loadingFetch}
              />
            </div>
          </ActionWithPermission>
        </div>
      )}
    </form>
  );
};
