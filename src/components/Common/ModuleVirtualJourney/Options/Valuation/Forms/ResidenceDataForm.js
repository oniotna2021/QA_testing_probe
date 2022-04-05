// react
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

// redux
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateWelcomeForm } from "modules/virtualJourney";

// ui
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";

// services
import { getCountries } from "services/MedicalSoftware/Countries";
import { getDeparmentsByCountry } from "services/GeneralConfig/Deparments";
import { getCitiesByDepartment } from "services/GeneralConfig/Cities";
import { postWelcomeForm } from "services/VirtualJourney/WelcomeForm";
import { postWelcomeFormNutrition } from "services/VirtualJourney/WelcomeForm";

// components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// utils
import {
  mapErrors,
  errorToast,
  successToast,
  addKeyClinicalHistoryForm,
} from "utils/misc";

const FormResidenceAddress = ({ setIsOpen, setReloadInfo, userType }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const savedForm = useSelector((state) => state.virtualJourney.welcomeForm);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { user_id, quote_id } = useParams();

  const [LoadingFetchForm, setLoadingFetchForm] = useState(false);
  const [countryId, setCountryId] = useState(savedForm.country_id);
  const [departmentId, setDepartmentId] = useState(savedForm.department_id);
  const [countries, setCountries] = useState([]);
  const [citis, setCitis] = useState([]);
  const [departments, setDepartments] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getCountries()
      .then(({ data }) => {
        if (data && data.data && data.data.length > 0) {
          setCountries(data.data);
        } else {
          enqueueSnackbar(mapErrors(data.data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    getDeparmentsByCountry(countryId)
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          setDepartments(data.data);
        } else {
          if (data.status === "error") {
            enqueueSnackbar(mapErrors(data.data), errorToast);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [countryId, enqueueSnackbar]);

  useEffect(() => {
    getCitiesByDepartment(departmentId)
      .then(({ data }) => {
        if (data.status === "success" && data.data) {
          setCitis(data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [departmentId, enqueueSnackbar]);

  const handleChangeCountry = (e) => {
    setCountryId(e.target.value);
  };

  const handleChangeDepartment = (e) => {
    setDepartmentId(e.target.value);
  };

  const onSubmit = (data) => {
    let functionToCall =
      userType === 30 ? postWelcomeFormNutrition : postWelcomeForm;
    setLoadingFetchForm(true);
    data.form = 2;
    data.quote_id = Number(quote_id);
    data.user_id = user_id;
    functionToCall(data)
      .then(({ data }) => {
        if (data && data.status === "success") {
          enqueueSnackbar("Guardado correctamente", successToast);
          addKeyClinicalHistoryForm(`form_2_${user_id}_${quote_id}`, 100);
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

  const onError = () => {
    enqueueSnackbar(t("General.ErrorMessage"), {
      variant: "info",
      autoHideDuration: 2500,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="d-flex flex-column align-items-center"
    >
      <div className="row d-flex align-items-center mb-4">
        <div className="col">
          <Typography variant="h5">
            {t("ResidenceAddress.ResidenceData")}
          </Typography>
        </div>
        <div className="col-1" style={{ marginRight: "12px" }}>
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-2">
          <Controller
            rules={{ required: true }}
            control={control}
            name="country_id"
            defaultValue={countryId}
            render={({ field }) => (
              <FormControl
                variant="outlined"
                error={errors.country_id ? true : false}
              >
                <InputLabel id="country_of_residence">
                  {t("ResidenceAddress.ResidenceCountry")}
                </InputLabel>
                <Select
                  {...field}
                  labelId="country_of_residence"
                  label="País de residencia"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleChangeCountry(e);
                  }}
                  name="country_of_residence"
                >
                  {countries.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div className="col-12 mb-2">
          <Controller
            rules={{ required: true }}
            control={control}
            name="department_id"
            defaultValue={departmentId}
            render={({ field }) => (
              <FormControl variant="outlined" error={errors.department_id}>
                <InputLabel id="country_of_residence">
                  {"Departamento"}
                </InputLabel>
                <Select
                  {...field}
                  labelId="country_of_residence"
                  label="Departamento"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleChangeDepartment(e);
                  }}
                  name="country_of_residence"
                >
                  {departments?.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>
        <div className="col-12 mb-2">
          <Controller
            rules={{ required: true }}
            control={control}
            name="city_id"
            defaultValue={savedForm?.city_id}
            render={({ field }) => (
              <FormControl variant="outlined" error={errors.city_id}>
                <InputLabel id="city_id">{"Municipio"}</InputLabel>
                <Select
                  {...field}
                  labelId="city_id"
                  label="Municipio"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  name="city_id"
                >
                  {citis?.map((res) => (
                    <MenuItem key={res.name} value={res.id}>
                      {res.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </div>

        <div className="d-flex flex-row-reverse">
          <ButtonSave loader={LoadingFetchForm} text={t("Btn.save")} />
        </div>
      </div>
    </form>
  );
};

export default FormResidenceAddress;
