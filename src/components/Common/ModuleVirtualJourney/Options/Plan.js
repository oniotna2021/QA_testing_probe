import React, { useState } from "react";
import { useParams } from "react-router-dom";

// UI
import { Typography } from "@material-ui/core";

// components
import PlanCardItem from "components/Shared/PlanCardItem/PlanCardItem";
import Loading from "components/Shared/Loading/Loading";

// hooks
import { useGetUserPlans } from "hooks/CachedServices/VirtualJourney/getUserPlans";

// styles
import styled from "@emotion/styled";

// translate
import { useTranslation } from "react-i18next";

const TagContainer = styled.div`
  padding: 5px 10px 5px 10px;
  cursor: pointer;
  border-radius: 10px;
  margin-right: 10px;
  background-color: ${({ isActive }) => (isActive ? "#3C3C3B" : "#ECECEB")};
  color: ${({ isActive }) => (isActive ? "white" : "black")};
`;

const Plan = () => {
  const { t } = useTranslation();
  const [filterState, setFilterState] = useState(0);
  const { user_id } = useParams();

  const { swrData, isLoading } = useGetUserPlans(user_id);

  const plansNumber =
    swrData?.trainingPlans?.length === 0 &&
    swrData?.nutritionalPlans?.length === 0;

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Typography variant="h6" className="mb-3">
          {t("Plan.ModuleVirtualJourneyPlanAssigned")}
        </Typography>
        <div className="d-flex mb-3">
          <TagContainer
            onClick={() => setFilterState(0)}
            isActive={filterState === 0}
          >
            <Typography variant="body2">
              {t("ProductsList.FilterOptions.Total")}
            </Typography>
          </TagContainer>

          <TagContainer
            onClick={() => setFilterState(1)}
            isActive={filterState === 1}
          >
            <Typography variant="body2">
              {t("Plan.ModuleVirtualJourneyNutri")}
            </Typography>
          </TagContainer>

          <TagContainer
            onClick={() => setFilterState(2)}
            isActive={filterState === 2}
          >
            <Typography variant="body2">
              {t("FormEditInformation.labelTraining")}
            </Typography>
          </TagContainer>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {filterState === 0 && (
            <>
              {!plansNumber ? (
                <>
                  {swrData?.nutritionalPlans?.map((nutritionalPlan) => (
                    <PlanCardItem
                      key={nutritionalPlan.nutritional_plan_id}
                      name={nutritionalPlan.nutritional_plan_name}
                      nutritional_plan_id={nutritionalPlan.nutritional_plan_id}
                      user_id={nutritionalPlan.user_id}
                      date={nutritionalPlan.start_date}
                      isNutrition
                    />
                  ))}

                  {swrData?.trainingPlans?.map((trainingPlan) => (
                    <PlanCardItem
                      key={trainingPlan.id}
                      name={trainingPlan.name}
                      trainer={trainingPlan.trainer_name}
                      date={trainingPlan.start_date}
                      trainingPlanData={{ ...trainingPlan }}
                    />
                  ))}
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "gray",
                    marginTop: 100,
                  }}
                >
                  <span>{t("Plan.ModuleVrtualJourneyNotPlans")}</span>
                </div>
              )}
            </>
          )}

          {filterState === 1 && (
            <>
              {swrData?.nutritionalPlans?.length > 0 ? (
                swrData?.nutritionalPlans?.map((nutritionalPlan) => (
                  <PlanCardItem
                    key={nutritionalPlan.nutritional_plan_id}
                    name={nutritionalPlan.nutritional_plan_name}
                    nutritional_plan_id={nutritionalPlan.nutritional_plan_id}
                    user_id={nutritionalPlan.user_id}
                    isNutrition
                  />
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "gray",
                    marginTop: 100,
                  }}
                >
                  <span>{t("Plan.ModuleVrtualJourneyNotPlansNutrition")}</span>
                </div>
              )}
            </>
          )}

          {filterState === 2 && (
            <>
              {swrData?.trainingPlans?.length > 0 ? (
                swrData?.trainingPlans?.map((trainingPlan) => (
                  <PlanCardItem
                    key={trainingPlan.id}
                    name={trainingPlan.name}
                    date={trainingPlan.start_date}
                    trainer={trainingPlan.trainer_name}
                    trainingPlanData={{ ...trainingPlan }}
                  />
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "gray",
                    marginTop: 100,
                  }}
                >
                  <span>{t("Plan.ModuleVirtualJourneyNotPlanTraining")}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Plan;
