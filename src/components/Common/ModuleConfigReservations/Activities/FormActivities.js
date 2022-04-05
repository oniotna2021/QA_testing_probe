import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import slugify from "slugify";
import { useTranslation } from "react-i18next";

//UI
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";

//Components
import ColorPalettePicker from "components/Shared/ColorPalettePicker/ColorPalettePicker";
import TimePicker from "components/Shared/TimePicker/TimePicker";
import MultiSelect from "components/Common/ModuleConfigReservations/Activities/MultiSelect";
import DropzoneImage from "components/Shared/DropzoneImage/DropzoneImage";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//Services
import { postActivity, putActivity } from "services/Reservations/activities";
import { getAttributesPagination } from "services/Reservations/attributes";
import { getAllActivityCategory } from "services/Reservations/activityCategory";

//utils
import {
  successToast,
  errorToast,
  mapErrors,
  formatDateToHHMMSS,
  setFormData,
  regexNumbersPositive,
} from "utils/misc";

// Data colors
import { colorsPalette } from "assets/colorsPalette";

const optionsModality = [
  { id: "presencial", name: "Presencial" },
  { id: "virtual", name: "Virtual" },
];

const optionsTypeSchedule = [
  { name: "En sede", value: "in_venue" },
  { name: "Personalizado", value: "custom" },
  { name: "Producto", value: "product" },
];

const propsTimePicker = {
  ampm: false,
  inputVariant: "outlined",
  margin: "normal",
  minutesStep: 5,
  KeyboardButtonProps: { "aria-label": "change time" },
  emptyLabel: null,
  invalidLabel: "Hora inválida",
  InputAdornmentProps: { position: "start" },
};

