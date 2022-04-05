import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format, isBefore } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

// UI
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";

// Components
import TimePicker from "components/Shared/TimePicker/TimePicker";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import DatePicker from "components/Shared/DatePicker/DatePicker";

// Service
import { postNewsEmployee } from "services/Reservations/activitiesUser";
import { getAllReasonsByType } from "services/Reservations/reasonBlock";

// Utils
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  formatDateToHHMMSS,
  infoToast,
  mapErrors,
  successToast,
} from "utils/misc";
import Loading from "components/Shared/Loading/Loading";

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

const FormBlockUser = ({
  setNewsReasoniD,
  newsReasonId,
  handleClose,
  typeUnlock,
  setTypeUnlock,
  title,
  userId,
  setValueTab,
  setIsOpen,
  selectDate,
  handleChangeDate,
  venueId,
  setIsRangeHours,
  isRangeHours,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const [dataReasonsBlock, setDataReasonsBlock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingReasons, setFetchingReasons] = useState(false);

  const onSubmit = () => {
    if (typeUnlock === "definitive") {
      if (selectDate.start_date === null) {
        enqueueSnackbar(t("FormNovelty.WarningDesactivateDate"), infoToast);
        return;
      }

      if (isBefore(selectDate.end_date, selectDate.start_date)) {
        enqueueSnackbar(t("FormNovelty.WarningInvalidInterval"), infoToast);
        return;
      }

      const dataForm = {
        user_internal_id: Number(userId),
        range_hours: isRangeHours,
        news_type: typeUnlock,
        news_reason_id: newsReasonId,
        start_date: `${format(selectDate.start_date, "yyyy-MM-dd")} 00:00:00`,
        venue_id: venueId,
      };
      setLoading(true);
      postNewsEmployee(dataForm)
        .then(({ data }) => {
          if (data && data.status === "success") {
            enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
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
    } else {
      if (
        (selectDate.start_date &&
          selectDate.end_date &&
          selectDate.start_time &&
          selectDate.end_time) === null
      ) {
        enqueueSnackbar(t("FormNovelty.WarningDesactivateDate"), infoToast);
        return;
      }

      if (isBefore(selectDate.end_date, selectDate.start_date)) {
        enqueueSnackbar(t("FormNovelty.WarningInvalidInterval"), infoToast);
        return;
      }

      const dataForm = {
        user_internal_id: Number(userId),
        news_type: "temp",
        range_hours: isRangeHours,
        news_reason_id: newsReasonId,
        start_date: `${format(
          selectDate.start_date,
          "yyyy-MM-dd"
        )} ${formatDateToHHMMSS(selectDate.start_time)}`,
        end_date: `${format(
          selectDate.end_date,
          "yyyy-MM-dd"
        )} ${formatDateToHHMMSS(selectDate.end_time)}`,
        venue_id: venueId,
      };
      setLoading(true);
      postNewsEmployee(dataForm)
        .then(({ data }) => {
          if (data && data.status === "success") {
            enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
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
    }
  };

  const handleClickReasing = () => {
    if (
      (selectDate.start_date &&
        selectDate.end_date &&
        selectDate.start_time &&
        selectDate.end_time) === null
    ) {
      enqueueSnackbar(t("FormNovelty.WarningSaveDate"), infoToast);
      return;
    }

    if (isBefore(selectDate.end_date, selectDate.start_date)) {
      enqueueSnackbar(t("FormNovelty.WarningInvalidInterval"), infoToast);
      return;
    }

    setValueTab(1);
  };

  const handleChangeTypeUnlock = (e, handleChange) => {
    const value = e.target.value;
    setIsRangeHours(value === "range_hours" ? 1 : 0);
    setTypeUnlock(value);
    handleChange(value);
  };

  useEffect(() => {
    setFetchingReasons(true);
    getAllReasonsByType(typeUnlock === "range_hours" ? "recurrent" : typeUnlock)
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setDataReasonsBlock(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => setFetchingReasons(false));
  }, [typeUnlock, enqueueSnackbar]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {title && <Typography variant="h6">{title}</Typography>}
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Typography variant="body1">
            {t("FormNovelty.labelNovelty")}
          </Typography>
          <Controller
            rules={{ required: true }}
            control={control}
            defaultValue={typeUnlock}
            name="type_unlock"
            render={({ field }) => (
              <FormControl className="mt-3" variant="outlined">
                <Select
                  {...field}
                  onChange={(e) => handleChangeTypeUnlock(e, field.onChange)}
                >
                  <MenuItem value="definitive">
                    {t("FormNovelty.SelectBlock")}
                  </MenuItem>
                  <MenuItem value="temp">
                    {t("FormNovelty.SelectBlockTem")}
                  </MenuItem>
                  <MenuItem value="range_hours">
                    {t("FormNovelty.SelectBlockRecurrent")}
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {typeUnlock === "definitive" ? (
            <>
              <div className="col-12 d-flex justify-content-between align-items-center mt-4">
                <Typography className="" variant="body1">
                  {t("FormNovelty.labelDateBlock")}
                </Typography>

                <DatePicker
                  id="date-picker"
                  value={selectDate.start_date}
                  onChange={(date) => handleChangeDate(date, "start_date")}
                  style={{ width: 220 }}
                  placeholder="AAAA/MM/DD"
                />
              </div>
            </>
          ) : (
            <>
              <Typography className="mb-2 mt-4" variant="body1">
                {isRangeHours
                  ? t("FormNovelty.labelBlockRecurrentStart")
                  : t("FormNovelty.labelBlockTemp")}
              </Typography>
              <div className="col-12 mt-4 d-flex align-items-center justify-content-between">
                <DatePicker
                  id="date-picker"
                  value={selectDate.start_date}
                  onChange={(date) => handleChangeDate(date, "start_date")}
                  placeholder="AAAA/MM/DD"
                />

                <FormControl variant="outlined">
                  <TimePicker
                    style={{ width: 200, marginLeft: 45 }}
                    id="time-picker-2"
                    label={t("label.InitialOur")}
                    name="start_time"
                    value={selectDate.start_time}
                    onChange={(value) =>
                      handleChangeDate(value, "start_time", "time")
                    }
                    {...propsTimePicker}
                  />
                </FormControl>
              </div>

              <Typography className="my-3" variant="body1">
                {isRangeHours
                  ? t("FormNovelty.labelBlockRecurrentEnd")
                  : t("FormNovelty.labelBlockTempEnd")}
              </Typography>
              <div className="col-12 d-flex justify-content-between align-items-center">
                <DatePicker
                  id="date-picker"
                  value={selectDate.end_date}
                  onChange={(date) => handleChangeDate(date, "end_date")}
                  name="date_picker"
                  placeholder="AAAA/MM/DD"
                />

                <FormControl variant="outlined">
                  <TimePicker
                    style={{ width: 200, marginLeft: 45 }}
                    id="time-picker-2"
                    label={t("FormVenueTurnsWorking.HourFinal")}
                    name="end_time"
                    value={selectDate.end_time}
                    onChange={(value) =>
                      handleChangeDate(value, "end_time", "time")
                    }
                    {...propsTimePicker}
                  />
                </FormControl>
              </div>
            </>
          )}

          <div className="mt-3">
            {fetchingReasons ? (
              <Loading />
            ) : (
              <FormControl className="mt-3" variant="outlined">
                <InputLabel>
                  {t("FormAssingActivity.SelectReasonBlock")}
                </InputLabel>
                <Select
                  label={t("FormAssingActivity.SelectReasonBlock")}
                  value={newsReasonId}
                  onChange={(e) => setNewsReasoniD(e.target.value)}
                  defaultValue={newsReasonId}
                >
                  {dataReasonsBlock &&
                    dataReasonsBlock.map((reason, index) => (
                      <MenuItem key={index} value={reason.id_Reason}>
                        {reason.description}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </div>

          <div className="d-flex justify-content-between mt-5">
            {typeUnlock === "definitive" ? (
              <>
                <Button
                  onClick={() => setIsOpen(false)}
                  fullWidth
                  className={classes.buttonBlock}
                >
                  {t("Btn.Cancel")}
                </Button>
                <ButtonSave
                  loader={loading}
                  fullWidth={true}
                  text={t("Btn.Block")}
                />
              </>
            ) : (
              <>
                <Button
                  onClick={handleClickReasing}
                  fullWidth
                  className={classes.buttonReasing}
                >
                  {t("Btn.ReSchedule")}
                </Button>
                <ButtonSave
                  loader={loading}
                  fullWidth={true}
                  text={t("Btn.save")}
                />
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(FormBlockUser);
