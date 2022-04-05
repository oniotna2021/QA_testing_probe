import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import EditActivityForm from "components/Common/ModuleCollaborators/Calendar/EditActivityForm";
import FormRemoveActivityCalendar from "./FormRemoveActivityCalendar";
// UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";

// Utils
import { checkVariable } from "utils/misc";
import { useStyles } from "utils/useStyles";

import FormRemoveActivity from "./FormRemoveActivity";
import DetailActivity from "./DetailActivity";

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

const FormRemoveActivityContainer = ({
  setIsOpen,
  dataDetailActivity,
  setFetchReload,
  userType,
  isCalendar,
}) => {
  const { t } = useTranslation();
  const [valueTab, setValueTab] = useState(0);

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Typography variant="h6">
          {valueTab === 0 && t("DetailActivityModal.Title")}
          {valueTab === 1 && t("DetailActivityModal.EditPage")}
          {valueTab === 2 && t("DetailActivityModal.InactivateActivity")}
        </Typography>

        <div className="d-flex align-items-center">
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>

      <TabPanel value={valueTab} index={0}>
        <DetailActivity
          userType={userType}
          setValueTab={setValueTab}
          setFetchReload={setFetchReload}
          setIsOpen={setIsOpen}
          dataDetailActivity={dataDetailActivity}
        />
      </TabPanel>

      <TabPanel value={valueTab} index={1}>
        <EditActivityForm
          setValueTab={setValueTab}
          setFetchReload={setFetchReload}
          setIsOpen={setIsOpen}
          dataDetailActivity={dataDetailActivity}
        />
      </TabPanel>

      <TabPanel value={valueTab} index={2}>
        {isCalendar ? (
          <FormRemoveActivityCalendar
            setIsOpen={setIsOpen}
            dataDetailActivity={dataDetailActivity}
            setFetchReload={setFetchReload}
          />
        ) : (
          <FormRemoveActivity
            setValueTab={setValueTab}
            setIsOpen={setIsOpen}
            dataDetailActivity={dataDetailActivity}
            setFetchReload={setFetchReload}
          />
        )}
      </TabPanel>
    </Card>
  );
};

export default FormRemoveActivityContainer;
