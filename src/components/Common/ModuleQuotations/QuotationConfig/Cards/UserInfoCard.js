import React from "react";
import { useTranslation } from "react-i18next";

//UI
import Typography from "@material-ui/core/Typography";
import { Card } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

// icons
import { IconEditItem } from "assets/icons/customize/config";

const UserInfoCard = ({
  selectedUserInfo,
  setNewUserForm,
  defaultQuotation,
  isDetail,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      {isDetail ? (
        <div className="row p-3 d-flex align-items-center">
          <div className="col">
            <Typography
              variant="caption"
              display="block"
              style={{ color: "gray" }}
            >
              {t("QuotationsConfig.NameCard")}
            </Typography>
            <Typography variant="p">
              {defaultQuotation?.client_information?.name}
            </Typography>
          </div>

          <div className="col">
            <Typography
              variant="caption"
              display="block"
              style={{ color: "gray" }}
            >
              {t("QuotationsConfig.IdCard")}
            </Typography>
            <Typography variant="p">
              {`${defaultQuotation?.client_information?.document_type_name} ${defaultQuotation?.client_information?.document_number}`}
            </Typography>
          </div>
        </div>
      ) : !selectedUserInfo ? (
        <div className="p-3 d-flex align-items-center justify-content-between">
          <Typography variant="body1">{t("Quotation.SelectUser")}</Typography>
          <IconButton onClick={() => setNewUserForm(true)}>
            <IconEditItem color="gray" width="20" height="20"></IconEditItem>
          </IconButton>
        </div>
      ) : (
        <div className="row p-3 d-flex align-items-center">
          <div className="col">
            <Typography
              variant="caption"
              display="block"
              style={{ color: "gray" }}
            >
              {t("QuotationsConfig.NameCard")}
            </Typography>
            <Typography variant="body1">
              {`${selectedUserInfo?.first_name} ${selectedUserInfo?.last_name}`}
            </Typography>
          </div>

          <div className="col">
            <Typography
              variant="caption"
              display="block"
              style={{ color: "gray" }}
            >
              {t("QuotationsConfig.IdCard")}
            </Typography>
            <Typography variant="p">
              {`${selectedUserInfo.document_type_name} ${selectedUserInfo?.document_number}`}
            </Typography>
          </div>

          <div className="col d-flex justify-content-end">
            <IconButton onClick={() => setNewUserForm(true)}>
              <IconEditItem color="gray" width="20" height="20"></IconEditItem>
            </IconButton>
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserInfoCard;
