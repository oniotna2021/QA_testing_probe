import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { useTheme } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";

// utils
import { actionsLogsMobile } from "utils/misc";

// icons
import { IconPhone, IconEyeView } from "assets/icons/customize/config";

// components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import ModalDetailLogAppMobile from "./ModalDetailLogAppMobile";

export default function LogsAppMobile({ logsAfiliate = [], userId }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedlog, setSelectedLog] = useState();

  const handleClick = (id) => {
    setSelectedLog(id);
    setOpen(true);
  };

  return (
    <Accordion className="mt-3" style={{ borderRadius: "8px" }}>
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
        <div className="col-12 d-flex justify-content-start align-items-center">
          <IconPhone width="15" height="19" color={theme.palette.black.main} />
          <Typography
            className="ms-2"
            style={{ fontWeight: "bold", fontSize: "18px" }}
          >
            {t("UseToApp")}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="col-12">
          {logsAfiliate.length > 0 ? (
            <React.Fragment>
              {logsAfiliate.map((x) => (
                <>
                  <Typography>{actionsLogsMobile[x.session_type]}</Typography>
                  <div className="d-flex justify-content-around">
                    <div>
                      <Typography variant="body1">
                        <b>{x.session_name}</b>
                      </Typography>
                      <Typography variant="body2">{x.created_at}</Typography>
                    </div>
                    <IconButton onClick={() => handleClick(x.session_id)}>
                      <IconEyeView />
                    </IconButton>
                  </div>

                  <br></br>
                </>
              ))}
            </React.Fragment>
          ) : (
            <Typography variant="body2">{t("Message.EmptyData")}</Typography>
          )}
          <ShardComponentModal
            isOpen={open}
            handleClose={() => setOpen(false)}
            title="Historial de sesión"
            body={
              <ModalDetailLogAppMobile idLog={selectedlog} userId={userId} />
            }
          />
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
