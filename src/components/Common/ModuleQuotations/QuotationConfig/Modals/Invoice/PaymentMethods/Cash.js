import React from "react";

// UI
import { FormControl, TextField, Typography } from "@material-ui/core";



const Cash = () => {
  return (
    <div>
      <Typography className="mb-3">
        Ingresa el valor a pagar con este método
      </Typography>
      <FormControl variant="outlined">
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

export default Cash;
