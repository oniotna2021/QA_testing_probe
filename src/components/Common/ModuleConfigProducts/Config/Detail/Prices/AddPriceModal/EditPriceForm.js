import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";

//utils
import { successToast, errorToast, mapErrors } from "utils/misc";

// services
import { putPrice } from "services/Comercial/Price";

const EditPriceForm = ({
  categoriesOptions,
  defaultValue,
  companiesOptions,
  taxesOptions,
  setHandleEditModal,
  userType,
  fetchPrices,
}) => {
  const [applyTaxes, setApplyTaxes] = useState(
    defaultValue.tax_apply === 1 ? true : false
  );
  const [loadingFetch, setLoadingFetch] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { control, handleSubmit } = useForm();
  const { t } = useTranslation();

  const onSubmit = async (values) => {
    if (values.taxes) {
      values.taxes = values.taxes.map((tax) => {
        return { id: tax.id };
      });
    }
    try {
      setLoadingFetch(true);
      const { data } = await putPrice(values, defaultValue.uuid);
      if (data && data.message && data.status === "success") {
        fetchPrices();
        enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
        setHandleEditModal(false);
      } else {
        enqueueSnackbar(mapErrors(data), errorToast);
      }
      setLoadingFetch(false);
    } catch (err) {
      enqueueSnackbar(mapErrors(err), errorToast);
      setLoadingFetch(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        rules={{ required: true }}
        control={control}
        name="category_id"
        defaultValue={defaultValue.category_id}
        render={({ field }) => (
          <FormControl variant="outlined">
            <InputLabel>{t("EditPriceForm.Category")}</InputLabel>
            <Select
              {...field}
              fullWidth
              className="mb-3"
              variant="outlined"
              label={t("EditPriceForm.Category")}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            >
              {categoriesOptions.map((item) => (
                <MenuItem key={`item-${item.id}`} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <div className="row">
        {userType === 1 && (
          <div className="col">
            <Controller
              rules={{ required: true }}
              control={control}
              defaultValue={defaultValue.company}
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
            defaultValue={defaultValue.price}
            render={({ field }) => (
              <TextField
                fullWidth
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
            defaultValue={defaultValue.price_min}
            render={({ field }) => (
              <TextField
                fullWidth
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
            defaultValue={defaultValue.tax_apply}
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
              rules={{ required: false }}
              control={control}
              defaultValue={defaultValue.product_price_tax}
              name="taxes"
              options={taxesOptions || []}
              getOptionLabel={(option) => `${option.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("EditPriceForm.Taxes")}
                  variant="outlined"
                />
              )}
            />
          </div>

          <div className="col">
            <Controller
              rules={{ required: false }}
              control={control}
              name="total_value"
              render={({ field }) => (
                <TextField
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
        <ButtonSave
          loader={loadingFetch}
          text={t("Btn.Edit")}
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </form>
  );
};

export default EditPriceForm;
