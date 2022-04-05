import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { format, addDays } from "date-fns";
// UI
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Card from "@material-ui/core/Card";
import IconButton from "@material-ui/core/IconButton";
import { IconArrowRightMin } from "assets/icons/customize/config";
import Typography from "@material-ui/core/Typography";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import FormControl from "@material-ui/core/FormControl";
import Skeleton from "@material-ui/lab/Skeleton";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";

//Components
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import OptionsRecipesForSelect from "../OptionsRecipesForSelect/OptionsRecipesForSelect";
import AssingRecipeModal from "components/Common/ModuleNutrition/AssingRecipeModal/AssingRecipeModal";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ItemAccordionNutrition from "./ItemAccordionNutrition";
import ControlledAutocompleteChip from "components/Shared/ControlledAutocompleteChip/ControlledAutocompleteChip";
import DatePicker from "components/Shared/DatePicker/DatePicker";

//Internal Depedencies
import {
  generateQueryElasticForNutricion,
  generateQueryElasticForNutritionTemplatesByTags,
} from "hooks/_elasticQuerys";

//Services
import { searchElastic } from "services/_elastic";

// hooks
import { useStyles } from "utils/useStyles";
import { useTheme } from "@material-ui/core/styles";

// styles
import { UserContainer, Container } from "./NutritionLeftPanel.styles";
import Loading from "components/Shared/Loading/Loading";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

