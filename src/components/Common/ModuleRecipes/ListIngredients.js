import { useState, useEffect } from "react";

//components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormFoodItem from "components/Common/ModuleClinicalHistory/Nutrition/NutritionPlan/FormFoodItem";
import EditIngredient from "./EditIngredient";

//ui
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";

//IMPORTS
import { useSnackbar } from "notistack";

//utils
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors } from "utils/misc";

// services
//import { getTypeFood } from "services/MedicalSoftware/TypeFood";
import { getFood } from "services/MedicalSoftware/Food";
import { getWeightUnit } from "services/MedicalSoftware/WeightUnit";

const ListIngredients = ({
  ingredients,
  setIngredients,
  setIsOpen,
  isEdit,
  fromAssingModal,
  isDetail,
  changeCalories,
  setChangeCalories,
}) => {
  const classes = useStyles();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [food, setFood] = useState([]);
  const [weightUnit, setWeightUnit] = useState([]);
  const [loadIngredients, setLoadIngredients] = useState(false);

  useEffect(() => {
    getWeightUnit()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setWeightUnit(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    getFood()
      .then(({ data }) => {
        if (data && data.status === "success" && data.data) {
          setFood(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);


  // delete item
  const deleteItem = (index, item) => {
    setLoadIngredients(true);
    setTimeout(() => {
      setIngredients(ingredients.filter((r, i) => i !== index));
      setLoadIngredients(false);
    }, 10);
  };

  return (
    <div>
      <div className="row m-0 align-items-center mb-4">
        <div className="col-11">
          <Typography variant="h5">Lista de ingredientes</Typography>
        </div>
        <div className="col-1">
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
        <div>
          <div className="mt-3">
            {!isDetail && (
              <Button
                fullWidth
                className={classes.buttonListIngredients}
                endIcon={<AddIcon color="#3C3C3B" width="25" height="25" />}
                onClick={() => setIsOpenForm(true)}
              >
                Agregar ingrediente
              </Button>
            )}
          </div>
          <div className="mt-3">
            {ingredients &&
              ingredients.map((item, idx) => (
                <div className={classes.itemFoodList} key={`ingredient-${idx}`}>
                  {fromAssingModal && !loadIngredients ? (
                    <EditIngredient
                      food={food}
                      setChangeCalories={setChangeCalories}
                      changeCalories={changeCalories}
                      weightUnit={weightUnit}
                      item={item}
                      deleteItem={deleteItem}
                      idx={idx}
                      ingredients={ingredients}
                      setIngredients={setIngredients}
                    />
                  ) : isEdit ? (
                    // Outside nutrition modal
                    <>
                      <Tooltip
                        title={
                          item?.foodData
                            ? item?.foodData?.name
                            : item?.food?.name
                        }
                        placement="bottom"
                      >
                        <Typography noWrap style={{ width: "100px" }}>
                          {item?.foodData
                            ? item?.foodData?.name
                            : item?.food?.name}
                        </Typography>
                      </Tooltip>
                      <div
                        style={{
                          width: "100px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: 12,
                            color: "rgba(150, 150, 150, 1)",
                          }}
                        >{`${
                          item?.weight_unit_name
                            ? item?.weight_unit_name
                            : item?.unit?.name
                        }`}</Typography>
                        <Typography>{`${item?.weight_value}`}</Typography>
                      </div>
                      <div
                        style={{
                          width: "100px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: 12,
                            color: "rgba(150, 150, 150, 1)",
                          }}
                        >{`Calorias`}</Typography>
                        <Typography>{`${item?.calories}`}</Typography>
                      </div>
                      {!isDetail && (
                        <Button onClick={() => deleteItem(idx, item)}>
                          <CloseIcon />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Tooltip
                        title={
                          item?.foodData
                            ? item?.foodData?.name
                            : item?.food?.name
                        }
                        placement="bottom"
                      >
                        <Typography noWrap style={{ width: "100px" }}>
                          {item?.foodData
                            ? item?.foodData?.name
                            : item?.food?.name}
                        </Typography>
                      </Tooltip>
                      <div
                        style={{
                          width: "100px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: 12,
                            color: "rgba(150, 150, 150, 1)",
                          }}
                        >{`${item?.unit?.name}`}</Typography>
                        <Typography>{`${item?.weight_value}`}</Typography>
                      </div>
                      <div
                        style={{
                          width: "100px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: 12,
                            color: "rgba(150, 150, 150, 1)",
                          }}
                        >{`Calorias`}</Typography>
                        <Typography>{`${item?.calories}`}</Typography>
                      </div>
                      {!isDetail && (
                        <Button onClick={() => deleteItem(idx, item)}>
                          <CloseIcon />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
        {!isDetail && (
          <div className="d-flex justify-content-end">
            <Button className={classes.button} onClick={() => setIsOpen(false)}>
              Guardar
            </Button>
          </div>
        )}
      </div>
      <ShardComponentModal
        fullWidth={true}
        width="sm"
        body={
          <FormFoodItem
            fromAssingModal={fromAssingModal}
            setIngredients={setIngredients}
            ingredients={ingredients}
            setIsOpen={setIsOpenForm}
          />
        }
        isOpen={isOpenForm}
      />
    </div>
  );
};

export default ListIngredients;
