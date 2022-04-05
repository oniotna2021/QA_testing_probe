import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
// UI
import Checkbox from "@material-ui/core/Checkbox";
import { Typography } from "@material-ui/core";

const TimeSlot = ({ control, errors }) => {
  const { t } = useTranslation();

  const [applyAllDays, setApplyAllDays] = useState(false);

  return (
    <div className="col">
      <div className="d-flex justify-content-between align-items-center">
        <Typography>{t("PromotionRule.ApplyAllDays")}</Typography>
        <Controller
          control={control}
          name="apply_all_days"
          render={({ field: { onChange } }) => (
            <Checkbox
              color="primary"
              size="medium"
              checked={applyAllDays}
              onChange={(data) => {
                onChange(data);
                setApplyAllDays(!applyAllDays);
              }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default TimeSlot;
