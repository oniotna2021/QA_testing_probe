import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// UI
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

// components
import Loading from "components/Shared/Loading/Loading";

// services
import { getAllGenres } from "services/GeneralConfig/Genres";

// utils
import { mapErrors, errorToast } from "utils/misc";

const Gender = ({ control, errors }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [genderOptions, setGenderOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAllGenres()
      .then(({ data }) => setGenderOptions(data.data))
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setIsLoading(false));
  }, [enqueueSnackbar]);

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <Controller
          rules={{ required: true }}
          control={control}
          name="gender_id"
          render={({ field }) => (
            <div className="col mb-3">
              <FormControl {...field} variant="outlined">
                <InputLabel>{t("Promotions.Genre")}</InputLabel>
                <Select
                  label={t("Promotions.Genre")}
                  variant="outlined"
                  error={errors.gender}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {genderOptions?.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default Gender;
