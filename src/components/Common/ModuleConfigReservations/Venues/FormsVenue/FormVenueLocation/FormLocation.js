import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import slugify from "slugify";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

// Components
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
  setOpenForm,
  isEdit = false,
  setIsEdit,
  setIdItem,
  idItem,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [typeLocations, setTypeLocations] = useState([]);
  const [dataSchedules, setDataSchedule] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [viewCapacity, setViewCapacity] = useState(false);
  const [nameLocation, setNameLocation] = useState("");
  const [idTypeLocation, setIdTypeLocation] = useState("");
  const [thirdSpace, setThirdSpace] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
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
            enqueueSnackbar(mapErrors(data.data), errorToast);
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
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.locations.length > 0
          ) {
            setLocations(data.data.locations);
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
  }, [idTypeLocation, enqueueSnackbar]);

  useEffect(() => {
    if (idItem && isEdit) {
      getSchedulesByLocationVenue(idItem)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setNameLocation(data.data.location_name);

            if (data.data.is_capacity === 1) {
              setViewCapacity(true);
              setValue(
                "is_capacity",
                data.data.is_capacity === 1 ? true : false
              );
              setValue("capacity", data.data.capacity);
            }

            if (data.data.third_party_space === 1) {
              setThirdSpace(true);
              setValue(
                "third_party_space",
                data.data.third_party_space === 1 ? true : false
              );
              setValue("address", data.data.address);
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

    return () => {
      setIdItem("");
      setIsEdit(false);
    };
  }, [idItem, enqueueSnackbar, isEdit, setIdItem, setIsEdit, setValue]);

  const submitForm = (data) => {
    const dataForm = {
      ...data,
      capacity: Number(data.capacity),
      is_capacity: data.is_capacity === true ? 1 : 0,
      address: data.third_party_space === true ? data.address : "",
      third_party_space: data.third_party_space === true ? 1 : 0,
      schedules: isEdit ? schedules : JSON.stringify(schedules),
      venue_id: idVenue,
    };
    console.log(dataForm);

    setLoading(true);
    const functionCall = isEdit
      ? putLocationHasVenue
      : postAddLocationHasVenueAndSchedules;
    functionCall(isEdit ? dataForm : setFormData(dataForm), idItem)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(true);
          setOpenForm(false);
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
      {!isEdit && (
        <div className="mt-4">
          <FormControl variant="outlined">
            <InputLabel>{t("FormVenueLocation.SelectTypeLocation")}</InputLabel>
            <Select
              name="id_country"
              fullWidth
              id={slugify("id_country", { lower: true })}
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
            {errors.type_activity_id && (
              <FormHelperText error>Campo requerido</FormHelperText>
            )}
          </FormControl>
        </div>
      )}

      {isEdit && (
        <div className="mt-4">
          <Typography variant="body1">Actividad: {nameLocation}</Typography>
        </div>
      )}

      {!isEdit && (
        <div className="mt-4">
          <Controller
            rules={{ required: true }}
            control={control}
            name="location_id"
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel>{t("FormVenueLocation.SelectLocation")}</InputLabel>
                <Select
                  {...field}
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
                      <MenuItem value={`${locations.id}`} key={locations.id}>
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
      )}

      <div className="row mt-4 py-2">
        <div className="col">
          <div className="d-flex align-items-center justify-content-center">
            <div>
              <Controller
                rules={{ required: false }}
                control={control}
                name="is_capacity"
                render={({ field }) => (
                  <FormControl>
                    <Checkbox
                      {...field}
                      onChange={(e) => {
                        setViewCapacity(e.target.checked);
                        field.onChange(e.target.checked);
                      }}
                      checked={field.value}
                      color="primary"
                    />
                  </FormControl>
                )}
              />
            </div>
            <div>
              <Typography variant="body2">
                {t("FormVenueLocation.AssingCapacity")}
              </Typography>
            </div>
          </div>
        </div>

        {viewCapacity && (
          <div className="col-4">
            <Controller
              rules={{ required: true }}
              control={control}
              name="capacity"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TextField
                    {...field}
                    fullWidth
                    id={slugify("capacity", { lower: true })}
                    type="number"
                    label={t("ListLocation.Capacity")}
                    rows={1}
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
        )}
      </div>

      <div className="row mt-2 py-2">
        <div className="col 12">
          <div className="d-flex align-items-center justify-content-center">
            <div>
              <Controller
                rules={{ required: false }}
                control={control}
                name="third_party_space"
                defaultValue={Boolean(getValues("third_party_space"))}
                render={({ field }) => (
                  <FormControl>
                    <Checkbox
                      {...field}
                      onChange={(e) => {
                        setThirdSpace(e.target.checked);
                        field.onChange(e.target.checked);
                      }}
                      checked={field.value}
                      color="primary"
                    />
                  </FormControl>
                )}
              />
            </div>
            <div>
              <Typography variant="body2">Espacio de tercero</Typography>
            </div>
          </div>
        </div>

        {thirdSpace && (
          <div className="col">
            <Controller
              rules={{ required: true }}
              control={control}
              name="address"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <TextField
                    {...field}
                    id={"address"}
                    fullWidth
                    type="text"
                    label={"Dirección"}
                    rows={1}
                    variant="outlined"
                  />
                  {errors.address && (
                    <FormHelperText error>Campo requerido</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
        )}
      </div>

      <Schedules
        defaultValues={dataSchedules}
        title={t("FormVenueLocation.ScheduleLocation")}
        setSchedules={setSchedules}
        schedules={schedules}
      />

      <div className="d-flex justify-content-end mt-3">
        <ButtonSave
          style={{ width: "200px" }}
          loader={loading}
          text={isEdit ? t("Btn.saveChanges") : t("Btn.save")}
        />
      </div>
    </form>
  );
};

export default FormLocation;
