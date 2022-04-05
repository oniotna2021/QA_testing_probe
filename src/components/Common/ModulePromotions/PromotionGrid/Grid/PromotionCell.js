import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// UI
import { Typography } from "@material-ui/core";

// icons
import { IconPromotions } from "assets/icons/customize/config";

// utils
import { useStyles } from "utils/useStyles";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import AddPromotion from "../Modals/AddPromotion";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSelectedPromotions } from "modules/promotions";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const PromotionCell = ({
  currentPromotionInfo,
  updateSelectedPromotions,
  selectedPromotions,
  product,
  category,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [addPromotionModal, setAddPromotionModal] = useState(false);

  const deletePromotion = () => {
    let filteredPromotions = [];
    selectedPromotions.forEach((selectedPromotion) => {
      if (
        selectedPromotion.category_id === currentPromotionInfo.category_id &&
        selectedPromotion.product_id === currentPromotionInfo.product_id
      ) {
        return null;
      } else {
        return filteredPromotions.push(selectedPromotion);
      }
    });
    updateSelectedPromotions(filteredPromotions);
  };

  return (
    <>
      <div
        className={`d-flex justify-content-center align-items-center ${classes.promotionCellGrid}`}
        onClick={(e) => {
          e.stopPropagation();
          setAddPromotionModal(true);
        }}
      >
        <div
          className={classes.closeButton}
          onClick={(e) => {
            e.stopPropagation();
            deletePromotion();
          }}
        >
          X
        </div>
        {currentPromotionInfo.apply_discount_per_month ? (
          <div className="d-flex flex-column align-items-center">
            <IconPromotions color="black" />
            <Typography variant="Body1">
              {t("PromotionRule.ByMonth")}
            </Typography>
          </div>
        ) : (
          <Typography variant="h6">
            {currentPromotionInfo.discount_type === "valor" && "$"}
            {currentPromotionInfo.discount_value}
            {currentPromotionInfo.discount_type === "porcentaje" && "%"}
          </Typography>
        )}
      </div>

      {/* Add promotion modal */}
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <AddPromotion
            setAddPromotionModal={setAddPromotionModal}
            defaultValue={currentPromotionInfo}
            product={product}
            category={category}
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

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateSelectedPromotions,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PromotionCell);