export const FormActivity = ({
  isEdit,
  dataItem,
  defaultValue,
  setExpanded,
  setLoad,
  files,
  setFiles,
}) => {
  const { t } = useTranslation();
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();
  const [viewRestrictAges, setViewRestrictAges] = useState(
    defaultValue?.check_age_restriction
  );
  const { enqueueSnackbar } = useSnackbar();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [dataAttributes, setDataAttributes] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);

  useEffect(() => {
    getAttributesPagination(100, 1)
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataAttributes(data.data.items);
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
    getAllActivityCategory()
      .then(({ data }) => {
        if (
          data &&
          data.status === "success" &&
          data.data &&
          data.data.length > 0
        ) {
          setDataCategories(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    const setDefaultValues = () => {
      setValue("name", dataItem?.name);
      setValue(
        "duration",
        dataItem?.duration !== null ? dataItem.duration.slice(3, 5) : 0
      );
      setValue("description", dataItem?.description);
      setValue("type_schedule", dataItem?.type_schedule);
      if (dataItem?.check_age_restriction === 1) {
        setValue("range_ini", dataItem?.range_ini);
        setValue("range_end", dataItem?.range_end);
      }
    };
    if (isEdit) {
      setDefaultValues();
    }
  }, [isEdit, dataItem, setValue]);

  const onSubmit = (data) => {
    let dataForm = {
      ...data,
      atributes:
        data.atributes.length !== 0
          ? data.atributes.filter((id) => id !== null)
          : [],
      duration: `00:${data.duration}:00`,
      check_age_restriction: data.check_age_restriction === true ? 1 : 0,
    };

    if (files[0]?.path) {
      dataForm = {
        ...dataForm,
        image: files[0],
      };
    }

    setLoadingFetch(true);
    const functionCall = isEdit ? putActivity : postActivity;
    functionCall(
      isEdit ? setFormData(dataForm) : setFormData(dataForm),
      dataItem?.uuid
    )
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          setExpanded(false);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setLoad(true);
          setFiles([]);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
          setLoadingFetch(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setLoadingFetch(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="container">
        <div class="row justify-content-center">
          {!isEdit && (
            <div class="col-2">
              <DropzoneImage files={files} setFiles={setFiles} />
            </div>
          )}

          <div class="col">
            <div className="row m-0">
              <div className={`col-6 m-0`}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormControl variant="outlined" className="mb-3">
                      <TextField
                        {...field}
                        fullWidth
                        id={slugify("name", { lower: true })}
                        type="text"
                        label="Nombre de la actividad"
                        rows={1}
                        variant="outlined"
                      />
                      {errors.name && (
                        <FormHelperText error>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />

                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="duration"
                  defaultValue={null}
                  render={({ field }) => (
                    // <FormControl variant="outlined">
                    //   <TimePicker
                    //     {...field}
                    //     id={slugify("duration", { lower: true })}
                    //     label={"Duración"}
                    //     {...propsTimePicker}
                    //   />
                    //   {errors.duration && (
                    //     <FormHelperText error>
                    //       {t("Field.required")}
                    //     </FormHelperText>
                    //   )}
                    // </FormControl>
                    <FormControl variant="outlined">
                      <TextField
                        {...field}
                        fullWidth
                        inputProps={{ maxLength: 2, min: 0, max: 9 }}
                        id={slugify("name", { lower: true })}
                        label="Duración"
                        onKeyUp={(e) => {
                          if (regexNumbersPositive.test(e.target.value)) {
                            field.onChange(e.target.value);
                          } else {
                            e.target.value = "";
                            field.onChange("");
                          }
                        }}
                        variant="outlined"
                      />
                      {errors.description && (
                        <FormHelperText error>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div className={`col-6`}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <TextField
                        {...field}
                        fullWidth
                        id={slugify("name", { lower: true })}
                        type="textarea"
                        label="Descripción"
                        rows={4}
                        multiline={true}
                        variant="outlined"
                      />
                      {errors.description && (
                        <FormHelperText error>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
            </div>

            <div className="row mt-3 m-0">
              <div className={`col-6 m-0`}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="type_schedule"
                  defaultValue={defaultValue?.type_schedule}
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <InputLabel>{t("FormActivities.TypeDiary")}</InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        id={slugify("type_schedule", { lower: true })}
                        label="Tipo de Agenda"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      >
                        {optionsTypeSchedule &&
                          optionsTypeSchedule.map((type) => (
                            <MenuItem value={`${type.value}`} key={type.value}>
                              {type.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.type_activity_id && (
                        <FormHelperText error>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>

              <div className="col-6 m-0">
                <div className="row m-0">
                  <div className="col">
                    <div className="row align-items-center justify-content-center">
                      <div className="col-3">
                        <Controller
                          defaultValue={defaultValue?.check_age_restriction}
                          rules={{ required: false }}
                          control={control}
                          name="check_age_restriction"
                          render={({ field }) => (
                            <FormControl>
                              <Checkbox
                                {...field}
                                onChange={(e) => {
                                  setViewRestrictAges(e.target.checked);
                                  field.onChange(e.target.checked);
                                }}
                                checked={field.value}
                                color="primary"
                              />
                            </FormControl>
                          )}
                        />
                      </div>
                      <div className="col-9 justify-items-center">
                        <Typography variant="body2">
                          {t("FormActivities.AgeRestriction")}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-3 m-0">
              <div className={`col-6 m-0`}>
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="type_activity_id"
                  defaultValue={defaultValue?.type_activity_id}
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <InputLabel>
                        {t("FormAppointmentByMedical.InputType")}
                      </InputLabel>
                      <Select
                        {...field}
                        fullWidth
                        id={slugify("type_activity_id", { lower: true })}
                        label="Tipo"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                        }}
                      >
                        {dataCategories &&
                          dataCategories.map((category) => (
                            <MenuItem
                              value={`${category.id}`}
                              key={category.id}
                            >
                              {category.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.type_activity_id && (
                        <FormHelperText error>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </div>
              <div className="col-6 m-0">
                {viewRestrictAges === true && (
                  <div className="d-flex justify-content-between">
                    <div className="me-2">
                      <Controller
                        rules={{
                          required: getValues().check_age_restriction
                            ? true
                            : false,
                        }}
                        control={control}
                        name="range_ini"
                        render={({ field }) => (
                          <FormControl>
                            <TextField
                              {...field}
                              fullWidt
                              variant="outlined"
                              type="number"
                              label="Edad Inicial"
                              onKeyUp={(e) => {
                                if (regexNumbersPositive.test(e.target.value)) {
                                  field.onChange(parseInt(e.target.value));
                                } else {
                                  e.target.value = "";
                                  field.onChange("");
                                }
                              }}
                              inputProps={{ min: 1 }}
                            />
                            {errors.range_ini && (
                              <FormHelperText error>
                                {t("Field.required")}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>

                    <div>
                      <Controller
                        rules={{
                          required: getValues().check_age_restriction
                            ? true
                            : false,
                        }}
                        control={control}
                        name="range_end"
                        render={({ field }) => (
                          <FormControl>
                            <TextField
                              {...field}
                              fullWidt
                              variant="outlined"
                              type="number"
                              label="Edad Final"
                              onKeyUp={(e) => {
                                if (regexNumbersPositive.test(e.target.value)) {
                                  field.onChange(parseInt(e.target.value));
                                } else {
                                  e.target.value = "";
                                  field.onChange("");
                                }
                              }}
                              inputProps={{ min: 1 }}
                            />
                            {errors.range_end && (
                              <FormHelperText error>
                                {t("Field.required")}
                              </FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="row mt-4 mx-0">
              <div className="col-6 m-0">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  defaultValue={
                    defaultValue?.colour ? defaultValue?.colour : null
                  }
                  name="colour"
                  render={({ field }) => (
                    <>
                      <ColorPalettePicker
                        valueColor={field.value}
                        onChangeColor={field.onChange}
                        dataColors={colorsPalette}
                      />
                      {errors.colour && (
                        <FormHelperText error>
                          {t("Field.required")}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="col-6 m-0">
                <Controller
                  rules={{ required: true }}
                  control={control}
                  name="modality"
                  defaultValue={defaultValue?.modality}
                  render={({ field }) => (
                    <FormControl variant="outlined">
                      <InputLabel id="select_modalidad">
                        {t("FormAppointmentByMedical.Modality")}
                      </InputLabel>
                      <Select
                        labelId="select_modalidad"
                        label="Modalidad"
                        {...field}
                      >
                        {optionsModality.map((res) => (
                          <MenuItem key={res.name} value={res.id}>
                            {res.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.modality && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
            </div>

            <div className="row mt-4 mx-0">
              <div className="col">
                <MultiSelect
                  form={[
                    {
                      className: "",
                      label: "Atributos",
                      required: true,
                      name: "atributes",
                    },
                  ]}
                  dataSelect={dataAttributes || []}
                  control={control}
                  defaultValue={
                    defaultValue?.atributes
                    // ? defaultValue?.atributes.some((p) => p.id !== null)
                    // : []
                  }
                />
                {errors.atributes && (
                  <FormHelperText error>{t("Field.required")}</FormHelperText>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <ButtonSave text={t("Btn.save")} loader={loadingFetch} />
          </div>
        </div>
      </div>
    </form>
  );
};
