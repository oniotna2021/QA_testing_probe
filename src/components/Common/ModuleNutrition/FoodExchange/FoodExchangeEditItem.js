import React from "react";
// UI
import BorderColorIcon from "@material-ui/icons/BorderColor";

// styles
import Styled from "@emotion/styled";

export const Container = Styled.div`
  background-color: rgba(98, 149, 250, .2);
  width: 100%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  & > *{
    font-size: 20px !important;
  }
`;

const FoodExchangeEditItem = () => {
  return (
    <Container>
      <BorderColorIcon />
    </Container>
  );
};

export default FoodExchangeEditItem;
