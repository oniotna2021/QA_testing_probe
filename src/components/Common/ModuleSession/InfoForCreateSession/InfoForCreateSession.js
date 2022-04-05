import React from "react";
import { useTranslation } from "react-i18next";

//UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Styles
import { useStyles } from "utils/useStyles";

//Internal dependecies
import { iconView } from "utils/iconsPlaceSession";
import { casteMapNameArrayForString } from "utils/misc";

const InfoForCreateSession = ({ formValues, trainingsLevels }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const nameLevel =
    trainingsLevels && trainingsLevels.data
      ? trainingsLevels.data.find(
          (x) => x.id === (formValues && Number(formValues.training_levels))
        )
      : { name: "" };

  return (
    <Grid container spacing={1}>
      <Grid item md={6}>
        <Typography variant="body2">{t("Level.Title")}</Typography>
      </Grid>

      <Grid item md={6}>
        <Typography variant="body2">{nameLevel?.name}</Typography>
      </Grid>

      <Grid item md={6}>
        <Typography variant="body2">
          {t("WeeklyNutrition.InputDescription")}
        </Typography>
      </Grid>
      <Grid item md={6}>
        <Typography variant="body2">{formValues.long_description}</Typography>
      </Grid>

      <Grid item md={6}>
        <Typography variant="body2">{t("Objective.Title")}</Typography>
      </Grid>
      <Grid item md={6}>
        <Typography variant="body2">
          {casteMapNameArrayForString(formValues.goals)}
        </Typography>
      </Grid>

      <Grid item md={6}>
        <Typography variant="body2">{t("Pathologies.Title")}</Typography>
      </Grid>
      <Grid item md={6}>
        <Typography variant="body2">
          {casteMapNameArrayForString(formValues.pathologies, "No Aplica")}
        </Typography>
      </Grid>

      <Grid item md={6}>
        <Typography variant="body2">{t("Contrains.Title")}</Typography>
      </Grid>
      <Grid item md={6}>
        <Typography variant="body2">
          {casteMapNameArrayForString(
            formValues.contraindications,
            "No Aplica"
          )}
        </Typography>
      </Grid>

      <Grid item md={6}>
        <Typography variant="body2">{t("Place.Title")}</Typography>
      </Grid>
      <Grid container item md={6} spacing={0}>
        {formValues.training_places.map((item) => {
          const IconPlace = iconView[item];
          return (
            <Grid
              key={`icon-place-${item}`}
              item
              md={4}
              className={classes.placeRound}
            >
              <IconPlace />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default InfoForCreateSession;
