import React, { useState } from "react";
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

//COMPONENTS
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import AssingRecipeData from "../AssingRecipeModal/AssingRecipeData";

//UTILS
import { useStyles } from "utils/useStyles";

const ItemResumeNutritionTemplate = ({ setIsOpen, data }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [clickedRecipe, setClickedRecipe] = useState();
  const [openModal, setOpenModal] = useState(false);

  //header tab panel
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`wrapped-tabpanel-${index}`}
        aria-labelledby={`wrapped-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `wrapped-tab-${index}`,
      "aria-controls": `wrapped-tabpanel-${index}`,
    };
  }

  const handleChange = (events, newValue) => {
    setValue(newValue);
  };

  const onClickRecipe = (recipe) => {
    setClickedRecipe(recipe);
    setOpenModal(true);
  };

  return (
    <div>
      <div className="row d-flex align-items-center mb-4 m-0">
        <div className="col">
          <Typography variant="h5">{data.name}</Typography>
        </div>
        <div className="col-1" style={{ marginRight: "12px" }}>
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>
      <div className="row mb-3 m-0">
        <div className="col-5">
          <Typography className={classes.fontObservation}>
            {t("ListNutritionGoals.NutritionGoal")}
          </Typography>
          <Typography variant="body2">{data.goal_name}</Typography>
          <Typography className={classes.fontObservation}>
            {t("NutritionPlan.FormFoodItem.SelectTypeFood")}
          </Typography>
          <Typography variant="body2">{data.type_alimentation_name}</Typography>
        </div>
        <div className="col-7">
          <div className={classes.boxObservationTwo}>
            <Typography className={classes.fontObservation}>
              {t("WeeklyNutrition.InputDescription")}
            </Typography>
            <Typography variant="body2">{data.description}</Typography>
          </div>
        </div>
      </div>
      <AppBar position="static" className={`${classes.appBar}`}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs example"
          variant="scrollable"
        >
          <Tab value={0} label={"Lunes"} {...a11yProps(0)} />
          <Tab value={1} label={"Martes"} {...a11yProps(1)} />
          <Tab value={2} label={"Miercoles"} {...a11yProps(2)} />
          <Tab value={3} label={"Jueves"} {...a11yProps(3)} />
          <Tab value={4} label={"Viernes"} {...a11yProps(4)} />
          <Tab value={5} label={"Sabado"} {...a11yProps(5)} />
          <Tab value={6} label={"Domingo"} {...a11yProps(6)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} key={`tab-indexdetailsession-` + 0}>
        <div className="row m-0">
          {data &&
            data.rescipes.map((item) => {
              if (item.day_week_id === "1") {
                return (
                  <div className="col-3">
                    <div
                      className={`${classes.boxObservationTwo} pointer`}
                      onClick={() => onClickRecipe(item)}
                    >
                      <Typography className={classes.fontCardSchedule}>
                        {item.food_type.name}
                      </Typography>
                      <Typography className={classes.fontGray}>
                        {item.name}
                      </Typography>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} key={`tab-indexdetailsession-` + 1}>
        <div className="row m-0">
          {data &&
            data.rescipes.map((item) => {
              if (item.day_week_id === "2") {
                return (
                  <div className="col-3">
                    <div
                      className={`${classes.boxObservationTwo} pointer`}
                      onClick={() => onClickRecipe(item)}
                    >
                      <Typography className={classes.fontCardSchedule}>
                        {item.food_type.name}
                      </Typography>
                      <Typography className={classes.fontGray}>
                        {item.name}
                      </Typography>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2} key={`tab-indexdetailsession-` + 2}>
        <div className="row m-0">
          {data &&
            data.rescipes.map((item) => {
              if (item.day_week_id === "3") {
                return (
                  <div className="col-3">
                    <div
                      className={`${classes.boxObservationTwo} pointer`}
                      onClick={() => onClickRecipe(item)}
                    >
                      <Typography className={classes.fontCardSchedule}>
                        {item.food_type.name}
                      </Typography>
                      <Typography className={classes.fontGray}>
                        {item.name}
                      </Typography>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </TabPanel>
      <TabPanel value={value} index={3} key={`tab-indexdetailsession-` + 3}>
        <div className="row m-0">
          {data &&
            data.rescipes.map((item) => {
              if (item.day_week_id === "4") {
                return (
                  <div className="col-3">
                    <div
                      className={`${classes.boxObservationTwo} pointer`}
                      onClick={() => onClickRecipe(item)}
                    >
                      <Typography className={classes.fontCardSchedule}>
                        {item.food_type.name}
                      </Typography>
                      <Typography className={classes.fontGray}>
                        {item.name}
                      </Typography>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </TabPanel>
      <TabPanel value={value} index={4} key={`tab-indexdetailsession-` + 4}>
        <div className="row m-0">
          {data &&
            data.rescipes.map((item) => {
              if (item.day_week_id === "5") {
                return (
                  <div className="col-3">
                    <div
                      className={`${classes.boxObservationTwo} pointer`}
                      onClick={() => onClickRecipe(item)}
                    >
                      <Typography className={classes.fontCardSchedule}>
                        {item.food_type.name}
                      </Typography>
                      <Typography className={classes.fontGray}>
                        {item.name}
                      </Typography>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </TabPanel>
      <TabPanel value={value} index={5} key={`tab-indexdetailsession-` + 5}>
        <div className="row m-0">
          {data &&
            data.rescipes.map((item) => {
              if (item.day_week_id === "6") {
                return (
                  <div className="col-3">
                    <div
                      className={`${classes.boxObservationTwo} pointer`}
                      onClick={() => onClickRecipe(item)}
                    >
                      <Typography className={classes.fontCardSchedule}>
                        {item.food_type.name}
                      </Typography>
                      <Typography className={classes.fontGray}>
                        {item.name}
                      </Typography>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </TabPanel>
      <TabPanel value={value} index={6} key={`tab-indexdetailsession-` + 6}>
        <div className="row m-0">
          {data &&
            data.rescipes.map((item) => {
              if (item.day_week_id === "7") {
                return (
                  <div className="col-3">
                    <div
                      className={`${classes.boxObservationTwo} pointer`}
                      onClick={() => onClickRecipe(item)}
                    >
                      <Typography className={classes.fontCardSchedule}>
                        {item.food_type.name}
                      </Typography>
                      <Typography className={classes.fontGray}>
                        {item.name}
                      </Typography>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
        </div>
      </TabPanel>
      <ShardComponentModal
          handleClose={() => setOpenModal(false)}
          body={<AssingRecipeData selectedRecipe={clickedRecipe} />}
          isOpen={openModal}
          fullWidth
          width='sm'
        />
    </div>
  );
};

export default ItemResumeNutritionTemplate;
