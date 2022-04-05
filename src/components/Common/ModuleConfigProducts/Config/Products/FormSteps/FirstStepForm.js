// utils
import { frecuencyType, productType } from "utils/misc";

import { Autocomplete } from "@material-ui/lab";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import React from "react";
import Select from "@material-ui/core/Select";
//UI
import TextField from "@material-ui/core/TextField";
import { useTranslation } from "react-i18next";

const FirstStepForm = ({
  Controller,
  control,
  defaultValue,
  userType,
  errors,
  getValues,
  channels,
  organizations,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="row">
        <div className="col-6">
          <div className="col-12">
            <Controller
              rules={{ required: true }}
              defaultValue={defaultValue?.name}
              control={control}
              name="name"
              error={errors.name}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  error={errors.name}
                  label={t("FormProduct.ProductName")}
                  variant="outlined"
                />
              )}
            />
          </div>

          <div className="col-12">
            <Controller
              rules={{ required: true }}
              control={control}
              error={errors.external_reference}
              name="external_reference"
              defaultValue={
                defaultValue?.product_details[0]?.external_reference
              }
              render={({ field }) => (
                <TextField
                  className="mt-3"
                  error={errors.external_reference}
                  {...field}
                  type="text"
                  label={t("FormProduct.ExternalReference")}
                  variant="outlined"
                />
              )}
            />
          </div>

          {/* Organization only can be set on super_admin role */}
          {userType === 1 && (
            <div className="col-12 mt-3">
              <Controller
                rules={{ required: true }}
                control={control}
                name="organization"
                error={errors.organization}
                defaultValue={defaultValue?.organization}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <InputLabel>{t("FormProduct.Organization")}</InputLabel>
                    <Select
                      {...field}
                      fullWidth
                      error={errors.organization}
                      variant="outlined"
                      label={t("FormProduct.Organization")}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      {organizations.map((item) => (
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

          <div className="col-12">
            <div className="row m-0 mt-3">
              <div className="col-6 p-0 pe-1">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  error={errors.frecuency_type}
                  name="frecuency_type"
                  defaultValue={defaultValue?.frecuency_type}
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <InputLabel>{t("FormProduct.Frecuency")}</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        error={errors.frecuency_type}
                        variant="outlined"
                        label={t("FormProduct.Frecuency")}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {frecuencyType.map((item) => (
                          <MenuItem key={`item-${item.id}`} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div>

              <div className="col-6 p-0 ps-1">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="frecuency_quantity"
                  error={errors.frecuency_quantity}
                  defaultValue={defaultValue?.frecuency_quantity}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      {...field}
                      type="number"
                      error={errors.frecuency_quantity}
                      label={t("FormProduct.FrecuencyQuantity")}
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <Controller
            rules={{ required: true }}
            control={control}
            name="short_description"
            error={errors.short_description}
            defaultValue={defaultValue?.product_details[0]?.short_description}
            render={({ field }) => (
              <TextField
                className="mt-3"
                {...field}
                error={errors.short_description}
                multiline
                rows={userType === 1 ? 6 : 10}
                variant="outlined"
                label={t("DetailDescription.DescriptionShort")}
              />
            )}
          />
        </div>

        <div className="col-sm">
          <Controller
            rules={{ required: true }}
            control={control}
            name="type"
            error={errors.type}
            defaultValue={defaultValue?.type}
            render={({ field }) => (
              <FormControl variant="outlined">
                <InputLabel>{t("FormProduct.ProductType")}</InputLabel>
                <Select
                  {...field}
                  fullWidth
                  variant="outlined"
                  error={errors.type}
                  label={t("FormProduct.ProductType")}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {productType.map((item) => (
                    <MenuItem key={`item-${item.id}`} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            control={control}
            rules={{ required: true }}
            name="channels"
            defaultValue={
              defaultValue?.product_channels || getValues("channels")
            }
            error={errors.channels}
            render={({ field: { onChange } }) => (
              <Autocomplete
                className="mt-2"
                multiple={true}
                defaultValue={defaultValue?.channels || getValues("channels")}
                options={channels || []}
                getOptionLabel={(option) => `${option.name}`}
                onChange={(_, data) => onChange(data)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={errors.channels}
                    label={t("FormProduct.Channels")}
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            )}
          />

          <Controller
            rules={{ required: true }}
            control={control}
            name="barcode"
            error={errors.barcode}
            defaultValue={defaultValue?.barcode}
            render={({ field }) => (
              <TextField
                className="mt-3"
                {...field}
                type="text"
                error={errors.barcode}
                label={t("FormProduct.Barcode")}
                variant="outlined"
              />
            )}
          />

          <Controller
            rules={{ required: true }}
            control={control}
            name="long_description"
            error={errors.long_description}
            defaultValue={defaultValue?.product_details[0]?.long_description}
            render={({ field }) => (
              <TextField
                className="mt-3"
                {...field}
                multiline
                error={errors.long_description}
                rows={10}
                variant="outlined"
                label={t("DetailDescription.DescriptionLong")}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default FirstStepForm;
