import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  IconEdit,
  IconScheduleActivity,
  InactivateScheduleIcon,
  InsertTrashActivity,
} from "assets/icons/customize/config";
import { addMinutes, isDate, subMinutes } from "date-fns";
//utils
import {
  checkDuration,
  checkSchedules,
  convertH2M,
  errorToast,
  formatDateToHHMMSS,
  infoToast,
  mapErrors,
  successToast,
} from "utils/misc";
//Services
import {
  deleteActivityFormActivity,
  getActivityById,
  getAllActivities,
} from "services/Reservations/activities";
import {
  postAddScheduleActivity,
  putScheduleActivity,
} from "services/Reservations/venueActivities";

import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import AssignMassiveActivities from "components/Common/ModuleConfigReservations/MassiveActivities/AssignMassiveActivities";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import FormControl from "@material-ui/core/FormControl";
//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import FormRemoveActivity from "components/Common/ModuleActivitiesCalendar/FormRemoveActivity/FormRemoveActivity";
import FormScheduleRefactored from "components/Shared/FormScheduleRefactored/FormScheduleRefactored";
import IconButton from "@material-ui/core/IconButton";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
// Components
import TimePicker from "components/Shared/TimePicker/TimePicker";
import Typography from "@material-ui/core/Typography";
import { getAllLocation } from "services/Reservations/location";
import { getEmployeesByVenue } from "services/Reservations/employess";
import { getLocationByVenue } from "services/Reservations/location";
import { makeStyles } from "@material-ui/core";
import { postAssignMassiveActivity } from "services/Reservations/activitiesGeneral";
import slugify from "slugify";
// Hooks
import useAutocomplete from "hooks/useAutocomplete";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const propsTimePicker = {
  ampm: true,
  inputVariant: "outlined",
  margin: "normal",
  minutesStep: 5,
  KeyboardButtonProps: { "aria-label": "change time" },
  emptyLabel: null,
  invalidLabel: "Hora inválida",
  InputAdornmentProps: { position: "start" },
};

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
  //   style: { padding: "30px" },
};

const useStyles = makeStyles((theme) => ({
  content: {
    background: theme.themeColorSoft,
    borderRadius: 10,
    width: "100%",
    height: "60px",
    color: "#000",
  },
  fontBold: {
    fontWeight: "bold",
  },
}));

