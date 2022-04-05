import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// UI
import { Typography } from "@material-ui/core";

// custom styles
import { Container, TableBody } from "./Grid.styles.js";

// icons
import { IconPromotions } from "assets/icons/customize/config";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import AddProductButton from "./AddProductButton";
import AddPoduct from "../Modals/AddProduct";
import SelectedProduct from "./SelectedProduct";
import AddPromotionCell from "./AddPromotionCell";
import LockedCell from "./LockedCell";

// redux
import { connect } from "react-redux";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const Grid = ({ selectedCategories, selectedProducts }) => {
  const { t } = useTranslation();
  const [addProductModal, setAddProductModal] = useState(false);

  return (
    <>
      <div style={{ minHeight: "70vh" }}>
        <div className="mb-3">
          <Typography variant="h6">{t("Promotions.GridTitle")}</Typography>
          <Typography variant="p">{t("Promotions.GridLabel")}</Typography>
        </div>
        <Container>
          <thead>
            <tr>
              <th>
                <IconPromotions color="black" />
              </th>
              {selectedCategories.map((category, idx) => {
                return <th key={idx}>{category?.name}</th>;
              })}
            </tr>
          </thead>
          <TableBody>
            {selectedProducts.map((product, idx) => {
              return (
                <tr key={idx}>
                  <td>
                    <SelectedProduct product={product} />
                  </td>
                  {selectedCategories.map((category, idx) => {
                    if (
                      product.selectedCategories.some(
                        (item) => item?.id === category.id
                      )
                    ) {
                      return (
                        <AddPromotionCell
                          product={product}
                          category={category}
                          key={idx}
                        />
                      );
                    } else {
                      return <LockedCell key={idx} />;
                    }
                  })}
                </tr>
              );
            })}
            <tr>
              <AddProductButton setAddProductModal={setAddProductModal} />
            </tr>
          </TableBody>
        </Container>
      </div>

      {/* Add product modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={<AddPoduct setAddProductModal={setAddProductModal} />}
        isOpen={addProductModal}
        handleClose={() => setAddProductModal(false)}
        title={t("Promotions.AddProduct")}
      />
    </>
  );
};

const mapStateToProps = ({ promotions }) => ({
  selectedProducts: promotions.selectedProducts,
  selectedCategories: promotions.selectedCategories,
});

export default connect(mapStateToProps)(Grid);
