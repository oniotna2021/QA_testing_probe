import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

//utils
import { useStyles } from "utils/useStyles";

//components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import { getProductByuuId } from "services/Comercial/Product";

const DetailPlan = ({
  setdetailProductModal,
  product,
  handleSelectProduct,
  fromAddedProduct,
  isDetail,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [dataProduct, setDataProduct] = useState({});

  useEffect(() => {
    if (product) {
      getProductByuuId(product.uuid)
        .then(({ data }) => {
          if (data && data.data && data.status === "success") {
            setDataProduct(data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }, [product]);

  return (
    <div className="container p-3">
      <div className="col-12">
        <Typography variant={"h6"}>
          {t("DetailDescription.DescriptionShort")}
        </Typography>
        <Typography variant={"p"}>
          {isDetail
            ? dataProduct?.short_description
            : dataProduct?.product_details?.at(-1)?.long_description}
        </Typography>
      </div>

      {dataProduct?.kit_products && dataProduct?.kit_products.length > 0 && (
        <div className="col-12 mt-3">
          <Typography variant={"h6"}>
            {t("QuotationsConfig.Resume.KitProducts")}
          </Typography>

          <ul>
            {dataProduct?.kit_products.map((kitProduct) => {
              return <li>{kitProduct.name}</li>;
            })}
          </ul>
        </div>
      )}

      {!fromAddedProduct && (
        <div className="d-flex justify-content-around my-3">
          <Button
            className={classes.buttonCancel}
            onClick={() => setdetailProductModal(false)}
          >
            {t("Btn.Cancel")}
          </Button>
          <ButtonSave
            style={{ width: 180 }}
            text={t("Promotions.AddProduct")}
            onClick={() => {
              handleSelectProduct()
              setdetailProductModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DetailPlan;
