// react
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// ui
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

// utils
import { useStyles } from "utils/useStyles";
import {
  errorToast,
  mapErrors,
  infoToast,
  successToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";

// services
import {
  postWelcomeForm,
  postWelcomeFormNutrition,
} from "services/VirtualJourney/WelcomeForm";

const HealthConditionForm = ({
  setIsOpen,
  pathologicalAntecedents,
  surgeryTimes,
  musculoskeletalHistory,
  familyHistory,
  setReloadInfo,
  userType,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  let userGender = "Masculino";

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { user_id, quote_id } = useParams();
  const lastPositionForm = useSelector((state) =>
    state.virtualJourney.welcomeForm.MedicalFormHealthCondition
      ? state.virtualJourney.welcomeForm.MedicalFormHealthCondition.length
      : null
  );
  const savedForm = useSelector(
    (state) =>
      state?.virtualJourney?.welcomeForm?.MedicalFormHealthCondition &&
      state?.virtualJourney?.welcomeForm?.MedicalFormHealthCondition[
        lastPositionForm - 1
      ]
  );

  const dispatch = useDispatch();
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);

  //STATES QUESTIONS
  const [pathological, setPathological] = useState("");
  const [surgical, setSurgical] = useState("");
  const [musculoskeletal, setMusculoskeletal] = useState("");
  const [pharmacological, setPharmacological] = useState("");
  const [allergic, setAllergic] = useState("");
  const [family, setFamily] = useState("");
  const [pregnancy, setPregnancy] = useState("");
  const [planningFamily, setPlanningFamily] = useState("");

  //STATE STEPS
  const [step, setStep] = useState(0);

  useEffect(() => {
    setPathological(savedForm?.presence_of_a_pathological_history);
    setSurgical(savedForm?.surgery);
    setMusculoskeletal(savedForm?.musculoskeletal);
    setPharmacological(savedForm?.take_drugs);
    setAllergic(savedForm?.have_allergies);
    setFamily(savedForm?.presence_family_history);
    setPregnancy(savedForm?.state_pregnancy);
    setPlanningFamily(savedForm?.family_planning);
  }, []);

  //SEND DATA
  const onSubmit = (dataController) => {
    let functionToCall =
      userType === 30 ? postWelcomeFormNutrition : postWelcomeForm;
    setLoadingFetchForm(true);
    dataController.form = 5;
    dataController.user_id = user_id;
    dataController.quote_id = quote_id;

    functionToCall(dataController)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_5_${user_id}_${quote_id}`, 100);
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

  //NEXT STEP
  const handleNextStep = () => {
    setStep(step + 1);
  };

  //ERROR
  const onError = () => {
    enqueueSnackbar("Debes completar todos los campos", infoToast);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <div className="col-12 d-flex justify-content-between">
          <div className="col-10">
            <Typography variant="h5">
              {t("NutritionSuggestions.SectionOne")}
            </Typography>
          </div>
          <div className="col-1">
            <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
          </div>
        </div>

        {step === 0 ? (
          <div>
            {/*ANTECEDENTES PATOLOGICOS*/}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">{t("HealthCondition.title")}</div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="presence_of_a_pathological_history"
                  defaultValue={savedForm?.presence_of_a_pathological_history}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={
                        errors.presence_of_a_pathological_history ? true : false
                      }
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="presence_of_a_pathological_history"
                        onChange={(e) => {
                          setPathological(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.presence_of_a_pathological_history && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {pathological === "Si" ? (
                <>
                  <div className="col-12 mt-2">
                    <Controller
                      rules={{
                        required: pathological === "Si" ? true : false,
                      }}
                      control={control}
                      name="pathological_antecedents"
                      defaultValue={savedForm?.pathological_antecedents}
                      render={({ field }) => (
                        <FormControl
                          variant="outlined"
                          error={errors.pathological_antecedents ? true : false}
                        >
                          <InputLabel id="pathological_antecedents">
                            {t("HealthCondition.title")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="pathological_antecedents"
                            label={t("HealthCondition.title")}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {pathologicalAntecedents.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="mt-2">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="observation_of_pathological_history"
                      defaultValue={
                        savedForm?.observation_of_pathological_history
                      }
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("DetailClinicHistory.Observations")}
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/*ANTECEDENTES QUIRURGICOS*/}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">{t("HealthCondition.Surgery")}</div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="surgery"
                  defaultValue={savedForm?.surgery}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.surgery ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="surgery"
                        onChange={(e) => {
                          setSurgical(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.surgery && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {surgical === "Si" ? (
                <>
                  <div className="mt-2">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="obs_of_surgery"
                      defaultValue={savedForm?.obs_of_surgery}
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("DetailClinicHistory.Observations")}
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="col-12 mt-2">
                    <Controller
                      rules={{ required: surgical === "Si" ? true : false }}
                      control={control}
                      name="time_of_surgery"
                      defaultValue={savedForm?.time_of_surgery}
                      render={({ field }) => (
                        <FormControl
                          variant="outlined"
                          error={errors.time_of_surgery ? true : false}
                        >
                          <InputLabel id="time_of_surgery">
                            {t("HealthCondition.TimeSurgery")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="time_of_surgery"
                            label={t("HealthCondition.TimeSurgery")}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {surgeryTimes.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/*ANTECEDENTES OSTEOMUSCULARES*/}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">
                {t("HealthCondition.AntecedenTitle")}
              </div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="musculoskeletal"
                  defaultValue={savedForm?.musculoskeletal}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.musculoskeletal ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="musculoskeletal"
                        onChange={(e) => {
                          setMusculoskeletal(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.musculoskeletal && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {musculoskeletal === "Si" ? (
                <>
                  <div className="mt-2">
                    <Controller
                      rules={{
                        required: musculoskeletal === "Si" ? true : false,
                      }}
                      control={control}
                      name="time_of_musculoskeletal"
                      defaultValue={savedForm?.time_of_musculoskeletal}
                      render={({ field }) => (
                        <FormControl
                          variant="outlined"
                          error={errors.time_of_musculoskeletal ? true : false}
                        >
                          <InputLabel id="time_of_musculoskeletal">
                            {t("HealthCondition.AntecedenTitle")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="time_of_musculoskeletal"
                            label={t("HealthCondition.AntecedenTitle")}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {musculoskeletalHistory.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>

                  <div className="mt-2">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="obs_of_musculoskeletal"
                      defaultValue={savedForm?.obs_of_musculoskeletal}
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("DetailClinicHistory.Observations")}
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : step === 1 ? (
          <div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            {/*ANTECEDENTES FARMACOLOGICOS*/}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">{t("HealthCondition.TakeDrugs")}</div>
              <div className="col-5 ">
                <Controller
                  control={control}
                  name="take_drugs"
                  defaultValue={savedForm?.take_drugs}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.take_drugs ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="take_drugs"
                        onChange={(e) => {
                          setPharmacological(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.take_drugs && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {pharmacological === "Si" ? (
                <>
                  <div className="mt-2">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="drugs_observacion"
                      defaultValue={savedForm?.drugs_observacion}
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("DetailClinicHistory.Observations")}
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/*ANTECEDENTES ALERGICO*/}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7 ">{t("HealthCondition.HaveAllergies")}</div>
              <div className="col-5 ">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="have_allergies"
                  defaultValue={savedForm?.have_allergies}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.have_allergies ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="have_allergies"
                        onChange={(e) => {
                          setAllergic(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.have_allergies && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {allergic === "Si" ? (
                <>
                  <div className="mt-2">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="obs_allergies"
                      defaultValue={savedForm?.obs_allergies}
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("DetailClinicHistory.Observations")}
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
            {/*ANTECEDENTES FAMILIARES*/}
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7">
                {t("CardiovascularRisk.QuestionSeven")}
              </div>
              <div className="col-5">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="presence_family_history"
                  defaultValue={savedForm?.presence_family_history}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.presence_family_history ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="presence_family_history"
                        onChange={(e) => {
                          setFamily(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.presence_family_history && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {family === "Si" ? (
                <>
                  <div className="col-12 mt-2">
                    <Controller
                      rules={{ required: family === "Si" ? true : false }}
                      control={control}
                      name="family_history"
                      defaultValue={savedForm?.family_history}
                      render={({ field }) => (
                        <FormControl
                          variant="outlined"
                          error={errors.family_history ? true : false}
                        >
                          <InputLabel id="family_history">
                            {t("CardiovascularRisk.QuestionSeven")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="family_history"
                            label={t("CardiovascularRisk.QuestionSeven")}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {familyHistory.map((res) => (
                              <MenuItem key={res.name} value={res.id}>
                                {res.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  </div>
                  <div className="mt-2">
                    <Controller
                      rules={{ required: false }}
                      control={control}
                      name="obs_family_history"
                      defaultValue={savedForm?.obs_family_history}
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            {...field}
                            variant="outlined"
                            label={t("DetailClinicHistory.Observations")}
                            multiline
                            rows={4}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : step === 2 ? (
          <div>
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7">
                {t("HealthCondition.CurrentPregnancyTitle")}
              </div>
              <div className="col-5">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="state_pregnancy"
                  defaultValue={savedForm?.state_pregnancy}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.state_pregnancy ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="state_pregnancy"
                        onChange={(e) => {
                          setPregnancy(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.state_pregnancy && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {pregnancy === "Si" ? (
                <div className="col-12 my-3 d-flex align-items-center justify-content-between">
                  <div className="col-7">
                    {t("HealthCondition.GestationPeriod")}
                  </div>
                  <div className="col-4 mt-2">
                    <Controller
                      rules={{ required: pregnancy === "Si" ? true : false }}
                      control={control}
                      name="gestation_period"
                      defaultValue={savedForm.gestation_period}
                      render={({ field }) => (
                        <FormControl variant="outlined">
                          <TextField
                            {...field}
                            variant="outlined"
                            error={errors.gestation_period ? true : false}
                            label="Sem"
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="mx-2">
              <div className="col-12 d-flex justify-content-between">
                <div className="col-3 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="births"
                    defaultValue={savedForm?.births}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          {...field}
                          variant="outlined"
                          label={t("DetailClinicHistory.Birth")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                <div className="col-3 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="caesarean_sections"
                    defaultValue={savedForm?.caesarean_sections}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          {...field}
                          variant="outlined"
                          label={t("DetailClinicHistory.Caesarean")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                <div className="col-3 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="abortions"
                    defaultValue={savedForm.abortions}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          {...field}
                          variant="outlined"
                          label={t("DetailClinicHistory.Abortions")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>
              <div className="d-flex mt-4">
                <Controller
                  rules={{ required: false }}
                  control={control}
                  name="last_menstruation_date"
                  defaultValue={savedForm?.last_menstruation_date}
                  render={({ field }) => (
                    <FormControl>
                      <TextField
                        {...field}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        type="date"
                        variant="outlined"
                        label={t("HealthCondition.LastMenstruation")}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  )}
                />
              </div>
            </div>
            <div className="row m-0 d-flex mt-3 align-items-center">
              <div className="col-7">
                {t("DetailClinicHistory.FamilyPlanning")}
              </div>
              <div className="col-5">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="family_planning"
                  defaultValue={savedForm?.family_planning}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      error={errors.pregnancy ? true : false}
                    >
                      <RadioGroup
                        {...field}
                        row
                        name="family_planning"
                        onChange={(e) => {
                          setPlanningFamily(e.target.value);
                          field.onChange(e.target.value);
                        }}
                      >
                        <FormControlLabel
                          value="Si"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                {errors.family_planning && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
              {planningFamily === "Si" ? (
                <div className="col-12 mt-2">
                  <Controller
                    rules={{ required: false }}
                    control={control}
                    name="obs_family_planning"
                    defaultValue={savedForm?.obs_family_planning}
                    render={({ field }) => (
                      <FormControl>
                        <TextField
                          {...field}
                          multiline
                          rows={4}
                          variant="outlined"
                          label={t("DetailClinicHistory.Observations")}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {/*SECCION BOTONES*/}
        <div className="col-12 d-flex justify-content-around mt-3">
          <div>
            <Button
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className={classes.buttonBack}
            >
              {t("MedicalSuggestions.ButtonBack")}
            </Button>
          </div>
          {userGender && userGender === "Femenino" && step === 2 ? (
            <div>
              <ButtonSave
                onClick={handleSubmit(onSubmit, onError)}
                loader={loadingFetchForm}
                text={t("Btn.save")}
              />
            </div>
          ) : userGender && userGender === "Masculino" && step === 1 ? (
            <div>
              <ButtonSave
                onClick={handleSubmit(onSubmit, onError)}
                loader={loadingFetchForm}
                text={t("Btn.save")}
              />
            </div>
          ) : (
            <div>
              <Button
                onClick={handleSubmit(handleNextStep, onError)}
                className={classes.button}
                variant="contained"
                color="primary"
              >
                {t("Btn.Next")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default HealthConditionForm;
