import React, { useEffect } from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { IconEditItem } from "assets/icons/customize/config";
import { useTranslation } from "react-i18next";

//utils
import { casteMapNameArrayForString } from "utils/misc";
import Styled from "@emotion/styled";

//services
import { getRecipeById } from "services/MedicalSoftware/Recipes";

export const EditButtonContainer = Styled.div`
    cursor: pointer;
`;

const useStyles = makeStyles((theme) => ({
  container: {
    background: "#F3F3F3",
    borderRadius: 20,
    padding: 30,
  },
}));

const AssingRecipeData = ({
  selectedRecipe,
  setEditRecipeModal,
  isCreatedPlan,
  id_recipe,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  useEffect(() => {
    getRecipeById(id_recipe).then(({ data }) => {
      if (data && data.data && data.source) {
        console.log(data.data);
      }
    });
  }, []);

  return (
    <>
      <div className={`${classes.container} mb-3`}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Avatar src={selectedRecipe?.urlImage} className="me-3" />
            <Typography className="my-3" variant="body1">
              <strong>{selectedRecipe.name}</strong>
            </Typography>
          </div>
          {selectedRecipe.name && (
            <EditButtonContainer onClick={() => setEditRecipeModal(true)}>
              <IconEditItem color="gray" width="25" height="25"></IconEditItem>
            </EditButtonContainer>
          )}
        </div>
        <div className="d-flex justify-content-between">
          <div className="col-6 d-flex flex-column">
            <Typography variant="p">{t("FormRecipe.GoalRecipe")}</Typography>
            <Typography variant="p">
              {t("FormRecipe.SelectFoodType")}
            </Typography>
            <Typography variant="p">
              {t("FormRecipe.SelectFoodTime")}
            </Typography>
            <Typography variant="p">{t("FormRecipe.TotalCalories")}</Typography>
          </div>
          <div className="col-6 d-flex flex-column" style={{}}>
            <Typography variant="body2" style={{ fontSize: 11 }}>
              {casteMapNameArrayForString(selectedRecipe.nutrition_goals)}
            </Typography>
            <Typography variant="p" style={{ fontSize: 11 }}>
              {casteMapNameArrayForString(
                selectedRecipe?.type_alimentations_id
              )}
            </Typography>
            <Typography variant="p" style={{ fontSize: 11 }}>
              {selectedRecipe?.food_type
                ? casteMapNameArrayForString(selectedRecipe?.food_type)
                : "-"}
            </Typography>
            <Typography variant="p">
              {selectedRecipe?.total_calories}
            </Typography>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center my-2">
          <Typography className="my-3" variant="body1">
            <strong>{t("FormRecipe.Ingredients")}</strong>
          </Typography>
        </div>
        {selectedRecipe &&
          selectedRecipe.ingredient?.map((item) => (
              <div className="col-6 d-flex flex-column">
            <div className="d-flex justify-content-between">
                <Typography variant="p">{item?.food?.name}</Typography>
              </div>
              <div className="col-6 d-flex flex-column" style={{}}>
                <Typography variant="p">{`${item?.weight_value} ${item?.weight_unit_name}`}</Typography>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default AssingRecipeData;
