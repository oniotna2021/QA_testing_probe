import React, { useEffect } from "react";

//UI
import { Button } from "@material-ui/core";

// components
import Card from "./PaymentMethods/Card";
import Cash from "./PaymentMethods/Cash";
import Mixed from "./PaymentMethods/Mixed";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

const Payment = ({ method, setPaymentMethod, setAprovedTransactionModal }) => {
  useEffect(() => {
    return () => setPaymentMethod(null);
  }, [setPaymentMethod]);

  return (
    <div>
      {method === "card" && (
        <Card />
      )}
      {method === "cash" && (
        <Cash />
      )}
      {method === "mixed" && (
        <Mixed />
      )}

      <div className="row pb-3 pt-5">
        <div className="col d-flex justify-content-center">
          <Button onClick={() => setPaymentMethod(null)}>Atrás</Button>
        </div>

        <div className="col d-flex justify-content-center">
          <ButtonSave
            text="Siguiente"
            onClick={() => setAprovedTransactionModal(true)}
          />
        </div>
      </div>


    </div>
  );
};

export default Payment;
