import React from "react";

// UI
import { Typography } from "@material-ui/core";

// styles
import styled from "@emotion/styled";

// translate
import { useTranslation } from "react-i18next";

const BoxItem = styled.div`
  background-color: #ececeb;
  padding: 5px;
  border-radius: 10px;
  margin-right: 10px;
  display: flex;
`;

const BoxItems = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex">
      <BoxItem>
        <Typography variant="body2" className="me-1">
          <b>{t("BoxItems.ModuleVirtualJourneyScheduled")}</b>
        </Typography>
        <Typography variant="body2">05</Typography>
      </BoxItem>
      <BoxItem>
        <Typography variant="body2" className="me-1">
          <b>{t("BoxItems.ModuleVirtualJourneySuccessful")}</b>
        </Typography>
        <Typography variant="body2">03</Typography>
      </BoxItem>
      <BoxItem>
        <Typography variant="body2" className="me-1">
          <b>{t("BoxItems.ModuleVirtualJourneyFailed")}</b>
        </Typography>
        <Typography variant="body2">00</Typography>
      </BoxItem>
    </div>
  );
};

export default BoxItems;
