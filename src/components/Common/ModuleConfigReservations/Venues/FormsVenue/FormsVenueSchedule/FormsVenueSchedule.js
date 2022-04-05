import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

// Ui
import Typography from "@material-ui/core/Typography";

// Components
import Loading from "components/Shared/Loading/Loading";
import ButtonSave from "components/Shared/ButtonSave/ButtonSave";
import Schedules from "components/Shared/ScheduleDaysWeek/Schedule";

//Services
import {
  getScheduleVenueById,
  postAllShedulesVenue,
  putUpdateSheduleVenueById,
} from "services/Reservations/scheduleVenue";

// Hooks
import useIsMounted from "hooks/useIsMounted";

//utils
import {
  successToast,
  errorToast,
  mapErrors,
  checkSchedules,
} from "utils/misc";

const FormVenueSchedule = ({
  idVenue,
  isEdit,
  setIsOpen,
  setLoadSchedule,
  isVirtual = false,
  scheduleVirtual,
}) => {
  const isMounted = useIsMounted();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { handleSubmit } = useForm({
    defaultValues: {
      venue_id: idVenue,
    },
  });
  const [isEditSchedule, setIsEditSchedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [scheduleData, setScheduleData] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!isVirtual) {
      setLoad(true);
      getScheduleVenueById(idVenue)
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.schedules
          ) {
            if (isMounted.current) {
              setScheduleData(data.data.schedules);
              setIsEditSchedule(true);
            }
          } else {
            setIsEditSchedule(false);
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
    } else {
      setScheduleData(scheduleVirtual);
      setIsEditSchedule(true);
    }
  }, [idVenue, enqueueSnackbar, isMounted, isVirtual, scheduleVirtual]);

  const submitForm = (data) => {
    const dataForm = {
      ...data,
      schedules: checkSchedules(schedules),
    };

    setLoading(true);
    const functionCall = isEditSchedule
      ? putUpdateSheduleVenueById
      : postAllShedulesVenue;
    functionCall(dataForm, idVenue)
      .then(({ data }) => {
        if (data && data.message && data.status === "success") {
          console.log(data.status);
          enqueueSnackbar(t("SportsHistory.SaveForms"), successToast);
          setIsOpen(false);
          if (setLoadSchedule) {
            setLoadSchedule(true);
          }
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      <Typography variant="body2">
        {t("FormsVenueSchedule.Description")}
      </Typography>

      {load === 0 ? (
        <Loading />
      ) : (
        <Schedules
          defaultValues={scheduleData}
          setSchedules={setSchedules}
          schedules={schedules}
        />
      )}

      <div className="d-flex justify-content-end mt-3">
        <ButtonSave
          style={{ width: "200px" }}
          loader={loading}
          text={isEditSchedule ? t("Btn.saveChanges") : t("Btn.save")}
        />
      </div>
    </form>
  );
};

export default FormVenueSchedule;
