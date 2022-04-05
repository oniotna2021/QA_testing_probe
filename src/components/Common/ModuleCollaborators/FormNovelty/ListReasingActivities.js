import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { format } from "date-fns/esm";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

// Components
import Loading from "components/Shared/Loading/Loading";
import ButtonModalForm from "components/Shared/ButtonModalForm/ButtonModalForm";

// Service
import { getActivitesScheduleEmployee } from "services/Reservations/activitiesUser";

// Utils
import {
  errorToast,
  formatDateToHHMMSS,
  infoToast,
  mapErrors,
} from "utils/misc";
import ChangeDateComponent from "./ChangeDateComponent";

const ListReasingActivities = ({
  title,
  setActivityData,
  isMedical,
  setIsMedical,
  setValueTab,
  userId,
  setIsOpen,
  selectDate,
  handleChangeDate,
  venueId,
  isRangeHours,
}) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [activities, setActivites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (
      load &&
      selectDate.start_date &&
      selectDate.start_date &&
      venueId !== undefined
    ) {
      setLoading(true);

      const formatDateStart = `${format(
        selectDate.start_date,
        "yyyy-MM-dd"
      )} ${formatDateToHHMMSS(selectDate.start_time)}`;
      const formatDateEnd = `${format(
        selectDate.end_date,
        "yyyy-MM-dd"
      )} ${formatDateToHHMMSS(selectDate.end_time)}`;

      setLoad(false);
      getActivitesScheduleEmployee(
        userId,
        formatDateStart,
        formatDateEnd,
        venueId,
        isRangeHours
      )
        .then(({ data }) => {
          if (data && data?.status === "success" && data?.data?.data) {
            if (data?.data?.is_medical === 1) {
              if (data?.data?.data?.length === 0) {
                enqueueSnackbar(
                  t("FormReassingQuotes.WarningEmptyQuotes"),
                  infoToast
                );
                setValueTab(0);
              }

              setIsMedical(data?.data?.is_medical === 1 ? true : false);
              setActivites(data?.data?.data);
              return;
            }

            if (data?.data?.data.every((p) => p.standby === false)) {
              enqueueSnackbar(
                t("FormReassingActivities.WarningEmptyActivities"),
                infoToast
              );
              setValueTab(0);
            }
            setIsMedical(data?.data?.is_medical === 1 ? true : false);
            setActivites(data?.data?.data);
          } else {
            enqueueSnackbar(
              t("FormReassingQuotes.WarningEmptyQuotes"),
              infoToast
            );
            setValueTab(0);

            if (data.status === "error") {
              console.log(mapErrors(data?.data), errorToast);
              return;
            }
          }
        })
        .catch((err) => {
          enqueueSnackbar(mapErrors(err), errorToast);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [
    load,
    enqueueSnackbar,
    selectDate,
    userId,
    setValueTab,
    setIsMedical,
    venueId,
    t,
    isRangeHours,
  ]);

  const handleClick = (dataActivity) => {
    setActivityData(dataActivity);
    setValueTab(2);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        {title && <Typography variant="h6">{title}</Typography>}
        <IconButton
          style={{ backgroundColor: "white", color: "#000" }}
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <ChangeDateComponent
        setLoad={setLoad}
        selectDate={selectDate}
        handleChangeDate={handleChangeDate}
      />

      <Typography className="mb-2 mt-4" variant="body1">
        {isMedical
          ? t("FormReassingQuotes.Description")
          : t("FormReassingActivities.Description")}
      </Typography>

      <div className="my-4">
        {loading && activities.length === 0 ? (
          <Loading />
        ) : (
          activities &&
          activities.map((activity, idx) => {
            return (
              <ButtonModalForm
                isCheck={activity?.standby === false}
                textBold={true}
                isAssing={true}
                bgColor="#ffff"
                color={theme.palette.black.light}
                key={idx}
                idM={activity.id || activity.date}
                onClick={() => handleClick(activity)}
                title={activity.activity_name || activity.date}
                quotes={activity?.quotes?.length}
                url_image={activity?.activity_image}
              />
            );
          })
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  venueId: auth.venueIdDefaultProfile,
});

export default connect(mapStateToProps)(ListReasingActivities);
