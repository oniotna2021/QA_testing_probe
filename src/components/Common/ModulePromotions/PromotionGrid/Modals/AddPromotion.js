import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

// utils
import { useStyles } from "utils/useStyles";
import { infoToast } from "utils/misc";

// UI
import Button from "@material-ui/core/Button";

// icons
import { IconMas } from "assets/icons/customize/config";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import NewRule from "./RulesSteps/NewRule";
import AddDiscount from "./RulesSteps/AddDiscount";
import RuleCard from "../Cards/RuleCard";
import DiscountDetail from "../Cards/DiscountDetail";

// redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateSelectedPromotions } from "modules/promotions";

const AddPromotion = ({
  updateSelectedPromotions,
  selectedPromotions,
  category,
  product,
  setAddPromotionModal,
  defaultValue,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [addNewRuleModal, setAddNewRuleModal] = useState(false);
  const [AddDiscountStep, setAddDiscountStep] = useState(false);
  const [monthDiscount, setMonthDiscount] = useState(
    defaultValue?.apply_discount_per_month ? false : true
  );
  // data
  const [promotionRules, setPromotionRules] = useState(
    defaultValue?.rules || []
  );
  const [promotionDiscount, setPromotionDiscount] = useState();

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: defaultValue });

  const onSubmit = () => {
    if (promotionDiscount) {
      let promotionObject = {
        product_id: Number(product.id),
        category_id: Number(category.id),
        product_price_id:
          Number(product.product_prices_list?.at(-1)?.id) || null,
        discount_type: promotionDiscount.discount_type,
        rules: promotionRules,
        apply_discount_per_month: promotionDiscount.apply_discount_per_month,
        // hardcoded
        all_venues: true,
        rule_id: 1,
      };

      if (!monthDiscount) {
        promotionObject = {
          ...promotionObject,
          discount_per_month: promotionDiscount.discount_per_month.map(
            (discount, idx) => {
              return {
                month: idx + 1,
                discount_value: Number(discount.discount_value),
              };
            }
          ),
        };
      } else {
        promotionObject = {
          ...promotionObject,
          discount_value: Number(promotionDiscount.discount_value),
        };
      }

      if (defaultValue) {
        updateSelectedPromotions(
          selectedPromotions.map((promotion) => {
            if (
              promotion.category_id === Number(category.id) &&
              promotion.product_id === Number(product.id)
            ) {
              return promotionObject;
            } else {
              return promotion;
            }
          })
        );
      } else {
        updateSelectedPromotions([...selectedPromotions, promotionObject]);
      }
      setAddPromotionModal(false);
    } else {
      enqueueSnackbar(t("PromotionRule.AddDiscountAlert"), infoToast);
    }
  };

  useEffect(() => {
    reset();
  }, [monthDiscount, reset]);

  // set default discount
  useEffect(() => {
    if (defaultValue) {
      if (!defaultValue.apply_discount_per_month) {
        setPromotionDiscount({
          apply_discount_per_month: defaultValue.apply_discount_per_month,
          discount_value: defaultValue.discount_value,
          discount_type: defaultValue.discount_type,
        });
      } else {
        setPromotionDiscount({
          apply_discount_per_month: defaultValue.apply_discount_per_month,
          discount_per_month: defaultValue.discount_per_month,
          discount_type: defaultValue.discount_type,
        });
      }
    }
  }, [defaultValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {AddDiscountStep ? (
          <AddDiscount
            control={control}
            handleSubmit={handleSubmit}
            errors={errors}
            setAddDiscountStep={setAddDiscountStep}
            setPromotionDiscount={setPromotionDiscount}
            monthDiscount={monthDiscount}
            setMonthDiscount={setMonthDiscount}
            defaultValue={defaultValue}
          />
        ) : (
          <>
            {promotionDiscount ? (
              <DiscountDetail
                defaultValue={promotionDiscount}
                setAddDiscountStep={setAddDiscountStep}
              />
            ) : (
              <div className="col mb-2">
                <Button
                  onClick={() => setAddDiscountStep(true)}
                  fullWidth
                  className="d-flex justify-content-between p-3"
                  style={{ backgroundColor: "#EBEBEB" }}
                >
                  {t("PromotionRule.AddDiscount")} <IconMas />
                </Button>
              </div>
            )}

            {promotionRules.length < 3 && (
              <div className="col mb-4">
                <Button
                  onClick={() => setAddNewRuleModal(true)}
                  fullWidth
                  className="d-flex justify-content-between p-3"
                  style={{ backgroundColor: "#EBEBEB" }}
                >
                  {t("PromotionRule.AddRuleBtn")} <IconMas />
                </Button>
              </div>
            )}

            {promotionRules.map((rule) => {
              return (
                <RuleCard
                  rule={rule}
                  setPromotionRules={setPromotionRules}
                  promotionRules={promotionRules}
                />
              );
            })}
          </>
        )}

        {!AddDiscountStep && (
          <div className="d-flex justify-content-around my-2 mt-4">
            <Button
              className={classes.buttonCancel}
              onClick={() => setAddPromotionModal(false)}
            >
              {t("Btn.Cancel")}
            </Button>
            <ButtonSave text={t("Btn.save")}></ButtonSave>
          </div>
        )}
      </form>

      {/* New rule modal */}
      <ShardComponentModal
        title={t("PromotionRule.NewRule")}
        fullWidth={true}
        handleClose={() => setAddNewRuleModal(false)}
        isOpen={addNewRuleModal}
        width={"sm"}
        body={
          <NewRule
            promotionRules={promotionRules}
            setPromotionRules={setPromotionRules}
            setAddNewRuleModal={setAddNewRuleModal}
          />
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPromotion);
