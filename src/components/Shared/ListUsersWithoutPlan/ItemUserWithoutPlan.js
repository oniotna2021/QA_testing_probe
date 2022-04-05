import React, { useState } from "react";
import { useTranslation } from "react-i18next";

//component
import FormTrainingPlan from "../FormAppointment/FormTrainingPlan";
import { ShardComponentModal } from "components/Shared/Modal/Modal";

//icons
import { IconRisk } from "assets/icons/customize/config";

//UI
import Typography from "@material-ui/core/Typography";

//utils
import { useStyles } from "utils/useStyles";

const ItemUserWithoutPlan = ({ isDanger, dataUser, reload, setReload }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);

  function handleClickItem() {
    if (dataUser.trainer === null) {
      setOpenModal(true);
    }
  }

  return (
    <div>
      <div
        className={isDanger ? classes.itemUserDanger : classes.itemUser}
        onClick={handleClickItem}
      >
        <div className="row m-0">
          <div className="col-4">
            <Typography
              noWrap
              variant="body2"
            >{`${dataUser.first_name} ${dataUser.last_name}`}</Typography>
            <Typography className={classes.fontSlug}>
              {dataUser.plan_start_date}
            </Typography>
          </div>
          <div className="col-5">
            <Typography variant="body2">{`Doc. ${dataUser.document_number}`}</Typography>
            <Typography className={classes.fontSlug}>
              {`Tel. ${dataUser.phone_number}`}
            </Typography>
          </div>
          <div className="col-3">
            <Typography className={classes.fontSlug}>
              {t("Slug.TrainerAsigned")}
            </Typography>
            <Typography noWrap variant="body2">
              {dataUser?.trainer ? dataUser?.trainer : "-"}
            </Typography>
          </div>
        </div>
        <IconRisk />
      </div>
      <ShardComponentModal
        isOpen={openModal}
        fullWidth
        width="sm"
        handleClose={() => setOpenModal(false)}
        body={
          <FormTrainingPlan
            isFormModal={true}
            reload={reload}
            setReload={setReload}
            user_id={dataUser.id}
            setOpenAssignTrainer={setOpenModal}
          />
        }
      />
    </div>
  );
};
export default ItemUserWithoutPlan;
