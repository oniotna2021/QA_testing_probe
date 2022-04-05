import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// UI
import { Card } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";

//Components
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

//utils
import { useStyles } from "utils/useStyles";

const SendQuotation = () => {
  const [downloadPDF, setDownloadPDF] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className="container">
      <div className="row">
        <Typography variant="body1" className="mb-4">
          {t("Quotation.SendQuotation.Message")}
        </Typography>

        <Card className={`p-3 mb-3 ${classes.SendQuotationSwitchCard}`}>
          <Typography variant="body1">
            {t("Quotation.SendQuotation.DownloadPDF")}
          </Typography>
          <Switch
            checked={downloadPDF}
            onChange={() => setDownloadPDF(!downloadPDF)}
            color="primary"
          />
        </Card>

        <Card className={`p-3 mb-5 ${classes.SendQuotationSwitchCard}`}>
          <Typography variant="body1">
            {t("Quotation.SendQuotation.DownloadEmail")}
          </Typography>
          <Switch
            checked={sendEmail}
            onChange={() => setSendEmail(!sendEmail)}
            color="primary"
          />
        </Card>

        <div className="d-flex justify-content-around">
          <Button className={classes.buttonCancel}>{t("Btn.Cancel")}</Button>
          <ButtonSave text={t("Btn.save")} />
        </div>
      </div>
    </div>
  );
};

export default SendQuotation;
