import React, { useEffect, useState } from "react";
//utils
import { errorToast, mapErrors } from "utils/misc";

import ButtonModalForm from "components/Shared/ButtonModalForm/ButtonModalForm";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import FormActivity from "./FormActivity";
// Components
import Loading from "components/Shared/Loading/Loading";
// Ui
import Typography from "@material-ui/core/Typography";
//Services
import { getActivitesByVenue } from "services/Reservations/venueActivities";
import { useSnackbar } from "notistack";
import { useTheme } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

const FormsVenueActivities = ({ idVenue, setIsOpen, files }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [load, setLoad] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [idItem, setIdItem] = useState("");
  const [activities, setActivities] = useState([]);
  const [lockCapacity, setLockCapacity] = useState("");

  useEffect(() => {
    if (load && idVenue) {
      getActivitesByVenue(idVenue)
        .then(({ data }) => {
          if (data && data.status === "success" && data.data && data.data) {
            setActivities(data.data);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoad(false);
        });
    }
  }, [enqueueSnackbar, idVenue, load]);

  const handleClick = (id) => {
    if (id === 0) {
      setIdItem(0);
      setOpenForm(true);
      setIsEdit(false);
    } else {
      setOpenForm(true);
      setIdItem(id);
      setIsEdit(true);
    }
  };

  return (
    <>
      {!openForm && (
        <Typography variant="body2">
          {t("FormVenueActivity.Description")}
        </Typography>
      )}

      {!openForm && (
        <div className="mb-4">
          <ButtonModalForm
            idM={0}
            onClick={handleClick}
            title={t("FormVenueActivity.InputCreateActivity")}
          />
        </div>
      )}

      {openForm && (
        <FormActivity
          files={files}
          setLoad={setLoad}
          setOpenForm={setOpenForm}
          idVenue={idVenue}
          lockCapacity={lockCapacity}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setIdItem={setIdItem}
          idItem={idItem}
        />
      )}

      {!openForm &&
        (load ? (
          <Loading />
        ) : (
          <div className="d-flex flex-column mb-4">
            {activities &&
              activities.map((activity) => (
                <ButtonModalForm
                  lockCapacity={activity.is_lock_capacity !== 0 ? true : false}
                  bgColor={activity.status_activity === 1 ? "#ffff" : "#ECECEB"}
                  isActivity={true}
                  statusActivity={activity.status_activity === 1 ? true : false}
                  color={theme.palette.black.light}
                  key={activity.id}
                  idM={activity.id}
                  onClick={() => {
                    handleClick(activity.id);
                    setLockCapacity(activity.is_lock_capacity);
                  }}
                  title={activity.activity_name}
                  url_image={activity?.activity_image}
                  isEdit={true}
                />
              ))}
          </div>
        ))}

      {!openForm && (
        <div className="d-flex justify-content-end mt-3">
          <ButtonSave
            style={{ width: "200px" }}
            typeButton="button"
            onClick={() => setIsOpen(false)}
            text={isEdit ? t("Btn.saveChanges") : t("Btn.save")}
          />
        </div>
      )}
    </>
  );
};

export default FormsVenueActivities;
