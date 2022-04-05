import React, { useState } from "react";

import { FormsVenueActivities } from "components/Common/ModuleConfigReservations/Venues/FormsVenue";
import IconButton from "@material-ui/core/IconButton";
import { IconWeightlifting } from "assets/icons/customize/config";
// conmponents
import { ShardComponentModal } from "components/Shared/Modal/Modal";
// UI
import Typography from "@material-ui/core/Typography";
// Utils
import { useStyles } from "utils/useStyles";
import { useTranslation } from "react-i18next";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
};

const ActivitiesVenue = ({ idVenue }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleChangeIsEdit = () => {
    setIsEdit(true);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsEdit(false);
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={`${classes.containerIconButtonHome}`}
        onClick={handleChangeIsEdit}
      >
        <IconButton className={``} variant="outlined" size="medium">
          <IconWeightlifting color="#3C3C3B" width="50" height="50" />
        </IconButton>

        <Typography className={classes.fontCardSchedule} variant="body3">
          {t("ListActivities.Container")}
        </Typography>
      </div>

      <ShardComponentModal
        {...modalProps}
        body={
          <FormsVenueActivities
            idVenue={idVenue}
            isEdit={isEdit}
            setIsOpen={setIsOpen}
          />
        }
        isOpen={isOpen}
        handleClose={handleCloseModal}
        title={t("FormsVenueActivities.AssingActivities")}
      />
    </>
  );
};

export default ActivitiesVenue;
