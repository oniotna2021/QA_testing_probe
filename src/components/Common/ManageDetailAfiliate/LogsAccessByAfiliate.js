import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

//UI
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { useTheme } from "@material-ui/core/styles";

// components
import EntranceVenue from "./EntrancetoVenue/EntranceVenue";

// styled
import { Box } from "./EntrancetoVenue/EntranceVenue.style";

// icons
import { IconInHome } from "assets/icons/customize/config";

// services
import { getLogAccessAfiliateForId } from "services/affiliates";

const LogsAccessByAfiliate = ({ idAfiliate }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [logsAccessAfiliate, setLogsAccessAfiliate] = useState([]);
  const [logsDay, setLogsDay] = useState([]);

  useEffect(() => {
    let day = [];

    if (idAfiliate) {
      getLogAccessAfiliateForId(idAfiliate).then(({ data }) => {
        if (
          data.status === "success" &&
          data.data &&
          data.data.items &&
          data.data.items.length > 0
        ) {
          setLogsAccessAfiliate(data.data.items);
          data.data.items.filter((date) =>
            day.push(date.created_at.substring(0, 10))
          );
          setLogsDay(
            day.filter((item, index) => {
              return day.indexOf(item) === index;
            })
          );
        }
      });
    }
  }, [idAfiliate]);

  return (
    <Accordion className="mt-3" style={{ borderRadius: "8px" }}>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
        <div className="col-12 d-flex justify-content-start align-items-center">
          <IconInHome width="25" height="25" color={theme.palette.black.main} />
          <Typography
            className="ms-2"
            style={{ fontWeight: "bold", fontSize: "18px" }}
          >
            {t("UseToApp.AccessForBranch")}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Box className="col-12">
          {logsAccessAfiliate.length > 0 ? (
            <EntranceVenue
              logsDay={logsDay}
              logsAccessAfiliate={logsAccessAfiliate}
            />
          ) : (
            <Typography variant="body2">{t("Message.EmptyData")}</Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default LogsAccessByAfiliate;
