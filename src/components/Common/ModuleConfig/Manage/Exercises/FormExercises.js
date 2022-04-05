import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

//COMPONENTS
import { CommonComponentSimpleForm } from "components/Shared/SimpleForm/SimpleForm";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import OptionsPlaceTraining from "components/Shared/OptionsPlaceTraining/OptionsPlaceTraining";
import ControlledAutocomplete from "components/Shared/ControlledAutocomplete/ControlledAutocomplete";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import SearchUrlVideosElastic from "components/Shared/SearchUrlVideosElastic/SearchUrlVideosElastic";
import SearchUrlmagesElastic from "components/Shared/SearchUrlmagesElastic/SearchUrlmagesElastic";
import MediaUploadButton from "components/Shared/MediaUploadButton/MediaUploadButton";
import UploadImagesModal from "components/Common/ModuleConfig/Manage/Exercises/Modals/UploadImagesModal";
import UploadVideosModal from "components/Common/ModuleConfig/Manage/Exercises/Modals/UploadVideosModal";

//FORMS
import { ExercisesForm } from "config/Forms/ConfigForms";

//UI
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Alert from "@material-ui/lab/Alert";

//SWAL
import Swal from "sweetalert2";

//IMPORTS
import { useSnackbar } from "notistack";

//TRANSLATE
import { useTranslation } from "react-i18next";

//UTILS
import { errorToast, mapErrors, decodeURL } from "utils/misc";

//Services
import { postExercises, putExercises } from "services/TrainingPlan/Exercises";
import { getObjectives } from "services/TrainingPlan/Objectives";
import { getMuscleGroups } from "services/TrainingPlan/MuscleGroups";
import { getMedicalConditions } from "services/TrainingPlan/MedicalConditions";
import { getTrainingElements } from "services/TrainingPlan/TrainingElements";
import { getTrainingLevels } from "services/TrainingPlan/TrainingLevels";
import { getTrainingSteps } from "services/TrainingPlan/TrainingSteps";
import { getMovements } from "services/TrainingPlan/Movements";

//Internal dependices
import { casteMapArray, concatWithEquivalentNames } from "utils/misc";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "sm",
};

