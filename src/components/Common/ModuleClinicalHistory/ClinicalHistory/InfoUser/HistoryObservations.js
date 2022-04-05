import React, { useState } from "react";

//HOOKS
import { useTranslation } from "react-i18next";

//utils
import { useStyles } from "utils/useStyles";

//UI
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

//components
import SharedTimeLine from "components/Shared/TimeLine/TimeLine";

export default function HistoryObservations({ lastReasonQuote, observations }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [valueObservation, setValueObservation] = useState(0);

  const handleChangeObservation = (event, newValue) => {
    setValueObservation(newValue);
  };

  function a11yPropsObservations(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  function TabPanel({ children, value, index, ...other }) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box p={0}>{children}</Box>}
      </div>
    );
  }

  return (
    <div className="row ms-5" style={{ overflowY: "scroll", height: 440 }}>
      <AppBar position="static" className={classes.appBar} elevation="2">
        <Tabs
          value={valueObservation}
          onChange={handleChangeObservation}
          aria-label="simple tabs example"
        >
          <Tab
            label={t("DetailClinicHistory.HistoryObservations")}
            {...a11yPropsObservations(0)}
          />
          <Tab
            label={t("DetailClinicHistory.ConsultationReasons")}
            {...a11yPropsObservations(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={valueObservation} index={0}>
        {observations.map((item, index) => (
          <SharedTimeLine
            item={item}
            isObservation={true}
            key={`observation-${index}`}
            time={`${item.date}, ${item.time}`}
            text={item.observation}
          />
        ))}
      </TabPanel>
      <TabPanel value={valueObservation} index={1}>
        {lastReasonQuote === null ? (
          <Typography variant="body2">
            {t("ListPermissions.NoData")}s
          </Typography>
        ) : (
          lastReasonQuote?.map((item, index) => (
            <SharedTimeLine
              key={`reason-${index}`}
              time={item.created_at}
              text={item.reason_of_query}
              isReason={true}
            />
          ))
        )}
      </TabPanel>
    </div>
  );
}
