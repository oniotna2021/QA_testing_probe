import React from "react";

// UI
import { Button, Typography } from "@material-ui/core";

// icons
import { IconQuotations, IconAddUser } from "assets/icons/customize/config";

// components
import Table from "./Table/Table";
import CardLight from "./Cards/CardLight";
import CardDark from "./Cards/CardDark";

const Carterization = () => {
  return (
    <div className="container">
      <div className="row mb-5">
        <div className="col d-flex justify-content-between">
          <div>
            <Typography variant="h5">Carterización</Typography>
          </div>
          <div>
            <Button
              style={{
                backgroundColor: "#F3F3F3",
                padding: "10px 20px 10px 20px",
                marginRight: 20,
              }}
            >
              <div className="d-flex align-items-center me-2">
                <IconQuotations color="black" />
              </div>
              Crear Cotización
            </Button>
            <Button
              style={{
                backgroundColor: "#F3F3F3",
                padding: "10px 20px 10px 20px",
              }}
            >
              <div className="d-flex align-items-center me-2">
                <IconAddUser color="black" />
              </div>
              Crear Usuario
            </Button>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <Table />
        </div>
      </div>

      <div className="row">
        <div className="col-4" style={{ display: "flex", flexWrap: "wrap" }}>
          <CardDark />
          <CardDark />
          <CardDark />
          <CardDark />
        </div>
        <div className="col-7" style={{ display: "flex", flexWrap: "wrap" }}>
          <CardLight />
          <CardLight />
          <CardLight />
          <CardLight />
          <CardLight />
          <CardLight />
        </div>
      </div>
    </div>
  );
};

export default Carterization;
