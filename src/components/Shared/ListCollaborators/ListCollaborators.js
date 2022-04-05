import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

// Ui
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

//icons
import { IconArrowRightMin } from "assets/icons/customize/config";

//components
import { ShardComponentModal } from "../Modal/Modal";
import FormAddFileUsersToTrainers from "./FormAddFileUsersToTrainers";

// Hooks
import { useGetEmployeesByVenue } from "hooks/CachedServices/employees";

//Routes
import { ConfigNameRoutes } from "router/constants";
import { useStyles } from "utils/useStyles";
import { Skeleton } from "@material-ui/lab";

const ListCollaborators = ({ idVenue }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);

  const { swrData, isLoading } = useGetEmployeesByVenue(idVenue);

  const goListCompleted = () => {
    history.push(ConfigNameRoutes.collaborators);
  };

  return (
    <>
      {isLoading ? (
        <div className="mt-4">
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
          <Skeleton animation="wave" width="100%" height={70} />
        </div>
      ) : (
        swrData &&
        swrData.slice(0, 3).map((collaborator, index) => (
          <div
            className={`row m-0 my-2 p-2 ${classes.containerCollaborator}`}
            key={index}
          >
            <div className="col-3">
              <div className="col-3">
                <Avatar
                  className="me-2"
                  src={
                    collaborator?.photo === "undefined"
                      ? null
                      : collaborator?.photo
                  }
                ></Avatar>
              </div>
            </div>

            <div className="col-9">
              <Typography className={classes.fontCardSchedule} variant="body1">
                {collaborator.first_name}
              </Typography>
              <Typography variant="body2">
                {collaborator.profile_name}
              </Typography>
            </div>
          </div>
        ))
      )}

      <div onClick={goListCompleted} className={classes.buttonCollaborator}>
        <div className="d-flex justify-content-between align-items-center p-4">
          <Typography className={classes.fontCardSchedule} variant="body1">
            {t("HomeTrainingPlans.SeeAll")}
          </Typography>

          <Button>
            <IconArrowRightMin color="#3C3C3B" width="10" height="20" />
          </Button>
        </div>
      </div>
      {/* <Button
        className={classes.boxButton}
        style={{ width: "100%", marginTop: 60 }}
        onClick={() => setOpenForm(true)}
        startIcon={<IconAddUser color={theme.palette.black.main} />}
      >
        <Typography variant="body2">Cargar Asignaciones</Typography>
      </Button> */}
      <ShardComponentModal
        title={"Subir excel"}
        fullWidth={true}
        width={"xs"}
        handleClose={() => setOpenForm(false)}
        body={<FormAddFileUsersToTrainers />}
        isOpen={openForm}
      />
    </>
  );
};

export default ListCollaborators;
