import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

//COMPONENTS
import Loading from "components/Shared/Loading/Loading";
import { MessageView } from "components/Shared/MessageView/MessageView";
import TimeLine from "components/Shared/TimeLine/TimeLine";

//UI
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Typography, Box } from "@material-ui/core";

//SERVICES
import { getObservationsByUser } from "services/MedicalSoftware/ActivityObservations";

//UTILS
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors } from "utils/misc";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography component={"span"} variant="body1">
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ActivitiesByAfiliate = ({ id }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [dataObservations, setDataObservations] = useState([]);
  const [fetchData, setFetchData] = useState(true);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (fetchData) {
      getObservationsByUser(id)
        .then(({ data }) => {
          setFetchData(false);
          if (data && data.status === "success" && data.data) {
            setDataObservations(data.data);
          } else {
            if (data.status === "error") {
              setDataObservations([]);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
          setFetchData(false);
        });
    }
  }, [id, enqueueSnackbar, fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ overflowY: "scroll", height: 440 }}>
      <AppBar position="static" className={classes.appBar} elevation="4">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          style={{ width: "600px" }}
        >
          <Tab label={t("Affiliates.HistoryObservations")} {...a11yProps(0)} />
          <Tab label={t("Affiliates.HistoryMyVitale")} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} style={{ minHeight: "504px" }}>
        <>
          {fetchData && <Loading />}
          {dataObservations.length === 0 && !fetchData ? (
            <MessageView label={t("Message.EmptyData")} />
          ) : (
            dataObservations.map((item) => {
              if (item.is_migrated_vytale === 0) {
                return (
                  <TimeLine
                    item={item}
                    time={`${item.date} ${item.time}`}
                    text={
                      item.observation === null || ""
                        ? t("Message.EmptyDataObservations")
                        : item.observation
                    }
                    isObservation={true}
                    isSuggestion={false}
                    isPhysical={false}
                  />
                );
              } else {
                return null;
              }
            })
          )}
        </>
      </TabPanel>
      <TabPanel value={value} index={1} style={{ minHeight: "504px" }}>
        <>
          {fetchData && <Loading />}
          {dataObservations.length === 0 && !fetchData ? (
            <MessageView label={t("Message.EmptyData")} />
          ) : (
            dataObservations.map((item) => {
              if (item.is_migrated_vytale === 1) {
                return (
                  <TimeLine
                    item={item}
                    time={`${item.date} ${item.time}`}
                    text={
                      item.observation === null || ""
                        ? t("Message.EmptyDataObservations")
                        : item.observation
                    }
                    isObservation={true}
                    isSuggestion={false}
                    isPhysical={false}
                  />
                );
              } else {
                return null;
              }
            })
          )}
        </>
      </TabPanel>
    </div>
  );
};

export default ActivitiesByAfiliate;
