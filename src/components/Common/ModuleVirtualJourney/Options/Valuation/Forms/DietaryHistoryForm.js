import React, { useState, useEffect, useLayoutEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// snackbar
import { useSnackbar } from "notistack";

// UI
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import TimePicker from "components/Shared/TimePicker/TimePicker";
import Loading from "components/Shared/Loading/Loading";

// utils
import { useStyles } from "utils/useStyles";
import {
  infoToast,
  errorToast,
  mapErrors,
  successToast,
  formatDateToHHMMSS,
  addKeyClinicalHistoryForm,
} from "utils/misc";

//services
import { searchElastic } from "services/_elastic";
import { postWelcomeFormNutrition } from "services/VirtualJourney/WelcomeForm";

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

const DietaryHistory = ({
  setIsOpen,
  supplements,
  sleepPatern,
  setReloadInfo,
  selectedFoodAlergies,
  setSelectedFoodAlergies,
  selectedFoodRejected,
  setSelectedFoodRejected,
  selectedFoodFavorite,
  setSelectedFoodFavorite,
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();
  const { user_id, quote_id } = useParams();
  const savedForm = useSelector(
    (state) =>
      state?.virtualJourney?.welcomeForm?.MedicalFormFoodBackground &&
      state?.virtualJourney?.welcomeForm?.MedicalFormFoodBackground[0]
  );

  const savedGeneral = useSelector(
    (state) => state?.virtualJourney?.welcomeForm
  );

  const dispatch = useDispatch();

  const [takeSupplements, setTakeSupplemets] = useState("");
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeUpTime, setWakeUpTime] = useState(null);
  const [foodTerm, setFoodTerm] = useState("");
  const [foodOptions, setFoodOptions] = useState([]);
  const [loadFetchForm, setLoadFetchForm] = useState(false);
  const [loadData, setLoadData] = useState(false);

  useEffect(() => {
    setLoadData(true);
    setTimeout(() => {
      setTakeSupplemets(savedForm?.take_supplements);
      setWakeUpTime(Date.parse(`2021-02-02 ${savedForm?.date_wu}`));
      setSleepTime(Date.parse(`2021-02-02 ${savedForm?.date_sleep}`));
      setSelectedFoodAlergies(
        savedGeneral?.food_allergies?.map((item) => {
          return { _source: item };
        })
      );
      setSelectedFoodFavorite(
        savedGeneral?.diet_not_food?.map((item) => {
          return { _source: item };
        })
      );
      setSelectedFoodRejected(
        savedGeneral?.FormWelcomeRejectedFood?.map((item) => {
          return { _source: item };
        })
      );
      setValue("food_allergy", savedGeneral?.food_allergies);
      setValue("rejected_food", savedGeneral?.diet_not_food);
      setValue("favorite_food", savedGeneral?.FormWelcomeRejectedFood);
      setValue("date_wu", savedGeneral?.date_wu);
      setValue("date_sleep", savedGeneral?.date_sleep);
      setLoadData(false);
    }, 100);
  }, [savedGeneral, savedForm]);

  useEffect(() => {
    searchElastic("food", {
      from: 0,
      size: 30,
      query: {
        match_all: {},
      },
    })
      .then(({ data }) => {
        if (data && data.data) {
          setFoodOptions(data.data.hits.hits);
        } else {
          setFoodOptions([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, []);

  const setFilterValue = (value) => {
    setFoodOptions([]);
    if (value) {
      searchElastic("food", {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: value,
                  fields: ["name"],
                  fuzziness: "2",
                },
              },
            ],
          },
        },
      })
        .then(({ data }) => {
          if (data && data.data) {
            setFoodOptions(data.data.hits.hits);
          } else {
            setFoodOptions([]);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    } else {
      setFoodOptions([]);
    }
  };

  const onSubmit = (dataSubmit) => {
    setLoadFetchForm(true);
    dataSubmit.form = 9;
    dataSubmit.user_id = user_id;
    dataSubmit.quote_id = quote_id;
    dataSubmit.supplements = [
      { id: dataSubmit?.supplements ? dataSubmit?.supplements : null },
    ];
    dataSubmit.date_sleep = formatDateToHHMMSS(sleepTime);
    dataSubmit.date_wu = formatDateToHHMMSS(wakeUpTime);
    dataSubmit.food_allergy = selectedFoodAlergies.map((item) => {
      return { id: item._source.id, name: item._source.name };
    });
    dataSubmit.rejected_food = selectedFoodRejected.map((item) => {
      return { id: item._source.id, name: item._source.name };
    });
    dataSubmit.favorite_food = selectedFoodFavorite.map((item) => {
      return { id: item._source.id, name: item._source.name };
    });
    postWelcomeFormNutrition(dataSubmit)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_9_${user_id}_${quote_id}`, 100);
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
        setLoadFetchForm(false);
      });
  };

  const onError = () => {
    enqueueSnackbar(t("Message.AlertFields"), infoToast);
  };

  return (
    <form className="row" onSubmit={handleSubmit(onSubmit, onError)}>
      {loadData ? (
        <Loading />
      ) : (
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            {
              <Typography variant="h5">
                {t("Valuation.ModuleVirtualJourneyFood")}
              </Typography>
            }
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>

          <Controller
            rules={{ required: true }}
            control={control}
            name="food_allergy"
            defaultValue={selectedFoodAlergies}
            render={({ field: { onChange } }) => (
              <Autocomplete
                onChange={(_, data) => {
                  onChange(data);
                  setSelectedFoodAlergies(data);
                }}
                className="mb-2"
                multiple
                defaultValue={selectedFoodAlergies}
                options={foodOptions}
                noOptionsText={t("DietaryHistoryForms.ModuleVirtualNotFood")}
                getOptionLabel={(option) => option._source?.name}
                renderOption={(option) => (
                  <React.Fragment>
                    <Typography variant="body2">
                      {option._source?.name}
                    </Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <>
                    <TextField
                      className={"mt-3"}
                      {...params}
                      label={t("DietaryHistoryForms.ModuleVirtualAllergies")}
                      variant="outlined"
                      value={foodTerm}
                      error={errors.food_allergy}
                      onChange={({ target }) => setFilterValue(target.value)}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  </>
                )}
              />
            )}
          />

          <Controller
            rules={{ required: true }}
            control={control}
            name="rejected_food"
            defaultValue={selectedFoodRejected}
            render={({ field: { onChange } }) => (
              <Autocomplete
                onChange={(_, data) => {
                  onChange(data);
                  setSelectedFoodRejected(data);
                }}
                className="mb-2"
                multiple
                options={foodOptions}
                defaultValue={selectedFoodRejected}
                noOptionsText={t("DietaryHistoryForms.ModuleVirtualNotFood")}
                getOptionLabel={(option) => option._source.name}
                renderOption={(option) => (
                  <React.Fragment>
                    <Typography variant="body2">
                      {option._source.name}
                    </Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <>
                    <TextField
                      className={"mt-3"}
                      {...params}
                      label={t("NutritionSuggestions.ItemTwo")}
                      variant="outlined"
                      value={foodTerm}
                      error={errors.rejected_food}
                      onChange={({ target }) => setFilterValue(target.value)}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  </>
                )}
              />
            )}
          />

          <Controller
            rules={{ required: true }}
            control={control}
            name="favorite_food"
            defaultValue={selectedFoodFavorite}
            render={({ field: { onChange } }) => (
              <Autocomplete
                onChange={(_, data) => {
                  onChange(data);
                  setSelectedFoodFavorite(data);
                }}
                className="mb-2"
                multiple
                options={foodOptions}
                defaultValue={selectedFoodFavorite}
                noOptionsText={t("DietaryHistoryForms.ModuleVirtualNotFood")}
                getOptionLabel={(option) => option._source.name}
                renderOption={(option) => (
                  <React.Fragment>
                    <Typography variant="body2">
                      {option._source.name}
                    </Typography>
                  </React.Fragment>
                )}
                renderInput={(params) => (
                  <>
                    <TextField
                      className={"mt-3"}
                      {...params}
                      label={t("NutritionSuggestions.ItemThree")}
                      variant="outlined"
                      value={foodTerm}
                      error={errors.favorite_food}
                      onChange={({ target }) => setFilterValue(target.value)}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  </>
                )}
              />
            )}
          />
          <div
            className="d-flex my-3 justify-content-between align-items-center"
            style={{ width: "100%" }}
          >
            <Typography>
              {t("DietaryHistoryForms.ModuleVirtualSupplementation")}
            </Typography>
            <Controller
              control={control}
              name="take_supplements"
              rules={{ required: true }}
              defaultValue={savedForm?.take_supplements}
              render={({ field }) => (
                <FormControl
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setTakeSupplemets(e.target.value);
                  }}
                  component="fieldset"
                  style={{ width: 100, display: "flex" }}
                >
                  <RadioGroup
                    defaultValue={savedForm?.take_supplements}
                    name="radio-buttons-group"
                  >
                    <div className="d-flex">
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
          {errors.take_supplements && (
            <FormHelperText error>
              {t("Message.AlertSelectOption")}
            </FormHelperText>
          )}

          {takeSupplements === "Si" && (
            <Controller
              rules={{
                required: takeSupplements === "Si" ? true : false,
              }}
              defaultValue={savedForm?.supplements}
              control={control}
              name="supplements"
              render={({ field }) => (
                <FormControl variant="outlined" error={errors.supplements}>
                  <InputLabel id="supplements">
                    {t("ListSupplements.TitleSupplements")}
                  </InputLabel>
                  <Select
                    className="mb-2"
                    {...field}
                    labelId="supplements"
                    label={t("ListSupplements.TitleSupplements")}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {supplements &&
                      supplements?.map((res) => (
                        <MenuItem key={res.name} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          )}

          <div className="row m-0 mb-2">
            <div className="col-6 ps-0">
              <Controller
                rules={{ required: true }}
                control={control}
                name="date_wu"
                defaultValue={wakeUpTime}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <TimePicker
                      error={errors.date_wu}
                      className="my-2"
                      style={{ margin: 0 }}
                      {...propsTimePicker}
                      label={t("DietaryHistoryForms.ModuleVirtualWakeUp")}
                      id="time-picker-2"
                      value={wakeUpTime}
                      onChange={(data) => {
                        field.onChange(data);
                        setWakeUpTime(data);
                      }}
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className="col-6 pe-0">
              <Controller
                rules={{ required: true }}
                control={control}
                name="date_sleep"
                defaultValue={sleepTime}
                render={({ field }) => (
                  <FormControl variant="outlined">
                    <TimePicker
                      error={errors.date_sleep}
                      className="my-2"
                      style={{ margin: 0 }}
                      {...propsTimePicker}
                      label={t("DietaryHistoryForms.ModuleVirtualLayDown")}
                      id="time-picker-2"
                      value={sleepTime}
                      onChange={(data) => {
                        field.onChange(data);
                        setSleepTime(data);
                      }}
                    />
                  </FormControl>
                )}
              />
            </div>
          </div>

          <Controller
            rules={{
              required: true,
            }}
            control={control}
            name="sleep_patron"
            defaultValue={savedForm?.sleep_patron}
            render={({ field }) => (
              <FormControl variant="outlined" error={errors.sleep_patron}>
                <InputLabel id="sleep_patern">
                  {t("NutritionSuggestions.ItemFive")}
                </InputLabel>
                <Select
                  {...field}
                  labelId="sleep_patern"
                  label={t("NutritionSuggestions.ItemFive")}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {sleepPatern &&
                    sleepPatern?.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="observ_background"
            defaultValue={savedForm?.observ_background}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                rows={5}
                multiline
                error={errors.observ_background}
                id="observ_background"
                variant="outlined"
                label={t("NutritionSuggestions.ItemSeven")}
                className="my-2"
              />
            )}
          />

          <div className="d-flex justify-content-between mt-3 container">
            <Button
              className={classes.buttonBack}
              onClick={() => setIsOpen(false)}
            >
              {t("Btn.Back")}
            </Button>
            <ButtonSave
              text={t("Btn.save")}
              typeButton="submit"
              loader={loadFetchForm}
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default DietaryHistory;
