import React from "react";
import { useTranslation } from "react-i18next";

import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// COMPONENTS
import Loading from "components/Shared/Loading/Loading";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";

// Utils
import { checkVariable } from "utils/misc";

const DetailActivity = ({
  setIsOpen,
  dataDetailActivity,
  setValueTab,
  userType,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className="mb-4">
        {Object.keys(dataDetailActivity).length === 0 ? (
          <Loading />
        ) : (
          <>
            <div className="d-flex justify-content-between">
              <Typography className="me-4">
                <b>{t("DetailActivityModal.ActivityDate")}</b>
              </Typography>{" "}
              <Typography noWrap={true}>
                {checkVariable(dataDetailActivity.date)}
              </Typography>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Typography className="me-4">
                <b>{t("DetailActivityModal.ActivityName")}</b>
              </Typography>{" "}
              <Typography noWrap={true}>
                {checkVariable(dataDetailActivity.activity_name)}
              </Typography>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Typography>
                <b>{t("DetailActivityModal.LocationName")}</b>
              </Typography>
              <Typography>
                {checkVariable(dataDetailActivity.location_name)}
              </Typography>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Typography>
                <b>{t("ListLocation.Capacity")}</b>
              </Typography>
              <Typography>
                {dataDetailActivity.Bookings ? dataDetailActivity.Bookings : 0}{" "}
                / {checkVariable(dataDetailActivity.capacity)}
              </Typography>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Typography>
                <b>{t("DetailActivityModal.Managers")}</b>
              </Typography>
              <Typography className="me-2">
                {checkVariable(dataDetailActivity.managers.join(", "))}
              </Typography>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Typography>
                <b>{t("DetailActivityModal.HourInit")}</b>
              </Typography>
              <Typography>
                {checkVariable(dataDetailActivity.start_time)}
              </Typography>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <Typography>
                <b>{t("DetailActivityModal.HourFinal")}</b>
              </Typography>
              <Typography>
                {checkVariable(dataDetailActivity.end_time)}
              </Typography>
            </div>

            {userType === 17 || userType === 41 ? (
              ""
            ) : (
              <div className="d-flex justify-content-between mt-3">
                <Button
                  onClick={() => setValueTab(2)}
                  fullWidth
                  className="me-2"
                  variant="outlined"
                  color="primary"
                >
                  {t("Btn.Inactivate")}
                </Button>
                <ButtonSave
                  color="primary"
                  style={{ marginBottom: 0 }}
                  fullWidth={true}
                  onClick={() => setValueTab(1)}
                  text={t("ListPermissions.Edit")}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default DetailActivity;
