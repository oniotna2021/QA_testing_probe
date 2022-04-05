import React, { useState, useEffect } from "react";
import slugify from "slugify";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import DatePicker from "components/Shared/DatePicker/DatePicker";

//Services
import {
  postDayFestive,
  putDayFestive,
} from "services/Reservations/dayFestives";
import { getCountries } from "services/utils";

//utils
import { successToast, errorToast, mapErrors, addDays } from "utils/misc";
import { format } from "date-fns";

export const FormFestives = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries()
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          setCountries(data.data);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  const onSubmit = (value) => {
    setLoadingFetch(true);
    const formData = {
      ...value,
      date: format(value.date, "yyyy-MM-dd"),
    };
    const functionCall = type === "Nuevo" ? postDayFestive : putDayFestive;
    functionCall(formData, defaultValue?.uuid)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(!load);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetch(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row align-items-end">
        <div className="col">
          <div className="row">
            <div className="col-4">
              <Controller
                rules={{ required: true }}
                control={control}
                name="name"
                defaultValue={defaultValue?.name}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <TextField
                      {...field}
                      fullWidth
                      id={slugify("name", { lower: true })}
                      type="text"
                      label={t("ListDaysFestives.InputName")}
                      rows={1}
                      variant="outlined"
                    />
                    {errors.name && (
                      <FormHelperText error>
                        {t("Field.required")}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>

            <div className="col-4">
              <Controller
                rules={{ required: true }}
                control={control}
                name="id_country"
                defaultValue={defaultValue?.id_country}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel id="select_modalidad">
                      {t("ListVenues.InputCountry")}
                    </InputLabel>
                    <Select
                      labelId="select_modalidad"
                      label={t("ListVenues.InputCountry")}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      {countries.map((res) => (
                        <MenuItem key={res.name} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.id_country && (
                      <FormHelperText error>
                        {t("Field.required")}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </div>

            <div className="col-4">
              <Controller
                rules={{ required: true }}
                defaultValue={
                  defaultValue?.date ? addDays(defaultValue?.date, 1) : null
                }
                control={control}
                name="date"
                render={({ field }) => (
                  <DatePicker
                    id="date-picker"
                    label={t("ListDaysFestives.InputDate")}
                    {...field}
                  />
                )}
              />
              {errors.date && (
                <FormHelperText error>{t("Field.required")}</FormHelperText>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="d-flex justify-content-end mt-4">
            <ActionWithPermission
              isValid={
                type === "Nuevo"
                  ? permissionsActions.create
                  : permissionsActions.edit
              }
            >
              <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
            </ActionWithPermission>
          </div>
        </div>
      </div>
    </form>
  );
};
