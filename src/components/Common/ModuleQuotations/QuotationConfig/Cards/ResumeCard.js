import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//UI
import { Card } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

// utils
import { formatCurrency } from "utils/misc";

//redux
import { connect } from "react-redux";

const ResumeCard = ({ infoBudget, defaultQuotation, isDetail, selectedProducts }) => {
  const [price, setPrice] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setPrice(
      formatCurrency(
        selectedProducts.reduce((total, num) => {
          return total + parseInt(num.price);
        }, 0)
      )
    );
  }, [selectedProducts]);

  return (
    <Card>
      <div className="row p-3">
        <div className="col-3">
          <p>
            <b>Subtotal</b>
          </p>
          {(infoBudget ? infoBudget.taxes : []).map(x =>
            <p key={`tax-id-` + x.name}>
              <b>{x.type}</b>
            </p>
          )}
        </div>
        <div className="col-5">
          <p>${price}</p>
          {(infoBudget ? infoBudget.taxes : []).map(x =>
            <p key={`tax-id-` + x.name}>
              {x.value}
            </p>
          )}
        </div>

        <div className="col-4">
          <div className="d-flex align-items-center justify-content-end">
            <Typography variant="h6" className="mx-2">
              {t("QuotationsConfig.Resume.Total")}:
            </Typography>
            <Typography variant="h4">
              {isDetail
                ? defaultQuotation?.sign?.sign
                : selectedProducts?.at(-1)?.sign}
              ${price}
            </Typography>
          </div>
          <div className="d-flex justify-content-end">
            <p>Fecha de Vigencia</p>
          </div>
          <div className="d-flex justify-content-end">
            <p className="m-0">--------</p>
          </div>
          {isDetail && (
            <div>
              {" "}
              <Typography variant="body1">
                {t("QuotationsConfig.Resume.Date")}:
              </Typography>
              <Typography variant="body1" className="mb-3">
                <strong>{defaultQuotation?.end_date}</strong>
              </Typography>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const mapStateToProps = ({ quotations }) => ({
  selectedProducts: quotations.selectedProducts,
});

export default connect(mapStateToProps)(ResumeCard);
