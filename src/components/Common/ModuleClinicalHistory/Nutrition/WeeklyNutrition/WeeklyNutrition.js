import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

//UTILS
import {
  errorToast,
  mapErrors,
  addFormsPercentToLocalStorage,
  optionFood,
  optionWater,
  addKeyClinicalHistoryForm,
} from "utils/misc";
import Swal from "sweetalert2";

//SERVICES
import { saveForms } from "services/MedicalSoftware/SaveForms";
import { getLoadForm } from "services/MedicalSoftware/LoadForms";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

export const WeeklyNutritionForm = ({
  setIsOpen,
  setReload,
  reload,
  setCompleteWeeklyNutrition,
  completeWeeklyNutrition,
  dailyFood,
  foodPreparationType,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const formId = 15;
  let percent = {};
  let { quote_id, medical_professional_id, user_id, appoiment_type_id } =
    useParams();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  //States Data
  const [option, setOption] = useState([]);
  const [selectFoodWeek, setSelectFoodWeek] = useState();
  const [selectFoodWeekend, setSelectFoodWeekend] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState();
  const [loadForm, setLoadForm] = useState(false);

  //CONSULT DATA
  useEffect(() => {
    setLoadForm(true);

    getLoadForm(
      formId,
      appoiment_type_id,
      user_id,
      window.localStorage.getItem(`form-${user_id}-${formId}`) ? 1 : 0
    )
      .then(({ data }) => {
        setOption(data.data[0]?.customInputFields);
        setSelectFoodWeek(data.data[0]?.customInputFields[0]?.value);
        setSelectFoodWeekend(data.data[0]?.customInputFields[22]?.value);
        setLoadForm(false);
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadForm(false);
      });
  }, [appoiment_type_id, completeWeeklyNutrition, enqueueSnackbar, user_id]);

  const handleClickWeek = (e) => {
    setSelectFoodWeek(e);
  };
  const handleClickWeekend = (e) => {
    setSelectFoodWeekend(e);
  };

  //SEND DATA
  const onSubmit = (dataController) => {
    setLoadingFetchForm(true);

    let dataSubmit = {
      form_id: Number(formId),
      user_id: Number(user_id),
      quote_id: Number(quote_id),
      medical_professional_id: Number(medical_professional_id),
      customInputFields: [],
    };

    option.map((field) => {
      return dataSubmit.customInputFields.push({
        id: field.id,
        value: dataController[field.slug],
      });
    });

    saveForms(dataSubmit)
      .then((req) => {
        if (req && req.data && req.data.message === "success") {
          setIsOpen(false);
          Swal.fire({
            title: t("Message.SavedSuccess"),
            icon: "success",
          });
          percent = { id: formId, completed: req?.data.data.percent };
          addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
          addFormsPercentToLocalStorage(percent);
          setCompleteWeeklyNutrition(1);
        } else {
          Swal.fire({
            title: mapErrors(req.data),
            icon: "error",
          });
        }
        setLoadingFetchForm(false);
        setReload(!reload);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
        setLoadingFetchForm(false);
      });
  };
  //ERRORS
  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), {
      variant: "info",
      autoHideDuration: 2500,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      {loadForm ? (
        <Loading />
      ) : (
        <div className="row">
          {/*TITULO*/}
          <div className="col-12 d-flex justify-content-between align-items-center">
            <Typography variant="h5">
              {t("WeeklyNutrition.FormonSubmit")}
            </Typography>
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
          {/*SELECT TIMES FOOD WEEK*/}
          <div className="col-12 mt-4">
            <Controller
              rules={{ required: true }}
              control={control}
              name="food_times_week"
              defaultValue={option[0]?.value === null ? "" : option[0]?.value}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={errors.food_times_week ? true : false}
                >
                  <InputLabel id="label">
                    {t("WeeklyNutrition.SelectTimeFood")}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="label"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleClickWeek(e.target.value);
                    }}
                    label={option[0]?.label}
                  >
                    {optionFood.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {selectFoodWeek === 1 ? (
            <div className="col-12 mt-3">
              <div className="col-12 d-flex justify-content-between align-items-center ">
                <div className="col-6 pe-1">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="name_week_1"
                    defaultValue={
                      option[1]?.value === null ? "" : option[1]?.value
                    }
                    render={({ field }) => (
                      <FormControl variant="outlined">
                        <InputLabel id="name-week-1">
                          {t("WeeklyNutrition.InputName")}
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="select"
                          label={t("WeeklyNutrition.InputName")}
                        >
                          {dailyFood.map((res) => (
                            <MenuItem key={res.name} value={res.id}>
                              {res.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
                <div className="col-6 ps-1">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="hour_week_1"
                    defaultValue={
                      option[2]?.value === null ? "" : option[2]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="time"
                        variant="outlined"
                        label={t("WeeklyNutrition.InputHour")}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-2">
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="description_week_1"
                  defaultValue={
                    option[3]?.value === null ? "" : option[3]?.value
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={4}
                      variant="outlined"
                      label={t("WeeklyNutrition.InputDescription")}
                    />
                  )}
                />
              </div>
            </div>
          ) : selectFoodWeek === 2 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_1"
                      defaultValue={
                        option[1]?.value === null ? "" : option[1]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_1"
                      defaultValue={
                        option[2]?.value === null ? "" : option[2]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_1"
                    defaultValue={
                      option[3]?.value === null ? "" : option[3]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_2"
                      defaultValue={
                        option[4]?.value === null ? "" : option[4]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_2"
                      defaultValue={
                        option[5]?.value === null ? "" : option[5]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_2"
                    defaultValue={
                      option[6]?.value === null ? "" : option[6]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeek === 3 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_1"
                      defaultValue={
                        option[1]?.value === null ? "" : option[1]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_1"
                      defaultValue={
                        option[2]?.value === null ? "" : option[2]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_1"
                    defaultValue={
                      option[3]?.value === null ? "" : option[3]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_2"
                      defaultValue={
                        option[4]?.value === null ? "" : option[4]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_2"
                      defaultValue={
                        option[5]?.value === null ? "" : option[5]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_2"
                    defaultValue={
                      option[6]?.value === null ? "" : option[6]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_3"
                      defaultValue={
                        option[7]?.value === null ? "" : option[7]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_3"
                      defaultValue={
                        option[8]?.value === null ? "" : option[8]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_3"
                    defaultValue={
                      option[9]?.value === null ? "" : option[9]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeek === 4 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_1"
                      defaultValue={
                        option[1]?.value === null ? "" : option[1]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_1"
                      defaultValue={
                        option[2]?.value === null ? "" : option[2]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_1"
                    defaultValue={
                      option[3]?.value === null ? "" : option[3]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_2"
                      defaultValue={
                        option[4]?.value === null ? "" : option[4]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_2"
                      defaultValue={
                        option[5]?.value === null ? "" : option[5]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_2"
                    defaultValue={
                      option[6]?.value === null ? "" : option[6]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_3"
                      defaultValue={
                        option[7]?.value === null ? "" : option[7]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_3"
                      defaultValue={
                        option[8]?.value === null ? "" : option[8]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_3"
                    defaultValue={
                      option[9]?.value === null ? "" : option[9]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_4"
                      defaultValue={
                        option[10]?.value === null ? "" : option[10]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_4"
                      defaultValue={
                        option[11]?.value === null ? "" : option[11]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_4"
                    defaultValue={
                      option[12]?.value === null ? "" : option[12]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeek === 5 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_1"
                      defaultValue={
                        option[1]?.value === null ? "" : option[1]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_1"
                      defaultValue={
                        option[2]?.value === null ? "" : option[2]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_1"
                    defaultValue={
                      option[3]?.value === null ? "" : option[3]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_2"
                      defaultValue={
                        option[4]?.value === null ? "" : option[4]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_2"
                      defaultValue={
                        option[5]?.value === null ? "" : option[5]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_2"
                    defaultValue={
                      option[6]?.value === null ? "" : option[6]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_3"
                      defaultValue={
                        option[7]?.value === null ? "" : option[7]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_3"
                      defaultValue={
                        option[8]?.value === null ? "" : option[8]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_3"
                    defaultValue={
                      option[9]?.value === null ? "" : option[9]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_4"
                      defaultValue={
                        option[10]?.value === null ? "" : option[10]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_4"
                      defaultValue={
                        option[11]?.value === null ? "" : option[11]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_4"
                    defaultValue={
                      option[12]?.value === null ? "" : option[12]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_5"
                      defaultValue={
                        option[13]?.value === null ? "" : option[13]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_5">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_5"
                      defaultValue={
                        option[14]?.value === null ? "" : option[14]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_5"
                    defaultValue={
                      option[15]?.value === null ? "" : option[15]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeek === 6 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_1"
                      defaultValue={
                        option[1]?.value === null ? "" : option[1]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_1"
                      defaultValue={
                        option[2]?.value === null ? "" : option[2]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_1"
                    defaultValue={
                      option[3]?.value === null ? "" : option[3]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_2"
                      defaultValue={
                        option[4]?.value === null ? "" : option[4]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_2"
                      defaultValue={
                        option[5]?.value === null ? "" : option[5]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_2"
                    defaultValue={
                      option[6]?.value === null ? "" : option[6]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_3"
                      defaultValue={
                        option[7]?.value === null ? "" : option[7]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_3"
                      defaultValue={
                        option[8]?.value === null ? "" : option[8]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_3"
                    defaultValue={
                      option[9]?.value === null ? "" : option[9]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_4"
                      defaultValue={
                        option[10]?.value === null ? "" : option[10]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_4"
                      defaultValue={
                        option[11]?.value === null ? "" : option[11]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_4"
                    defaultValue={
                      option[12]?.value === null ? "" : option[12]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_5"
                      defaultValue={
                        option[13]?.value === null ? "" : option[13]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_5">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_5"
                      defaultValue={
                        option[14]?.value === null ? "" : option[14]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_5"
                    defaultValue={
                      option[15]?.value === null ? "" : option[15]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_6"
                      defaultValue={
                        option[16]?.value === null ? "" : option[16]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_6">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_6"
                      defaultValue={
                        option[17]?.value === null ? "" : option[17]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_6"
                    defaultValue={
                      option[18]?.value === null ? "" : option[18]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeek === 7 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_1"
                      defaultValue={
                        option[1]?.value === null ? "" : option[1]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_1"
                      defaultValue={
                        option[2]?.value === null ? "" : option[2]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_1"
                    defaultValue={
                      option[3]?.value === null ? "" : option[3]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_2"
                      defaultValue={
                        option[4]?.value === null ? "" : option[4]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_2"
                      defaultValue={
                        option[5]?.value === null ? "" : option[5]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_2"
                    defaultValue={
                      option[6]?.value === null ? "" : option[6]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_3"
                      defaultValue={
                        option[7]?.value === null ? "" : option[7]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_3"
                      defaultValue={
                        option[8]?.value === null ? "" : option[8]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_3"
                    defaultValue={
                      option[9]?.value === null ? "" : option[9]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_4"
                      defaultValue={
                        option[10]?.value === null ? "" : option[10]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name-week-4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_4"
                      defaultValue={
                        option[11]?.value === null ? "" : option[11]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_4"
                    defaultValue={
                      option[12]?.value === null ? "" : option[12]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_5"
                      defaultValue={
                        option[13]?.value === null ? "" : option[13]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_5">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_5"
                      defaultValue={
                        option[14]?.value === null ? "" : option[14]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_5"
                    defaultValue={
                      option[15]?.value === null ? "" : option[15]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_6"
                      defaultValue={
                        option[16]?.value === null ? "" : option[16]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_6">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_6"
                      defaultValue={
                        option[17]?.value === null ? "" : option[17]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_6"
                    defaultValue={
                      option[18]?.value === null ? "" : option[18]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_week_7"
                      defaultValue={
                        option[19]?.value === null ? "" : option[19]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_week_7">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_week_7"
                      defaultValue={
                        option[20]?.value === null ? "" : option[20]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_week_7"
                    defaultValue={
                      option[21]?.value === null ? "" : option[21]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/*SELECT TIMES FOOD WEEKEND*/}
          <div className="col-12 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="food_times_weekend"
              defaultValue={option[22]?.value === null ? "" : option[22]?.value}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={errors.food_times_weekend ? true : false}
                >
                  <InputLabel id="food_times_weekend">
                    {t("WeeklyNutrition.SelectTimeWeekendFood")}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="select"
                    label={t("WeeklyNutrition.SelectTimeWeekendFood")}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      handleClickWeekend(e.target.value);
                    }}
                  >
                    {optionFood.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {selectFoodWeekend === 1 ? (
            <div className="col-12 mt-3">
              <div className="col-12 d-flex justify-content-between align-items-center ">
                <div className="col-6 pe-1">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="name_weekend_1"
                    defaultValue={
                      option[23]?.value === null ? "" : option[23]?.value
                    }
                    render={({ field }) => (
                      <FormControl variant="outlined">
                        <InputLabel id="name_weekend_1">
                          {t("WeeklyNutrition.InputName")}
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="select"
                          label={t("WeeklyNutrition.InputName")}
                        >
                          {dailyFood.map((res) => (
                            <MenuItem key={res.name} value={res.id}>
                              {res.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </div>
                <div className="col-6 ps-1">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="hour_weekend_1"
                    defaultValue={
                      option[24]?.value === null ? "" : option[24]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="time"
                        variant="outlined"
                        label={t("WeeklyNutrition.InputHour")}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-2">
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="description_weekend_1"
                  defaultValue={
                    option[25]?.value === null ? "" : option[25]?.value
                  }
                  render={({ field }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={4}
                      variant="outlined"
                      label={t("WeeklyNutrition.InputDescription")}
                    />
                  )}
                />
              </div>
            </div>
          ) : selectFoodWeekend === 2 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_1"
                      defaultValue={
                        option[23]?.value === null ? "" : option[23]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_1"
                      defaultValue={
                        option[24]?.value === null ? "" : option[24]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_1"
                    defaultValue={
                      option[25]?.value === null ? "" : option[24]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_2"
                      defaultValue={
                        option[26]?.value === null ? "" : option[25]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_2"
                      defaultValue={
                        option[27]?.value === null ? "" : option[27]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_2"
                    defaultValue={
                      option[28]?.value === null ? "" : option[28]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeekend === 3 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_1"
                      defaultValue={
                        option[23]?.value === null ? "" : option[23]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_1"
                      defaultValue={
                        option[24]?.value === null ? "" : option[24]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_1"
                    defaultValue={
                      option[25]?.value === null ? "" : option[25]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_2"
                      defaultValue={
                        option[26]?.value === null ? "" : option[26]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_2"
                      defaultValue={
                        option[27]?.value === null ? "" : option[27]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_2"
                    defaultValue={
                      option[28]?.value === null ? "" : option[28]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_3"
                      defaultValue={
                        option[29]?.value === null ? "" : option[29]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_3"
                      defaultValue={
                        option[30]?.value === null ? "" : option[30]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_3"
                    defaultValue={
                      option[31]?.value === null ? "" : option[31]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeekend === 4 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_1"
                      defaultValue={
                        option[23]?.value === null ? "" : option[23]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_1"
                      defaultValue={
                        option[24]?.value === null ? "" : option[24]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_1"
                    defaultValue={
                      option[25]?.value === null ? "" : option[25]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_2"
                      defaultValue={
                        option[26]?.value === null ? "" : option[26]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_2"
                      defaultValue={
                        option[27]?.value === null ? "" : option[27]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_2"
                    defaultValue={
                      option[28]?.value === null ? "" : option[28]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_3"
                      defaultValue={
                        option[29]?.value === null ? "" : option[29]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_3"
                      defaultValue={
                        option[30]?.value === null ? "" : option[30]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_3"
                    defaultValue={
                      option[31]?.value === null ? "" : option[31]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_4"
                      defaultValue={
                        option[32]?.value === null ? "" : option[32]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_4"
                      defaultValue={
                        option[33]?.value === null ? "" : option[33]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_4"
                    defaultValue={
                      option[34]?.value === null ? "" : option[34]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeekend === 5 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_1"
                      defaultValue={
                        option[23]?.value === null ? "" : option[23]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_1"
                      defaultValue={
                        option[24]?.value === null ? "" : option[24]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_1"
                    defaultValue={
                      option[25]?.value === null ? "" : option[25]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_2"
                      defaultValue={
                        option[26]?.value === null ? "" : option[26]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_2"
                      defaultValue={
                        option[27]?.value === null ? "" : option[27]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_2"
                    defaultValue={
                      option[28]?.value === null ? "" : option[28]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_3"
                      defaultValue={
                        option[29]?.value === null ? "" : option[29]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_3"
                      defaultValue={
                        option[30]?.value === null ? "" : option[30]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_3"
                    defaultValue={
                      option[31]?.value === null ? "" : option[31]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_4"
                      defaultValue={
                        option[32]?.value === null ? "" : option[32]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_4"
                      defaultValue={
                        option[33]?.value === null ? "" : option[33]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_4"
                    defaultValue={
                      option[34]?.value === null ? "" : option[34]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_5"
                      defaultValue={
                        option[35]?.value === null ? "" : option[35]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_5">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_5"
                      defaultValue={
                        option[36]?.value === null ? "" : option[36]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_5"
                    defaultValue={
                      option[37]?.value === null ? "" : option[37]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeekend === 6 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_1"
                      defaultValue={
                        option[23]?.value === null ? "" : option[23]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_1"
                      defaultValue={
                        option[24]?.value === null ? "" : option[24]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_1"
                    defaultValue={
                      option[25]?.value === null ? "" : option[25]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_2"
                      defaultValue={
                        option[26]?.value === null ? "" : option[26]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_2"
                      defaultValue={
                        option[27]?.value === null ? "" : option[27]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_2"
                    defaultValue={
                      option[28]?.value === null ? "" : option[28]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_3"
                      defaultValue={
                        option[29]?.value === null ? "" : option[29]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_3"
                      defaultValue={
                        option[30]?.value === null ? "" : option[30]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_3"
                    defaultValue={
                      option[31]?.value === null ? "" : option[31]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_4"
                      defaultValue={
                        option[32]?.value === null ? "" : option[32]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_4"
                      defaultValue={
                        option[33]?.value === null ? "" : option[33]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_4"
                    defaultValue={
                      option[34]?.value === null ? "" : option[34]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_5"
                      defaultValue={
                        option[35]?.value === null ? "" : option[35]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_5">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_5"
                      defaultValue={
                        option[36]?.value === null ? "" : option[36]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_5"
                    defaultValue={
                      option[37]?.value === null ? "" : option[37]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_6"
                      defaultValue={
                        option[38]?.value === null ? "" : option[38]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_6">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_6"
                      defaultValue={
                        option[39]?.value === null ? "" : option[39]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_6"
                    defaultValue={
                      option[40]?.value === null ? "" : option[40]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : selectFoodWeekend === 7 ? (
            <div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_1"
                      defaultValue={
                        option[23]?.value === null ? "" : option[23]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_1">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_1"
                      defaultValue={
                        option[24]?.value === null ? "" : option[24]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_1"
                    defaultValue={
                      option[25]?.value === null ? "" : option[25]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_2"
                      defaultValue={
                        option[26]?.value === null ? "" : option[26]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_2">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_2"
                      defaultValue={
                        option[27]?.value === null ? "" : option[27]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_2"
                    defaultValue={
                      option[28]?.value === null ? "" : option[28]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_3"
                      defaultValue={
                        option[29]?.value === null ? "" : option[29]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_3">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_3"
                      defaultValue={
                        option[30]?.value === null ? "" : option[30]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_3"
                    defaultValue={
                      option[31]?.value === null ? "" : option[31]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_4"
                      defaultValue={
                        option[32]?.value === null ? "" : option[32]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_4">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_4"
                      defaultValue={
                        option[33]?.value === null ? "" : option[33]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_4"
                    defaultValue={
                      option[34]?.value === null ? "" : option[34]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_5"
                      defaultValue={
                        option[35]?.value === null ? "" : option[35]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_5">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_5"
                      defaultValue={
                        option[36]?.value === null ? "" : option[36]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_5"
                    defaultValue={
                      option[37]?.value === null ? "" : option[37]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_6"
                      defaultValue={
                        option[38]?.value === null ? "" : option[38]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_6">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_6"
                      defaultValue={
                        option[39]?.value === null ? "" : option[39]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_6"
                    defaultValue={
                      option[40]?.value === null ? "" : option[40]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-12 mt-3">
                <div className="col-12 d-flex justify-content-between align-items-center ">
                  <div className="col-6 pe-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="name_weekend_7"
                      defaultValue={
                        option[41]?.value === null ? "" : option[41]?.value
                      }
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <InputLabel id="name_weekend_7">
                            {t("WeeklyNutrition.InputName")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="select"
                            label={t("WeeklyNutrition.InputName")}
                          >
                            {dailyFood.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="col-6 ps-1">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="hour_weekend_7"
                      defaultValue={
                        option[42]?.value === null ? "" : option[42]?.value
                      }
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="time"
                          variant="outlined"
                          label={t("WeeklyNutrition.InputHour")}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="description_weekend_7"
                    defaultValue={
                      option[43]?.value === null ? "" : option[43]?.value
                    }
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t("WeeklyNutrition.InputDescription")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/*RADIOGROUP BUY FOOD*/}
          <div className="mt-2">
            <Controller
              rules={{ required: true }}
              control={control}
              name="buy_food"
              defaultValue={option[44]?.value === null ? "" : option[44]?.value}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={errors.buy_food ? true : false}
                >
                  <RadioGroup
                    {...field}
                    name="buy_food"
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <Typography>
                      {t("WeeklyNutrition.TitileBuyFood")}
                    </Typography>
                    <div className="d-flex justify-content-around mt-2">
                      <FormControlLabel
                        value="El mismo"
                        label="El mismo"
                        control={<Radio color="primary" />}
                      />
                      <FormControlLabel
                        value="Un tercero"
                        label="Un tercero"
                        control={<Radio color="primary" />}
                      />
                    </div>
                  </RadioGroup>
                </FormControl>
              )}
            />
            {errors.buy_food && (
              <FormHelperText error>{t("Field.required")}</FormHelperText>
            )}
          </div>
          {/*RADIOGROUP PREPARE FOOD*/}
          <div className="mt-2">
            <Controller
              rules={{ required: true }}
              control={control}
              name="prepare_food"
              defaultValue={option[45]?.value === null ? "" : option[45]?.value}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={errors.prepare_food ? true : false}
                >
                  <RadioGroup
                    {...field}
                    name="prepare_food"
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <Typography>
                      {t("WeeklyNutrition.TitlePrepareFood")}
                    </Typography>
                    <div className="d-flex justify-content-around mt-2">
                      <FormControlLabel
                        value="El mismo"
                        label="El mismo"
                        control={<Radio color="primary" />}
                      />
                      <FormControlLabel
                        value="Un tercero"
                        label="Un tercero"
                        control={<Radio color="primary" />}
                      />
                    </div>
                  </RadioGroup>
                </FormControl>
              )}
            />
            {errors.prepare_food && (
              <FormHelperText error>{t("Field.required")}</FormHelperText>
            )}
          </div>
          {/*SELECT PREPARE FRECUENCY*/}
          <div className="col-12 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="frequent_preparation"
              defaultValue={option[46]?.value === null ? "" : option[46]?.value}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={errors.frequent_preparation ? true : false}
                >
                  <InputLabel id="frequent_preparation">
                    {t("WeeklyNutrition.TitleFrequentPreparation")}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="select"
                    label={t("WeeklyNutrition.TitleFrequentPreparation")}
                  >
                    {foodPreparationType.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/*SELECT WATER CUPS*/}
          <div className="col-12 mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="glasses_water"
              defaultValue={option[47]?.value === null ? "" : option[47]?.value}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={errors.glasses_water ? true : false}
                >
                  <InputLabel id="glasses_water">
                    {t("WeeklyNutrition.TitleWater")}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="select"
                    label={t("WeeklyNutrition.TitleWater")}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {optionWater.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
          {/*BUTTON SAVE*/}
          <div className="d-flex justify-content-end mt-3">
            <ButtonSave loader={loadingFetchForm} text={t("Btn.save")} />
          </div>
        </div>
      )}
    </form>
  );
};
