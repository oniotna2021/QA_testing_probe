import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFieldArray } from "react-hook-form";
import { useSnackbar } from "notistack";

// utils
import { useStyles } from "utils/useStyles";
import { infoToast } from "utils/misc";

// UI
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Switch from "@material-ui/core/Switch";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import IconButton from "@material-ui/core/IconButton";

// icons
import { IconMas } from "assets/icons/customize/config";
import { IconClose } from "assets/icons/customize/config";

const AddDiscount = ({
  handleSubmit,
  control,
  errors,
  setAddDiscountStep,
  setPromotionDiscount,
  monthDiscount,
  setMonthDiscount,
  defaultValue,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [isAbsoluteValue, setIsAbsoluteValue] = useState(
    defaultValue?.discount_type === "valor" ? true : false
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "discount_per_month",
  });

  const onSubmit = (value) => {
    if (monthDiscount) {
      setPromotionDiscount({
        apply_discount_per_month: false,
        discount_value: value.discount_value,
        discount_type: !isAbsoluteValue ? "porcentaje" : "valor",
      });
      setAddDiscountStep(false);
    } else {
      if (value.discount_per_month?.length > 0) {
        setPromotionDiscount({
          apply_discount_per_month: true,
          discount_per_month: value.discount_per_month,
          discount_type: !isAbsoluteValue ? "porcentaje" : "valor",
        });
        setAddDiscountStep(false);
      } else {
        enqueueSnackbar(t("PromotionRule.AddDiscountMonthAlert"), infoToast);
      }
    }
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="col-12 d-flex">
            <div className="col-6 d-flex align-items-center my-4">
              <Typography variant="p">
                {t("PromotionRule.TypeDiscount")}
              </Typography>
            </div>
            <div className="col-6 d-flex align-items-center justify-content-around">
              <div>{t("PromotionRule.Percentage")}</div>
              <div>
                <Switch
                  checked={isAbsoluteValue}
                  onChange={() => setIsAbsoluteValue(!isAbsoluteValue)}
                ></Switch>
              </div>
              <div>{t("DetailCollaborator.LabelValue")}</div>
            </div>
          </div>

          <div className="col-12 d-flex">
            <div className="col-6 d-flex align-items-center my-4">
              <Typography variant="p">
                {t("PromotionRule.MonthDiscount")}
              </Typography>
            </div>
            <div className="col-6 d-flex align-items-center justify-content-around">
              <div>{t("PromotionRule.Month")}</div>
              <div>
                <Switch
                  checked={monthDiscount}
                  onChange={() => setMonthDiscount(!monthDiscount)}
                ></Switch>
              </div>
              <div>{t("DetailCollaborator.LabelValue")}</div>
            </div>
          </div>

          <div className="col">
            {!monthDiscount ? (
              fields.map((item, index) => (
                <div
                  key={item.id}
                  className="row my-3 d-flex align-items-center"
                >
                  <div className="col">
                    <Typography>Valor mes {index + 1}</Typography>
                  </div>

                  <div className="col d-flex">
                    <Controller
                      name={`discount_per_month.${index}.discount_value`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormControl {...field} variant="outlined">
                          <OutlinedInput
                            defaultValue={
                              defaultValue?.discount_per_month &&
                              defaultValue?.discount_per_month[index]
                                ?.discount_value
                            }
                            type="number"
                            startAdornment={
                              <InputAdornment position="start">
                                {isAbsoluteValue ? "$" : "%"}
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      )}
                    />

                    <div className="d-flex align-items-center ms-3">
                      <IconButton
                        color="inherit"
                        onClick={() => remove(index)}
                        edge="start"
                      >
                        <IconClose color={"gray"} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex align-items-center my-3">
                <Typography className="me-3">Valor</Typography>
                <Controller
                  name={"discount_value"}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl {...field} variant="outlined">
                      <OutlinedInput
                        type="number"
                        defaultValue={defaultValue?.discount_value}
                        error={errors.discount_value}
                        startAdornment={
                          <InputAdornment position="start">
                            {isAbsoluteValue ? "$" : "%"}
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  )}
                />
              </div>
            )}
          </div>

          {!monthDiscount && (
            <div className="col my-4">
              <Button
                onClick={() => append({})}
                fullWidth
                className="d-flex justify-content-between p-3"
                style={{ backgroundColor: "#EBEBEB" }}
              >
                {t("PromotionRule.AddMonth")} <IconMas />
              </Button>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-around my-2">
          <Button
            className={classes.buttonCancel}
            onClick={() => setAddDiscountStep(false)}
          >
            {t("Btn.Cancel")}
          </Button>
          <ButtonSave
            text={t("Btn.save")}
            onClick={handleSubmit(onSubmit, onError)}
          ></ButtonSave>
        </div>
      </div>
    </>
  );
};

export default AddDiscount;
