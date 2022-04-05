import React, { useState } from "react";

// UI
import { Typography } from "@material-ui/core";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import DetailProduct from "../Modals/DetailProduct";

// utils
import { useStyles } from "utils/useStyles";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  updateSelectedProducts,
  updateSelectedPromotions,
} from "modules/promotions";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const SelectedProduct = ({
  product,
  selectedProducts,
  selectedPromotions,
  updateSelectedProducts,
  updateSelectedPromotions,
}) => {
  const classes = useStyles();

  const [detailProductModal, setDetailProductModal] = useState(false);

  const deleteProduct = () => {
    updateSelectedPromotions(
      selectedPromotions.filter(
        (promotion) => promotion.product_id !== product.id
      )
    );
    updateSelectedProducts(
      selectedProducts?.filter(
        (selectedProduct) => selectedProduct.id !== product.id
      )
    );
  };

  return (
    <>
      <div
        className={classes.selectedProductGrid}
        style={{ cursor: "pointer" }}
        onClick={() => setDetailProductModal(true)}
      >
        <div
          className={classes.closeButton}
          onClick={(e) => {
            e.stopPropagation();
            deleteProduct();
          }}
        >
          X
        </div>
        <Typography variant="p">{product.name}</Typography>
      </div>

      {/* Detail product modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <DetailProduct
            setdetailProductModal={setDetailProductModal}
            product={product}
            fromSelectedProduct
          />
        }
        isOpen={detailProductModal}
        handleClose={() => setDetailProductModal(false)}
        title={product.name}
      />
    </>
  );
};

const mapStateToProps = ({ promotions }) => ({
  selectedProducts: promotions.selectedProducts,
  selectedPromotions: promotions.selectedPromotions,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSelectedProducts,
      updateSelectedPromotions,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SelectedProduct);
