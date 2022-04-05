import React from "react";

// UI
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import CloseIcon from "@material-ui/icons/Close";
// Styles
import Styled from "@emotion/styled";

export const DeleteButton = Styled.div`
    background-color: transparent;
    border: none;
    position: absolute;
    right: 10px;
    top: 5px;
    color: gray;
    cursor: pointer;
    z-index: 2;
    pointer-events: all;
`;

export const Container = Styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FoodExchageItem = ({
  exchange,
  setModalFoodExchangeData,
  setFoodExchangeModalState,
  isCreatedPlan,
  foodExchangeItems,
  setFoodExchangeItems,
}) => {
  const deleteItem = (e) => {
    e.stopPropagation();
    setFoodExchangeItems(
      foodExchangeItems.filter(
        (item) => item.daily_food_id !== exchange.daily_food_id
      )
    );
  };

  return (
    <Container
      onClick={(e) => {
        e.stopPropagation();
        setModalFoodExchangeData(exchange);
        setFoodExchangeModalState(true);
      }}
    >
      {!isCreatedPlan && (
        <DeleteButton onClick={(e) => deleteItem(e)}>
          <CloseIcon fontSize="small" />
        </DeleteButton>
      )}
      <VisibilityOutlinedIcon style={{ color: "gray" }} />
    </Container>
  );
};

export default FoodExchageItem;
