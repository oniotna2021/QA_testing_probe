import React, { useState } from "react";

//UI
import Typography from "@material-ui/core/Typography";
import { Card } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

// icons
import { IconClose } from "assets/icons/customize/config";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import DetailPlan from "../Modals/DetailPlan";

// utils
import { useStyles } from "utils/useStyles";
import { formatCurrency } from "utils/misc";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSelectedProducts } from "modules/quotations";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const AddedProductCard = ({
  product,
  isDetail,
  defaultQuotation,
  selectedProducts,
  updateSelectedProducts,
}) => {
  const [detailProductModal, setDetailProductModal] = useState(false);

  const classes = useStyles();

  const deleteFromSelected = () => {
    updateSelectedProducts(
      selectedProducts.filter((productItem) => productItem.id !== product?.id)
    );
  };

  return (
    <>
      <Card className="mb-2">
        <div className="row p-3 d-flex align-items-center">
          <div className="col d-flex align-items-center">
            <div
              className={`d-flex align-items-center col-3 ${classes.defaultBoxCenteredContainer}`}
              style={{ cursor: "pointer" }}
              onClick={() => setDetailProductModal(true)}
            >
              <ErrorOutlineIcon className="me-1" style={{ color: "gray" }} />
              <Typography variant="p" style={{ color: "gray" }}>
                {product?.name_category}
              </Typography>
            </div>

            <Typography variant="body1" className="ms-5">
              {product?.name_product}
            </Typography>
          </div>

          <div
            className={`col-2 ${classes.defaultBoxCenteredContainerQuotations}`}
          >
            <Typography variant="body1">
              {isDetail ? defaultQuotation?.sign?.sign : product?.sign}
              ${formatCurrency(product?.price)}
            </Typography>
          </div>
          <div className="col-2 d-flex justify-content-end">
            {!isDetail && (
              <div style={{ cursor: "pointer" }} onClick={deleteFromSelected}>
                <IconClose color="gray" />
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Detail product modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <DetailPlan
            product={product}
            isDetail={isDetail}
            setdetailProductModal={setDetailProductModal}
            fromAddedProduct
          />
        }
        isOpen={detailProductModal}
        handleClose={() => setDetailProductModal(false)}
        title={product?.name}
      />
    </>
  );
};

const mapStateToProps = ({ quotations }) => ({
  selectedProducts: quotations.selectedProducts,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSelectedProducts,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddedProductCard);
