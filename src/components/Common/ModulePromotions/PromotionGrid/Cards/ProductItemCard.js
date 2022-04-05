import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// UI
import Card from "@material-ui/core/Card";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

// icons
import { IconArrowRightMin, IconEyeView } from "assets/icons/customize/config";

// utils
import { useStyles } from "utils/useStyles";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import AddProduct from "../Modals/AddProduct";
import DetailProduct from "../Modals/DetailProduct";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const ProductItemCard = ({ product }) => {
  const theme = useTheme();
  const classes = useStyles();
  const { t } = useTranslation();

  const [addProductModal, setAddProductModal] = useState(false);
  const [detailProductModal, setdetailProductModal] = useState(false);

  return (
    <>
      <Card className="d-flex align-items-center justify-content-between p-2 ps-3 mb-2">
        <Typography variant="body1" style={{ width: 200 }}>
          {product.name}
        </Typography>
        <div>
          <IconButton
            className={`me-2 ${classes.iconButtonArrow}`}
            onClick={() => setdetailProductModal(true)}
          >
            <IconEyeView color={theme.palette.black.main} />
          </IconButton>
          <IconButton
            className={classes.iconButtonArrow}
            onClick={() => setAddProductModal(true)}
          >
            <IconArrowRightMin color={theme.palette.black.main} />
          </IconButton>
        </div>

        {/* Add product modal */}
        <ShardComponentModal
          fullWidth
          maxWidth="sm"
          {...modalProps}
          body={
            <AddProduct
              setAddProductModal={setAddProductModal}
              defaultValue={product}
            />
          }
          isOpen={addProductModal}
          handleClose={() => setAddProductModal(false)}
          title={t("Promotions.AddProduct")}
        />
      </Card>

      {/* Detail product modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <DetailProduct
            setdetailProductModal={setdetailProductModal}
            product={product}
          />
        }
        isOpen={detailProductModal}
        handleClose={() => setdetailProductModal(false)}
        title={product.name}
      />
    </>
  );
};

export default ProductItemCard;