const FormActivity = ({
  setLoad,
  idVenue,
  setOpenForm,
  isEdit = false,
  idItem,
  dataItem,
  userType,
  lockCapacity,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [dataSchedules, setDataSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [duration, setDuration] = useState(null);
  const [activityId, setActivityId] = useState(0);
  const [dataActivity, setDataActivity] = useState({});
  const [openedDayWeek, setOpenedDayWeek] = useState(0);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      schedules: [],
    },
  });

  const [loadLocations, setLoadLocations] = useState(false);

  const [openInactivate, setOpenInactivate] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const [messages, setMessages] = useState([]);

  const [valueActivity] = useAutocomplete(activities, activityId);

  // modal
  const [openPlaces, setOpenPlaces] = useState(false);
  // option RadioGroup
  const [optionAssign, setOptionAssign] = useState("");
  // category location
  const [locationCategory, setLocationCategory] = useState([]);
  // regions, cities and venues
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [venues, setVenues] = useState([]);

  // validate button lockCapacity
  const [changeSchedul, setChangeSchedule] = useState(true);

  useEffect(() => {
    getAllActivities()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setActivities(data.data);
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
    if (idVenue) {
      getEmployeesByVenue(idVenue)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data?.data?.users?.length > 0
          ) {
            const filterManagers = data?.data?.users;
            setEmployees(filterManagers);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, idVenue]);

  useEffect(() => {
    if ((userType === 17 || userType === 41) && dataItem) {
      setActivityId(dataItem.id);
      setDuration(new Date(`2021-08-18T${dataItem?.duration}`));
      // category Location
      getAllLocation()
        .then(({ data }) => {
          if (data && data.status === "success") {
            setLocationCategory(data.data);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    } else {
      getLocationByVenue(idVenue)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data && data.data) {
            setLocations(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, idVenue, dataItem]);

  useEffect(() => {
    if (idItem && isEdit) {
      getActivityById(idItem)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            if (data?.data?.activity_id) {
              setDataActivity(data?.data);
              setActivityId(data.data.activity_id);
              setValue("activity_id", data.data.activity_id);
            }

            if (data?.data?.length_minutes > 0) {
              const durationMinutes = addMinutes(
                new Date(`2021-08-18T00:00:00`),
                data?.data?.length_minutes
              );
              const durationToSub = convertH2M(
                formatDateToHHMMSS(durationMinutes)
              );
              if (data.data.shedules.length > 0) {
                setDataSchedules(
                  data?.data?.shedules.map((schedule) => {
                    if (schedule.end_time !== null) {
                      return {
                        ...schedule,
                        end_time: formatDateToHHMMSS(
                          subMinutes(
                            new Date(`2021-08-18T${schedule.end_time}`),
                            durationToSub
                          )
                        ),
                      };
                    }
                    return schedule;
                  })
                );
              }
              setDuration(durationMinutes);
              setValue("length_minutes", durationMinutes);
            } else {
              setDataSchedules(data?.data?.shedules);
            }

            setValue("capacity_min", data?.data?.capacity_min);
            setValue("capacity_max", data?.data?.capacity_max);

            if (data.data.location_has_venue_id) {
              setLoadLocations(true);
              setValue(
                "location_has_venue_id",
                data?.data?.location_has_venue_id
              );
              setLoadLocations(false);
            }

            if (data?.data?.managers && employees) {
              let employessData = [];
              employees.forEach((employee) => {
                if (data?.data?.managers.some((p) => p === employee.id)) {
                  employessData.push(employee);
                }
              });
              setValue("managers", employessData);
            }
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [idItem, enqueueSnackbar, isEdit, setValue, employees, dataItem]);

  const handleChangeRegion = (value) => {
    if (regions.some((reg) => reg.id === value.id)) {
      setRegions(regions.filter((region) => region.id !== value.id));
    } else {
      setRegions((prev) => [...prev, value]);
    }
  };

  const handleChangeCity = (value) => {
    if (cities.some((reg) => reg.id === value.id)) {
      setCities(cities.filter((city) => city.id !== value.id));
    } else {
      setCities((prev) => [...prev, value]);
    }
  };

  const handleChangeVenue = (value) => {
    setVenues(value);
  };

  const submitForm = (data) => {
    setLoading(true);

    if ((userType === 17 || userType === 41) && dataItem) {
      let dataForm = {
        ...data,
        regions: regions.length !== 0 ? regions.map((x) => Number(x.id)) : [],
        venues: venues.length !== 0 ? venues.map((x) => Number(x.id)) : [],
        cities: cities.length !== 0 ? cities.map((x) => Number(x.id)) : [],
        location_id: Number(data.location_id),
        activity_id: dataItem && dataItem.id,
        start_date: data.start,
        end_date: data.end,
        length_minutes:
          duration !== null && isDate(duration)
            ? convertH2M(formatDateToHHMMSS(duration))
            : null,
        schedules: schedules
          ? schedules.length !== 0
            ? checkSchedules(schedules, true)
            : []
          : [],
      };

      postAssignMassiveActivity(dataForm)
        .then(({ data }) => {
          if (data && data.data && data.data.length > 0) {
            setOpenAnswer(true);
            setMessages(data.data);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
        .finally(() => {
          setLoading(false);
        });
    } else {
      let dataForm = {
        ...data,
        location_has_venue_id: data.location_has_venue_id || null,
        capacity_max: Number(data.capacity_max),
        capacity_min: Number(data.capacity_min),
        length_minutes:
          duration !== null && isDate(duration)
            ? convertH2M(formatDateToHHMMSS(duration))
            : null,
        schedules: schedules
          ? schedules.length !== 0
            ? checkSchedules(schedules, true)
            : []
          : [],
        managers: [],
        venue_id: data.location_has_venue_id ? null : idVenue,
      };

      const functionCall = isEdit
        ? putScheduleActivity
        : postAddScheduleActivity;

      functionCall(dataForm, idItem)
        .then(({ data }) => {
          if (data && data.message && data.status === "success") {
            enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
            setLoad(true);
            setOpenForm(false);
          } else {
            if (dataForm.location_has_venue_id) {
              enqueueSnackbar(mapErrors(data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChangeActivityAutocomplete = (value) => {
    setDuration(new Date(`2021-08-18T${value?.duration}`));
  };

  const handleDeleteActivity = () => {
    if (!!isEdit) {
      deleteActivityFormActivity(idItem)
        .then(({ data }) => {
          if (data && data.status === "success") {
            enqueueSnackbar("Eliminado correctamente", successToast);
            setLoad(true);
          } else {
            enqueueSnackbar(mapErrors(data), infoToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }

    setOpenForm(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="mt-4">
          <Controller
            rules={{ required: true }}
            control={control}
            name="activity_id"
            defaultValue={activityId}
            render={({ field }) => (
              <FormControl variant="outlined">
                <Autocomplete
                  {...field}
                  disabled={isEdit ? true : false}
                  placeholder={t("Actividad")}
                  value={valueActivity}
                  onChange={(_, value) => {
                    field.onChange(parseInt(value.id));
                    setActivityId(value.id);
                    handleChangeActivityAutocomplete(value);
                  }}
                  disableClearable={true}
                  getOptionLabel={(option) => `${option.name}`}
                  getOptionSelected={(option, value) =>
                    Number(value) === option.id
                  }
                  aria-label="seleccionar actividad"
                  id="controllable-select-activity"
                  options={activities}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("FormsVenueActivities.SelectActivity")}
                      variant="outlined"
                    />
                  )}
                />
                {errors.activity_id && (
                  <FormHelperText error>Campo requerido</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </div>

        <div className="row mt-4 g-0">
          <div className="col-6">
            <div className="me-2">
              <Controller
                rules={{ required: true }}
                control={control}
                name="capacity_min"
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <TextField
                      {...field}
                      fullWidth
                      error={errors.capacity_min}
                      id={slugify("capacity_min", { lower: true })}
                      type="number"
                      label={t("FormsVenueActivities.CapacityMin")}
                      rows={1}
                      variant="outlined"
                      inputProps={{ min: 1 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    {errors.capacity_min && (
                      <FormHelperText error>Campo requerido</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="col-6">
            <Controller
              rules={{ required: true }}
              control={control}
              name="capacity_max"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TextField
                    {...field}
                    fullWidth
                    error={errors.capacity_max}
                    id={slugify("capacity_max", { lower: true })}
                    type="number"
                    label={t("FormsVenueActivities.CapacityMax")}
                    rows={1}
                    variant="outlined"
                    inputProps={{ min: 1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  {errors.capacity_max && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
        </div>

        <div className="row mt-3 py-2 gx-0">
          <div className="col d-flex align-items-center">
            <Typography variant="body2">
              {t("FormsVenueActivities.ActitivyDuration")}
            </Typography>
          </div>

          <div className="col-6 mx-0 gx-0">
            <Controller
              rules={{ required: false }}
              control={control}
              defaultValue={duration}
              name="length_minutes"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TimePicker
                    {...field}
                    disabled={true}
                    id={slugify("duration", { lower: true })}
                    label={"Duración"}
                    value={duration}
                    onChange={(e) => {
                      field.onChange(checkDuration(e));
                      setDuration(checkDuration(e));
                    }}
                    {...propsTimePicker}
                    ampm={false}
                  />
                </FormControl>
              )}
            />
          </div>
        </div>

        <div
          className="my-2"
          style={{ borderTop: "1px solid rgba(60, 60, 59, 0.1)" }}
        ></div>

        <div className="my-4">
          <Typography className={classes.fontBold}>
            {t("FormsVenueActivities.ActivityHour")}
          </Typography>

          <Typography className="mt-3" variant="body1">
            {t("FormsVenueActivities.DescriptionScheduleActivity")}
          </Typography>

          {/* <ScheduleActivity
          idVenue={idVenue}
          defaultValues={dataSchedules}
          duration={duration}
          setSchedules={setSchedules}
          schedules={schedules}
        /> */}

          <FormScheduleRefactored
            lockCapacity={lockCapacity}
            setChangeSchedule={setChangeSchedule}
            userType={userType}
            handleChangeRegion={handleChangeRegion}
            handleChangeCity={handleChangeCity}
            handleChangeVenue={handleChangeVenue}
            regions={regions}
            cities={cities}
            venues={venues}
            setRegions={setRegions}
            setCities={setCities}
            setVenues={setVenues}
            optionAssign={optionAssign}
            setOptionAssign={setOptionAssign}
            idVenue={idVenue}
            setOpenedDayWeek={setOpenedDayWeek}
            openedDayWeek={openedDayWeek}
            inCollaborators={false}
            defaultValues={dataSchedules}
            duration={duration}
            setSchedules={setSchedules}
            schedules={schedules}
            title={t("FormActivitiesVenue.TitleSchedules")}
            description={t("FormActivitiesVenue.DescriptionSchedules")}
          >
            {({ setIsOpen }) => (
              <div
                onClick={() => {
                  duration !== null && isDate(duration)
                    ? setIsOpen(true)
                    : enqueueSnackbar(
                        t("Debes seleccionar una actividad"),
                        infoToast
                      );
                }}
                className={`d-flex align-items-center justify-content-between p-3 pointer mt-3 ${classes.content}`}
              >
                <div className="d-flex align-items-center">
                  <div className="mx-4">
                    <IconScheduleActivity width="25" height="25" color="#000" />
                  </div>
                  <Typography className={`${classes.fontBold}`}>
                    {t("FormActivitiesVenue.ButtonViewSchedules")}
                  </Typography>
                </div>

                <IconButton>
                  <ArrowForwardIosIcon
                    fontSize="small"
                    width="25"
                    height="25"
                    style={{ color: "#000" }}
                  />
                </IconButton>
              </div>
            )}
          </FormScheduleRefactored>
        </div>

        <div
          className="my-2"
          style={{ borderTop: "1px solid rgba(60, 60, 59, 0.1)" }}
        ></div>

        <div className="my-4">
          {userType !== (17 || 41) ? (
            <Typography className={classes.fontBold}>
              {t("FormsVenueActivities.ActivityLocation")}
            </Typography>
          ) : (
            <Typography className={classes.fontBold}>Espacio</Typography>
          )}

          <Typography className="mt-3" variant="body1">
            {t("FormsVenueActivities.DescriptionSelectLocations")}
          </Typography>

          <div className="mt-4">
            {userType === 17 || userType === 41 ? (
              // Location Category
              <Controller
                rules={{ required: true }}
                control={control}
                name="location_id"
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel>Espacio</InputLabel>
                    <Select
                      {...field}
                      fullWidth
                      error={errors.location_category}
                      id={slugify("location_id", { lower: true })}
                      label={t("Espacio")}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      {/* <MenuItem value={null}>Ninguno</MenuItem> */}
                      {locationCategory &&
                        locationCategory.map((category) => (
                          <MenuItem value={`${category.id}`} key={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                    </Select>
                    {errors.location_category && (
                      <FormHelperText error>Campo requerido</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            ) : (
              locations &&
              !loadLocations &&
              locations.length > 0 && (
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="location_has_venue_id"
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <InputLabel>
                        {t("FormsVenueActivities.Locations")}
                      </InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        name="location_has_venue_id"
                        id={slugify("location_has_venue_id", { lower: true })}
                        label={t("FormsVenueActivities.Locations")}
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      >
                        {/* <MenuItem value={null}>Ninguno</MenuItem> */}
                        {locations &&
                          locations.map((locations) => (
                            <MenuItem
                              value={`${locations.location_has_venue_id}`}
                              key={locations.location_has_venue_id}
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
              )
            )}
          </div>
          <>
            {regions.length > 0 ? (
              <div className="row mt-4 ">
                <p>Regiones seleccionadas</p>
                <div className="col-10">
                  <div
                    style={{
                      background: "#F3F3F3",
                      display: "flex",
                      borderRadius: "12px",
                      padding: ".5em",
                    }}
                  >
                    {regions.map((item) => item?.name).join(", ")}
                  </div>
                </div>
                <div className="col-2 d-flex align-items-center">
                  <IconButton
                    onClick={() => setOpenPlaces(true)}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <IconEdit width="15" height="15" color={theme.themeColor} />
                  </IconButton>
                </div>
              </div>
            ) : cities.length > 0 ? (
              <div className="row mt-4">
                <p>Ciudades seleccionadas</p>
                <div className="col-10">
                  <div
                    style={{
                      background: "#F3F3F3",
                      display: "flex",
                      borderRadius: "12px",
                      padding: ".5em",
                    }}
                  >
                    {cities.map((item) => item?.name).join(", ")}
                  </div>
                </div>
                <div className="col-2 d-flex align-items-center">
                  <IconButton
                    onClick={() => setOpenPlaces(true)}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <IconEdit width="15" height="15" color={theme.themeColor} />
                  </IconButton>
                </div>
              </div>
            ) : venues.length > 0 ? (
              <div className="row mt-4">
                <p>Sedes seleccionadas</p>
                <div className="col-10">
                  <div
                    style={{
                      background: "#F3F3F3",
                      display: "flex",
                      borderRadius: "12px",
                      padding: ".5em",
                    }}
                  >
                    {venues.map((item) => item?.name).join(", ")}
                  </div>
                </div>
                <div className="col-2 d-flex align-items-center">
                  <IconButton
                    onClick={() => setOpenPlaces(true)}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <IconEdit width="15" height="15" color={theme.themeColor} />
                  </IconButton>
                </div>
              </div>
            ) : null}
          </>
        </div>

        {userType === 17 || userType === 41
          ? ""
          : isEdit && (
              <div className="mb-4">
                <div
                  className="my-2"
                  style={{ borderTop: "1px solid rgba(60, 60, 59, 0.1)" }}
                ></div>

                <div className="mt-4">
                  <Typography className={classes.fontBold}>
                    {t("FormsVenueActivities.EnableActivity")}
                  </Typography>

                  <Typography className="mt-3" variant="body1">
                    {t("FormsVenueActivities.EnableActivityDescription")}
                  </Typography>

                  <div
                    onClick={() => setOpenInactivate(true)}
                    className={`d-flex align-items-center justify-content-between p-3 pointer mt-3 ${classes.content}`}
                  >
                    <div className="d-flex align-items-center">
                      <div className="mx-4">
                        <InactivateScheduleIcon
                          width="20"
                          height="20"
                          color="#000"
                        />
                      </div>
                      <Typography className={`${classes.fontBold}`}>
                        {t("FormsVenueActivities.EnableActivity")}
                      </Typography>
                    </div>

                    <IconButton>
                      <ArrowForwardIosIcon
                        fontSize="small"
                        width="25"
                        height="25"
                        style={{ color: "#000" }}
                      />
                    </IconButton>
                  </div>
                </div>
              </div>
            )}

        <div className="row m-0 mb-4 pt-2">
          <div className="col-6 d-flex justify-content-center">
            <Button
              onClick={() => handleDeleteActivity()}
              type="button"
              className={classes.buttonCancel}
              variant="contained"
              style={{ marginRight: 0, width: "100%" }}
              startIcon={!!isEdit && <InsertTrashActivity />}
            >
              {!!isEdit ? t("Btn.delete") : t("Btn.Cancel")}
            </Button>
          </div>
          <div className="col-6">
            {lockCapacity !== 1 ? (
              <ButtonSave
                style={{ width: "100%" }}
                loader={loading}
                text={isEdit ? t("Btn.saveChanges") : t("Btn.save")}
              />
            ) : (
              <ButtonSave
                style={{ width: "100%" }}
                loader={loading}
                disabled={changeSchedul ? true : false}
                text={t("Btn.saveChanges")}
              />
            )}
          </div>
        </div>
      </form>

      <ShardComponentModal
        width="xs"
        fullWidth="true"
        handleClose={() => setOpenInactivate(false)}
        title={t("FormsVenueActivities.EnableActivity")}
        body={
          <FormRemoveActivity
            isCalendar={false}
            setIsOpen={setOpenInactivate}
            dataDetailActivity={dataActivity}
            setFetchReload={() => console.log("reload")}
            setValueTab={() => setOpenInactivate(false)}
          />
        }
        isOpen={openInactivate}
      />

      <ShardComponentModal
        width="xs"
        fullWidth="true"
        handleClose={() => {
          setOpenAnswer(false);
          setOpenForm(false);
        }}
        title="Asignar Actividad"
        isOpen={openAnswer}
        body={
          <>
            <div className="my-3">
              <Typography variant="h5">Asignaciones exitosas</Typography>
              <div
                style={{ display: "flex", overflowX: "auto", width: "100%" }}
              >
                {messages.length > 0 &&
                  messages.map((message) => (
                    <>
                      {message.status === "success" ? (
                        <div className="cardMessage">
                          <div className="cardBadgeSuccess"></div>
                          <p style={{ width: 200, margin: 10 }}>
                            {message.message}
                          </p>
                        </div>
                      ) : null}
                    </>
                  ))}
              </div>
            </div>
            <div className="my-3">
              <Typography variant="h5">Asignaciones no exitosas</Typography>
              <div style={{ overflowX: "auto", display: "flex" }}>
                {messages.length > 0 &&
                  messages.map((message) => (
                    <>
                      {message.status === "error" ? (
                        <div className="cardMessage">
                          <div className="cardBadgeError"></div>
                          <p style={{ width: 200, margin: 10 }}>
                            {message.message}
                          </p>
                        </div>
                      ) : null}
                    </>
                  ))}
              </div>
            </div>
            <div>
              <Button
                onClick={() => {
                  setOpenAnswer(false);
                  setOpenForm(false);
                }}
                type="button"
                className={classes.buttonAssign}
                variant="contained"
                style={{ marginRight: 0, width: "100%" }}
              >
                Aceptar
              </Button>
            </div>
          </>
        }
      />

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <>
            <AssignMassiveActivities
              isView={true}
              optionAssign={optionAssign}
              setOptionAssign={setOptionAssign}
              setOpenPlaces={setOpenPlaces}
              handleChangeRegion={handleChangeRegion}
              handleChangeCity={handleChangeCity}
              handleChangeVenue={handleChangeVenue}
              regions={regions}
              cities={cities}
              venues={venues}
              setRegions={setRegions}
              setCities={setCities}
              setVenues={setVenues}
            />
          </>
        }
        isOpen={openPlaces}
        title={"Asignar Actividad"}
        handleClose={() => {
          setOpenPlaces(false);
        }}
      />
    </>
  );
};

export default FormActivity;
