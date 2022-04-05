import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// UI
import FormControl from "@material-ui/core/FormControl";
import { TextField } from "@material-ui/core";

const Age = ({ control, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="row mx-auto">
      <div className="col p-0 pe-1">
        <Controller
          rules={{ required: true }}
          control={control}
          name="from"
          render={({ field }) => (
            <FormControl {...field} variant="outlined">
              <TextField
                type="number"
                variant="outlined"
                error={errors.value}
                label={t("Promotions.AgeFrom")}
              />
            </FormControl>
          )}
        />
      </div>

      <div className="col p-0 ps-1">
        <Controller
          rules={{ required: true }}
          control={control}
          name="to"
          render={({ field }) => (
            <FormControl {...field} variant="outlined">
              <TextField
                type="number"
                variant="outlined"
                error={errors.value_fin}
                label={t("Promotions.Age")}
              />
            </FormControl>
          )}
        />
      </div>
    </div>
  );
};

export default Age;
