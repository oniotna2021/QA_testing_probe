import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useStyles } from "utils/useStyles";
import { useTheme } from "@material-ui/core/styles";

// error
import { errorToast, mapErrors } from "utils/misc";

// ui
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Checkbox from "@material-ui/core/Checkbox";
import ControlledAutocomplete from "components/Shared/AutocompleteSelect/AutocompleteSelect";
import Loading from "components/Shared/Loading/Loading";

// icons
import { IconSearch } from "assets/icons/customize/config";

// hooks
import useSearchable from "hooks/useSearchable";

// services
import { getAllRegions } from "services/GeneralConfig/Regions";
import { getAllVenues } from "services/GeneralConfig/Venues";
import { getAllCities } from "services/GeneralConfig/Cities";

const AssignMassiveActivities = ({
  setOpenMassiveActivity,
  setIsOpen,
  handleChangeRegion,
  handleChangeCity,
  handleChangeVenue,
  regions,
  cities,
  venues,
  setRegions,
  setCities,
  setVenues,
  isView,
  setOpenPlaces,
  optionAssign,
  setOptionAssign,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // loader
  const [loadData, setLoadData] = useState(false);
  //regionals, cities and venues
  const [data, setData] = useState([]);
  // search
  const [term, setTerm] = useState("");
  const searchableData = useSearchable(data, term, (l) => [l.name]);

  useEffect(() => {
    setData([]);
    setLoadData(true);
    if (optionAssign === "Regional") {
      setCities([]);
      setVenues([]);
      getAllRegions()
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setData(data.data.items);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoadData(false);
        });
    } else if (optionAssign === "Ciudad") {
      setRegions([]);
      setVenues([]);
      getAllCities()
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setData(data.data);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoadData(false);
        });
    } else if (optionAssign === "Sede") {
      setRegions([]);
      setCities([]);
      getAllVenues()
        .then(({ data }) => {
          if (data && data.status === "success" && data.data) {
            setData(data.data);
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoadData(false);
        });
    } else {
      setData([]);
      setLoadData(false);
    }
  }, [optionAssign, enqueueSnackbar]);

  const handleClose = () => {
    if (!isView) {
      setIsOpen(false);
      setOpenMassiveActivity(false);
    } else {
      setOpenPlaces(false);
    }
  };

  const handleOptionSelect = (e) => {
    setOptionAssign(e);
  };

  return (
    <div>
      <form>
        <RadioGroup
          row
          name="group_select_places"
          value={optionAssign}
          className="d-flex justify-content-center"
          onClick={(e) => handleOptionSelect(e.target.value)}
        >
          <FormControlLabel
            value="Regional"
            className="col-3"
            control={<Radio color="primary" />}
            label="Regional"
          />
          <FormControlLabel
            value="Ciudad"
            className="col-5 d-flex justify-content-center"
            control={<Radio color="primary" />}
            label="Ciudad"
          />
          <FormControlLabel
            value="Sede"
            className="col-3 d-flex justify-content-end"
            control={<Radio color="primary" />}
            label="Sede"
          />
        </RadioGroup>
        <Typography variant="body2" className="mt-3">
          Se aplicará a todas las sedes pertenecientes a las regionales
          seleccionadas.
        </Typography>

        <div className="row d-flex justify-content-center mt-2">
          {loadData ? (
            <Loading />
          ) : optionAssign === "Regional" ? (
            <>
              {data.map((regional, index) => (
                <div className="col-12 m-0">
                  <FormControlLabel
                    key={`key: ${index}`}
                    label={regional.name}
                    className={classes.optAssignActivityOn}
                    control={
                      <Checkbox
                        color="primary"
                        checked={
                          regions.some((x) => x.id === regional.id)
                            ? true
                            : false
                        }
                        onChange={() => {
                          handleChangeRegion(regional);
                        }}
                      />
                    }
                  />
                </div>
              ))}
            </>
          ) : optionAssign === "Ciudad" ? (
            <div>
              <TextField
                className="mt-4"
                fullWidth
                label={"Buscar Ciudad"}
                variant="outlined"
                value={term}
                onChange={({ target }) => setTerm(target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconSearch color={theme.palette.primary.light} />
                    </InputAdornment>
                  ),
                }}
              />
              <>
                {searchableData.map((city) => (
                  <div className="w-100 m-0">
                    <FormControlLabel
                      key={city.id}
                      label={city.name}
                      className={classes.optAssignActivityOn}
                      control={
                        <Checkbox
                          color="primary"
                          checked={
                            cities.some((x) => x.id === city.id) ? true : false
                          }
                          onChange={() => {
                            handleChangeCity(city);
                          }}
                        />
                      }
                    />
                  </div>
                ))}
              </>
            </div>
          ) : optionAssign === "Sede" ? (
            <div>
              <ControlledAutocomplete
                multiple={true}
                value={venues}
                handleChange={handleChangeVenue}
                name="select_city"
                options={searchableData || []}
                getOptionLabel={(option) => option?.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sedes"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="d-flex justify-content-between my-3">
          <Button className={classes.buttonCancelAssign} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleClose}
            className={classes.buttonAssign}
            variant="contained"
          >
            Aplicar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssignMassiveActivities;
