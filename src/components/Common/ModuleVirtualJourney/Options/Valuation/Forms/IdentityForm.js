import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// UI
import { MenuItem, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FormControl, Select, InputLabel } from "@material-ui/core";
import Button from "@material-ui/core/Button";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// services
import { getBiologicalSex } from "services/MedicalSoftware/BiologicalSex";
import { getGenderIdentity } from "services/MedicalSoftware/GenderIdentity";
import { getBloodType } from "services/MedicalSoftware/BloodType";
import { getEthnicCommunity } from "services/MedicalSoftware/EthnicCommunity";
import { getEthnicity } from "services/MedicalSoftware/Ethnicity";
import { postWelcomeForm } from "services/VirtualJourney/WelcomeForm";
import { postWelcomeFormNutrition } from "services/VirtualJourney/WelcomeForm";

// utils
import { useStyles } from "utils/useStyles";
import {
  infoToast,
  successToast,
  mapErrors,
  errorToast,
  addKeyClinicalHistoryForm,
  biological_gender,
} from "utils/misc";

const IdentityForm = ({ setIsOpen, userType, setReloadInfo }) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { t } = useTranslation();
  const savedForm = useSelector((state) => state.virtualJourney.welcomeForm);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { user_id, quote_id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [biologicalSexOptions, setBiologicalSexOptions] = useState([]);
  const [genderIdentityOptions, setGenderIdentityOptions] = useState([]);
  const [bloodTypeOptions, setBloodTypeOptions] = useState([]);
  const [ethnicCommunityOptions, setEthnicCommunityOptions] = useState([]);
  const [ethnicityOptions, setEthnicityOptions] = useState([]);

  const dispatch = useDispatch();

  const getOptions = async () => {
    const requestOne = getBiologicalSex();
    const requestTwo = getGenderIdentity();
    const requestThree = getBloodType();
    const requestFour = getEthnicCommunity();
    const requestFive = getEthnicity();
    axios
      .all([requestOne, requestTwo, requestThree, requestFour, requestFive])
      .then(
        axios.spread((...responses) => {
          const { data: resOne } = responses[0];
          const { data: resTwo } = responses[1];
          const { data: resThree } = responses[2];
          const { data: resFour } = responses[3];
          const { data: resFive } = responses[4];

          // use/access the results
          setBiologicalSexOptions(resOne.data.items);
          setGenderIdentityOptions(resTwo.data.items);
          setBloodTypeOptions(resThree.data.items);
          setEthnicCommunityOptions(resFour.data.items);
          setEthnicityOptions(resFive.data.items);
        })
      )
      .catch((errors) => {
        console.log(errors);
      });
  };

  useEffect(() => {
    getOptions();
  }, []);

  const onSubmit = (values) => {
    let functionToCall =
      userType === 30 ? postWelcomeFormNutrition : postWelcomeForm;
    setIsLoading(true);
    const payload = {
      form: 1,
      quote_id: quote_id,
      user_id: user_id,
      ...values,
    };
    functionToCall(payload)
      .then(({ data }) => {
        if (data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_1_${user_id}_${quote_id}`, 100);
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

  const onError = () => {
    enqueueSnackbar("Debes completar todos los campos", infoToast);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {
          <Typography variant="h5">
            {t("DetailClinicHistory.Identity")}
          </Typography>
        }
        <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
      </div>
      <Controller
        rules={{ required: true }}
        control={control}
        name="biological_gender"
        defaultValue={savedForm?.biological_gender}
        render={({ field }) => (
          <FormControl className="my-2" variant="outlined">
            <InputLabel>{t("IdentityForm.GenreBiological")}</InputLabel>
            <Select
              {...field}
              label={"Género Biológico"}
              error={errors.biological_gender}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            >
              {biological_gender.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        rules={{ required: true }}
        control={control}
        name="gender_identity"
        defaultValue={savedForm?.gender_identity}
        render={({ field }) => (
          <FormControl className="my-2" variant="outlined">
            <InputLabel>
              {t("ListGenderIdentity.TitleGenderIdentity")}
            </InputLabel>
            <Select
              {...field}
              error={errors.gender_identity}
              label={"Identidad de género"}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            >
              {genderIdentityOptions.map((option) => (
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
        name="blood_type"
        defaultValue={savedForm?.blood_type}
        render={({ field }) => (
          <FormControl className="my-2" variant="outlined">
            <InputLabel>{t("ListBloodTyoe.GroupBlood")}</InputLabel>
            <Select
              {...field}
              error={errors.blood_type}
              label={"Grupo sanguineo"}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            >
              {bloodTypeOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      {userType === 30 && (
        <>
          <Controller
            rules={{ required: userType === 30 ? true : false }}
            control={control}
            name="ethnic_membership"
            defaultValue={savedForm?.ethnic_membership}
            render={({ field }) => (
              <FormControl className="my-2" variant="outlined">
                <InputLabel>{t("ListEthnicity.TitleEthnicity")}</InputLabel>
                <Select
                  {...field}
                  label={"Pertenencia étnica"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {ethnicityOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Controller
            rules={{ required: userType === 30 ? true : false }}
            control={control}
            name="ethnic_community"
            defaultValue={savedForm?.ethnic_community}
            render={({ field }) => (
              <FormControl className="my-2" variant="outlined">
                <InputLabel>
                  {t("ListEthnicCommunity.TitleEthnicCommunity")}
                </InputLabel>
                <Select
                  {...field}
                  error={errors.ethnic_community}
                  label={"Comunidad étnica"}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                >
                  {ethnicCommunityOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </>
      )}
      <div className="d-flex justify-content-between mt-3 container row">
        <Button className={classes.buttonBack} onClick={() => setIsOpen(false)}>
          {t("Btn.Back")}
        </Button>
        <ButtonSave text="Guardar" loader={isLoading} />
      </div>
    </form>
  );
};

export default IdentityForm;
