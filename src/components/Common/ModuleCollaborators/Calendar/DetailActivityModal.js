import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

// COMPONENTS
import Loading from "components/Shared/Loading/Loading";

import EditActivityForm from "components/Common/ModuleCollaborators/Calendar/EditActivityForm";

// Utils
import { checkVariable } from "utils/misc";

const DetailActivityModal = ({
  canEdit = true,
  setIsOpen,
  dataDetailActivity,
  setFetchReload,
  extendActivityInformation = false,
}) => {
  const { t } = useTranslation();

  const [isEdit, setIsEdit] = useState(false);

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Typography variant="h6">
          {isEdit
            ? t("DetailActivityModal.EditPage")
            : t("DetailActivityModal.Title")}
        </Typography>

        <div className="d-flex align-items-center">
          {canEdit && (
            <IconButton className="me-2" onClick={() => setIsEdit(!isEdit)}>
              <EditIcon color="primary" />
            </IconButton>
          )}
          <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
        </div>
      </div>
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

            {extendActivityInformation && (
              <>
                <div className="d-flex justify-content-between mt-2">
                  <Typography>
                    <b>{t("ListLocation.Capacity")}</b>
                  </Typography>
                  <Typography>
                    {checkVariable(dataDetailActivity.capacity)}
                  </Typography>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <Typography>
                    <b>{t("DetailActivityModal.Bookings")}</b>
                  </Typography>
                  <Typography>
                    {checkVariable(dataDetailActivity.bookings)}
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
              </>
            )}

            {isEdit ? (
              <EditActivityForm
                setFetchReload={setFetchReload}
                setIsOpen={setIsOpen}
                dataDetailActivity={dataDetailActivity}
              />
            ) : (
              <>
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
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default DetailActivityModal;
