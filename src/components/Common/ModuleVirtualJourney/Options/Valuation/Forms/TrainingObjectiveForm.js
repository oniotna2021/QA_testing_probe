import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// UI
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  Chip
} from "@material-ui/core";
import Button from "@material-ui/core/Button";

// components
import TimePicker from "components/Shared/TimePicker/TimePicker";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import ControlledAutocomplete from "components/Shared/AutocompleteSelect/AutocompleteSelect";

// utils
import { useStyles } from "utils/useStyles";
import {
  mapErrors,
  errorToast,
  successToast,
  formatDateToHHMMSS,
  optionWaterJourney,
  addKeyClinicalHistoryForm,
} from "utils/misc";

// services
import { getTrainingObjectives } from "services/VirtualJourney/TrainingObjectives";
import { getSupplements } from "services/MedicalSoftware/Supplements";
import { getPhysicalConditions } from "services/VirtualJourney/PhysicalConditions";
import { getVirtualTrainingElements } from "services/VirtualJourney/TrainingElementsVirtual";
import {
  postWelcomeForm,
  postWelcomeFormNutrition,
} from "services/VirtualJourney/WelcomeForm";

const propsTimePicker = {
  ampm: true,
  inputVariant: "outlined",
  margin: "normal",
  minutesStep: 5,
  mask: "__:__ _M",
  KeyboardButtonProps: { "aria-label": "change time" },
  emptyLabel: null,
  showTodayButton: true,
  todayLabel: "Hora actual",
  invalidLabel: "Hora inválida",
  InputAdornmentProps: { position: "start" },
};

const activity_level = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 7 },
];

const trainingMinutes = [
  { value: 30 },
  { value: 45 },
  { value: 60 },
  { value: 75 },
  { value: 90 },
  { value: 120 },
];

