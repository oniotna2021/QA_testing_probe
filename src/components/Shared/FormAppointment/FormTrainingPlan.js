//REACT
import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";

//UI
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Typography from "@material-ui/core/Typography";

//UTILS
import { errorToast, mapErrors } from "utils/misc";

//IMPORTS
import { useSnackbar } from "notistack";

//TRANSLATE
import { useTranslation } from "react-i18next";

//COMPONENTS
import ButtonSave from "../ButtonSave/ButtonSave";

//SERVICES
import {
  getVenuesByCity,
  getTrainers,
} from "services/MedicalSoftware/VenuesAndTrainers";
import { putAssingTrainer } from "services/MedicalSoftware/UserInformation";

//SWEET ALERT
import Swal from "sweetalert2";

const FormTrainingPlan = ({
  venueCityIdDefault,
  venueIdDefaultProfile,
  venueNameDefaultProfile,
  isFormModal,
  user_id,
  reload,
  setReload,
  setExpanded,
  setOpenAssignTrainer,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  //STATES
  const [dataVenues, setDataVenues] = useState([]); //VENUES
  const [dataTrainers, setDataTrainers] = useState([]); //TRAINERS
  const [loadFetch, setLoadFetch] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (venueCityIdDefault) {
      getVenuesByCity(venueCityIdDefault)
        .then(({ data }) => {
          if (data.status === "success" && data.data && data.data.length > 0) {
            setDataVenues(data.data);
          } else {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, venueCityIdDefault]);

  useEffect(() => {
    if (venueIdDefaultProfile && venueNameDefaultProfile) {
      let defaultVenueObject = {
        id: venueIdDefaultProfile,
        name: venueNameDefaultProfile,
      };
      setValue("id_venue", defaultVenueObject);
    }
  }, [venueIdDefaultProfile, venueNameDefaultProfile]);

  const handleChange = (data) => {
    let id_venue = data?.id;
    if (id_venue !== undefined) {
      getTrainers(id_venue)
        .then(({ data }) => {
          if (data.status === "success" && data.data && data.data.length > 0) {
            setDataTrainers(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    } else {
      return;
    }
  };

  const onSubmit = (value) => {
    setLoadFetch(true);
    const valueSubmit = {
      user_id: user_id,
      trainer_id: value.trainer_id,
      venue_id: value.id_venue.id,
    };
    const functionCall = putAssingTrainer;
    functionCall(valueSubmit)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          Swal.fire({
            title: "Entrenador asignado",
            text: "Asignación exitosa con el entrenador",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "No se ha podido asignar entrenador",
            text: `${data.message[0].message}`,
            icon: "error",
          });
        }
        setLoadFetch(false);
        setOpenAssignTrainer(false);
        if (setReload) {
          setReload(!reload);
        }
        if (setExpanded) {
          setExpanded(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadFetch(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isFormModal && (
        <Typography variant="h5" style={{ marginBottom: 30 }}>
          Asignar entrenador
        </Typography>
      )}
      <div className="row m-0">
        <div className={isFormModal ? "col-12" : "col-4 mt-3"}>
          <Controller
            name="id_venue"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                onChange={(_, data) => {
                  handleChange(data);
                  onChange(data);
                }}
                options={dataVenues}
                defaultValue={value}
                noOptionsText={t("ListPermissions.NoData")}
                getOptionLabel={(option) => option?.name}
                renderOption={(option) => (
                  <React.Fragment>
                    <Typography variant="body2">{option?.name}</Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("FormTrainingPlan.InputSedes")}
                    variant="outlined"
                    error={errors.method_id_group_classes}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            )}
          />
        </div>

        <div className={isFormModal ? "col-12 mt-3" : "col-4 mt-3"}>
          <Controller
            control={control}
            name="trainer_id"
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel labelId="selectTrainer">
                  {t("ListTrainers.Container")}
                </InputLabel>
                <Select
                  labelid="selectTrainer"
                  label={t("ListTrainers.Container")}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {dataTrainers.map((res) => (
                    <MenuItem key={res.id} value={res.id}>
                      {res.first_name + " " + res.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div
          className={
            isFormModal
              ? "col-12 d-flex justify-content-end mt-3"
              : "col-4 mt-3"
          }
        >
          <ButtonSave
            loader={loadFetch}
            text={t("FormTrainingPlan.ButtonAssign")}
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueCityIdDefault: auth.venueCityIdDefault,
  venueIdDefaultProfile: auth.venueIdDefaultProfile,
  venueNameDefaultProfile: auth.venueNameDefaultProfile,
});

export default connect(mapStateToProps)(FormTrainingPlan);
