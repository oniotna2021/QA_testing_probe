import React from "react";
import { useStyles } from "utils/useStyles";

// UI
import Typography from "@material-ui/core/Typography";

//TRANSLATE
import { useTranslation } from "react-i18next";

const DetailDescription = ({ detailProduct }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-11 mb-3 d-flex justify-content-between">
          <Typography variant="body1" gutterBottom>
            <strong>{t("DetailDescription.DescriptionProduct")}</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>
              {t("DetailDescription.Slug")}:{detailProduct?.slug}
            </strong>
          </Typography>
        </div>

        <div className="row">
          <div className="col">
            <div className={`${classes.defaultBoxContainer} mb-3`}>
              <Typography
                className={classes.fontGray}
                variant="caption"
                gutterBottom
              >
                {t("DetailDescription.DescriptionShort")}
              </Typography>
              <Typography className="mb-3" variant="body2">
                {detailProduct.product_details && detailProduct.product_details.length > 0 &&
                  detailProduct.product_details.at(-1).short_description}
              </Typography>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className={`${classes.defaultBoxContainer} mb-3`}>
              <Typography
                className={classes.fontGray}
                variant="caption"
                gutterBottom
              >
                {t("DetailDescription.DescriptionLong")}
              </Typography>
              <Typography className="mb-3" variant="body2">
                {detailProduct.product_details && detailProduct.product_details.length > 0 &&
                  detailProduct.product_details.at(-1).long_description}
              </Typography>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className={`${classes.defaultBoxContainer} mb-3`}>
              <Typography
                className={classes.fontGray}
                variant="caption"
                gutterBottom
              >
                {t("DetailDescription.PrivateNote")}
              </Typography>
              <Typography className="mb-3" variant="body2">
                {detailProduct.product_details && detailProduct.product_details.length > 0 &&
                  detailProduct.product_details.at(-1).private_note}
              </Typography>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className={`${classes.defaultBoxContainer} mb-3`}>
              <Typography
                className={classes.fontGray}
                variant="caption"
                gutterBottom
              >
                {t("DetailDescription.PublicNote")}
              </Typography>
              <Typography className="mb-3" variant="body2">
                {detailProduct.product_details && detailProduct.product_details.length > 0 &&
                  detailProduct.product_details.at(-1).public_note}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailDescription;