const TrainingObjectiveForm = ({ setIsOpen, userType, setReloadInfo }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [firstPart, setFirstPart] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const savedForm = useSelector((state) => state.virtualJourney.welcomeForm);
  const [sumplementation, setSumplementation] = useState(
    savedForm?.supplements?.length > 0 ? true : false
  );
  const [selectedTrainingElements, setSelectedTrainingElements] = useState(
    savedForm?.trainer_elements_virtual || []
  );
  const [selectedSupplemets, setSelectedSuplements] = useState(
    savedForm?.supplements || []
  );

  const [trainingObjectivesOptions, setTrainingObjectivesOptions] = useState(
    []
  );
  const [suplementsOptions, setsuplementsOptions] = useState([]);
  const [physicalConditions, setPhysicalConditions] = useState([]);
  const [trainingElements, setTrainingElements] = useState([]);
  const { user_id, quote_id } = useParams();
  const [open, setOpen] = useState(false);

  const [selectValue, setselectValue] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getTrainingObjectives().then(({ data }) =>
      setTrainingObjectivesOptions(data.data)
    );
    getPhysicalConditions().then(({ data }) =>
      setPhysicalConditions(data.data)
    );
    getSupplements().then(({ data }) => setsuplementsOptions(data.data.items));
    getVirtualTrainingElements().then(({ data }) =>
      setTrainingElements(data.data)
    );
    setSelectedTime(new Date(`2021-08-18T${savedForm?.hour_train_regular}`));
    setselectValue(savedForm && savedForm.goal_virtual ? savedForm.goal_virtual.map((x) => x.id) : []);
  }, [savedForm]);

  const handleChangeSuplements = (data) => {
    setSelectedSuplements(data);
  };

  const handleChangeTrainingElements = (data) => {
    setSelectedTrainingElements(data);
  };

  const onSubmit = (values) => {
    let functionToCall =
      userType === 30 ? postWelcomeFormNutrition : postWelcomeForm;
    setIsLoading(true);
    const payload = {
      form: 4,
      quote_id: quote_id,
      goal_virtual: selectValue?.map((x) => { return { id: x } }),
      description_other_goal: "",
      physical_condition_level: values.physical_condition_level,
      number_train_week: values.number_train_week,
      hour_train_regular: formatDateToHHMMSS(values.hour_train_regular),
      number_minutes_day: values.number_minutes_day,
      number_glasses_water: values.number_glasses_water,
      suplements: selectedSupplemets?.map((x) => {
        return { id: x.id };
      }),
      number_day_trainer_plan: values.number_train_week,
      time_session_trainer: values.number_minutes_day,
      trainer_elements_virtual:
        selectedTrainingElements.length > 0
          ? selectedTrainingElements?.map((x) => {
            return { id: x.id };
          })
          : [{ id: 1 }],
    };

    functionToCall(payload)
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_4_${user_id}_${quote_id}`, 100);
          dispatch(updateWelcomeForm(data.data));
          setIsOpen(false);
          setReloadInfo((prev) => !prev);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setIsLoading(false));
  };

  const handleNext = () => {
    setFirstPart(false);
  };

  const handleChange = (event) => {
    setselectValue(event);
  };

  const handleDelete = (value) => {
    setselectValue(selectValue.filter((items) => items !== value));
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        {
          <Typography variant="h5">
            {t("Valuation.ModuleVirtualJourneyTarget")}
          </Typography>
        }
        <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
      </div>
      {firstPart ? (
        <>
          <Controller
            rules={{ required: true }}
            control={control}
            name="training_objective"
            defaultValue={savedForm && savedForm?.goal_virtual ? savedForm?.goal_virtual : []}
            render={({ field }) => (
              <FormControl className="mt-3" variant="outlined">
                <InputLabel id="id_department">
                  {t("ListNutritionGoals.NutritionGoal")}
                </InputLabel>
                <Select
                  {...field}
                  fullWidth
                  open={open}
                  label={"Objetivo"}
                  multiple
                  value={selectValue}
                  error={errors.training_objective}
                  onClick={() => setOpen(!open)}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleChange(e.target.value);
                  }}
                  renderValue={(selected) => (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap'
                    }}>
                      {selected.map((item) => (
                        trainingObjectivesOptions.map((res) => (
                          item === res.id &&
                          <Chip
                            key={item}
                            label={item === res.id && res.name}
                            className='m-1'
                            onDelete={() => handleDelete(res.id)}
                          />
                        ))
                      ))}
                    </div>
                  )}
                >
                  {trainingObjectivesOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <Controller
            rules={{ required: true }}
            control={control}
            name="physical_condition_level"
            defaultValue={savedForm?.physical_condition_level}
            render={({ field }) => (
              <FormControl className="mt-3" variant="outlined">
                <InputLabel id="id_department">
                  {t("TrainingObjective.PhysicalCondition")}
                </InputLabel>
                <Select
                  {...field}
                  label={t("TrainingObjective.PhysicalCondition")}
                  error={errors.physical_condition_level}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {physicalConditions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {userType === 29 && (
            <div className="col-12">
              <ControlledAutocomplete
                control={control}
                value={selectedTrainingElements}
                name="trainer_elements_virtual"
                handleChange={handleChangeTrainingElements}
                options={trainingElements || []}
                getOptionLabel={(option) => `${option?.name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("TrainingObjective.TrainingElements")}
                    variant="outlined"
                    margin="normal"
                  />
                )}
                defaultValue={selectedTrainingElements}
              />
            </div>
          )}
          <div className="row m-0 mt-2 mb-3 align-items-center">
            <div className="col-6 p-2">
              <Typography align="center">
                {t("TrainingObjective.TrainingWeek")}
              </Typography>
            </div>
            <div className="col-6 pe-0">
              <Controller
                rules={{ required: true }}
                control={control}
                name="number_train_week"
                defaultValue={savedForm?.number_train_week}
                render={({ field }) => (
                  <FormControl className="mt-3" variant="outlined">
                    <Select
                      {...field}
                      error={errors.number_train_week}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    >
                      {activity_level.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <Controller
            rules={{ required: true }}
            control={control}
            name="hour_train_regular"
            defaultValue={savedForm?.hour_train_regular}
            render={({ field: { onChange } }) => (
              <FormControl variant="outlined">
                <TimePicker
                  error={errors.hour_train_regular}
                  className="mb-3"
                  value={selectedTime}
                  style={{ margin: 0 }}
                  {...propsTimePicker}
                  onChange={(e) => {
                    onChange(e);
                    setSelectedTime(e);
                  }}
                  label={t("TrainingObjective.TrainingHour")}
                  id="time-picker-2"
                />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="number_minutes_day"
            rules={{ required: true }}
            defaultValue={savedForm?.number_minutes_day}
            render={({ field }) => (
              <FormControl
                className="mt-2"
                variant="outlined"
                error={errors.number_minutes_day}
              >
                <InputLabel id="number_minutes_day">
                  {t("TrainingObjective.TrainingMinutes")}
                </InputLabel>
                <Select
                  {...field}
                  label={t("TrainingObjective.TrainingMinutes")}
                  error={errors.number_minutes_day}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {trainingMinutes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {userType !== 30 ? (
            <div className="d-flex justify-content-between mt-3 container row">
              <Button
                className={classes.buttonBack}
                onClick={() => setIsOpen(false)}
              >
                {t("Btn.Back")}
              </Button>
              <ButtonSave text="Siguiente" onClick={handleSubmit(handleNext)} />
            </div>
          ) : (
            <div className="d-flex justify-content-end mt-3 container row m-0">
              <ButtonSave
                text="Guardar"
                onClick={handleSubmit(onSubmit)}
                loader={isLoading}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="d-flex mt-3 justify-content-between align-items-center">
            <Typography>
              {t("DietaryHistoryForms.ModuleVirtualSupplementation")}
            </Typography>
            <div>
              <Controller
                rules={{ required: true }}
                control={control}
                name="take_suplements"
                defaultValue={savedForm?.supplements && savedForm?.supplements?.length > 0 ? "Si" : "No"}
                render={({ field }) => (
                  <FormControl component="fieldset">
                    <RadioGroup
                      defaultValue={
                        savedForm?.supplements && savedForm?.supplements.length > 0 ? "Si" : "No"
                      }
                      name="radio-buttons-group"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setSumplementation(
                          e.target.value === "Si" ? true : false
                        );
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        <FormControlLabel
                          value="Si"
                          control={<Radio />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio />}
                          label="No"
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
          </div>
          {sumplementation && (
            <div className="col-12 mt-1">
              <ControlledAutocomplete
                control={control}
                name="supplements"
                value={selectedSupplemets}
                handleChange={handleChangeSuplements}
                options={suplementsOptions || []}
                getOptionLabel={(option) => `${option?.name}`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={"Suplementos"}
                    variant="outlined"
                    margin="normal"
                  />
                )}
                defaultValue={selectedSupplemets}
              />
            </div>
          )}
          <div className="mt-3">
            <Controller
              rules={{ required: true }}
              control={control}
              name="number_glasses_water"
              defaultValue={savedForm?.number_glasses_water}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  error={errors.number_glasses_water}
                >
                  <InputLabel id="number_glasses_water">
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

          <div className="d-flex justify-content-between mt-3 container row">
            <Button
              className={classes.buttonBack}
              onClick={() => setFirstPart(true)}
            >
              {t("Btn.Back")}
            </Button>
            <ButtonSave
              text="Guardar"
              onClick={handleSubmit(onSubmit)}
              loader={isLoading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TrainingObjectiveForm;
