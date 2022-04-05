import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// UI
import Typography from "@material-ui/core/Typography";
import { IconBigCalendarBooking } from "assets/icons/customize/config";
import IconButton from "@material-ui/core/IconButton";

// conmponents
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import CreateBookingAfiliate from "./CreateBookingAfiliate";

import { useStyles } from "utils/useStyles";

const modalProps = {
  fullWidth: true,
  width: "sm",
  style: {
    padding: "20px 15px",
  },
};

const IndexCreateBooking = ({ idVenue, setIsLoading, isLoading }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`${classes.containerIconButtonHome}`}
        onClick={() => setIsOpen(true)}
      >
        <IconButton className={``} variant="outlined" size="medium">
          <IconBigCalendarBooking color="#3C3C3B" width="50" height="50" />
        </IconButton>

        <Typography className={classes.fontCardSchedule} variant="body3">
          {t("HomeTrainingPlans.CreateBooking")}
        </Typography>
      </div>

      <ShardComponentModal
        {...modalProps}
        body={
          <CreateBookingAfiliate
            idVenue={idVenue}
            setIsOpen={setIsOpen}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        }
        isOpen={isOpen}
      />
    </>
  );
};

export default IndexCreateBooking;
