import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { addDays } from "date-fns";
import { connect } from "react-redux";

//UI
import { makeStyles } from "@material-ui/core";
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

//Components
import FullCalendar from "components/Common/ModuleActivitiesCalendar/Calendar/FullCalendar";
import DayCalendar from "components/Common/ModuleActivitiesCalendar/Calendar/DayCalendar";
import CustomizedProgressBars from "components/Shared/CustomizedProgressBars/CustomizedProgressBars";

// Hooks
import useQueryParams from "hooks/useQueryParams";

//Utils
import HeaderCalendar from "./Calendar/HeaderCalendar";

// services
import { getAllVenues } from "services/GeneralConfig/Venues";

const useStyles = makeStyles((theme) => ({
  button: {
    width: "177px",
    height: "48px",
    background: "#F6EFFB",
    marginLeft: "15px",
  },
  fontBold: {
    fontWeight: "bold",
  },
}));

const ModuleActivitiesCalendar = ({ userType }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const option = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const [fetchReload, setFetchReload] = useState(true);
  const [listActivities, setListActivities] = useState([]);
  const [selectsActivites, setSelectsActivites] = useState([]);
  const [listVenues, setListVenues] = useState([]);
  const [selectVenues, setSelectVenues] = useState(null);

  // Calendar Props
  const [isFullCalendar, setIsFullCalendar] = useQueryParams(
    "fullCalendar",
    "false",
    history
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  const dateText = currentDate.toLocaleDateString("es-ES", option);

  useEffect(() => {
    getAllVenues().then(({ data }) => {
      if (data && data.status === "success") {
        setListVenues(data.data);
      }
    });
  }, []);

  const handleChangeActivities = (data) => {
    setSelectsActivites(data);
  };

  const handleChangeVenues = (value) => {
    setSelectVenues(value);
    setFetchReload(true);
  };

  const handleChangeIsFullCalendar = (value) => {
    if (!value) {
      setIsFullCalendar("false");
    } else {
      setIsFullCalendar("true");
      setCurrentDate(new Date());
    }
    setFetchReload(true);
  };

  const handleClickAssingActivity = (day) => {
    setIsFullCalendar("false");
    setCurrentDate(addDays(new Date(day), 1));
    setFetchReload(true);
  };

  return (
    <>
      <div className="container row">
        <div style={{ height: 5, marginBottom: 7 }}>
          {fetchReload && <CustomizedProgressBars color="primary" />}
        </div>
        <div className="col-12 d-flex justify-content-between align-items-center">
          <Typography variant="h4" className="mx-3">
            {t("ListActivities.Container")}
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
          <div className="mt-4 ms-3">
            {/* <div className="mt-2 d-flex justify-content-end">
              <Typography variant="p" className={`me-2 ${classes.fontBold}`}>
                {t("ModuleActivitiesCalendar.ReservesOfDay")}:
              </Typography>
              <Typography variant="p">-</Typography>
            </div>
            <div className="mt-2 d-flex justify-content-end">
              <Typography variant="p" className={`me-2 ${classes.fontBold}`}>
                {t("ModuleActivitiesCalendar.TotalCapacity")}:
              </Typography>
              <Typography variant="p">-</Typography>
            </div> */}
          </div>

          <div className="d-flex align-items-center">
            <div className="d-flex align-content-center">
              <HeaderCalendar
                isFullCalendar={isFullCalendar}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                setFetchReload={setFetchReload}
              />
            </div>

            {/* Select Sedes */}
            {userType === 17 || userType === 41 ? (
              <>
                <FormControl
                  style={{ width: 250, margin: "0em .8em" }}
                  variant="outlined"
                >
                  <InputLabel id="demo-mutiple-checkbox-label">
                    Seleccione Sede
                  </InputLabel>
                  <Select
                    labelId="demo-mutiple-checkbox-label"
                    id="demo-mutiple-checkbox"
                    variant="outlined"
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 48 * 4.5 + 8, width: 300 },
                      },
                    }}
                    onChange={(e) => {
                      handleChangeVenues(e.target.value);
                    }}
                    value={selectVenues}
                    label="Seleccione Sede"
                  >
                    {listVenues &&
                      listVenues.map((res) => (
                        <MenuItem key={res.name} value={res.id}>
                          {res.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
            ) : (
              ""
            )}

            {/* Select Activity */}
            <FormControl style={{ width: 300 }} variant="outlined">
              <InputLabel id="demo-mutiple-checkbox-label">
                {t("ListActivities.Container")}
              </InputLabel>
              <Select
                labelId="demo-mutiple-checkbox-label"
                id="demo-mutiple-checkbox"
                variant="outlined"
                multiple
                renderValue={(selected) => selected.join(", ")}
                MenuProps={{
                  PaperProps: {
                    style: { maxHeight: 48 * 4.5 + 8, width: 300 },
                  },
                }}
                onChange={(e) => {
                  handleChangeActivities(e.target.value);
                }}
                value={selectsActivites}
                label={t("ListActivities.Container")}
              >
                {listActivities &&
                  listActivities.map((res) => (
                    <MenuItem key={res.name} value={res.name}>
                      {res.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="col-12 d-flex justify-content-center mt-5">
          {isFullCalendar === "true" ? (
            <FullCalendar
              selectVenues={selectVenues}
              setListActivities={setListActivities}
              setFetchReload={setFetchReload}
              fetchReload={fetchReload}
              selectActivityId={selectsActivites}
              currentDate={currentDate}
              handleClickAssingActivity={handleClickAssingActivity}
            />
          ) : (
            <DayCalendar
              userType={userType}
              selectVenues={selectVenues}
              dateWeekCalendar={null}
              setFetchReload={setFetchReload}
              fetchReload={fetchReload}
              setListActivities={setListActivities}
              selectActivityId={selectsActivites}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              handleClickAssingActivity={() => console.log("click")}
            />
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userType: auth.userType,
});

export default connect(mapStateToProps)(ModuleActivitiesCalendar);
