import React from "react";

// UI
import { Button, Typography } from "@material-ui/core";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

const ApprovedTransaction = ({ setSendQuotationModal }) => {
  return (
    <div className="container">
      <div className="row mb-5">
        <div className="d-flex justify-content-between">
          <div>
            <Typography>
              <strong>Número de transacción</strong>
            </Typography>
            <Typography variant="body1">APIE20062607598435</Typography>
          </div>

          <div>
            <div className="d-flex">
              <Typography className="me-2">
                <strong>Fecha</strong>
              </Typography>
              <Typography variant="body1">27.09.2021</Typography>
            </div>

            <div className="d-flex">
              <Typography className="me-2">
                <strong>Hora</strong>
              </Typography>
              <Typography variant="body1">14:26</Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="row pb-4">
        <div className="col">
          <div className="d-flex justify-content-between">
            <Typography variant="body1">
              <strong>Banco</strong>
            </Typography>
            <Typography variant="body1">Bancolombia</Typography>
          </div>

          <div className="d-flex justify-content-between">
            <Typography variant="body1">
              <strong>CUS</strong>
            </Typography>
            <Typography variant="body1">662969861</Typography>
          </div>

          <div className="d-flex justify-content-between">
            <Typography variant="body1">
              <strong>Voucher N°</strong>
            </Typography>
            <Typography variant="body1">186.55.55.55</Typography>
          </div>
        </div>
      </div>

      <div
        className="row pt-4 mb-4"
        style={{ borderTop: ".1px solid #F3F3F1" }}
      >
        <div className="col">
          <div className="d-flex justify-content-between">
            <Typography variant="body1">
              <strong>Razón social</strong>
            </Typography>
            <Typography variant="body1">Bodytech CORP</Typography>
          </div>

          <div className="d-flex justify-content-between">
            <Typography variant="body1">
              <strong>NIT</strong>
            </Typography>
            <Typography variant="body1">5555555555</Typography>
          </div>

          <div className="d-flex justify-content-between">
            <Typography variant="body1">
              <strong>Dirección</strong>
            </Typography>
            <Typography variant="body1">Cll 75 # 22 - 10</Typography>
          </div>

          <div className="d-flex justify-content-between">
            <Typography variant="body1">
              <strong>Ciudad</strong>
            </Typography>
            <Typography variant="body1">Bogotá</Typography>
          </div>
        </div>
      </div>

      <div
        className="row pt-4 mb-4"
        style={{ borderTop: ".1px solid #F3F3F1" }}
      >
        <div className="d-flex align-items-center">
          <div className="col">
            <div className="mb-3">
              <Typography variant="body1">
                <strong>Elite Gold Mensual</strong>
              </Typography>
              <Typography variant="body1">Autopista 137</Typography>
            </div>

            <div className="d-flex">
              <Typography variant="body1" className="me-3">
                <strong>IVA(16%)</strong>
              </Typography>
              <Typography variant="body1">$5.100</Typography>
            </div>

            <div className="d-flex">
              <Typography variant="body1" className="me-3">
                <strong>Subtotal</strong>
              </Typography>
              <Typography variant="body1">$85.000</Typography>
            </div>
          </div>

          <div className="col p-3">
            <div
              className="d-flex align-items-center p-4"
              style={{
                backgroundColor: "#F3F3F3",
                borderRadius: 10,
              }}
            >
              <Typography variant="h6" className="me-2">
                <strong>Total: </strong>
              </Typography>
              <Typography variant="h5">
                <strong>$90.100</strong>
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="row pb-3 pt-3">
        <div className="col d-flex justify-content-center">
          <Button
            id="printPageButton"
            onClick={() => {
              window.print();
            }}
          >
            Imprimir
          </Button>
        </div>

        <div className="col d-flex justify-content-center">
          <ButtonSave
            id="printPageButton"
            text="Guardar"
            onClick={() => setSendQuotationModal(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default ApprovedTransaction;
