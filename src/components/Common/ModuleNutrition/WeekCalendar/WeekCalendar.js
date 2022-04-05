/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";

// UI
import { Container, TableBody } from "./WeekCalendar.styles.js";
import DateRangeIcon from "@material-ui/icons/DateRange";
import AutorenewOutlinedIcon from "@material-ui/icons/AutorenewOutlined";

// components
import NutritionItem from "components/Common/ModuleNutrition/WeekCalendar/NutritionItem";
import AssingRecipeModal from "components/Common/ModuleNutrition/AssingRecipeModal/AssingRecipeModal";
import FoodExchangeModal from "components/Common/ModuleNutrition/FoodExchange/FoodExchangeModal";
import { ShardComponentModal } from "../../../Shared/Modal/Modal";
import CalendarCell from "./CalendarCell";
import Loader from "components/Shared/Loading/Loading";
import FoodExchangeItem from "../FoodExchange/FoodExchageItem";

// services
import { getDailyFood, getDayWeek } from "services/MedicalSoftware/DailyFood";
import { Typography } from "@material-ui/core";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const ScheduleNutritionWeek = ({
  nutritionalPlanData,
  setNutritionalPlanData,
  scheduleItems,
  setScheduleItems,
  cellData,
  setCellData,
  isLoading,
  setIsLoading,
  isCreatedPlan,
  foodExchangeItems,
  setFoodExchangeItems,
  selectedRecipe,
  selectedDataElastic,
  setSelectedRecipe,
  setCaloriesForDay,
  caloriesForDay,
}) => {
  const { t } = useTranslation();
  const [modalState, setModalState] = useState(false);
  const [foodExchangeModalState, setFoodExchangeModalState] = useState(false);
  const [scheduleDays, setScheduleDays] = useState([]);
  const [scheduleFood, setScheduleFood] = useState([]);
  const [modalNutritionItemData, setModalNutritionItemData] = useState({});
  const [modalFoodExchangeData, setModalFoodExchangeData] = useState({});
  const [fromNutritionItem, setFromNutritionItem] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getDayWeek().then(({ data }) => {
      if (data && data.data && data.data.items.length > 0) {
        setScheduleDays(data.data.items);
      }
    });
    getDailyFood().then(({ data }) => {
      if (data && data.data && data.data.items.length > 0) {
        setScheduleFood(data.data.items);
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    separeRecipesWithDays();
  }, [scheduleDays]);

  const separeRecipesWithDays = () => {
    let temporalDays = [];
    let temporalCalories = [];

    scheduleDays?.forEach((dayWeek) => {
      temporalDays.push(
        scheduleItems?.filter((recipe) => recipe.day_week_id === dayWeek.id)
      );
    });
    temporalDays?.forEach((day, index) => {
      temporalCalories.push({
        id: "",
        day_week_id: index + 1,
        total_calories:
          day.length > 0
            ? day.reduce((total, recipe) => {
                return Number(total + parseInt(recipe.total_calories));
              }, 0)
            : 0,
      });
    });
    setCaloriesForDay(temporalCalories);
  };

  useEffect(() => {
    setNutritionalPlanData({
      ...nutritionalPlanData,
      recipe_exchange: foodExchangeItems,
      recipes: scheduleItems,
    });
    separeRecipesWithDays();
  }, [foodExchangeItems, scheduleItems]);

  return (
    <Fragment>
      {isLoading ? (
        <div className="mt-5">
          <Loader />
        </div>
      ) : (
        <Container>
          <thead>
            <tr>
              <th>
                <DateRangeIcon color="gray" />
              </th>
              {scheduleDays.map((day) => {
                return (
                  <th key={day.id}>
                    <span>{day.name}</span>
                  </th>
                );
              })}
              <th>
                <AutorenewOutlinedIcon color="gray" />
              </th>
            </tr>
          </thead>
          <TableBody>
            {scheduleFood.map((hour, foodIndex) => {
              return (
                <tr key={`item-${foodIndex}`}>
                  <td rowspan="1">
                    <span>{hour.name}</span>
                  </td>
                  {scheduleDays.map((day, idx) => {
                    return (
                      <CalendarCell
                        selectedDataElastic={selectedDataElastic}
                        key={idx}
                        cellData={{
                          day,
                          hour,
                        }}
                        isCreatedPlan={isCreatedPlan}
                        setModalState={setModalState}
                        setCellData={setCellData}
                      >
                        {scheduleItems.find(
                          (newItem) =>
                            newItem.day_week_id === day.id &&
                            newItem.food_type === hour.id
                        ) && (
                          <NutritionItem
                            cellData={{
                              day,
                              hour,
                            }}
                            fromNutritionItem={fromNutritionItem}
                            setFromNutritionItem={setFromNutritionItem}
                            selectedRecipe={selectedRecipe}
                            setSelectedRecipe={setSelectedRecipe}
                            setModalState={setModalState}
                            isCreatedPlan={isCreatedPlan}
                            scheduleItems={scheduleItems}
                            setScheduleItems={setScheduleItems}
                            setModalNutritionItemData={
                              setModalNutritionItemData
                            }
                          />
                        )}
                      </CalendarCell>
                    );
                  })}
                  <CalendarCell
                    selectedDataElastic={selectedDataElastic}
                    key={foodIndex}
                    cellData={{
                      day: "foodExchange",
                      hour,
                    }}
                    isFoodExchange={true}
                    setFoodExchangeModalState={setFoodExchangeModalState}
                    isCreatedPlan={isCreatedPlan}
                    setModalState={setModalState}
                    setCellData={setCellData}
                    setModalFoodExchangeData={setModalFoodExchangeData}
                  >
                    {foodExchangeItems.map((exchange, idx) => {
                      if (hour.id === exchange.daily_food_id) {
                        return (
                          <FoodExchangeItem
                            isCreatedPlan={isCreatedPlan}
                            key={idx}
                            exchange={exchange}
                            foodExchangeItems={foodExchangeItems}
                            setFoodExchangeItems={setFoodExchangeItems}
                            setFoodExchangeModalState={
                              setFoodExchangeModalState
                            }
                            setModalFoodExchangeData={setModalFoodExchangeData}
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                  </CalendarCell>
                </tr>
              );
            })}
          </TableBody>
          {caloriesForDay?.length > 0 ? (
            <>
              <th className="mt-3 d-flex justify-content-around">
                <Typography style={{ fontSize: 12 }}>Tot. calorias:</Typography>
              </th>

              {caloriesForDay?.map((day) => (
                <td style={{ textAlign: "center" }}>{day.total_calories}</td>
              ))}
            </>
          ) : null}
        </Container>
      )}

      {/* Assing recipe */}

      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <AssingRecipeModal
            cellData={cellData}
            setCellData={setCellData}
            setIsOpen={setModalState}
            modalState={modalState}
            setScheduleItems={setScheduleItems}
            scheduleItems={scheduleItems}
            setModalState={setModalState}
            setModalNutritionItemData={setModalNutritionItemData}
            modalNutritionItemData={modalNutritionItemData}
            isCreatedPlan={isCreatedPlan}
            selectedRecipe={selectedRecipe}
            setSelectedRecipe={setSelectedRecipe}
            fromNutritionItem={fromNutritionItem}
          />
        }
        isOpen={modalState}
        handleClose={() => {
          setModalNutritionItemData({});
          setCellData({});
          setSelectedRecipe({});
          setModalState(false);
          setFromNutritionItem(false);
        }}
        title={
          isCreatedPlan ? t("NutritionPlan.Info") : t("FormRecipe.AsignBtn")
        }
      />

      {/* Food exchange */}

      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <FoodExchangeModal
            isCreatedPlan={isCreatedPlan}
            setModalFoodExchangeData={setModalFoodExchangeData}
            foodExchangeItems={foodExchangeItems}
            setFoodExchangeItems={setFoodExchangeItems}
            modalFoodExchangeData={modalFoodExchangeData}
            setFoodExchangeModalState={setFoodExchangeModalState}
          />
        }
        isOpen={foodExchangeModalState}
        handleClose={() => {
          setModalFoodExchangeData({});
          setFoodExchangeModalState(false);
        }}
        title={
          isCreatedPlan
            ? t("NutritionPlan.ExchangeDetail")
            : t("NutritionPlan.ExchangeCreate")
        }
      />
    </Fragment>
  );
};

export default ScheduleNutritionWeek;
