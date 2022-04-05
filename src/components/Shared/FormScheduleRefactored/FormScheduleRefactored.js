import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

// Components
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import FormSchedule from "./FormSchedule";

// Services
import { getEmployeesByVenue } from "services/Reservations/employess";

//utils
import { daysWeek, errorToast, mapErrors } from "utils/misc";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
  //   style: { padding: "30px" },
};

const FormScheduleRefactored = ({
  inCollaborators,
  title,
  description,
  setOpenedDayWeek,
  openedDayWeek,
  children,
  idVenue,
  isSelectManagers = true,
  isSelectVirtual = false,
  openMassiveActivity,
  setOpenMassiveActivity,
  ...restProps
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isOpen, setIsOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (isSelectManagers) {
      getEmployeesByVenue(idVenue, openedDayWeek)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data?.data?.users?.length > 0
          ) {
            const filterManagers = data?.data?.users;
            setManagers(filterManagers);
          } else {
            if (data.status === "error") {
              enqueueSnackbar(mapErrors(data.data), errorToast);
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        });
    }
  }, [enqueueSnackbar, setManagers, isSelectManagers, idVenue, openedDayWeek]);

  return (
    <>
      {inCollaborators ? (
        <FormSchedule
          setOpenedDayWeek={setOpenedDayWeek}
          openedDayWeek={openedDayWeek}
          {...restProps}
          description={description}
          inCollaborators={inCollaborators}
          managers={managers}
          idVenue={idVenue}
          isModified={false}
          setIsModified={setIsModified}
          isSelectManagers={isSelectManagers}
          isSelectVirtual={isSelectVirtual}
        />
      ) : (
        <>
          {children({
            isOpen: isOpen,
            setIsOpen: setIsOpen,
          })}

          {isOpen && (
            <ShardComponentModal
              fullWidth
              {...modalProps}
              body={
                <>
                  <FormSchedule
                    setOpenedDayWeek={setOpenedDayWeek}
                    openedDayWeek={openedDayWeek}
                    setIsOpen={setIsOpen}
                    handleClose={() => {
                      setIsOpen(false);
                    }}
                    {...restProps}
                    description={description}
                    managers={managers}
                    idVenue={idVenue}
                    isModified={isModified}
                    setIsModified={setIsModified}
                    isSelectManagers={isSelectManagers}
                    isSelectVirtual={isSelectVirtual}
                    openMassiveActivity={openMassiveActivity}
                    setOpenMassiveActivity={setOpenMassiveActivity}
                  />
                </>
              }
              isOpen={isOpen}
              title={title}
              handleClose={() => {
                setIsOpen(false);
              }}
            />
          )}
        </>
      )}
    </>
  );
};

FormScheduleRefactored.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  idVenue: PropTypes.number.isRequired,
};

export default FormScheduleRefactored;