export const FormExercises = ({
  userId,
  defaultValue,
  setReload,
  setExpanded,
  isUpdate = false,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { handleSubmit, control, setValue } = useForm();
  const [dataObjectives, setDataObjectives] = useState([]);
  const [dataMuscleGroups, setDataMuscleGroups] = useState([]);
  const [dataMedicalConditions, setDataMedicalConditions] = useState([]);
  const [dataTrainingElements, setDataTrainingElements] = useState([]);
  const [dataTrainingLevels, setDataTrainingLevels] = useState([]);
  const [dataTrainingSteps, setDataTrainingSteps] = useState([]);
  const [dataMovements, setDataMovements] = useState([]);
  const [optionPlaceTraining, setOptionPlaceTraining] = useState(
    isUpdate
      ? () => defaultValue?.training_places.map((x) => Number(x.id))
      : () => []
  );
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [messageError, setMessageError] = useState("");

  // media
  const [mediaImagesModal, setMediaImagesModal] = useState(false);
  const [mediaVideosModal, setMediaVideosModal] = useState(false);
  const [desktopImage, setDesktopImage] = useState([]);
  const [mobileImage, setMobileImage] = useState([]);
  const [verticalVideo, setVerticalVideo] = useState([]);
  const [horizontalVideo, setHorizontalVideo] = useState([]);

  const onSubmit = (data) => {
    if (!data.training_places && !isUpdate) {
      setMessageError(t("PlaceTraining.Required"));
      return;
    }
    if (Number.isInteger(data.is_home_training)) {
      setMessageError(t("PlaceTrainingIsHome.Required"));
      return;
    }

    if (optionPlaceTraining && optionPlaceTraining.length === 0) {
      setMessageError("Por favor seleccione el lugar de entrenamiento");
      return;
    }

    if (!data.video_url) {
      setMessageError("Video Vertical requerido");
      return;
    }

    if (!data.image_desktop) {
      setMessageError("Imagen de Escritorio requerido");
      return;
    }

    if (!data.image_mobile) {
      setMessageError("Imagen Movil requerido");
      return;
    }

    if (!data.video_url_landscape) {
      setMessageError("Video Horizontal requerido");
      return;
    }

    setLoadingFetch(true);
    setReload(false);
    setMessageError("");

    const dataSubmit = {
      ...data,
      name: data.name,
      description: data.description,
      duration: data.duration,
      trainer_id: userId,
      training_levels: casteMapArray(data.training_levels),
      training_places: optionPlaceTraining.map((x) => {
        return { id: x };
      }),
      training_steps: casteMapArray(data.training_steps),
      contraindications: casteMapArray(data.contraindications),
      pathologies: casteMapArray(data.pathologies),
      muscle_groups: casteMapArray(data.muscle_groups),
      training_elements: casteMapArray(data.training_elements),
      movements: casteMapArray(data.movements),
      is_home_training: parseInt(
        data?.is_home_training || defaultValue?.is_home_training || 0
      ),
      video_url: data.video_url.replace("Verticales/", ""),
      video_url_landscape: data.video_url_landscape.replace(
        "Horizontales/",
        ""
      ),
      image_desktop: data.image_desktop,
      image_mobile: data.image_mobile,
      status: Number(defaultValue?.status),
    };

    if (isUpdate) {
      putExercises(defaultValue.uuid, dataSubmit)
        .then(({ data }) => {
          setLoadingFetch(false);
          if (data && data.status === "success") {
            Swal.fire({
              title: "Se ha Actualizado el ejercicio",
              icon: "success",
            });
            setReload(true);
            setExpanded(false);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    } else {
      postExercises(dataSubmit)
        .then(({ data }) => {
          setLoadingFetch(false);
          if (data && data.status === "success") {
            Swal.fire({
              title: "Se ha guardado el ejercicio",
              icon: "success",
            });
            setReload(true);
            setExpanded(false);
          } else {
            enqueueSnackbar(mapErrors(data), errorToast);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  };

  const handleOptionPlaceTraining = (event, selectedOption) => {
    setMessageError("");
    setValue("training_places", selectedOption);
    setOptionPlaceTraining(selectedOption);
  };

  useEffect(() => {
    getObjectives(100, 1)
      .then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataObjectives(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getMuscleGroups(100, 1)
      .then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataMuscleGroups(concatWithEquivalentNames(data.data.items));
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getMedicalConditions(100, 1)
      .then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataMedicalConditions(concatWithEquivalentNames(data.data.items));
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getTrainingLevels(100, 1)
      .then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataTrainingLevels(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getTrainingElements(100, 1)
      .then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataTrainingElements(concatWithEquivalentNames(data.data.items));
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getTrainingSteps()
      .then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataTrainingSteps(data.data.items);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data?.message), errorToast);
          }
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });

    getMovements(100, 1)
      .then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items.length > 0
        ) {
          setDataMovements(concatWithEquivalentNames(data.data.items));
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

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-4 mt-2">
            <CommonComponentSimpleForm
              form={ExercisesForm.form_one}
              control={control}
              defaultValue={defaultValue}
            />
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Typography variant="body2">
                {t("FormExercises.SimpleForm")}
              </Typography>
              <OptionsPlaceTraining
                option={optionPlaceTraining}
                handleOption={handleOptionPlaceTraining}
              />
            </div>
            <Controller
              name="is_home_training"
              control={control}
              defaultValue={
                isUpdate
                  ? defaultValue?.is_home_training
                    ? String(defaultValue?.is_home_training)
                    : "0"
                  : ""
              }
              render={({ field }) => (
                <FormControl component="fieldset">
                  <RadioGroup {...field} row>
                    <div className="col d-flex align-items-center">
                      <Typography>{t("FormExercises.FormControl")}</Typography>
                      <div className=" col d-flex justify-content-end">
                        <FormControlLabel
                          value="1"
                          control={<Radio color="primary" />}
                          label="Si"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio color="primary" />}
                          label="No"
                        />
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
              )}
            />

            {/* Upload media */}
            {/* <div className="col mt-5 d-flex justify-content-around">
              <MediaUploadButton
                legend={t("FormExercises.UploadImage")}
                openModal={setMediaImagesModal}
              />

              <MediaUploadButton
                legend={t("FormExercises.UploadVideo")}
                openModal={setMediaVideosModal}
              />
            </div> */}

            <div className="col mt-3">
              {desktopImage.length > 0 && mobileImage.length > 0 && (
                <>
                  <Typography>
                    <strong>{t("FormExercises.Images")}</strong>
                  </Typography>
                  <>
                    <Typography variant="body2">
                      <strong>{t("FormExercises.Desktop")}:</strong>
                      {`${desktopImage[0]?.path} - ${desktopImage[0]?.size} byte`}
                    </Typography>
                    <Typography variant="body2">
                      <strong>{t("FormExercises.Mobile")}:</strong>
                      {`${mobileImage[0]?.path} - ${mobileImage[0]?.size} byte`}
                    </Typography>
                  </>
                </>
              )}

              {verticalVideo.length > 0 && horizontalVideo.length > 0 && (
                <>
                  <Typography className="mt-3">
                    <strong>{t("FormExercises.VideosTitle")}</strong>
                  </Typography>
                  <>
                    <Typography variant="body2">
                      <strong>{t("FormExercises.Vertical")}:</strong>
                      {`${verticalVideo[0]?.path} - ${verticalVideo[0]?.size} byte`}
                    </Typography>
                    <Typography variant="body2">
                      <strong>{t("FormExercises.Horizontal")}:</strong>
                      {`${horizontalVideo[0]?.path} - ${horizontalVideo[0]?.size} byte`}
                    </Typography>
                  </>
                </>
              )}
            </div>
          </div>

          <div className="col-8">
            <div className="d-flex justify-content-between">
              <div className="col" style={{ width: "180px" }}>
                <ControlledAutocomplete
                  control={control}
                  name="muscle_groups"
                  required={true}
                  options={dataMuscleGroups}
                  getOptionLabel={(option) => `${option.name}`}
                  defaultValue={defaultValue?.muscle_groups}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        t("FormExercises.MuscleGroups") + (true ? "*" : "")
                      }
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="col mx-1" style={{ width: "180px" }}>
                <ControlledAutocomplete
                  control={control}
                  name="training_levels"
                  required={true}
                  options={dataTrainingLevels}
                  defaultValue={defaultValue?.training_levels}
                  getOptionLabel={(option) => `${option.name}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("FormExercises.Levels") + (true ? "*" : "")}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </div>
              <div className="col" style={{ width: "180px" }}>
                <ControlledAutocomplete
                  control={control}
                  name="contraindications"
                  options={dataMedicalConditions}
                  required={false}
                  getOptionLabel={(option) => `${option.name}`}
                  defaultValue={defaultValue?.contraindications}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("MedicalSuggestions.Contraindications")}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="col mx-1" style={{ width: "180px" }}>
                <ControlledAutocomplete
                  control={control}
                  name="training_elements"
                  options={dataTrainingElements}
                  required={false}
                  getOptionLabel={(option) => `${option.name}`}
                  defaultValue={defaultValue?.training_elements}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("FormExercises.Materials")}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </div>
              <div className="col" style={{ width: "180px" }}>
                <ControlledAutocomplete
                  control={control}
                  name="movements"
                  options={dataMovements}
                  required={false}
                  getOptionLabel={(option) => `${option.name}`}
                  defaultValue={defaultValue?.movements}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("FormExercises.Movements")}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between">
              <div className="col mx-1" style={{ width: "180px" }}>
                <ControlledAutocomplete
                  control={control}
                  name="pathologies"
                  required={false}
                  options={dataMedicalConditions}
                  getOptionLabel={(option) => `${option.name}`}
                  defaultValue={defaultValue?.pathologies}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("FormExercises.Pathologies")}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </div>
              <div className="col" style={{ width: "180px" }}>
                <ControlledAutocomplete
                  control={control}
                  name="training_steps"
                  required={false}
                  options={dataTrainingSteps}
                  defaultValue={defaultValue?.training_steps}
                  getOptionLabel={(option) => `${option.name}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("Create.Session.TitleTypeTrainig")}
                      variant="outlined"
                      margin="normal"
                    />
                  )}
                />
              </div>
            </div>

            <div className="row p-0 m-0">
              <div className="col-md-12 p-1">
                <Controller
                  control={control}
                  name="video_url"
                  defaultValue={defaultValue?.video_url || ""}
                  render={({ field: { onChange } }) => (
                    <SearchUrlVideosElastic
                      defaultValue={
                        isUpdate
                          ? {
                              name: decodeURL(
                                "Verticales/" + defaultValue?.video_url
                              ).replace(/\+/g, " "),
                            }
                          : null
                      }
                      prefix="Verticales/"
                      setValue={(data) => onChange(data)}
                      label={"Url del video vertical *"}
                    />
                  )}
                />
              </div>
              <div className="col-md-12 p-1">
                <Controller
                  control={control}
                  name="video_url_landscape"
                  defaultValue={defaultValue?.video_url_landscape || ""}
                  render={({ field: { onChange } }) => (
                    <SearchUrlVideosElastic
                      defaultValue={
                        isUpdate
                          ? {
                              name: decodeURL(
                                "Horizontales/" +
                                  defaultValue?.video_url_landscape
                              ).replace(/\+/g, " "),
                            }
                          : null
                      }
                      prefix="Horizontales/"
                      setValue={(data) => onChange(data)}
                      label={"Url del video horizontal *"}
                    />
                  )}
                />
              </div>

              <div className="col-md-12 p-1">
                <Controller
                  control={control}
                  name="image_desktop"
                  defaultValue={defaultValue?.image_desktop || ""}
                  render={({ field: { onChange } }) => (
                    <SearchUrlmagesElastic
                      defaultValue={
                        isUpdate
                          ? {
                              name: defaultValue?.image_desktop,
                            }
                          : null
                      }
                      setValue={(data) => onChange(data)}
                      label={"Url de la imagen Escritorio *"}
                    />
                  )}
                />
              </div>

              <div className="col-md-12 p-1">
                <Controller
                  control={control}
                  name="image_mobile"
                  defaultValue={defaultValue?.image_mobile || ""}
                  render={({ field: { onChange } }) => (
                    <SearchUrlmagesElastic
                      defaultValue={
                        isUpdate
                          ? {
                              name: defaultValue?.image_mobile,
                            }
                          : null
                      }
                      setValue={(data) => onChange(data)}
                      label={"Url de la imagen movil *"}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="row gx-3 mt-3">
            <div className="d-flex justify-content-end">
              {messageError && <Alert severity="error">{messageError}</Alert>}
            </div>
          </div>

          <div className="row gx-3 mt-3">
            <div className="d-flex justify-content-end">
              <ButtonSave
                loader={loadingFetch}
                text={isUpdate ? "Actualizar" : t("FormExercises.Create")}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Add images modal */}
      <ShardComponentModal
        {...modalProps}
        fullWidth
        maxWidth="sm"
        body={
          <UploadImagesModal
            setIsOpen={setMediaImagesModal}
            desktopImage={desktopImage}
            setDesktopImage={setDesktopImage}
            mobileImage={mobileImage}
            setMobileImage={setMobileImage}
            isOpen={mediaImagesModal}
          />
        }
        isOpen={mediaImagesModal}
        handleClose={() => setMediaImagesModal(false)}
        title={t("FormExercises.UploadImage")}
      />

      {/* Add videos modal*/}
      <ShardComponentModal
        {...modalProps}
        fullWidth
        maxWidth="sm"
        body={
          <UploadVideosModal
            setIsOpen={setMediaVideosModal}
            verticalVideo={verticalVideo}
            setVerticalVideo={setVerticalVideo}
            horizontalVideo={horizontalVideo}
            setHorizontalVideo={setHorizontalVideo}
            isOpen={mediaImagesModal}
          />
        }
        isOpen={mediaVideosModal}
        handleClose={() => setMediaVideosModal(false)}
        title={t("FormExercises.UploadVideo")}
      />
    </>
  );
};
