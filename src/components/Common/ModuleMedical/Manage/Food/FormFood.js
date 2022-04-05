import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";

//Components
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { CommonComponentSimpleSelect } from "components/Shared/SimpleSelect/SimpleSelect";
import {
  FoodForm,
  selectTypeFood,
  selectWeightUnit,
} from "config/Forms/MedicalForms";
import MinButtonLoader from "components/Shared/MinButtonLoader/MinButtonLoader";

//Services
import { postFood, putFood, deleteFood } from "services/MedicalSoftware/Food";
import { getTypeFood } from "services/MedicalSoftware/TypeFood";
import { getWeightUnit } from "services/MedicalSoftware/WeightUnit";

//Swal
import Swal from "sweetalert2";

// HOCS
import ActionWithPermission from "hocs/ActionWithPermission";

//utils
import {
  errorToast,
  mapErrors,
  infoToast,
  regexOnlyPositiveNumbersWithZero,
} from "utils/misc";

export const FormFood = ({
  type,
  defaultValue,
  setExpanded,
  load,
  setLoad,
  permissionsActions,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [data, setData] = useState([]);
  const [dataWeightUnit, setDataWeightUnit] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);

  const [protein, setProtein] = useState(0);
  const [carbohydrates, setCarbohydrates] = useState(0);
  const [fat, setFat] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    getTypeFood()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setData(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    getWeightUnit()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataWeightUnit(data.data.items);
        } else {
          setDataWeightUnit([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
    if (defaultValue) {
      setProtein(defaultValue.protein);
      setValue("protein", defaultValue.protein);
      setCarbohydrates(defaultValue.carbohydrate);
      setValue("carbohydrate", defaultValue.carbohydrate);
      setFat(defaultValue.fats);
      setValue("fats", defaultValue.fats);
    }
  }, [defaultValue, enqueueSnackbar, setValue]);

  useEffect(() => {
    setTotalCalories(protein * 4 + fat * 9 + carbohydrates * 4);
    setValue("calories", totalCalories);
  }, [protein, fat, carbohydrates, setValue, totalCalories]);

  const onSubmit = (value) => {
    if (type === "Nuevo" && !permissionsActions.create) {
      return;
    } else if (type !== "Nuevo" && !permissionsActions.edit) {
      return;
    }

    value.calories = Number(value.calories);
    value.quantity = Number(value.quantity);
    value.protein = Number(value.protein);
    value.fats = Number(value.fats);
    value.carbohydrate = Number(value.carbohydrate);

    setLoadingFetch(true);
    const functionCall = type === "Nuevo" ? postFood : putFood;
    functionCall(value, defaultValue?.id)
      .then(({ data }) => {
        if (data && data.data && data.status === "success") {
          setExpanded(false);
          Swal.fire({
            title: data.message,
            icon: "success",
          });
          setLoad(!load);
          reset();
        } else {
          Swal.fire({
            title: mapErrors(data),
            icon: "error",
          });
        }
        setLoadingFetch(false);
      })
      .catch((err) => {
        setLoadingFetch(false);
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
      });
  };

  const deleteForm = () => {
    Swal.fire({
      title: t("Message.AreYouSure"),
      text: t("Message.DontRevertThis"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Message.YesDeleteIt"),
    }).then((result) => {
      if (result.isConfirmed) {
        deleteFood(defaultValue.id).then((req) => {
          Swal.fire(
            t("Message.Eliminated"),
            t("Message.EliminatedSuccess"),
            "success"
          );
          setLoad(!load);
        });
      }
    });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      {type !== "Nuevo" && (
        <div className="row justify-content-end mb-3">
          <ActionWithPermission isValid={permissionsActions.delete}>
            <div className="col-1">
              <IconButton
                color="primary"
                fullWidth
                variant="outlined"
                onClick={deleteForm}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </ActionWithPermission>
        </div>
      )}
      <div className="row align-items-end">
        <div className="col-10">
          <div className="row m-0">
            <CommonComponentSimpleForm
              form={FoodForm.slice(0, 1)}
              control={control}
              defaultValue={defaultValue}
              row={false}
              errors={errors}
            />
            <CommonComponentSimpleForm
              form={FoodForm.slice(1, 2)}
              control={control}
              defaultValue={defaultValue?.external_code}
              row={false}
              errors={errors}
            />
            <CommonComponentSimpleForm
              form={FoodForm.slice(2, 3)}
              control={control}
              defaultValue={defaultValue?.description}
              row={false}
              errors={errors}
            />
            <CommonComponentSimpleSelect
              form={selectWeightUnit}
              option={dataWeightUnit}
              control={control}
              value={defaultValue?.weight_unit_id}
              row={false}
              errors={errors}
            />
            <CommonComponentSimpleForm
              form={FoodForm.slice(4, 5)}
              control={control}
              defaultValue={defaultValue}
              row={false}
              errors={errors}
            />
            <CommonComponentSimpleSelect
              form={selectTypeFood}
              option={data}
              control={control}
              value={defaultValue?.food_type_id}
              row={false}
              errors={errors}
            />
            <div className="col-4 p-0 mb-3 pe-1">
              <Controller
                control={control}
                name="protein"
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Proteinas"
                    type="text"
                    onKeyUp={(e) => {
                      if (
                        regexOnlyPositiveNumbersWithZero.test(e.target.value)
                      ) {
                        field.onChange(e.target.value);
                      } else {
                        e.target.value = "";
                        field.onChange("");
                      }
                    }}
                    error={errors.protein}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setProtein(Number(e.target.value));
                    }}
                  />
                )}
              />
            </div>
            <div className="col-4 p-0 mb-3 pe-1">
              <Controller
                control={control}
                name="fats"
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Grasas"
                    onKeyUp={(e) => {
                      if (
                        regexOnlyPositiveNumbersWithZero.test(e.target.value)
                      ) {
                        field.onChange(e.target.value);
                      } else {
                        e.target.value = "";
                        field.onChange("");
                      }
                    }}
                    error={errors.fats}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setFat(Number(e.target.value));
                    }}
                  />
                )}
              />
            </div>
            <div className="col-4 p-0 mb-3">
              <Controller
                control={control}
                name="carbohydrate"
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    variant="outlined"
                    label="Carbohidratos"
                    onKeyUp={(e) => {
                      if (
                        regexOnlyPositiveNumbersWithZero.test(e.target.value)
                      ) {
                        field.onChange(e.target.value);
                      } else {
                        e.target.value = "";
                        field.onChange("");
                      }
                    }}
                    error={errors.carbohydrate}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setCarbohydrates(Number(e.target.value));
                    }}
                  />
                )}
              />
            </div>
            <CommonComponentSimpleForm
              form={FoodForm.slice(3, 4)}
              control={control}
              defaultValue={totalCalories}
              row={false}
              errors={errors}
            />
          </div>
        </div>

        <ActionWithPermission isValid={true}>
          <div className="col-2 mb-3">
            <MinButtonLoader text={t("Btn.save")} loader={loadingFetch} />
          </div>
        </ActionWithPermission>
      </div>
    </form>
  );
};
