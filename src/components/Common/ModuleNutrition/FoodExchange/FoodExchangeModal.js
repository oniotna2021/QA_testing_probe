import React from "react";
import { useTranslation } from "react-i18next";

//UI
import TextField from "@material-ui/core/TextField";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "130px",
    height: "50px",
    background: "transparent",
    color: "#3C3C3B",
    marginBottom: "20px",
  },
}));

const FoodExchangeModal = ({
  setFoodExchangeModalState,
  modalFoodExchangeData,
  setModalFoodExchangeData,
  foodExchangeItems,
  setFoodExchangeItems,
  isCreatedPlan,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleChange = (e) => {
    setModalFoodExchangeData({
      ...modalFoodExchangeData,
      description: e.target.value,
    });
  };

  const addFoodExchange = () => {
    if (modalFoodExchangeData.description) {
      const foundItem = foodExchangeItems.find(
        (item) => item.daily_food_id === modalFoodExchangeData.daily_food_id
      );

      if (!foundItem) {
        setFoodExchangeItems([...foodExchangeItems, modalFoodExchangeData]);
      } else {
        setFoodExchangeItems((actual) => {
          return actual.map((actualItem) => {
            return actualItem.daily_food_id ===
              modalFoodExchangeData.daily_food_id
              ? modalFoodExchangeData
              : actualItem;
          });
        });
      }
      setFoodExchangeModalState(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField
        defaultValue={modalFoodExchangeData.description}
        className="mb-2"
        multiline
        value={modalFoodExchangeData.description}
        onChange={handleChange}
        rows={11}
        disabled={false}
        variant="outlined"
        label={t("NutritionPlan.ExchangeCreateDetail")}
      />
      <div className="col-12 d-flex justify-content-around mt-5">
        <Button
          className={classes.button}
          onClick={() => setFoodExchangeModalState(false)}
        >
          {t("Btn.Cancel")}
        </Button>
        <ButtonSave
          text={t("NutritionPlan.ButtonSave")}
          onClick={addFoodExchange}
        />
      </div>
    </form>
  );
};

export default FoodExchangeModal;
