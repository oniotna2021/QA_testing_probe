import React, { useState } from "react";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
//UI
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

// components
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";

const NewCurrencyForm = ({
  t,
  classes,
  setNewCurrencyForm,
  Controller,
  control,
  companiesOptions,
  taxesOptions,
  loadingFetch,
  userType,
  errors,
}) => {
  const [applyTaxes, setApplyTaxes] = useState(false);

  return (
    <div>
      <div className="row">
        {userType === 1 && (
          <div className="col">
            <Controller
              rules={{ required: true }}
              control={control}
              name="company"
              render={({ field }) => (
                <FormControl variant="outlined">
                  <InputLabel>{t("EditPriceForm.Company")}</InputLabel>
                  <Select
                    {...field}
                    fullWidth
                    className="mb-3"
                    variant="outlined"
                    label={t("EditPriceForm.Company")}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                  >
                    {companiesOptions?.map((item) => (
                      <MenuItem key={`item-${item.id}`} value={item.uuid}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        )}
      </div>

      <div className="row">
        <div className="col">
          <Controller
            rules={{ required: true }}
            control={control}
            name="price"
            error={errors.price}
            render={({ field }) => (
              <TextField
                fullWidth
                error={errors.price}
                className="mb-3"
                {...field}
                type="number"
                label={t("EditPriceForm.BasePrice")}
                variant="outlined"
              />
            )}
          />
        </div>

        <div className="col">
          <Controller
            rules={{ required: true }}
            control={control}
            name="price_min"
            error={errors.price_min}
            render={({ field }) => (
              <TextField
                fullWidth
                error={errors.price_min}
                className="mb-3"
                {...field}
                type="number"
                label={t("EditPriceForm.MinPrice")}
                variant="outlined"
              />
            )}
          />
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-around mb-3">
        <span>{t("EditPriceForm.TaxApply")}</span>
        <div>
          <Controller
            rules={{ required: false }}
            control={control}
            name="tax_apply"
            render={({ field }) => (
              <FormControl>
                <Checkbox
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.checked);
                    setApplyTaxes(e.target.checked);
                  }}
                  checked={field.value}
                  color="primary"
                />
              </FormControl>
            )}
          />
        </div>
      </div>
      {applyTaxes && (
        <div className="row">
          <div className="col">
            <ControlledAutocomplete
              required={true}
              control={control}
              name="taxes"
              error={errors.taxes}
              options={taxesOptions || []}
              getOptionLabel={(option) => `${option.name}`}
              renderInput={(params) => (
                <TextField
                  error={errors.taxes}
                  {...params}
                  label={t("EditPriceForm.Taxes")}
                  variant="outlined"
                />
              )}
            />
          </div>

          <div className="col">
            <Controller
              rules={{ required: true }}
              control={control}
              name="total_value"
              error={errors.total_value}
              render={({ field }) => (
                <TextField
                  error={errors.total_value}
                  fullWidth
                  className="mb-3"
                  {...field}
                  type="number"
                  label={t("EditPriceForm.TotalValue")}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
      )}

      <div className="col-12 d-flex justify-content-around mt-5">
        <Button
          className={classes.buttonCancel}
          onClick={() => setNewCurrencyForm(false)}
        >
          {t("Btn.Cancel")}
        </Button>
        <ButtonSave loader={loadingFetch} text={t("FormExercises.Create")} />
      </div>
    </div>
  );
};

export default NewCurrencyForm;