const NutritionLeftPanel = ({
  infoAfiliate,
  goalsNutricionData,
  typeAlimentationData,
  timeAlimentationData,
  setNutritionalPlanData,
  nutritionalPlanData,
  scheduleItems,
  setScheduleItems,
  cellData,
  setCellData,
  setIsOpenNutritionalSuggestions,
  initFormDates,
  isCreatedPlan,
  selectedRecipe,
  setSelectedRecipe,
  initialData,
  setFoodExchangeItems,
  selectedDataElastic,
  setSelectedDataElastic,
  isLoading,
}) => {
  const { t } = useTranslation();
  const { handleSubmit, control, watch } = useForm();

  const [startSelectedDate, setStartSelectedDate] = useState(null);
  const [endSelectedDate, setEndSelectedDate] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const [dataRecipesOptions, setDataRecipesOptions] = useState([]);
  const [isViewRecipes, setIsViewRecipes] = useState(false);
  const [modalStateNutritionOpen, setModalStateNutritionOpen] = useState(false);
  const [dataNutritionView, setDataNutritionView] = useState({});

  const [disableButtonFilter, setDisableButtonFilter] = useState(false);
  const [selectedFilterNutritionGoals, setSelectedFilterNutritionGoals] =
    useState([]);
  const [selectedFilterTypeAlimentation, setSelectedFilterTypeAlimentation] =
    useState([]);
  const [selectedFilterTimeFood, setSelectedFilterTimeFood] = useState([]);
  const [loadTemplates, setLoadTemplates] = useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const watchTags = watch("searchTemplatesTag", []);

  useEffect(() => {
    if (
      selectedFilterNutritionGoals.length === 0 &&
      selectedFilterTypeAlimentation.length === 0 &&
      selectedFilterTimeFood.length === 0
    ) {
      setDisableButtonFilter(true);
    } else {
      setDisableButtonFilter(false);
    }
  }, [
    selectedFilterNutritionGoals,
    selectedFilterTypeAlimentation,
    selectedFilterTimeFood,
  ]);

  useEffect(() => {
    if (watchTags && watchTags.length > 0) {
      setIsViewRecipes(false);
      setFilterValue(watchTags);
    }
  }, [watchTags]);

  const setFilterValue = (tags) => {
    setLoadTemplates(true);
    const resultQuery = generateQueryElasticForNutritionTemplatesByTags(tags);
    searchElastic("nutritional_plan", {
      from: 0,
      size: 20,
      query: {
        bool: {
          must: resultQuery,
        },
      },
    }).then(({ data }) => {
      setFetchData(false);
      setIsViewRecipes(true);
      if (data.data && data.data.hits.hits.length > 0) {
        setDataRecipesOptions(data.data.hits.hits);
        setLoadTemplates(false);
      } else {
        setDataRecipesOptions([]);
        setLoadTemplates(false);
      }
    });
  };

  const onSubmit = (value) => {
    setFetchData(true);
    const resultQuery = generateQueryElasticForNutricion(value);
    searchElastic("recipes", {
      query: {
        bool: {
          must: resultQuery,
        },
      },
    })
      .then(({ data }) => {
        setFetchData(false);
        setIsViewRecipes(true);
        if (data.data && data.data.hits.hits.length > 0) {
          setDataRecipesOptions(data.data.hits.hits);
        }
      })
      .catch(() => {
        setFetchData(false);
      });
  };

  const handleStartDateChange = (date) => {
    setStartSelectedDate(date);
    setNutritionalPlanData({
      ...nutritionalPlanData,
      start_date: format(date, "yyyy-MM-dd"),
    });
  };

  const handleEndDateChange = (date) => {
    setEndSelectedDate(date);
    setNutritionalPlanData({
      ...nutritionalPlanData,
      end_date: format(date, "yyyy-MM-dd"),
    });
  };

  const handleSelectionRecipe = (value) => {
    value.isEditRecipe = true;
    setDataNutritionView(value);
    setModalStateNutritionOpen(true);
  };

  const handleSelectionTemplate = (value) => {
    if (value?.rescipes && value?.recipes_exchangue) {
      var arrayTemporal = [];
      var arrayTemporalTwo = [];
      value.rescipes.forEach((item) => {
        let data = {
          recipe_id: item.id,
          day_week_id: Number(item.day_week_id),
          food_type: Number(item.food_type.id),
          time: item.time,
          recipe_uuid: item.uuid,
          total_calories: Number(item.total_calories),
        };
        arrayTemporal.push(data);
      });
      value.recipes_exchangue.forEach((item) => {
        let data = {
          daily_food_id: Number(item.daily_food_id),
          description: item.description,
        };
        arrayTemporalTwo.push(data);
      });
      setFoodExchangeItems(arrayTemporalTwo);
      setScheduleItems(arrayTemporal);
    }
  };

  const handleSelectionTemplateExchange = (value) => {};

  const handleSelectedFilterNutritionGoals = (data) => {
    setSelectedFilterNutritionGoals(data);
  };

  const handleSelectedFilterTypeAlimentation = (data) => {
    setSelectedFilterTypeAlimentation(data);
  };

  const handleSelectedFilterTimeFood = (data) => {
    setSelectedFilterTimeFood(data);
  };

  useEffect(() => {
    if (isCreatedPlan) {
      setStartSelectedDate(addDays(new Date(initFormDates.start_date), 1));
      setEndSelectedDate(addDays(new Date(initFormDates.end_date), 1));
    }
  }, [initFormDates, isCreatedPlan]);

  return (
    <Container>
      <ShardComponentModal
        fullWidth
        maxWidth="sm"
        {...modalProps}
        body={
          <AssingRecipeModal
            selectedRecipe={selectedRecipe}
            setSelectedRecipe={setSelectedRecipe}
            cellData={cellData}
            setCellData={setCellData}
            setIsOpen={modalStateNutritionOpen}
            setScheduleItems={setScheduleItems}
            scheduleItems={scheduleItems}
            setModalState={setModalStateNutritionOpen}
            modalNutritionItemData={dataNutritionView}
          />
        }
        isOpen={modalStateNutritionOpen}
        handleClose={() => {
          setCellData({});
          setModalStateNutritionOpen(false);
        }}
        title={t("FormRecipe.AsignBtn")}
      />
      {isLoading ? (
        <div>
          <Skeleton animation="wave" height={60} />
          <Skeleton animation="wave" height={60} />
          <Skeleton animation="wave" height={60} />
          <Skeleton animation="wave" height={60} />
        </div>
      ) : (
        <>
          {infoAfiliate.length === 0 ? (
            <div>
              <Typography style={{ fontSize: 15 }}>
                {t("NutritionTitle.UserPanel")}
              </Typography>
              <ItemAccordionNutrition data={initialData} />
            </div>
          ) : (
            <>
              <UserContainer>
                <img
                  src={
                    "https://d500.epimg.net/cincodias/imagenes/2016/07/04/lifestyle/1467646262_522853_1467646344_noticia_normal.jpg"
                  }
                  alt="Profile User"
                />
                <div>
                  <h2>
                    {infoAfiliate?.first_name} {infoAfiliate?.last_name}
                  </h2>
                  <span>{infoAfiliate?.document_number}</span>
                </div>
              </UserContainer>

              <Card
                className={classes.cardSuggestions}
                onClick={() => setIsOpenNutritionalSuggestions(true)}
              >
                <VerifiedUserIcon />
                <Typography variant="h1">
                  {t("NutritionSuggestions.Recomendations")}
                </Typography>
                <IconButton className="">
                  <IconArrowRightMin
                    color={theme.palette.black.main}
                  ></IconArrowRightMin>
                </IconButton>
              </Card>

              <h1>{t("DetailNutritionalPlan.description")}</h1>
              <p>{t("DetailNutritionalPlan.SelectDate")}</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                  container
                  justifyContent="space-around"
                  style={{ marginBottom: 20 }}
                >
                  <FormControl style={{ marginBottom: 10 }}>
                    <DatePicker
                      id="outlined-name-planTraininig"
                      placeholder="Fecha inicio"
                      value={startSelectedDate}
                      onChange={(data) => handleStartDateChange(data)}
                    />
                  </FormControl>
                  <FormControl>
                    <DatePicker
                      id="outlined-name-planTraininig"
                      placeholder="Fecha final"
                      value={endSelectedDate}
                      onChange={(data) => handleEndDateChange(data)}
                    />
                  </FormControl>
                </Grid>
              </MuiPickersUtilsProvider>
            </>
          )}
          <>
            <h1>
              {infoAfiliate.length === 0
                ? t("NutritionPlan.FilterRecipes")
                : t("ModuleNutrition.FilterTemplate")}
            </h1>
            <p>{t("NutritionPlan.SelectSearchParams")}</p>

            <div className="col-12 m-auto w-100">
              {Object.keys(infoAfiliate).length > 0 ? (
                <>
                  <ControlledAutocompleteChip
                    control={control}
                    options={[]}
                    name="searchTemplatesTag"
                    className="mt-4"
                  />
                  <p>{t("NutritionPlan.ParamsSearch")}</p>
                  {loadTemplates ? (
                    <Loading />
                  ) : (
                    <OptionsRecipesForSelect
                      onBack={() => setIsViewRecipes(false)}
                      options={dataRecipesOptions}
                      handleSelectionRecipe={handleSelectionRecipe}
                      handleSelectionTemplate={handleSelectionTemplate}
                      handleSelectionTemplateExchange={
                        handleSelectionTemplateExchange
                      }
                      infoAfiliate={infoAfiliate}
                      setSelectedDataElastic={setSelectedDataElastic}
                      selectedDataElastic={selectedDataElastic}
                    />
                  )}
                </>
              ) : null}
            </div>
            {isViewRecipes && infoAfiliate.length === 0 ? (
              <OptionsRecipesForSelect
                onBack={() => setIsViewRecipes(false)}
                options={dataRecipesOptions}
                handleSelectionRecipe={handleSelectionRecipe}
                handleSelectionTemplate={handleSelectionTemplate}
                handleSelectionTemplateExchange={
                  handleSelectionTemplateExchange
                }
                infoAfiliate={infoAfiliate}
                setSelectedDataElastic={setSelectedDataElastic}
                selectedDataElastic={selectedDataElastic}
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* selects */}
                <div className="row">
                  {infoAfiliate.length === 0 ? (
                    <div className="col-12 m-auto w-100">
                      <ControlledAutocomplete
                        control={control}
                        disabled={initialData.isViewTemplate}
                        name="nutrition_goals"
                        handleChange={handleSelectedFilterNutritionGoals}
                        options={goalsNutricionData?.data || []}
                        getOptionLabel={(option) => `${option.name}`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("ModuleNutrition.goalNutrition")}
                            variant="outlined"
                            margin="normal"
                          />
                        )}
                        defaultValue={selectedFilterNutritionGoals}
                      />
                    </div>
                  ) : null}
                  {infoAfiliate.length === 0 ? (
                    <div className="col-12 m-auto w-100">
                      <ControlledAutocomplete
                        control={control}
                        name="type_alimentations_id"
                        handleChange={handleSelectedFilterTypeAlimentation}
                        disabled={initialData.isViewTemplate}
                        options={typeAlimentationData?.data || []}
                        getOptionLabel={(option) => `${option.name}`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("FormRecipe.SelectFeedingType")}
                            variant="outlined"
                            margin="normal"
                          />
                        )}
                        defaultValue={selectedFilterTypeAlimentation}
                      />
                    </div>
                  ) : null}

                  {infoAfiliate.length === 0 ? (
                    <div className="col-12 m-auto w-100">
                      <ControlledAutocomplete
                        control={control}
                        name="food_type"
                        handleChange={handleSelectedFilterTimeFood}
                        disabled={initialData.isViewTemplate}
                        options={timeAlimentationData?.data || []}
                        getOptionLabel={(option) => `${option.name}`}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t("FormRecipe.SelectTimeAlimentation")}
                            variant="outlined"
                            margin="normal"
                          />
                        )}
                        defaultValue={selectedFilterTimeFood}
                      />
                    </div>
                  ) : null}
                  {infoAfiliate.length === 0 ? (
                    <div className="col-12 mt-2 d-flex justify-content-center p-5">
                      <ButtonSave
                        disabled={disableButtonFilter}
                        loader={fetchData}
                        text={t("Btn.filter")}
                      />
                    </div>
                  ) : null}
                </div>
              </form>
            )}
          </>
        </>
      )}
    </Container>
  );
};

export default NutritionLeftPanel;
