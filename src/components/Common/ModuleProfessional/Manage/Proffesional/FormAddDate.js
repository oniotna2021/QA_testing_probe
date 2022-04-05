import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";

// ui
import TextField from "@material-ui/core/TextField";

// components
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

// translate
import { useTranslation } from "react-i18next";

// misc
import {
  regexOnlyPositiveNumbers,
  daysFormAddDate,
} from "../../../../../utils/misc";

const FormAddDate = ({
  isEdit,
  control,
  defaultValue,
  setIsOpenAddDate,
  setSelectDaysWeek,
  selectDaysWeek,
}) => {
  const { t } = useTranslation();
  const [loadData, setLoadData] = useState(false);

  useEffect(() => {
    setLoadData(true);
    setTimeout(() => {
      if (defaultValue) {
        try {
          setSelectDaysWeek(JSON.parse(defaultValue.days_available));
        } catch (err) {
          console.log(err);
        }
      }
      setLoadData(false);
    }, 1000);
  }, [defaultValue, setSelectDaysWeek]);

  const handleSelectDays = (data) => {
    setSelectDaysWeek(data);
  };

  return (
    <div>
      {loadData ? (
        <Loading />
      ) : (
        <div className="row">
          <div className="d-flex col-12 mb-2 justify-content-between">
            <Controller
              rules={{ required: false }}
              control={control}
              name="total_hours_per_day"
              defaultValue={
                defaultValue && defaultValue?.total_hours_per_day
                  ? defaultValue?.total_hours_per_day
                  : ""
              }
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  variant="outlined"
                  label={t("FormAddDate.TotalHours")}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
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

          <div className="col-12 my-2">
            <ControlledAutocomplete
              control={control}
              required={false}
              handleChange={handleSelectDays}
              defaultValue={
                selectDaysWeek && selectDaysWeek.length > 0
                  ? selectDaysWeek
                  : []
              }
              name="days_available"
              options={daysFormAddDate || []}
              getOptionLabel={(option) => `${option.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("FormAddDate.DaysofWeek")}
                  variant="outlined"
                />
              )}
            />
          </div>

          <div className="d-flex col-12 my-2 justify-content-between">
            <Controller
              rules={{ required: false }}
              control={control}
              name="hourly_value_day_week"
              defaultValue={
                defaultValue && defaultValue?.hourly_value_day_week
                  ? defaultValue?.hourly_value_day_week
                  : ""
              }
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  variant="outlined"
                  label={t("FormAddDate.ValueHourWeek")}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
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

          <div className="d-flex col-12 my-2 justify-content-between">
            <Controller
              rules={{ required: false }}
              control={control}
              name="hourly_value_weekend_day"
              defaultValue={
                defaultValue && defaultValue?.hourly_value_weekend_day
                  ? Number(defaultValue?.hourly_value_weekend_day)
                  : ""
              }
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  variant="outlined"
                  label={t("FormAddDate.ValueHourWeekend")}
                  onKeyUp={(e) => {
                    if (regexOnlyPositiveNumbers.test(e.target.value)) {
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

          <div className="d-flex col-12 my-1 justify-content-end">
            <ButtonSave
              text={t("Btn.save")}
              onClick={() => setIsOpenAddDate(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAddDate;
