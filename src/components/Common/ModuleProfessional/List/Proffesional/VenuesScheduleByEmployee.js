import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//UI
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";

//COMPONENTS
import Loading from "components/Shared/Loading/Loading";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import { FormAddScheldule } from "components/Common/ModuleProfessional/Manage/Proffesional/FormAddScheldule";

//SERVICES
import { getVenuesByEmployees } from "services/Reservations/scheduleEmployee";

//UTILS
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors } from "utils/misc";

const VenuesScheduleByEmployee = ({
  isEdit,
  shouldAdd = true,
  idUser,
  venues,
  setVenues,
  brandId,
  brands = [],
  ...restProps
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentVenueId, setCurrentVenueId] = useState(0);
  const [virtualData, setVirtualData] = useState({});

  useEffect(() => {
    if (idUser && load) {
      setLoading(true);
      getVenuesByEmployees(idUser)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            (data.data.venues || data.data.is_virtual)
          ) {
            setVenues(data?.data?.venues || []);
            setVirtualData({
              is_virtual: data?.data?.is_virtual,
              schedule_virtual: data?.data?.schedule_virtual,
            });
          } else {
            setVenues([]);
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoad(false);
          setLoading(false);
        });
    }
  }, [load, idUser, enqueueSnackbar, setVenues, brandId]);

  const handleClickVenueSchedule = (value) => {
    setCurrentVenueId(value);
    setIsOpen(true);
  };

  return (
    <>
      <div className="d-flex align-items-center flex-wrap g-0 m-0">
        {loading ? (
          <div className="me-2">
            {" "}
            <Loading />{" "}
          </div>
        ) : venues.length === 0 && Object.keys(virtualData).length === 0 ? (
          <Typography className="me-2">
            {t("FormProfessional.InputAddSchedule")}
          </Typography>
        ) : (
          <>
            {Object.keys(virtualData).length > 0 &&
              virtualData.is_virtual === 1 && (
                <div
                  className={classes.cardSchedule}
                  onClick={() => handleClickVenueSchedule(null)}
                >
                  <Typography className={classes.fontCardSchedule} noWrap>
                    {t("Message.Virtual")}
                  </Typography>
                </div>
              )}

            {venues.map((venue) => (
              <div
                className={classes.cardSchedule}
                key={venue.id}
                onClick={() => handleClickVenueSchedule(venue.id)}
              >
                <Typography className={classes.fontCardSchedule} noWrap>
                  {venue.name}
                </Typography>
              </div>
            ))}
          </>
        )}

        {shouldAdd && (
          <div className={`${classes.buttonAdd}`}>
            <IconButton
              onClick={() => {
                setCurrentVenueId(0);
                setIsOpen(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        )}
      </div>

      <ShardComponentModal
        fullWidth
        width="xs"
        isOpen={isOpen}
        body={
          <FormAddScheldule
            {...restProps}
            idUser={idUser}
            isEdit={currentVenueId === 0 ? false : true}
            currentVenueId={currentVenueId}
            setLoad={setLoad}
            setIsOpen={setIsOpen}
            virtualData={virtualData}
            brands={brands}
          />
        }
      />
    </>
  );
};

export default VenuesScheduleByEmployee;
