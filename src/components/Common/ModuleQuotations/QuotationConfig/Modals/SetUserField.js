import React from "react";
import { useTranslation } from "react-i18next";

//UI
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Tooltip from "@material-ui/core/Tooltip";
import { Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const SetUserField = ({ currentUserInfo, setUserDocument, isLoading }) => {
  const { t } = useTranslation();
  return (
    <div>
      <TextField
        variant="outlined"
        label={t("FormScheduleAppointment.labelDocument")}
        className="mb-2"
        onChange={(e) => setUserDocument(e.target.value)}
        InputProps={{
          endAdornment: document && (
            <Tooltip placement="top">
              <InputAdornment position="end">
                {currentUserInfo ? <CheckCircleIcon /> : <CancelIcon />}
              </InputAdornment>
            </Tooltip>
          ),
        }}
      />
      <div className="row">
        <div className="col p-3 mb-3" style={{ height: 120 }}>
          {isLoading ? (
            <div>
              <Skeleton animation="wave" height={30} width={200} />
              <Skeleton animation="wave" height={30} width={350} />
              <Skeleton animation="wave" height={30} width={300} />
            </div>
          ) : currentUserInfo ? (
            <div>
              <Typography variant="body1">
                <strong> {t("Quotation.AddUser.Name")}: </strong>{" "}
                {currentUserInfo.first_name + " " + currentUserInfo.last_name}
              </Typography>
              <Typography variant="body1">
                <strong> {t("Quotation.AddUser.Email")}: </strong>{" "}
                {currentUserInfo.email}
              </Typography>
              <Typography variant="body1">
                <strong> {currentUserInfo.document_type_name}: </strong>{" "}
                {currentUserInfo.document_number}
              </Typography>
            </div>
          ) : (
            t("Quotation.AddUser.NoRegister")
          )}
        </div>
      </div>
    </div>
  );
};

export default SetUserField;
