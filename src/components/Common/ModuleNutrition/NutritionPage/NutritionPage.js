/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import { useHistory } from "react-router-dom";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

//UI
import Button from "@material-ui/core/Button";

// components
import WeekCalendar from "components/Common/ModuleNutrition/WeekCalendar/WeekCalendar";
import NutritionLeftPanel from "components/Common/ModuleNutrition/NutritionLeftPanel/NutritionLeftPanel";
import NutritionalSuggestions from "components/Shared/ItemNutritionalSuggestions/ItemNutritionalSuggestions";
import ChangeNameModal from "./ChangeNameModal";

//Hooks
import { useFecthDataRecursibeNutricion } from "hooks/fetchDataSelectForNutricion";

//internal dependencies
import { setDataReusableForNutricion } from "modules/common";
import { setNutrition } from "modules/nutrition";

//service
import { getAfiliateForId } from "services/affiliates";
import {
  getNutritionalPlanById,
  postNutritionalPlanTemplate,
  putNutritionTemplateBase,
} from "services/MedicalSoftware/NutritionalPlan";

// styles
import { Container, LetftPanel, RightPanel } from "./NutritionPage.styles.js";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//utils
import { mapErrors, infoToast, formatDateToHHMMSS } from "utils/misc.js";
import Swal from "sweetalert2";

import { format } from "date-fns";

/*Pagina para adminstrar nutricion*/

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "white",
  fullWidth: true,
  width: "sm",
};

