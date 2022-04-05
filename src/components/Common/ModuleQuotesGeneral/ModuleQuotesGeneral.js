import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

//UI
import IconButton from "@material-ui/core/IconButton";
import {
  IconMonthCalendar,
  IconDayCalendar,
} from "assets/icons/customize/config";
import { Typography } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";

//Components
import FullCalendar from "components/Common/ModuleQuotesGeneral/Calendar/FullCalendar";
import DayCalendar from "components/Common/ModuleQuotesGeneral/Calendar/DayCalendar";
import HeaderCalendar from "../ModuleActivitiesCalendar/Calendar/HeaderCalendar";
import CustomizedProgressBars from "components/Shared/CustomizedProgressBars/CustomizedProgressBars";

// Hooks
import useQueryParams from "hooks/useQueryParams";

// Services
import { getRoles } from "services/SuperAdmin/Roles";
import { getTypeAppointment } from "services/MedicalSoftware/TypeAppointment";

//Utils
import { errorToast, mapErrors } from "utils/misc";

const ModuleQuotesGeneral = ({
  venueId,
  shouldIsVirtual,
  isVirtualDefault,
}) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const theme = useTheme();
  const option = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [fetchReload, setFetchReload] = useState(true);
  const [roles, setRoles] = useState([]);
  const [typeQuotes, setTypeQuotes] = useState([]);
  const [isMedical, setIsMedical] = useState(false);
  const [isVirtual, setIsVirtual] = useState(
    isVirtualDefault === 1 ? true : false
  );

  const [idTypeQuote, setIdTypeQuote] = useQueryParams(
    "typeQuote",
    "1",
    history
  );
  const [profile, setProfile] = useQueryParams("profile", "7", history);
  const [filterOption, setFilterOption] = useQueryParams(
    "filterOption",
    "1",
    history
  );

  // Calendar Props
  const [isFullCalendar, setIsFullCalendar] = useQueryParams(
    "fullCalendar",
    "false",
    history
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateText = currentDate.toLocaleDateString("es-ES", option);

  useEffect(() => {
    (() => {
      getRoles(1)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.length > 0
          ) {
            setRoles(data.data);
            if (profile) {
              const findRole = data?.data?.find(
                (role) => role.id === Number(profile)
              );
              if (Boolean(findRole)) {
                setIsMedical(findRole.is_medical === 1 ? true : false);
              }
            }
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    })();
  }, [enqueueSnackbar, setIsMedical]);

  useEffect(() => {
    getTypeAppointment()
      .then(({ data }) => {
        if (data.status === "success" && data.data && data.data.length > 0) {
          setTypeQuotes(data.data);
          setIsMedical(true);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [setIsMedical, enqueueSnackbar]);

  useEffect(() => {
    setIsVirtual(isVirtualDefault === 1);
  }, [isVirtualDefault]);

  useEffect(() => {
    setFetchReload(true);
  }, [venueId, isVirtual]);

  const handleChangeRol = (value) => {
    const findRole = roles.find((role) => role.id === value);
    if (Boolean(findRole)) {
      setIsMedical(findRole.is_medical === 1 ? true : false);
    }
    setProfile(String(value));
    setFetchReload(true);
  };

  const handleChangeTypeQuote = (value) => {
    setIdTypeQuote(String(value));
    setFetchReload(true);
  };

  const handleChangeIsFullCalendar = (value) => {
    if (!value) {
      setIsFullCalendar("false");
    } else {
      setIsFullCalendar("true");
    }
    setFetchReload(true);
  };

  return (
    <>
      <div className="container row">
        <div style={{ height: 5 }}>
          {fetchReload && <CustomizedProgressBars color="primary" />}
        </div>
        <div className="col-12 d-flex justify-content-between align-items-center">
          <Typography variant="h4" className="mx-3">
            {t("Menu.Title.DiaryGeneral")}
          </Typography>
          <Typography variant="p" className="mt-3">
            {dateText}
          </Typography>
          <div
            className="col d-flex justify-content-end"
            style={{ marginRight: "12px" }}
          >
            <IconButton onClick={() => handleChangeIsFullCalendar(true)}>
              <IconMonthCalendar color={theme.palette.black.main} />
            </IconButton>
            <IconButton onClick={() => handleChangeIsFullCalendar(false)}>
              <IconDayCalendar color={theme.palette.black.main} />
            </IconButton>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-between mt-4">
          {/* <Button
            onClick={handleClickNovelty}
            className={classes.buttonUserLead}
            startIcon={<IconAddUser />}
          >
            {t("FormAfiliateLead.labelNewUser")}
          </Button> */}
          <div className="d-flex align-content-center">
            <HeaderCalendar
              isFullCalendar={isFullCalendar}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              setFetchReload={setFetchReload}
            />
          </div>

          <div className="d-flex">
            <div className="d-flex align-items-center me-5">
              <Typography component="div">
                <Grid
                  component="label"
                  container
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>{t("ModuleQuotesGeneral.FilterRol")}</Grid>
                  <Grid item>
                    <Switch
                      checked={filterOption === "1" ? true : false}
                      name="checked_virtial"
                      color="primary"
                      onChange={(e) => {
                        setFilterOption(e.target.checked === true ? "1" : "0");
                        setFetchReload(true);
                      }}
                    />
                  </Grid>
                  <Grid item>{t("ModuleQuotesGeneral.TypeAppoinment")}</Grid>
                </Grid>
              </Typography>
            </div>

            {/* <IconButton onClick={() => setIsFullCalendar(true)}>
                            <SearchIcon color={theme.palette.black.main} />
                    </IconButton> */}
            {filterOption === "1" ? (
              <FormControl style={{ width: 193 }} variant="outlined">
                <InputLabel id="select">
                  {t("FormAppointmentByMedical.TypeVenue")}
                </InputLabel>
                <Select
                  label={t("FormAppointmentByMedical.TypeVenue")}
                  onChange={(e) => {
                    handleChangeTypeQuote(e.target.value);
                  }}
                  value={Number(idTypeQuote)}
                >
                  {typeQuotes &&
                    typeQuotes.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl style={{ width: 193 }} variant="outlined">
                <InputLabel id="select">
                  {t("FormProfessional.InputRol")}
                </InputLabel>
                <Select
                  label={t("GeneralCalendar.Rol")}
                  onChange={(e) => {
                    handleChangeRol(e.target.value);
                  }}
                  value={Number(profile)}
                >
                  {roles &&
                    roles.map((res) => (
                      <MenuItem key={res.name} value={res.id}>
                        {res.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          </div>
        </div>
        <div className="col-12 d-flex justify-content-center mt-5">
          {isFullCalendar === "true" ? (
            <FullCalendar
              isMedical={isMedical}
              setFetchReload={setFetchReload}
              fetchReload={fetchReload}
              profileId={Number(profile)}
              currentDate={currentDate}
              isVirtual={isVirtual}
              filterOption={filterOption}
              idTypeQuote={idTypeQuote}
            />
          ) : (
            <DayCalendar
              dateWeekCalendar={null}
              setFetchReload={setFetchReload}
              fetchReload={fetchReload}
              profileId={Number(profile)}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              isVirtual={isVirtual}
              filterOption={filterOption}
              idTypeQuote={idTypeQuote}
            />
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
  shouldIsVirtual: auth.shouldIsVirtual,
  isVirtualDefault: auth.isVirtual,
});

export default connect(mapStateToProps)(ModuleQuotesGeneral);
