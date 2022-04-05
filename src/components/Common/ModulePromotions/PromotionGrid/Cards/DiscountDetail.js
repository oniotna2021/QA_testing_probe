import React from "react";
import { useTranslation } from "react-i18next";

// UI
import { IconButton, Typography } from "@material-ui/core";
import { IconEditPencil } from "assets/icons/customize/config";

// utils
import { useStyles } from "utils/useStyles";

const DiscountDetail = ({ defaultValue, setAddDiscountStep }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={`p-3 mb-3 ${classes.detailPromotion}`}>
      <div className="d-flex justify-content-between">
        <Typography variant="p">
          <strong>{t("PromotionRule.ByMonthTitle")}</strong>
        </Typography>
        <IconButton onClick={() => setAddDiscountStep(true)}>
          <IconEditPencil color="gray" />
        </IconButton>
      </div>

      <div>
        {defaultValue.apply_discount_per_month ? (
          defaultValue.discount_per_month.map((discount, idx) => {
            return (
              <div key={idx} className="d-flex justify-content-between">
                <Typography variant="body1">
                  {`Valor mes ${idx + 1}`}
                </Typography>

                <Typography variant="body1" className="me-3">
                  {defaultValue.discount_type === "valor" && "$"}
                  {discount.discount_value}
                  {defaultValue.discount_type === "porcentaje" && "%"}
                </Typography>
              </div>
            );
          })
        ) : (
          <div className="d-flex justify-content-between">
            <Typography variant="body1">{`Valor`}</Typography>

            <Typography variant="body1" className="me-3">
              {defaultValue.discount_type === "valor" && "$"}
              {defaultValue.discount_value}
              {defaultValue.discount_type === "porcentaje" && "%"}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountDetail;
