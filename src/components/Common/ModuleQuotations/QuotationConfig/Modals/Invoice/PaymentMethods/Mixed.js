import React from "react";

// UI
import { FormControl, TextField, Typography } from "@material-ui/core";


const Mixed = () => {

  return (
    <div>
      <Typography variant="h5">Tarjeta</Typography>
      <Typography className="mb-3">
        Ingresa el valor a pagar con este método
      </Typography>
      <FormControl variant="outlined" className="mb-3">
        <TextField
          fullWidth
          type="number"
          label={"$ 000.000"}
          rows={1}
          variant="outlined"
        />
      </FormControl>

      {/* <Typography className="mb-3">Ingresa el número de aprobación</Typography>
      <FormControl variant="outlined" className="mb-3">
        <TextField
          fullWidth
          type="number"
          label={"Número de aprobación"}
          rows={1}
          variant="outlined"
        />
      </FormControl> */}

      <Typography variant="h5">Efectivo</Typography>
      <Typography className="mb-3">
        Ingresa el valor a pagar con este método
      </Typography>
      <FormControl variant="outlined" className="mb-3">
        <TextField
          fullWidth
          type="number"
          label={"$ 000.000"}
          rows={1}
          variant="outlined"
        />
      </FormControl>
    </div>
  );
};

export default Mixed;
