import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { Container, DeleteButton } from "./NutritionItem.styles.js";
import Loading from "components/Shared/Loading/Loading";
import CloseIcon from "@material-ui/icons/Close";

//services
import { getRecipeById } from "services/MedicalSoftware/Recipes";

// UI
import Avatar from "@material-ui/core/Avatar";
import { useSelector } from "react-redux";

const NutritionItem = ({
  cellData,
  scheduleItems,
  setScheduleItems,
  setModalNutritionItemData,
  isCreatedPlan,
  setModalState,
  selectedRecipe,
  setFromNutritionItem,
  userType,
}) => {
  const [currentItem, setCurrentItem] = useState({});
  const [dataRecipe, setDataRecipe] = useState({});
  const [load, setLoad] = useState(false);

  const arrayDays = useSelector((state) => state.nutrition.arrayDays);

  const filterItem = (newUUID) => {
    setLoad(true);
    scheduleItems.map((item) => {
      if (
        item.day_week_id === cellData.day.id &&
        item.food_type === cellData.hour.id
      ) {
        getRecipeById(newUUID ? newUUID : item.recipe_uuid).then(({ data }) => {
          if (data && data.data && data.status === "success") {
            setDataRecipe(data.data);
          } else {
            setDataRecipe({});
          }
          setLoad(false);
        });
        setCurrentItem(item);
        currentItem.default_food_type = item.food_type;
      }
    });
  };

  const deleteItem = (e) => {
    e.stopPropagation();
    setScheduleItems(
      scheduleItems.filter((item) => {
        if (
          item.food_type === currentItem.food_type &&
          item.day_week_id === currentItem.day_week_id
        ) {
        } else {
          return item;
        }
      })
    );
  };

  useEffect(() => {
    filterItem();
  }, []);

  useEffect(() => {
    if (
      arrayDays?.some(
        (day) => Number(day.id) === Number(currentItem?.day_week_id)
      ) &&
      selectedRecipe?.prevData?.food_type === currentItem?.food_type
    ) {
      filterItem(selectedRecipe.uuid);
    }
  }, [selectedRecipe, scheduleItems]);

  return (
    <Container
      isVirtualUser={userType === 25}
      onClick={(e) => {
        setModalState(true);
        setFromNutritionItem(true);
        setModalNutritionItemData(dataRecipe);
        dataRecipe.default_food_type = currentItem.food_type;
        dataRecipe.time = currentItem.time;
      }}
    >
      <DeleteButton onClick={(e) => deleteItem(e)}>
        <CloseIcon fontSize="small" />
      </DeleteButton>
      {load ? (
        <Loading />
      ) : (
        <>
          <Avatar src={dataRecipe?.urlImage} alt="Recipe Item" />
          <h1>{dataRecipe?.name}</h1>
          <span>{`${currentItem?.time}`}</span>
        </>
      )}
    </Container>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(NutritionItem);
