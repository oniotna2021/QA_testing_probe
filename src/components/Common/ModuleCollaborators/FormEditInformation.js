import React from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core";

import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

//TRANSLATE
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "130px",
    height: "50px",
    background: "transparent",
    color: "#3C3C3B",
    marginBottom: "20px",
  },
}));

const FormEditInformation = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { handleSubmit, control } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="row">
      <div className="container px-5">
        <div className="col-12">
          <FormControl className="mt-3" variant="outlined">
            <InputLabel id="select">
              {t("DetailCollaborator.LabelArea")}
            </InputLabel>
            <Select labelId="select" label="Area">
              <MenuItem value="1">
                {t("FormEditInformation.labelTraining")}
              </MenuItem>
              <MenuItem value="2">
                {t("FormsVenueActivities.SelectActivity")}
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className="mt-3" variant="outlined">
            <InputLabel id="select">
              {t("FormProfessional.InputRol")}
            </InputLabel>
            <Select labelId="select" label="Rol">
              <MenuItem value="1">
                {t("FormEditInformation.labelCoach")}
              </MenuItem>
              <MenuItem value="2">
                {t("FormsVenueActivities.SelectActivity")}
              </MenuItem>
            </Select>
          </FormControl>
          <div className="col-12 d-flex justify-content-between mt-3">
            <FormControl style={{ width: 220 }} variant="outlined">
              <InputLabel id="select">
                {t("FormProfessional.SelectTypeContract")}
              </InputLabel>
              <Select labelId="select" label="Tipo de Contrato">
                <MenuItem value="1">
                  {t("FormEditInformation.labelTypeContract")}
                </MenuItem>
                <MenuItem value="2">
                  {t("FormsVenueActivities.SelectActivity")}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl
              style={{ width: 300, marginLeft: 20 }}
              variant="outlined"
            >
              <InputLabel>{t("FormEditInformation.labelValue")}</InputLabel>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                labelWidth={40}
              />
            </FormControl>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-around my-5">
          <Button className={classes.button}>{t("Btn.Cancel")}</Button>
          <ButtonSave text={t("Btn.save")} />
        </div>
      </div>
    </form>
  );
};

export default FormEditInformation;
