//REACT
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";

//UTILS
import { useStyles } from "utils/useStyles";
import {
  addKeyClinicalHistoryForm,
  addFormsPercentToLocalStorage,
  errorToast,
  mapErrors,
  infoToast,
  successToast,
} from "utils/misc";
import Swal from "sweetalert2";

//SERVICES
import { saveForms } from "services/MedicalSoftware/SaveForms";
import { getLoadForm } from "services/MedicalSoftware/LoadForms";

//COMPONENTS
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Loading from "components/Shared/Loading/Loading";
import ElasticSearchAutocomplete from "components/Shared/ElasticSearchAutocomplete/ElasticSearchAutocomplete";

export const HealthconditionForm = ({
  setIsOpen,
  userGender,
  setReload,
  reload,
  completeHealthCondition,
  setCompleteHealthCondition,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const formId = 14;
  let percent = {};
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const [loadForm, setLoadForm] = useState(false);
  const [loadingFetchForm, setLoadingFetchForm] = useState(false);

  //STATES DATA
  const [option, setOption] = useState();

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

  //PARAMETROS
  let { quote_id, appoiment_type_id, medical_professional_id, user_id } =
    useParams();

  //CONSULT FORM
  useEffect(() => {
    setLoadForm(true);
    getLoadForm(
      formId,
      appoiment_type_id,
      user_id,
      window.localStorage.getItem(`form-${user_id}-${formId}`) ? 1 : 0
    ).then(({ data }) => {
      if (data.status === "success") {
        setOption(data.data[0].customInputFields);
        setPathological(data.data[0].customInputFields[0].value);
        setSurgical(data.data[0].customInputFields[3].value);
        setMusculoskeletal(data.data[0].customInputFields[6].value);
        setPharmacological(data.data[0].customInputFields[9].value);
        setAllergic(data.data[0].customInputFields[11].value);
        setFamily(data.data[0].customInputFields[13].value);
        setPregnancy(data.data[0].customInputFields[16].value);
        setPlanningFamily(data.data[0].customInputFields[22].value);
      } else if (data.status === "error") {
        enqueueSnackbar(mapErrors(data.data), errorToast);
      }
      setLoadForm(false);
    });
  }, [appoiment_type_id, completeHealthCondition, enqueueSnackbar, user_id]);

  //SEND DATA
  const onSubmit = (dataController) => {
    dataController.pathological_antecedents = Number(
      dataController.pathological_antecedents?.id
    );
    dataController.time_of_surgery = Number(dataController.time_of_surgery?.id);
    dataController.time_of_musculoskeletal = Number(
      dataController.time_of_musculoskeletal?.id
    );
    dataController.family_history = Number(dataController.family_history?.id);

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
          enqueueSnackbar(t("Message.SavedSuccess"), successToast);
        } else {
          enqueueSnackbar(mapErrors(req), errorToast);
        }
        setLoadForm(false);
        percent = { id: formId, completed: req.data.data.percent };
        addKeyClinicalHistoryForm(`form-${user_id}-${formId}`, percent);
        addFormsPercentToLocalStorage(percent);
        setIsOpen(false);
        setReload(!reload);
        setCompleteHealthCondition(1);
      })
      .catch((err) => {
        Swal.fire({
          title: mapErrors(err),
          icon: "error",
        });
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
      {loadForm ? (
        <Loading />
      ) : (
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
                    defaultValue={option && option[0] && option[0].value}
                    render={({ field }) => (
                      <FormControl
                        variant="outlined"
                        error={
                          errors.presence_of_a_pathological_history
                            ? true
                            : false
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
                      <ElasticSearchAutocomplete
                        control={control}
                        elasticIndex="pathological_history_all"
                        name={"pathological_antecedents"}
                        required={true}
                        label={t("HealthCondition.title")}
                        error={errors.pathological_antecedents}
                        defaultValue={
                          option[1].value === null ? "" : option[1].value
                        }
                        setValue={setValue}
                      />
                    </div>
                    <div className="mt-2">
                      <Controller
                        rules={{ required: false }}
                        control={control}
                        name="observation_of_pathological_history"
                        defaultValue={option && option[2] && option[2].value}
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
                    defaultValue={option && option[3] && option[3].value}
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
                        defaultValue={
                          option[4]?.value === null ? "" : option[4]?.value
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

                    <div className="col-12 mt-2">
                      <ElasticSearchAutocomplete
                        control={control}
                        elasticIndex="surgery_times_all"
                        name={"time_of_surgery"}
                        required={true}
                        label={t("HealthCondition.TimeSurgery")}
                        error={errors.time_of_surgery}
                        defaultValue={
                          option[5].value === null ? "" : option[5].value
                        }
                        setValue={setValue}
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
                    defaultValue={option && option[6] && option[6].value}
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
                      <ElasticSearchAutocomplete
                        control={control}
                        elasticIndex="musculoskeletal_history_all"
                        name={"time_of_musculoskeletal"}
                        required={true}
                        label={t("HealthCondition.AntecedenTitle")}
                        error={errors.time_of_musculoskeletal}
                        defaultValue={
                          option[7].value === null ? "" : option[7].value
                        }
                        setValue={setValue}
                      />
                    </div>

                    <div className="mt-2">
                      <Controller
                        rules={{ required: false }}
                        control={control}
                        name="obs_of_musculoskeletal"
                        defaultValue={
                          option[8]?.value === null ? "" : option[8]?.value
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
                    defaultValue={option && option[9] && option[9].value}
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
                        defaultValue={option && option[10] && option[10].value}
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
                <div className="col-7 ">
                  {t("HealthCondition.HaveAllergies")}
                </div>
                <div className="col-5 ">
                  <Controller
                    rules={{ required: true }}
                    control={control}
                    name="have_allergies"
                    defaultValue={option && option[11] && option[11].value}
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
                        defaultValue={option && option[12] && option[12].value}
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
                    defaultValue={option && option[13] && option[13].value}
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
                      <ElasticSearchAutocomplete
                        control={control}
                        elasticIndex="family_history_all"
                        name={"family_history"}
                        required={true}
                        label={t("CardiovascularRisk.QuestionSeven")}
                        error={errors.family_history}
                        defaultValue={option && option[14] && option[14].value}
                        setValue={setValue}
                      />
                      {/* <Controller
                        rules={{ required: family === "Si" ? true : false }}
                        control={control}
                        name="family_history"
                        defaultValue={option && option[14] && option[14].value}
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
                      /> */}
                    </div>
                    <div className="mt-2">
                      <Controller
                        rules={{ required: false }}
                        control={control}
                        name="obs_family_history"
                        defaultValue={option && option[15] && option[15].value}
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
                    defaultValue={option && option[16] && option[16].value}
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
                        defaultValue={option && option[17] && option[17].value}
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
                      defaultValue={option && option[18] && option[18].value}
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
                      defaultValue={option && option[19] && option[19].value}
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
                      defaultValue={option && option[20] && option[20].value}
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
                    defaultValue={option && option[21] && option[21].value}
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
                    defaultValue={option && option[22] && option[22].value}
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
                      defaultValue={option && option[23] && option[23].value}
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
            {userGender &&
            Array.isArray(userGender) &&
            userGender.length > 0 &&
            userGender[0].name === "Femenino" &&
            step === 2 ? (
              <div>
                <ButtonSave
                  onClick={handleSubmit(onSubmit, onError)}
                  loader={loadingFetchForm}
                  text={t("Btn.save")}
                />
              </div>
            ) : userGender &&
              Array.isArray(userGender) &&
              userGender.length > 0 &&
              userGender[0].name === "Masculino" &&
              step === 1 ? (
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
      )}
    </form>
  );
};
