import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import PromotionRules from "../Modals/AddPromotion";
import PromotionCell from "./PromotionCell";

// redux
import { connect } from "react-redux";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const AddPromotionCell = ({ product, category, selectedPromotions }) => {
  const { t } = useTranslation();

  const [addPromotionModal, setAddPromotionModal] = useState(false);
  const [currentPromotionInfo, setCurrentPromotionInfo] = useState();

  useEffect(() => {
    setCurrentPromotionInfo(
      selectedPromotions.find(
        (promotion) =>
          promotion.category_id === Number(category.id) &&
          promotion.product_id === Number(product.id)
      )
    );
  }, [selectedPromotions, product, category]);

  return (
    <>
      <td
        onClick={() => {
          if (!currentPromotionInfo) {
            setAddPromotionModal(true);
          }
        }}
      >
        {currentPromotionInfo && (
          <PromotionCell
            currentPromotionInfo={currentPromotionInfo}
            product={product}
            category={category}
          />
        )}
      </td>

      {/* Add promotion modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <PromotionRules
            product={product}
            category={category}
            setAddPromotionModal={setAddPromotionModal}
          />
        }
        isOpen={addPromotionModal}
        handleClose={() => setAddPromotionModal(false)}
        title={t("Promotions.PromotionRules")}
      />
    </>
  );
};

const mapStateToProps = ({ promotions }) => ({
  selectedPromotions: promotions.selectedPromotions,
});

export default connect(mapStateToProps)(AddPromotionCell);
