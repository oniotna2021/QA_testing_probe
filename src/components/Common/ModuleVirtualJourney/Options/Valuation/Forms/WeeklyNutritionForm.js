import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

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
  optionFood,
  optionWaterJourney,
  successToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";

//SERVICES
import { postWelcomeFormNutrition } from "services/VirtualJourney/WelcomeForm";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

const WeeklyNutritionForm = ({
  setIsOpen,
  dailyFood,
  foodPreparationType,
  setReloadInfo,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { user_id, quote_id } = useParams();
  const lastPositionForm = useSelector((state) =>
    state.virtualJourney?.welcomeForm?.MedicalFormWeeklyNutrition
      ? state.virtualJourney?.welcomeForm?.MedicalFormWeeklyNutrition?.length
      : null
  );
  const savedForm = useSelector(
    (state) =>
      state.virtualJourney.welcomeForm.MedicalFormWeeklyNutrition &&
      state.virtualJourney.welcomeForm.MedicalFormWeeklyNutrition[
        lastPositionForm - 1
      ]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const [selectFoodWeek, setSelectFoodWeek] = useState();
  const [selectFoodWeekend, setSelectFoodWeekend] = useState();
  const [loadingFetchForm, setLoadingFetchForm] = useState();

  useEffect(() => {
    setSelectFoodWeek(savedForm?.food_times_week);
    setSelectFoodWeekend(savedForm?.food_times_weekend);
  }, []);

  const handleClickWeek = (e) => {
    setSelectFoodWeek(e);
  };
  const handleClickWeekend = (e) => {
    setSelectFoodWeekend(e);
  };

  const onSubmit = (dataController) => {
    dataController.user_id = user_id;
    dataController.quote_id = quote_id;
    dataController.form = 10;
    setLoadingFetchForm(true);
    postWelcomeFormNutrition(dataController)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_10_${user_id}_${quote_id}`, 100);
          dispatch(updateWelcomeForm(data.data));
          setIsOpen(false);
          setReloadInfo((prev) => !prev);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
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
            defaultValue={savedForm?.food_times_week}
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
                  label={t("WeeklyNutrition.SelectTimeFood")}
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
                  defaultValue={savedForm?.name_week_1}
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
                  defaultValue={savedForm?.hour_week_1}
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
                defaultValue={savedForm?.description_week_1}
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
                    defaultValue={savedForm?.name_week_1}
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
                    defaultValue={savedForm?.hour_week_1}
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
                  defaultValue={savedForm?.description_week_1}
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
                    defaultValue={savedForm?.name_week_2}
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
                    defaultValue={savedForm?.hour_week_2}
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
                  defaultValue={savedForm?.description_week_2}
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
                    defaultValue={savedForm?.name_week_1}
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
                    defaultValue={savedForm?.hour_week_1}
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
                  defaultValue={savedForm?.description_week_1}
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
                    defaultValue={savedForm?.name_week_2}
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
                    defaultValue={savedForm?.hour_week_2}
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
                  defaultValue={savedForm?.description_week_2}
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
                    defaultValue={savedForm?.name_week_3}
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
                    defaultValue={savedForm?.hour_week_3}
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
                  defaultValue={savedForm?.description_week_3}
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
                    defaultValue={savedForm?.name_week_1}
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
                    defaultValue={savedForm?.hour_week_1}
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
                  defaultValue={savedForm?.description_week_1}
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
                    defaultValue={savedForm?.name_week_2}
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
                    defaultValue={savedForm?.hour_week_2}
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
                  defaultValue={savedForm?.description_week_2}
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
                    defaultValue={savedForm?.name_week_3}
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
                    defaultValue={savedForm?.hour_week_3}
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
                  defaultValue={savedForm?.description_week_3}
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
                    defaultValue={savedForm?.name_week_4}
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
                    defaultValue={savedForm?.hour_week_4}
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
                  defaultValue={savedForm?.description_week_4}
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
                    defaultValue={savedForm?.name_week_1}
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
                    defaultValue={savedForm?.hour_week_1}
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
                  defaultValue={savedForm?.description_week_1}
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
                    defaultValue={savedForm?.name_week_2}
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
                    defaultValue={savedForm?.hour_week_2}
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
                  defaultValue={savedForm?.description_week_2}
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
                    defaultValue={savedForm?.name_week_3}
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
                    defaultValue={savedForm?.hour_week_3}
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
                  defaultValue={savedForm?.description_week_3}
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
                    defaultValue={savedForm?.name_week_4}
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
                    defaultValue={savedForm?.hour_week_4}
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
                  defaultValue={savedForm?.description_week_4}
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
                    defaultValue={savedForm?.name_week_5}
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
                    defaultValue={savedForm?.hour_week_5}
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
                  defaultValue={savedForm?.description_week_5}
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
                    defaultValue={savedForm?.name_week_1}
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
                    defaultValue={savedForm?.hour_week_1}
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
                  defaultValue={savedForm?.description_week_1}
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
                    defaultValue={savedForm?.name_week_2}
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
                    defaultValue={savedForm?.hour_week_2}
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
                  defaultValue={savedForm?.description_week_2}
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
                    defaultValue={savedForm?.name_week_3}
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
                    defaultValue={savedForm?.hour_week_3}
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
                  defaultValue={savedForm?.description_week_3}
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
                    defaultValue={savedForm?.name_week_4}
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
                    defaultValue={savedForm?.hour_week_4}
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
                  defaultValue={savedForm?.description_week_4}
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
                    defaultValue={savedForm?.name_week_5}
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
                    defaultValue={savedForm?.hour_week_5}
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
                  defaultValue={savedForm?.description_week_5}
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
                    defaultValue={savedForm?.name_week_6}
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
                    defaultValue={savedForm?.hour_week_6}
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
                  defaultValue={savedForm?.description_week_6}
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
                    defaultValue={savedForm?.name_week_1}
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
                    defaultValue={savedForm?.hour_week_1}
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
                  defaultValue={savedForm?.description_week_1}
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
                    defaultValue={savedForm?.name_week_2}
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
                    defaultValue={savedForm?.hour_week_2}
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
                  defaultValue={savedForm?.description_week_2}
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
                    defaultValue={savedForm?.name_week_3}
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
                    defaultValue={savedForm?.hour_week_3}
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
                  defaultValue={savedForm?.description_week_3}
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
                    defaultValue={savedForm?.name_week_4}
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
                    defaultValue={savedForm?.hour_week_4}
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
                  defaultValue={savedForm?.description_week_4}
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
                    defaultValue={savedForm?.name_week_5}
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
                    defaultValue={savedForm?.hour_week_5}
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
                  defaultValue={savedForm?.description_week_5}
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
                    defaultValue={savedForm?.name_week_6}
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
                    defaultValue={savedForm?.hour_week_6}
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
                  defaultValue={savedForm?.description_week_6}
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
                    defaultValue={savedForm?.name_week_7}
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
                    defaultValue={savedForm?.hour_week_7}
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
                  defaultValue={savedForm?.description_week_7}
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
            defaultValue={savedForm?.food_times_weekend}
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
                  defaultValue={savedForm?.name_weekend_1}
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
                  defaultValue={savedForm?.hour_weekend_1}
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
                defaultValue={savedForm?.description_weekend_1}
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
                    defaultValue={savedForm?.name_weekend_1}
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
                    defaultValue={savedForm?.hour_weekend_1}
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
                  defaultValue={savedForm?.description_weekend_1}
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
                    defaultValue={savedForm?.name_weekend_2}
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
                    defaultValue={savedForm?.hour_weekend_2}
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
                  defaultValue={savedForm?.description_weekend_2}
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
                    defaultValue={savedForm?.name_weekend_1}
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
                    defaultValue={savedForm?.hour_weekend_1}
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
                  defaultValue={savedForm?.description_weekend_1}
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
                    defaultValue={savedForm?.name_weekend_2}
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
                    defaultValue={savedForm?.hour_weekend_2}
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
                  defaultValue={savedForm?.description_weekend_2}
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
                    defaultValue={savedForm?.name_weekend_3}
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
                    defaultValue={savedForm?.hour_weekend_3}
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
                  defaultValue={savedForm?.description_weekend_3}
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
                    defaultValue={savedForm?.name_weekend_1}
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
                    defaultValue={savedForm?.hour_weekend_1}
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
                  defaultValue={savedForm?.description_weekend_1}
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
                    defaultValue={savedForm?.name_weekend_2}
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
                    defaultValue={savedForm?.hour_weekend_2}
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
                  defaultValue={savedForm?.description_weekend_2}
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
                    defaultValue={savedForm?.name_weekend_3}
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
                    defaultValue={savedForm?.hour_weekend_3}
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
                  defaultValue={savedForm?.description_weekend_3}
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
                    defaultValue={savedForm?.name_weekend_4}
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
                    defaultValue={savedForm?.hour_weekend_4}
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
                  defaultValue={savedForm?.description_weekend_4}
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
                    defaultValue={savedForm?.name_weekend_1}
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
                    defaultValue={savedForm?.hour_weekend_1}
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
                  defaultValue={savedForm?.description_weekend_1}
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
                    defaultValue={savedForm?.name_weekend_2}
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
                    defaultValue={savedForm?.hour_weekend_2}
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
                  defaultValue={savedForm?.description_weekend_2}
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
                    defaultValue={savedForm?.name_weekend_3}
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
                    defaultValue={savedForm?.hour_weekend_3}
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
                  defaultValue={savedForm?.description_weekend_3}
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
                    defaultValue={savedForm?.name_weekend_4}
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
                    defaultValue={savedForm?.hour_weekend_4}
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
                  defaultValue={savedForm?.description_weekend_4}
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
                    defaultValue={savedForm?.name_weekend_5}
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
                    defaultValue={savedForm?.hour_weekend_5}
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
                  defaultValue={savedForm?.description_weekend_5}
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
                    defaultValue={savedForm?.name_weekend_1}
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
                    defaultValue={savedForm?.hour_weekend_1}
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
                  defaultValue={savedForm?.description_weekend_1}
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
                    defaultValue={savedForm?.name_weekend_2}
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
                    defaultValue={savedForm?.hour_weekend_2}
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
                  defaultValue={savedForm?.description_weekend_2}
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
                    defaultValue={savedForm?.name_weekend_3}
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
                    defaultValue={savedForm?.hour_weekend_3}
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
                  defaultValue={savedForm?.description_weekend_3}
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
                    defaultValue={savedForm?.name_weekend_4}
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
                    defaultValue={savedForm?.hour_weekend_4}
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
                  defaultValue={savedForm?.description_weekend_4}
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
                    defaultValue={savedForm?.name_weekend_5}
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
                    defaultValue={savedForm?.hour_weekend_5}
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
                  defaultValue={savedForm?.description_weekend_5}
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
                    defaultValue={savedForm?.name_weekend_6}
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
                    defaultValue={savedForm?.hour_weekend_6}
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
                  defaultValue={savedForm?.description_weekend_6}
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
                    defaultValue={savedForm?.name_weekend_1}
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
                    defaultValue={savedForm?.hour_weekend_1}
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
                  defaultValue={savedForm?.description_weekend_1}
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
                    defaultValue={savedForm?.name_weekend_2}
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
                    defaultValue={savedForm?.hour_weekend_2}
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
                  defaultValue={savedForm?.description_weekend_2}
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
                    defaultValue={savedForm?.name_weekend_3}
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
                    defaultValue={savedForm?.hour_weekend_3}
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
                  defaultValue={savedForm?.description_weekend_3}
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
                    defaultValue={savedForm?.name_weekend_4}
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
                    defaultValue={savedForm?.hour_weekend_4}
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
                  defaultValue={savedForm?.description_weekend_4}
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
                    defaultValue={savedForm?.name_weekend_5}
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
                    defaultValue={savedForm?.hour_weekend_5}
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
                  defaultValue={savedForm?.description_weekend_5}
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
                    defaultValue={savedForm?.name_weekend_6}
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
                    defaultValue={savedForm?.hour_weekend_6}
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
                  defaultValue={savedForm?.description_weekend_6}
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
                    defaultValue={savedForm?.name_weekend_7}
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
                    defaultValue={savedForm?.hour_weekend_7}
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
                  defaultValue={savedForm?.description_weekend_7}
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
            defaultValue={savedForm?.buy_food}
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
                  <Typography>{t("WeeklyNutrition.TitileBuyFood")}</Typography>
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
            defaultValue={savedForm?.prepare_food}
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
            defaultValue={savedForm?.frequent_preparation}
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
            defaultValue={savedForm?.glasses_water}
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
                  {optionWaterJourney.map((res) => (
                    <MenuItem key={res.value} value={res.value}>
                      {res.value}
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
    </form>
  );
};

export default WeeklyNutritionForm;
