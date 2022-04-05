import React from "react";
import { useTranslation } from "react-i18next";

//UI
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

// Components
import ControlledAutocomplete from "components/Shared/AutocompleteSelect/AutocompleteSelect";

//utils
import { useStyles } from "utils/useStyles";
import { formatToHHMM } from "utils/misc";

const QuoteForm = ({
  quote,
  managersSelect,
  handleChangeManagers,
  availableManagers,
  indexSchedule,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div>
      <div className="mt-4 d-flex align-items-center">
        <Typography className={`${classes.boldText} me-3`} variant="body2">
          Cita {indexSchedule}
        </Typography>
        {quote?.hour.length > 0 && (
          <>
            <Typography variant="body2">{quote?.date}</Typography>

            <Typography className="ms-3" variant="body2">
              {formatToHHMM(quote?.hour)}
            </Typography>
          </>
        )}
      </div>

      <div className="mt-2">
        <ControlledAutocomplete
          multiple={false}
          value={managersSelect}
          handleChange={(data) => handleChangeManagers(data, quote?.id)}
          name="managers"
          options={availableManagers || []}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("FormsVenueActivities.SelectResponsable")}
              variant="outlined"
              margin="normal"
            />
          )}
        />
      </div>
    </div>
  );
};

export default QuoteForm;
