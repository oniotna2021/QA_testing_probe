import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// UI
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

// utils
import {
  errorToast,
  infoToast,
  mapErrors,
  successToast,
  regexNumbersPositive,
} from "utils/misc";

// components
import Loading from "components/Shared/Loading/Loading";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import DatePicker from "components/Shared/DatePicker/DatePicker";

// hooks
import { useGetAllCities } from "hooks/CachedServices/cities";

// services
import {
  getUSDownload,
  getAFDownload,
  getACDownload,
} from "services/MedicalSoftware/Reports";

const reportTypes = [
  { name: "US", id: 0 },
  { name: "AF", id: 1 },
  { name: "AC", id: 2 },
];

const Reports = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { swrData, isLoading } = useGetAllCities();

  const [isDownloading, setIsDownloading] = useState(false);
  const [date, changeDate] = useState(null);
  const [reportType, setReportType] = useState(0);

  const onSubmit = (values) => {
    const date = new Date(values.report_date);
    values.year = date.getFullYear();
    values.month = date.getMonth() + 1;

    if (values.venue.id) {
      setIsDownloading(true);
      const methodToFetch =
        values.report_type === 0
          ? getUSDownload
          : values.report_type === 1
          ? getAFDownload
          : getACDownload;

      methodToFetch(values)
        .then(({ data }) => {
          if (data.status === "success") {
            enqueueSnackbar(data.message, successToast);
          } else {
            enqueueSnackbar(mapErrors(data), infoToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => setIsDownloading(false));
    } else {
      enqueueSnackbar("Por favor selecciona una ciudad", infoToast);
    }
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <div>
      <Typography variant={"h4"} className="mb-2">
        {t("Menu.Title.Reports")}
      </Typography>
      <Typography variant={"body1"}>{t("Reports.CompleteFields")}</Typography>

      <form
        className="row mt-5 d-flex"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <div className="row">
            <div className="col-3">
              <ControlledAutocomplete
                rules={{ required: true }}
                control={control}
                name="venue"
                multiple={false}
                defaultValue={{
                  name: "Seleccione una ciudad",
                }}
                options={swrData || []}
                getOptionLabel={(option) => `${option.name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={errors.venue}
                    label={"Ciudad"}
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </div>

            <div className="col-3 p-2">
              <Controller
                rules={{ required: true }}
                control={control}
                name="report_type"
                defaultValue={null}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel id="select_report_type">
                      {t("Reports.ReportType")}
                    </InputLabel>
                    <Select
                      error={errors.report_type}
                      labelId="select_report_type"
                      label={t("Reports.ReportType")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setReportType(e.target.value);
                      }}
                    >
                      {reportTypes.map((res) => (
                        <MenuItem key={res.id} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            <div className="row">
              <div className="col-3 mt-3">
                <Typography variant="body2" className="mb-2">
                  {t("Reports.Time")}
                </Typography>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="report_date"
                  render={({ field }) => (
                    <FormControl>
                      <DatePicker
                        {...field}
                        error={errors.report_date}
                        views={["year", "month"]}
                        value={date}
                        format="yyy-MM"
                        onChange={(e) => {
                          field.onChange(e);
                          changeDate(e);
                        }}
                        animateYearScrolling
                      />
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className="mt-5">
              <ButtonSave loader={isDownloading} text={"Enviar"} />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Reports;
