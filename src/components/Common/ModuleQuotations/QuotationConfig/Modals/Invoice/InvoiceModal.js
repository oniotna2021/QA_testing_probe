import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

// UI
import { TextField, Typography, Button } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

// components
import DatePicker from "components/Shared/DatePicker/DatePicker";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// utils
import { useStyles } from "utils/useStyles";
import { formatCurrency } from 'utils/misc';


import {
  IconCreditCard,
  IconDebitCard,
  IconCash,
  IconCupon,
} from "assets/icons/customize/config";

const InvoiceModal = ({ infoBudget, setPaymentMethod }) => {

  const classes = useStyles();
  const { control } = useForm();

  const [option, setOption] = useState([]);

  const handleOption = (event, newAlignment) => {
    setOption(newAlignment);
  };

  const handlePaymentMethod = () => {
    if (option.length > 0) {
      const isCard = option.includes("credit") || option.includes("debit");
      if (option.includes("cash") && isCard) {
        return setPaymentMethod("mixed");
      }

      if (isCard) {
        return setPaymentMethod("card");
      }

      if (option.includes("cash")) {
        return setPaymentMethod("cash");
      }
    } else {
      alert("seleccione un metodo de pago");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <Typography variant="body1" className="mb-1">
            {(infoBudget && Array.isArray(infoBudget.products) ? infoBudget.products : []).map(x =>
              <p><strong>{x.name_product}</strong> <span>{x.name_category} {infoBudget.name_venue}</span></p>
            )}
          </Typography>
          <Typography variant="body1">
            ¿A partir de qué fecha deseas iniciar el plan?
          </Typography>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col">
          <Controller
            rules={{ required: true }}
            control={control}
            name="date_init"
            render={({ field }) => (
              <FormControl>
                <DatePicker
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                  }}
                  animateYearScrolling
                />
              </FormControl>
            )}
          />

          <div className="row mt-3 d-flex align-items-center">
            <div className="col-9">
              <Controller
                name="code_promo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    placeholder="Cupón promocional"
                  />
                )}
              />
            </div>

            <div className="col-2">
              <ButtonSave text="Aplicar" />
            </div>
          </div>

          <div
            className="row mt-3 d-flex align-items-center pb-4 pt-3 mb-4"
            style={{ borderBottom: ".1px solid #F3F3F3" }}
          >
            <div className="col-9">
              <Typography variant="body1">
                <strong>Total a pagar</strong>
              </Typography>
            </div>

            <div className="col-2">
              <Typography variant="h5">${formatCurrency(infoBudget.total)}</Typography>
            </div>
          </div>
        </div>

        <Typography variant="body1" className="pb-3">
          Método de pago
        </Typography>

        <ToggleButtonGroup
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
          value={option}
          onChange={handleOption}
        >
          <ToggleButton
            className={classes.grayButton}
            value={"credit"}
            style={{ borderRadius: 10, border: "solid .1px #F3F3F3" }}
          >
            <div className="d-flex align-items-center me-2">
              <IconCreditCard color="black" />
            </div>
            T. Crédito
          </ToggleButton>

          <ToggleButton
            className={classes.grayButton}
            value={"debit"}
            style={{ borderRadius: 10, border: "solid .1px #F3F3F3" }}
          >
            <div className="d-flex align-items-center me-2">
              <IconDebitCard color="black" />
            </div>
            T. Débito
          </ToggleButton>

          <ToggleButton
            className={classes.grayButton}
            value={"cash"}
            style={{ borderRadius: 10, border: "solid .1px #F3F3F3" }}
          >
            <div className="d-flex align-items-center me-2">
              <IconCash color="black" />
            </div>
            Efectivo
          </ToggleButton>

          <ToggleButton
            className={classes.grayButton}
            value={"cupon"}
            style={{ borderRadius: 10, border: "solid .1px #F3F3F3" }}
          >
            <div className="d-flex align-items-center me-2">
              <IconCupon color="black" />
            </div>
            Cupón
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="row pb-3 pt-5">
        <div className="col d-flex justify-content-center">
          <Button>Cancelar</Button>
        </div>

        <div className="col d-flex justify-content-center">
          <ButtonSave text="Aceptar" onClick={() => handlePaymentMethod()} />
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