const NutritionPage = ({
  setDataReusableForNutricion,
  setNutrition,
  goalsNutricionData,
  typeAlimentationData,
  timeAlimentationData,
  proffesionalId,
  initialData,
}) => {
  const { t } = useTranslation();
  let { user_id, plan_id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  //Seteo de estados globales para nutricion
  setDataReusableForNutricion(useFecthDataRecursibeNutricion());
  const [infoAfiliate, setInfoAfiliate] = useState({});
  const [loadFetch, setLoadFetch] = useState(false);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [foodExchangeItems, setFoodExchangeItems] = useState([]);
  const [cellData, setCellData] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState({});
  const [isOpenNutritionalSuggestions, setIsOpenNutritionalSuggestions] =
    useState(false);
  const [changeNameModal, setChangeNameModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initFormDates, setInitFormDates] = useState({
    end_date: format(new Date(), "yyyy-MM-dd"),
    start_date: format(new Date(), "yyyy-MM-dd"),
  });
  const [selectedDataElastic, setSelectedDataElastic] = useState({});
  const [currentPlanName, setcurrentPlanName] = useState();
  const [caloriesForDay, setCaloriesForDay] = useState([]);

  const [nutritionalPlanData, setNutritionalPlanData] = useState({
    user_id: user_id,
    medical_professional_id: proffesionalId,
    quotes_id: 1,
    nutritional_plan_uuid: "",
  });

  //GUARDAR PLAN NUTRICIONAL DESDE CERO A UN USUARIO
  const savePlanWithNameChanged = () => {
    if (currentPlanName && scheduleItems.length > 0) {
      setLoadFetch(true);
      let dataSubmit = {
        name: currentPlanName.name
          ? currentPlanName.name
          : nutritionalPlanData.name,
        type_alimentation_id: selectedDataElastic?.type_alimentation_id
          ? Number(selectedDataElastic?.type_alimentation_id)
          : currentPlanName.type_alimentation_id
          ? currentPlanName.type_alimentation_id
          : nutritionalPlanData.type_alimentation_id,
        goal_id: selectedDataElastic?.goal_id
          ? Number(selectedDataElastic?.goal_id)
          : currentPlanName.goal_id
          ? currentPlanName.goal_id
          : nutritionalPlanData.goal_id,
        description: selectedDataElastic?.description
          ? selectedDataElastic.description
          : currentPlanName.description
          ? currentPlanName.description
          : nutritionalPlanData.description,
        recipes: scheduleItems,
        recipe_exchange: foodExchangeItems,
        start_date: nutritionalPlanData.start_date,
        end_date: nutritionalPlanData.end_date,
        user_id: user_id,
        medical_professional_id: proffesionalId,
        calories_day_week: caloriesForDay,
      };
      postNutritionalPlanTemplate(dataSubmit, true)
        .then(({ data }) => {
          if (data && data.status === "success") {
            Swal.fire({
              title: data.message,
              icon: "success",
            });
            setTimeout(() => {
              history.push("/afiliates");
            }, 250);
          } else {
            Swal.fire({
              title: mapErrors(data),
              icon: "error",
            });
          }
          setcurrentPlanName(null);
          setLoadFetch(false);
        })
        .catch(({ err }) => {
          setLoadFetch(false);
          Swal.fire({
            title: mapErrors(err),
            icon: "error",
          });
        });
    }
  };

  useEffect(() => {
    if (currentPlanName) {
      savePlanWithNameChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlanName]);

  useEffect(() => {
    (async () => {
      await getAfiliateForId(user_id)
        .then(({ data }) => {
          setInfoAfiliate(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  }, [user_id]);

  const fetchNutritionalPlan = async () => {
    const res = await getNutritionalPlanById(plan_id, user_id);

    const recipes = res?.data?.data.recipes;
    const end_date = res?.data?.data?.users?.end_date;
    const start_date = res?.data?.data?.users?.start_date;
    const recipe_exchange = res?.data?.data?.users?.recipe_exchange;
    const dataNutritionPlan = res?.data.data;

    setInitFormDates({
      end_date: dataNutritionPlan.end_date,
      start_date: dataNutritionPlan.start_date,
    });
    setcurrentPlanName(dataNutritionPlan?.name);
    setNutritionalPlanData({
      ...nutritionalPlanData,
      name: dataNutritionPlan.name,
      goal_id: dataNutritionPlan.goal_id,
      description: dataNutritionPlan.description,
      type_alimentation_id: dataNutritionPlan.type_alimentation_id,
      start_date: dataNutritionPlan.users.start_date,
      end_date: dataNutritionPlan.users.end_date,
    });

    if (recipes) {
      recipes.map((recipe) => {
        return setScheduleItems((prevState) => [
          ...prevState,
          {
            recipe_id: recipe.id,
            day_week_id: recipe.day_week_id,
            food_type: recipe.food_type.id,
            time: formatDateToHHMMSS(recipe.time),
            recipe_uuid: recipe.uuid,
            total_calories: Number(recipe.total_calories),
          },
        ]);
      });

      setFoodExchangeItems(recipe_exchange);

      setNutritionalPlanData({
        ...nutritionalPlanData,
        end_date,
        start_date,
      });

      setInitFormDates({
        end_date,
        start_date,
      });
    }
  };

  useEffect(() => {
    if (Object.keys(initialData).length === 0 && Number(user_id) === 0) {
      history.push("/recipes/nutrition");
    }
    if (initialData?.isCreateTemplate) {
      initialData?.recipes?.map((recipe) => {
        return setScheduleItems((prevState) => [
          ...prevState,
          {
            recipe_id: Number(recipe.id),
            day_week_id: Number(recipe.day_week_id),
            food_type: Number(recipe.food_type.id),
            time: formatDateToHHMMSS(recipe.time),
            recipe_uuid: recipe.uuid,
            total_calories: Number(recipe.total_calories),
          },
        ]);
      });
      initialData?.recipe_exchange?.map((exchange) => {
        return setFoodExchangeItems((prevState) => [
          ...prevState,
          {
            daily_food_id: Number(exchange.daily_food_id),
            description: exchange.description,
          },
        ]);
      });
    } else {
      setNutrition({});
      if (plan_id) {
        fetchNutritionalPlan();
      }
    }
  }, []);

  const submitNutritionPlan = () => {
    setLoadFetch(true);
    //GUARDAR PLANTILLA DE NUTRICIÓN BASE
    if (infoAfiliate.length === 0) {
      setLoadFetch(true);
      let dataSubmit = {
        uuid: initialData.uuid,
        name: initialData.name,
        type_alimentation_id: initialData?.type_alimentation[0]?.id,
        goal_id: initialData?.goal[0]?.id,
        description: initialData?.description,
        recipes: nutritionalPlanData?.recipes,
        recipe_exchange: nutritionalPlanData?.recipe_exchange,
        calories_day_week: caloriesForDay,
      };
      if (initialData.uuid) {
        putNutritionTemplateBase(dataSubmit)
          .then(({ data }) => {
            setLoadFetch(false);
            if (data && data.status === "success") {
              Swal.fire({
                title: data.message,
                icon: "success",
              });
              setTimeout(() => {
                history.push("/recipes/nutrition");
              }, 250);
            } else {
              Swal.fire({
                title: mapErrors(data),
                icon: "error",
              });
            }
          })
          .catch(({ err }) => {
            setLoadFetch(false);
            Swal.fire({
              title: mapErrors(err),
              icon: "error",
            });
          });
      } else {
        postNutritionalPlanTemplate(dataSubmit)
          .then(({ data }) => {
            setLoadFetch(false);
            if (data && data.status === "success") {
              Swal.fire({
                title: data.message,
                icon: "success",
              });
              setTimeout(() => {
                history.push("/recipes/nutrition");
              }, 250);
            } else {
              Swal.fire({
                title: mapErrors(data),
                icon: "error",
              });
            }
          })
          .catch(({ err }) => {
            setLoadFetch(false);
            Swal.fire({
              title: mapErrors(err),
              icon: "error",
            });
          });
      }
      if (!nutritionalPlanData.recipes.length > 0) {
        enqueueSnackbar(t("DetailNutritionalPlan.RecipeError"), infoToast);
      }

      //GUARDAR PLANTILLA PERSONALIZADA
    } else {
      if (Object.keys(selectedDataElastic).length > 0) {
        //DESDE SELECCIÓN DE PLANTILLA BASE
        let dataSubmit = {
          name:
            selectedDataElastic && selectedDataElastic?.name
              ? selectedDataElastic?.name
              : currentPlanName?.name,
          type_alimentation_id: selectedDataElastic?.type_alimentation_id
            ? Number(selectedDataElastic?.type_alimentation_id)
            : currentPlanName.type_alimentation_id,
          goal_id: selectedDataElastic?.goal_id
            ? Number(selectedDataElastic?.goal_id)
            : currentPlanName.goal_id,
          description: selectedDataElastic?.description
            ? selectedDataElastic.description
            : currentPlanName.description,
          recipes: scheduleItems,
          recipe_exchange: foodExchangeItems,
          start_date: nutritionalPlanData.start_date,
          end_date: nutritionalPlanData.end_date,
          user_id: user_id,
          medical_professional_id: proffesionalId,
          calories_day_week: caloriesForDay,
          parent_id: selectedDataElastic.id,
        };
        postNutritionalPlanTemplate(dataSubmit, true)
          .then(({ data }) => {
            setLoadFetch(false);
            if (data && data.status === "success") {
              Swal.fire({
                title: data.message,
                icon: "success",
              });
              setTimeout(() => {
                history.push("/afiliates");
              }, 250);
            } else {
              Swal.fire({
                title: mapErrors(data),
                icon: "error",
              });
            }
          })
          .catch(({ err }) => {
            setLoadFetch(false);
            Swal.fire({
              title: mapErrors(err),
              icon: "error",
            });
          });
      } else {
        setLoadFetch(false);
        //PLANTILLA DESDE CERO
        if (
          !currentPlanName &&
          nutritionalPlanData.start_date &&
          nutritionalPlanData.end_date &&
          scheduleItems.length > 0
        ) {
          setLoadFetch(false);
          setChangeNameModal(true);
        } else {
          savePlanWithNameChanged();
        }
      }
      if (!nutritionalPlanData.recipes.length > 0) {
        enqueueSnackbar(t("DetailNutritionalPlan.RecipeError"), infoToast);
      }
      if (!nutritionalPlanData.start_date) {
        enqueueSnackbar(t("DetailNutritionalPlan.StartDateError"), infoToast);
      }
      if (!nutritionalPlanData.end_date) {
        enqueueSnackbar(t("DetailNutritionalPlan.EndDateError"), infoToast);
      }
    }
  };

  return (
    <Container>
      <LetftPanel>
        <NutritionLeftPanel
          infoAfiliate={infoAfiliate}
          goalsNutricionData={goalsNutricionData}
          typeAlimentationData={typeAlimentationData}
          timeAlimentationData={timeAlimentationData}
          setNutritionalPlanData={setNutritionalPlanData}
          nutritionalPlanData={nutritionalPlanData}
          scheduleItems={scheduleItems}
          setScheduleItems={setScheduleItems}
          setCellData={setCellData}
          cellData={cellData}
          initFormDates={initFormDates}
          setIsOpenNutritionalSuggestions={setIsOpenNutritionalSuggestions}
          isCreatedPlan={plan_id}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          initialData={initialData}
          setFoodExchangeItems={setFoodExchangeItems}
          setSelectedDataElastic={setSelectedDataElastic}
          selectedDataElastic={selectedDataElastic}
          isLoading={isLoading}
        />
      </LetftPanel>
      <RightPanel>
        <WeekCalendar
          foodExchangeItems={foodExchangeItems}
          setFoodExchangeItems={setFoodExchangeItems}
          userId={user_id}
          isLoading={isLoading}
          scheduleItems={scheduleItems}
          setScheduleItems={setScheduleItems}
          setNutritionalPlanData={setNutritionalPlanData}
          nutritionalPlanData={nutritionalPlanData}
          setCellData={setCellData}
          cellData={cellData}
          setIsLoading={setIsLoading}
          isCreatedPlan={plan_id}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          selectedDataElastic={selectedDataElastic}
          initialData={initialData}
          setCaloriesForDay={setCaloriesForDay}
          caloriesForDay={caloriesForDay}
        />

        <div className="w-100 d-flex justify-content-between mt-5 align-items-center">
          <Button
            onClick={() => {
              setScheduleItems([]);
              setFoodExchangeItems([]);
              setSelectedDataElastic({});
            }}
          >
            {t("ModuleNutrition.ClearSchedule")}
          </Button>
          <ButtonSave
            loader={loadFetch}
            text={t("Btn.save")}
            disabled={initialData.isViewTemplate}
            onClick={submitNutritionPlan}
          />
        </div>
      </RightPanel>

      {/* Modal recomendaciones nutricionales */}

      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <NutritionalSuggestions
            userName={infoAfiliate.first_name}
            setIsOpen={setIsOpenNutritionalSuggestions}
            userDocument={infoAfiliate.document_number}
            userId={user_id}
          />
        }
        isOpen={isOpenNutritionalSuggestions}
        handleClose={() => setIsOpenNutritionalSuggestions(false)}
      />

      {/* Modal cambiar nombre de plan */}

      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <ChangeNameModal
            defaultValues={selectedDataElastic}
            setcurrentPlanName={setcurrentPlanName}
            setChangeNameModal={setChangeNameModal}
            isLoading={loadFetch}
          />
        }
        isOpen={changeNameModal}
        handleClose={() => setChangeNameModal(false)}
        title={t("NutritionalPage.ChangeName")}
      />
    </Container>
  );
};

const mapStateToProps = ({ common, auth, nutrition }) => ({
  goalsNutricionData: common.goalsNutricion,
  typeAlimentationData: common.typeAlimentation,
  timeAlimentationData: common.timeAlimentation,
  proffesionalId: auth.userId,
  initialData: nutrition.data,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setDataReusableForNutricion,
      setNutrition,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NutritionPage);
