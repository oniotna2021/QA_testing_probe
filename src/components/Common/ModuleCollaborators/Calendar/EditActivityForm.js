import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { addMinutes } from "date-fns";

import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// COMPONENTS
import TimePicker from "components/Shared/TimePicker/TimePicker";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ControlledAutocomplete from "components/Shared/AutocompleteSelect/AutocompleteSelect";

// Services
import { putActivityReservation } from "services/Reservations/activitiesUser";
import { getEmployeesByVenue } from "services/Reservations/employess";

// Utils
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  formatDateToHHMMSS,
  mapErrors,
  successToast,
  convertH2M,
} from "utils/misc";

const propsTimePicker = {
  ampm: true,
  inputVariant: "outlined",
  margin: "normal",
  minutesStep: 5,
  mask: "__:__ _M",
  KeyboardButtonProps: { "aria-label": "change time" },
  emptyLabel: null,
  showTodayButton: true,
  todayLabel: "Hora actual",
  invalidLabel: "Hora inválida",
  InputAdornmentProps: { position: "start" },
};

const EditActivityForm = ({
  setFetchReload,
  setIsOpen,
  dataDetailActivity,
  idVenue,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [isFetching, setIsFetching] = useState(false);
  const [timeObj, setTimeObj] = useState({
    start_time: new Date(`2021-08-18T${dataDetailActivity?.start_time}`),
    end_time: new Date(`2021-08-18T${dataDetailActivity?.end_time}`),
  });
  const [listManagers, setListManagers] = useState([]);
  const [selectManagers, setSelectManagers] = useState([]);

  useEffect(() => {
    if (idVenue !== undefined) {
      getEmployeesByVenue(idVenue)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data?.data?.users?.length > 0
          ) {
            const filterManagers = data?.data?.users;
            setListManagers(filterManagers);
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

  const handleChangeTime = (value, name) => {
    setTimeObj((timeObj) => ({
      ...timeObj,
      [name]: value,
      end_time: addMinutes(
        value,
        dataDetailActivity?.length_minutes
          ? dataDetailActivity?.length_minutes
          : convertH2M(dataDetailActivity?.end_time) -
              convertH2M(formatDateToHHMMSS(dataDetailActivity?.start_time)) ||
              0
      ),
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();
    // console.log(dataDetailActivity);
    // return;
    const dataForm = {
      schedule_activity_id:
        dataDetailActivity.schedule_activity_has_location_id ||
        dataDetailActivity.activity_id ||
        dataDetailActivity.id,
      date: dataDetailActivity.date,
      start_time: formatDateToHHMMSS(timeObj.start_time),
      end_time: formatDateToHHMMSS(timeObj.end_time),
      managers:
        selectManagers.length > 0
          ? selectManagers.map((manager) => manager.id)
          : [],
    };

    setIsFetching(true);
    putActivityReservation(dataForm)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setIsFetching(false);
          setFetchReload(true);
          setIsOpen(false);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <div className="col-12 d-flex justify-content-between mt-4">
          <div>
            <FormControl variant="outlined">
              <TimePicker
                style={{ width: 180 }}
                id="time-picker-2"
                label={t("label.InitialOur")}
                name="start_time"
                value={timeObj.start_time}
                onChange={(date) => {
                  handleChangeTime(date, "start_time");
                }}
                {...propsTimePicker}
              />
            </FormControl>
          </div>
          <div>
            <FormControl variant="outlined">
              <TimePicker
                style={{ width: 180 }}
                id="time-picker-2"
                label={t("label.FinalOur")}
                name="end_time"
                value={timeObj.end_time}
                onChange={(date) => {
                  handleChangeTime(date, "end_time");
                }}
                disabled={true}
                {...propsTimePicker}
              />
            </FormControl>
          </div>
        </div>

        <div className="mt-2">
          <ControlledAutocomplete
            multiple={true}
            name="managers"
            value={selectManagers}
            getOptionSelected={(option, value) => value.id === option.id}
            handleChange={(data) => setSelectManagers(data)}
            options={listManagers || []}
            getOptionLabel={(option) =>
              `${option.first_name} ${option.last_name}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("FormsVenueActivities.SelectResponsable")}
                variant="outlined"
                margin="normal"
              />
            )}
          />
        </div>

        <div className="d-flex justify-content-between my-3">
          <Button
            onClick={() => setIsOpen(false)}
            fullWidth
            className={classes.buttonBlock}
          >
            {t("Btn.Cancel")}
          </Button>
          <ButtonSave
            style={{ marginBottom: 0 }}
            loader={isFetching}
            fullWidth={true}
            text={t("Btn.saveChanges")}
          />
        </div>
      </div>
    </form>
  );
};

const mapStateToProps = ({ auth }) => ({
  idVenue: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(EditActivityForm);
