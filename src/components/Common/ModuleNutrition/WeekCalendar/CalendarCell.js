import React, { useState } from "react";
import { useParams } from "react-router";

// components
import FoodExchangeEditItem from "components/Common/ModuleNutrition/FoodExchange/FoodExchangeEditItem";

// styles
import Styled from "@emotion/styled";

export const FoodExchangeCell = Styled.td`
    width: 70px !important;
    border-right: none !important;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${({ isValidChild }) =>
      !isValidChild ? "10px !important;" : "0px !important;"}
    &:hover{
      background-color: white !important;
    }
    & > * {
      color: gray;
    }
    position: relative;
`;

const CalendarCell = ({
  setModalState,
  children,
  setCellData,
  cellData,
  isCreatedPlan,
  isFoodExchange,
  setFoodExchangeModalState,
  setModalFoodExchangeData,
  selectedDataElastic,
}) => {
  const { user_id } = useParams();
  const [showEditExchange, setShowEditExchange] = useState(false);

  const setData = () => {
    setCellData(cellData);
    setModalState(true);
  };

  function isTrue(element) {
    return element;
  }

  return (
    <>
      {isFoodExchange ? (
        <FoodExchangeCell
          isValidChild={children.some(isTrue)}
          onClick={() => {
            setModalFoodExchangeData({
              daily_food_id: cellData.hour.id,
            });
            setFoodExchangeModalState(true);
          }}
          onMouseEnter={() => setShowEditExchange(true)}
          onMouseLeave={() => setShowEditExchange(false)}
        >
          {children.some(isTrue)
            ? children
            : showEditExchange && <FoodExchangeEditItem />}
        </FoodExchangeCell>
      ) : (
        <td className="p-1" onClick={setData}>
          {children}
        </td>
      )}
    </>
  );
};

export default CalendarCell;
