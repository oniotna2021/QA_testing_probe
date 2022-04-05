import React, { useState } from "react";

//UI
import { useTheme } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

//icons
import { IconEyeView } from 'assets/icons/customize/config'
// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import DetailPlan from "../Modals/DetailPlan";
import SelectVenue from "../Modals/SelectVenue";

// utils
import { useStyles } from "utils/useStyles";
import { formatCurrency } from "utils/misc";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const ProductCard = ({ updateSelectedProducts, product, selectedProducts, setUpdateItemFetch }) => {
  // modals
  const [detailProductModal, setdetailProductModal] = useState(false);

  const handleSelectProduct = () => {
    if (
      !selectedProducts.find((productItem) => productItem.id === product.id)
    ) {
      updateSelectedProducts([
        ...selectedProducts,
        {
          ...product
        }
      ]);
      setUpdateItemFetch();
    }
  };

  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <Card className="mb-2">
        <div className="row p-3 d-flex align-items-center">
          <div className="col">
            <Typography variant="body1">
              <strong>{product?.name}</strong>
            </Typography>
            <Typography variant="body1">
              ${`${formatCurrency(product.price)}`}
            </Typography>
          </div>

          {/* <div className="col">
            <Typography
              variant="p"
              style={{ color: "gray" }}
              className={classes.defaultBoxCenteredContainer}
            >
              <strong>{product?.product_type}</strong>
            </Typography>
          </div> */}

          <div className="col-3 d-flex">
            <IconButton
              onClick={() => setdetailProductModal(true)}
              className={`${classes.iconButtonArrow} m-1`}
            >
              <IconEyeView color={theme.palette.black.main} />
            </IconButton>

            <IconButton
              onClick={() => handleSelectProduct()}
              className={`${classes.iconButtonArrow} m-1`}
            >
              <AddIcon color={theme.palette.black.main} />
            </IconButton>
          </div>
        </div>
      </Card>

      {/* Detail product modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="xs"
        {...modalProps}
        body={
          <DetailPlan
            product={product}
            handleSelectProduct={() => handleSelectProduct()}
            setdetailProductModal={setdetailProductModal}
          />
        }
        isOpen={detailProductModal}
        handleClose={() => setdetailProductModal(false)}
        title={product?.name}
      />

      {/* <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <SelectVenue
            price={product.price}
            product={product}
            citiesOptions={citiesOptions}
            setSelectVenueModal={setSelectVenueModal}
          />
        }
        isOpen={selectVenueModal}
        handleClose={() => setSelectVenueModal(false)}
        title={"Sede"}
      /> */}
    </>
  );
};

export default ProductCard;
