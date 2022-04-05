import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import slugify from "slugify";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

// Components
import DropzoneImage from "components/Shared/DropzoneImage/DropzoneImage";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Schedules from "components/Shared/ScheduleDaysWeek/Schedule";

//Services
import {
  getSchedulesByLocationVenue,
  postAddLocationHasVenueAndSchedules,
  putLocationHasVenue,
} from "services/Reservations/locationHasVenue";
import { getAllLocationCategory } from "services/Reservations/locationCategory";
import { getLocationByCategoryLocation } from "services/Reservations/location";

//utils
import {
  successToast,
  errorToast,
  mapErrors,
  setFormData,
  regexNumbersPositive,
} from "utils/misc";

const FormLocation = ({
  setLoad,
  idVenue,
  dataItem,
  files,
  setFiles,
  setExpanded,
  isEdit = false,
  setIsEdit,
  setIdItem,
  idItem,
  defaultValue,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [typeLocations, setTypeLocations] = useState([]);
  const [dataSchedules, setDataSchedule] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [idTypeLocation, setIdTypeLocation] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      venue_id: idVenue,
      is_capacity: 0,
      capacity: 0,
      schedules: [],
    },
  });

  useEffect(() => {
    getAllLocationCategory()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setTypeLocations(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (idTypeLocation) {
      getLocationByCategoryLocation(idTypeLocation)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setLocations(data?.data?.locations);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [idTypeLocation, enqueueSnackbar]);

  useEffect(() => {
    console.log(dataItem);
    if (dataItem?.id && isEdit) {
      getSchedulesByLocationVenue(dataItem.id)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setIdTypeLocation(defaultValue?.location_category_id);

            if (data.data.is_capacity === 1) {
              setValue(
                "is_capacity",
                data.data.is_capacity === 1 ? true : false
              );
              setValue("capacity", data.data.capacity);
            }

            setDataSchedule(data.data.schedules);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data?.message), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [idItem, enqueueSnackbar, isEdit, setValue, defaultValue, dataItem]);

  const submitForm = (data) => {
    const dataForm = {
      ...data,
      capacity: Number(data.capacity),
      is_capacity: data.capacity > 0 ? 1 : 0,
      schedules: isEdit ? schedules : JSON.stringify(schedules),
      venue_id: idVenue,
      url_image: files[0],
    };

    setLoading(true);
    const functionCall = isEdit
      ? putLocationHasVenue
      : postAddLocationHasVenueAndSchedules;
    functionCall(isEdit ? dataForm : setFormData(dataForm), dataItem?.id)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad();
          setExpanded(false);
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

  const handleChangeTypeLocation = (id) => {
    setIdTypeLocation(id);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <div className="container">
        <div className="row justify-content-center">
          {!isEdit && (
            <div class="col-2 ms-4">
              <DropzoneImage files={files} setFiles={setFiles} />
            </div>
          )}

          <div className="col">
            <div>
              <FormControl variant="outlined">
                <InputLabel>
                  {t("FormVenueLocation.SelectTypeLocation")}
                </InputLabel>
                <Select
                  disabled={isEdit ? true : false}
                  name="location_category_id"
                  fullWidth
                  id={slugify("location_category_id", { lower: true })}
                  label={t("FormVenueLocation.SelectTypeLocation")}
                  variant="outlined"
                  onChange={(e) => {
                    handleChangeTypeLocation(e.target.value);
                  }}
                  value={idTypeLocation}
                >
                  {typeLocations &&
                    typeLocations.map((typeLocation) => (
                      <MenuItem value={typeLocation.id} key={typeLocation.id}>
                        {typeLocation.name}
                      </MenuItem>
                    ))}
                </Select>
                {errors.location_category_id && (
                  <FormHelperText error>Campo requerido</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="row">
              <div className="col-6 mt-4">
                <Controller
                  rules={{ required: isEdit ? false : true }}
                  control={control}
                  name="location_id"
                  defaultValue={dataItem?.location_id}
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <InputLabel>
                        {t("FormVenueLocation.SelectLocation")}
                      </InputLabel>
                      <Select
                        {...field}
                        disabled={isEdit ? true : false}
                        fullWidth
                        id={slugify("location_id", { lower: true })}
                        label={t("FormVenueLocation.SelectLocation")}
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      >
                        {locations &&
                          locations.map((locations) => (
                            <MenuItem
                              value={`${locations.id}`}
                              key={locations.id}
                            >
                              {locations.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.location_id && (
                        <FormHelperText error>Campo requerido</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div className="col-6 mt-4">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="capacity"
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        id={slugify("capacity", { lower: true })}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {t("FormVenueLocation.CapacityDescription")}
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        inputProps={{ min: 0 }}
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                      />
                      {errors.capacity && (
                        <FormHelperText error>Campo requerido</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className="mt-4">
              <Schedules
                typeSchedule="common"
                defaultValues={dataSchedules}
                title={t("FormVenueLocation.SelectDays")}
                setSchedules={setSchedules}
                schedules={schedules}
              />
            </div>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <ButtonSave text={t("Btn.save")} loader={loading} />
          </div>
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = ({ auth }) => ({
  idVenue: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(FormLocation);
