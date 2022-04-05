import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { format, isDate } from "date-fns/esm";

// UI
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

// COMPONENTS
import DatePicker from "components/Shared/DatePicker/DatePicker";
import Loading from "components/Shared/Loading/Loading";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ItemResultsSearch from "./ItemsResultSearch";
import TimePicker from "components/Shared/TimePicker/TimePicker";

// Hooks
import useTimeValuePicker from "hooks/useTimeValuePicker";

// Services
import {
  getActivityScheduleByDate,
  postInactivateActivity,
} from "services/Reservations/activitiesCalendar";
import { getAllActivitiesReasons } from "services/Reservations/activitiesCancelationReason";

// Utils
import {
  errorToast,
  formatDateToHHMMSS,
  infoToast,
  mapErrors,
  successToast,
} from "utils/misc";

const options = [
  { id: "temp", name: "Temporal" },
  { id: "definitive", name: "Definitivo" },
];

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

const FormRemoveActivity = ({
  setIsOpen,
  dataDetailActivity,
  setFetchReload,
  setValueTab,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeInactivate, setTypeInactivate] = useState("");
  const [reasonInactivate, setReasonInactivate] = useState("");
  const [listReasonInactivate, setListReasonInactivate] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [valueTime, handleChangeDate] = useTimeValuePicker();

  useEffect(() => {
    if (
      typeInactivate === "temp" &&
      valueTime.start_date &&
      valueTime.end_date &&
      valueTime.start_time &&
      valueTime.end_time &&
      (dataDetailActivity.location_activity
        ? dataDetailActivity.location_activity
        : dataDetailActivity.id)
    ) {
      const formatDateStart = format(valueTime.start_date, "yyyy-MM-dd");
      const formatDateEnd = format(valueTime.end_date, "yyyy-MM-dd");
      const formatTimeStart = formatDateToHHMMSS(valueTime.start_time);
      const formatTimeEnd = formatDateToHHMMSS(valueTime.end_time);
      setLoadingSchedules(true);
      getActivityScheduleByDate(
        dataDetailActivity.location_activity
          ? dataDetailActivity.location_activity
          : dataDetailActivity.id,
        formatDateStart,
        formatDateEnd,
        formatTimeStart,
        formatTimeEnd,
        typeInactivate
      )
        .then(({ data }) => {
          if (data.status === "success" && data.data && data.data.dates) {
            setSchedules(data.data.dates);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoadingSchedules(false);
        });
    }
  }, [typeInactivate, valueTime, enqueueSnackbar, dataDetailActivity]);

  useEffect(() => {
    getAllActivitiesReasons()
      .then(({ data }) => {
        if (data && data.status === "success") {
          setListReasonInactivate(data.data);
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

  const onSubmitInactivate = () => {
    if (
      typeInactivate === "temp" &&
      (!isDate(valueTime.start_date) ||
        !isDate(valueTime.end_date) ||
        !isDate(valueTime.start_time) ||
        !isDate(valueTime.end_time))
    ) {
      enqueueSnackbar(t("FormRemoveActivity.WarningEmptyDates"), infoToast);
      return;
    } else if (
      typeInactivate === "definitive" &&
      !isDate(valueTime.start_date)
    ) {
      return;
    }

    if (!reasonInactivate) {
      enqueueSnackbar(t("FormRemoveActivity.WarningEmptyReason"), infoToast);
      return;
    }

    const formatDateStart = valueTime.start_date
      ? format(valueTime.start_date, "yyyy-MM-dd")
      : null;
    const formatDateEnd = valueTime.end_date
      ? format(valueTime.end_date, "yyyy-MM-dd")
      : null;
    const formatTimeStart = valueTime.start_time
      ? formatDateToHHMMSS(valueTime.start_time)
      : null;
    const formatTimeEnd = valueTime.end_time
      ? formatDateToHHMMSS(valueTime.end_time)
      : null;

    const dataSubmit = {
      location_activity_id: dataDetailActivity.location_activity
        ? dataDetailActivity.location_activity
        : dataDetailActivity.id,
      news_type: typeInactivate,
      start_date:
        typeInactivate === "temp"
          ? `${formatDateStart} ${formatTimeStart}`
          : `${formatDateStart}`,
      end_date: `${formatDateEnd} ${formatTimeEnd}`,
      news_reason_id: reasonInactivate,
    };
    setLoading(true);
    postInactivateActivity(dataSubmit)
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          enqueueSnackbar(
            "Actividades deshabilitadas exitosamente",
            successToast
          );
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
        setLoading(false);
      });
  };

  return (
    <Card>
      <div className="mb-4">
        {Object.keys(dataDetailActivity).length === 0 ? (
          <Loading />
        ) : (
          <>
            <div className="my-2">
              <Typography variant="body1">
                {t("FormRemoveActivity.Description")}
              </Typography>
            </div>

            <div className="my-4">
              <FormControl variant="outlined">
                <InputLabel id="document_type_id">
                  {t("FormRemoveActivity.Inactivate")}
                </InputLabel>
                <Select
                  disabled={false}
                  labelId="document_type_id"
                  label={t("FormRemoveActivity.Inactivate")}
                  onChange={(e) => setTypeInactivate(e.target.value)}
                  value={typeInactivate}
                >
                  {options.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <ItemResultsSearch
              loading={loadingSchedules}
              schedules={schedules}
              typeInactivate={typeInactivate}
            />

            {typeInactivate && (
              <>
                <div className="my-4">
                  <Typography style={{ opacity: "60%" }}>
                    {typeInactivate === "temp"
                      ? t("FormRemoveActivity.DescriptionInputDates")
                      : t("FormRemoveActivity.DescriptionInputDateDefinitive")}
                  </Typography>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <FormControl variant="outlined" className="me-2">
                    <DatePicker
                      id="date-picker-start_date"
                      label="Fecha inicial"
                      value={valueTime.start_date}
                      onChange={(date) => handleChangeDate(date, "start_date")}
                      placeholder="AAAA/MM/DD"
                    />
                  </FormControl>

                  {typeInactivate !== "definitive" && (
                    <FormControl>
                      <TimePicker
                        id="date-picker-start_time"
                        label={t("label.InitialOur")}
                        name="start_time"
                        value={valueTime.start_time}
                        onChange={(date) =>
                          handleChangeDate(date, "start_time")
                        }
                        {...propsTimePicker}
                      />
                    </FormControl>
                  )}
                </div>

                {typeInactivate !== "definitive" && (
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <FormControl variant="outlined" className="me-2">
                      <DatePicker
                        id="date-picker-end_date"
                        label="Fecha final"
                        value={valueTime.end_date}
                        onChange={(date) => handleChangeDate(date, "end_date")}
                        placeholder="AAAA/MM/DD"
                      />
                    </FormControl>

                    <FormControl>
                      <TimePicker
                        id="date-picker-start_time"
                        label={t("label.FinalOur")}
                        name="end_time"
                        value={valueTime.end_time}
                        onChange={(date) => handleChangeDate(date, "end_time")}
                        {...propsTimePicker}
                      />
                    </FormControl>
                  </div>
                )}
              </>
            )}

            {typeInactivate && (
              <div className="my-4">
                <FormControl variant="outlined">
                  <InputLabel id="document_type_id">
                    {t("FormRemoveActivity.ReasonToDesactivate")}
                  </InputLabel>
                  <Select
                    disabled={false}
                    labelId="document_type_id"
                    label={t("FormRemoveActivity.ReasonToDesactivate")}
                    onChange={(e) => setReasonInactivate(e.target.value)}
                    value={reasonInactivate}
                  >
                    {listReasonInactivate &&
                      listReasonInactivate.map((res) => (
                        <MenuItem key={res.description} value={res.id}>
                          {res.description}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div className="d-flex justify-content-between mt-3">
              <Button
                onClick={() => setValueTab(0)}
                fullWidth
                variant="contained"
                className="me-2"
              >
                {t("Btn.Cancel")}
              </Button>
              <ButtonSave
                color="primary"
                style={{ marginBottom: 0 }}
                fullWidth={true}
                loader={loading}
                onClick={onSubmitInactivate}
                text={t("Btn.Inactivate")}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default FormRemoveActivity;
