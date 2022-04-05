import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

// UI
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

// Hooks
import useAutocomplete from "hooks/useAutocomplete";

const FiltersSelect = ({
  listCountries,
  setIdCity,
  idCity,
  handleChangeIdCountry,
  idCountry,
  listCities,
}) => {
  const { t } = useTranslation();

  const [valueCity] = useAutocomplete(listCities, idCity);

  return (
    <div className="d-flex">
      <FormControl className="me-4" variant="outlined">
        <InputLabel id="id_country">{t("FormCities.Country")}</InputLabel>
        <Select
          labelId="id_country"
          label={t("FormCities.Country")}
          onChange={(e) => {
            handleChangeIdCountry(e.target.value);
            setIdCity(null);
          }}
          value={idCountry}
        >
          {listCountries &&
            listCountries.map((res) => (
              <MenuItem key={res.name} value={res.id}>
                {res.name}
              </MenuItem>
            ))}
        </Select>
        {!idCountry && (
          <FormHelperText error={true}>{t("Field.required")}</FormHelperText>
        )}
      </FormControl>

      <FormControl variant="outlined">
        <Autocomplete
          placeholder={t("FormZones.City")}
          value={valueCity}
          onChange={(_, value) => setIdCity(value.id)}
          disableClearable={true}
          getOptionLabel={(option) => `${option.name}`}
          getOptionSelected={(option, value) => Number(value) === option.id}
          aria-label="seleccionar ciudad"
          id="controllable-select-venue"
          options={listCities}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("FormZones.City")}
              variant="outlined"
            />
          )}
        />
        {!idCity && (
          <FormHelperText error={true}>{t("Field.required")}</FormHelperText>
        )}
      </FormControl>
    </div>
  );
};

const mapStateToProps = ({ global }) => ({
  listCountries: global.countries,
});

export default connect(mapStateToProps)(FiltersSelect);
