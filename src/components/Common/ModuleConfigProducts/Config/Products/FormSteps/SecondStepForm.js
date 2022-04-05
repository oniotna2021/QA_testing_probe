import React from "react";
import { useTranslation } from "react-i18next";

//UI
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import { useTheme } from "@material-ui/core/styles";

// styles
import { useStyles } from "utils/useStyles";

const SecondStepForm = ({
  Controller,
  control,
  defaultValue,
  setAgendaVenue,
  setAgendaPersonalized,
  fromEditProduct,
  errors,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <div className="row">
      <div className="col-sm">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span>{t("FormProduct.Virtual")}</span>
          <div>
            <Controller
              rules={{ required: false }}
              control={control}
              name="is_virtual"
              defaultValue={defaultValue?.is_virtual}
              render={({ field }) => (
                <FormControl>
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                    }}
                    checked={field.value}
                    color="primary"
                  />
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span>{t("FormProduct.UniqueVenue")}</span>
          <div>
            <Controller
              rules={{ required: false }}
              control={control}
              name="unique_venue"
              defaultValue={defaultValue?.unique_venue}
              render={({ field }) => (
                <FormControl>
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                    }}
                    checked={field.value}
                    color="primary"
                  />
                </FormControl>
              )}
            />
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <span>{t("FormProduct.Recurring")}</span>
          <div>
            <Controller
              rules={{ required: false }}
              defaultValue={defaultValue?.is_recurring}
              control={control}
              name="is_recurring"
              render={({ field }) => (
                <FormControl>
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                    }}
                    checked={field.value}
                    color="primary"
                  />
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span>{t("FormProduct.AgendaVenue")}</span>
          <div>
            <Controller
              rules={{ required: false }}
              defaultValue={defaultValue?.agenda_venue}
              control={control}
              name="agenda_venue"
              render={({ field }) => (
                <FormControl>
                  <Checkbox
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.checked);
                    }}
                    checked={field.value}
                    color="primary"
                  />
                </FormControl>
              )}
            />
          </div>
        </div>

      
      </div>

      <div className="col-sm">
        <Controller
          rules={{ required: true }}
          control={control}
          name="private_note"
          error={errors.private_note}
          defaultValue={defaultValue?.product_details[0]?.private_note}
          render={({ field }) => (
            <TextField
              className="mb-3"
              {...field}
              error={errors.private_note}
              multiline
              rows={7}
              variant="outlined"
              label={t("FormProduct.PrivateNote")}
            />
          )}
        />

        <Controller
          rules={{ required: true }}
          control={control}
          defaultValue={defaultValue?.product_details[0]?.public_note}
          name="public_note"
          error={errors.public_note}
          render={({ field }) => (
            <TextField
              className="mb-3"
              {...field}
              multiline
              error={errors.public_note}
              rows={7}
              variant="outlined"
              label={t("FormProduct.PublicNote")}
            />
          )}
        />
      </div>
    </div>
  );
};

export default SecondStepForm;
