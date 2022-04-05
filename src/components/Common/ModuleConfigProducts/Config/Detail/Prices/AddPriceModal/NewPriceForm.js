import React, { useState } from "react";


//UI
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";

const NewPriceForm = ({
  Controller,
  control,
  classes,
  t,
  categoriesOptions,
  segments,
  channels,
  taxesOptions
}) => {
  const [applyTaxes, setApplyTaxes] = useState(false);

  return (
    <div className="row m-0">


      <div className="col-12">
        <ControlledAutocomplete
          control={control}
          name="id_category"
          options={categoriesOptions || []}
          getOptionLabel={(option) => `${option.name}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("EditPriceForm.Category")}
              variant="outlined"
              margin="normal"
            />
          )}
          defaultValue={[]}
        />
      </div>

      <div className="col-12">
        <ControlledAutocomplete
          control={control}
          name="segments"
          options={segments || []}
          getOptionLabel={(option) => `${option.name}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("Subsegment.Select")}
              variant="outlined"
              margin="normal"
            />
          )}
          defaultValue={[]}
        />
      </div>

      <div className="col-12  my-3">
        <ControlledAutocomplete
          control={control}
          name="channels"
          options={channels || []}
          getOptionLabel={(option) => `${option.name}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("DetailProduct.Channel")}
              variant="outlined"
              margin="normal"
              className="mb-3"
            />
          )}
          defaultValue={[]}
        />
      </div>



      <div className="col-6" style={{ marginTop: 30 }}>
        <Typography variant="body2" style={{ fontWeight: 'bold' }}>
          {t("EditPriceForm.BasePrice")}
        </Typography>
      </div>

      <div className="col-6">
        <Controller
          rules={{ required: true }}
          control={control}
          name="price"
          render={({ field }) => (
            <TextField
              {...field}
              label={""}
              variant="outlined"
              margin="normal"
              fullWidth
              className="mb-3"
            />
          )}
        />
      </div>

      <div className="col-10" style={{ marginTop: 10 }}>
        <Typography variant="body2">
          {t("EditPriceForm.TaxApply")}
        </Typography>
      </div>

      <div className="col-2" >
        <Controller
          rules={{ required: false }}
          control={control}
          name="apply_taxes"
          render={({ field }) => (
            <Checkbox
              {...field}
              onChange={(e) => {
                field.onChange(e.target.checked);
                setApplyTaxes(e.target.checked);
              }}
              checked={field.value}
              color="primary"
              className="d-flex justify-content-end"
            />
          )}
        />
      </div>


      {applyTaxes && (
        <div className="row">
          <div className="col">
            <ControlledAutocomplete
              required={true}
              control={control}
              name="taxes"
              options={taxesOptions || []}
              getOptionLabel={(option) => `${option.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Type.Taxes")}
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
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  className="mb-3"
                  type="number"
                  label={t("EditPriceForm.TotalValue")}
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
      )}


      <div className="col-6 d-flex justify-content-center mt-5">
        <Button className={classes.buttonCancel}>{t("Btn.Cancel")}</Button>
      </div>


      <div className="col-6 d-flex justify-content-end mt-5">
        <ButtonSave
          fullWidth={true}
          text={t("Btn.save")}
        />
      </div>



    </div>
  );
};

export default NewPriceForm;
