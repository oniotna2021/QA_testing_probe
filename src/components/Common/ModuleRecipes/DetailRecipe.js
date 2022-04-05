import { useState } from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

//utils
import { useStyles } from "utils/useStyles";
import { casteMapNameArrayForString } from "utils/misc";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//components
import FormRecipe from "./FormRecipe";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormDeletePlanItem from "../ModuleClinicalHistory/Nutrition/NutritionPlan/FormDeletePlanItem";
import ListIngredients from "./ListIngredients";

//icons
import { IconEditItem } from "assets/icons/customize/config";

const DetailRecipe = ({
  setIsEdit,
  isEdit,
  data,
  load,
  setLoad,
  setExpanded,
  ingredients,
  setIngredients,
  permissionsActions,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const handleChangeIsEdit = () => {
    setIsEdit(true);
  };

  // const handleChangeOpenDelete = () => {
  //   setIsOpen(true);
  // };
  return (
    <div className="row">
      {isEdit ? (
        <FormRecipe
          dataItem={data}
          isEdit={true}
          load={load}
          setLoad={setLoad}
          setExpanded={setExpanded}
        />
      ) : (
        <>
          <div className="col-1 d-flex justify-content-center"></div>
          <div className="col-4">
            <Typography style={{ fontWeight: "bold", fontSize: 20 }}>
              {data?.name}
            </Typography>
            <div className="d-flex flex-column mt-4">
              <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                {t("FormRecipe.SelectFeedingType")}
              </Typography>
              <Typography variant="body1">
                {casteMapNameArrayForString(data?.type_alimentations_id)}
              </Typography>
            </div>
            <div className="d-flex flex-column my-4">
              <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                {t("FormRecipe.SelectFoodType")}
              </Typography>
              <Typography variant="body1">
                {casteMapNameArrayForString(data?.food_type)}
              </Typography>
            </div>
            <div className="d-flex flex-column my-4">
              <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                {t("FormRecipe.TotalCalories")}
              </Typography>
              <Typography variant="body1">{data?.total_calories}</Typography>
            </div>
            <Button
              onClick={() => setIsOpenForm(true)}
              size="large"
              className={classes.button2}
            >
              {t("FormRecipe.ListIngredients")}
            </Button>
          </div>
          <div className="col-5">
            <div className={classes.boxPreparation}>
              <Typography style={{ fontWeight: "bold", fontSize: 15 }}>
                {t("FormRecipe.InputPreparation")}
              </Typography>
              <Typography>{data?.description}</Typography>
            </div>
          </div>
          <div className="col-2 d-flex align-items-end mb-3 ps-5">
            <ActionWithPermission isValid={permissionsActions.edit}>
              <IconButton
                className={`${classes.buttonIcon} me-2`}
                variant="outlined"
                size="medium"
                onClick={handleChangeIsEdit}
              >
                <IconEditItem color="#3C3C3B" width="25" height="25" />
              </IconButton>
            </ActionWithPermission>

            {/*<IconButton className={classes.buttonIcon} variant="outlined" size="medium" onClick={handleChangeOpenDelete}>
                    <IconDeleteItem color="#3C3C3B" width="25" height="25" />
            </IconButton>*/}
          </div>
        </>
      )}
      <ShardComponentModal
        body={
          <FormDeletePlanItem
            idRecipe={data.id}
            setIsOpen={setIsOpen}
            load={load}
            setLoad={setLoad}
          />
        }
        isOpen={isOpen}
        setExpanded={setExpanded}
      />
      <ShardComponentModal
        fullWidth={true}
        width="xs"
        body={
          <ListIngredients
            isDetail={true}
            isEdit={true}
            setIngredients={setIngredients}
            ingredients={data?.ingredient}
            setIsOpen={setIsOpenForm}
          />
        }
        isOpen={isOpenForm}
      />
    </div>
  );
};

export default DetailRecipe;
