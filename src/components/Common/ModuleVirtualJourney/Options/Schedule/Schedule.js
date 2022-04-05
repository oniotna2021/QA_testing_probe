import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// redux
import { useSelector } from "react-redux";

// UI
import { Typography } from "@material-ui/core";

// components
import BoxItems from "./BoxItems";
import ScheduleForm from "./ScheduleForm";
import ScheduleCardItem from "components/Shared/ScheduleCardItem/ScheduleCardItem";
import { ShardComponentModal } from "components/Shared/Modal/Modal";
import PhoneCallModal from "components/Shared/ScheduleCardItem/PhoneCallModal";
import DetailQuote from "components/Common/ModuleCalendarJourney/Calendar/DetailQuote";

// services
import { postQuote } from "services/VirtualJourney/Quotes";

// hooks
import { useGetSchedules } from "hooks/CachedServices/VirtualJourney/Schedule";
import Loading from "components/Shared/Loading/Loading";

// utils
import { mapErrors, errorToast, successToast } from "utils/misc";

// translate
import { useTranslation } from "react-i18next";

const modalProps = {
  backgroundColorButtonClose: "transparent",
  colorButtonClose: "transparent",
  fullWidth: true,
  width: "sm",
};

const modalPropsReassing = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
  style: {
    padding: "20px 15px",
  },
};

const Schedule = ({ userId, setOptionSelection, isFrom360 }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  let history = useHistory();
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const { user_id } = useParams();
  const [fetching, setFetching] = useState(false);
  const [phoneCallModalState, setPhoneCallModalState] = useState(false);
  const [isOpenDetailQuote, setIsOpenDetailQuote] = useState(false);
  const [idQuote, setIdQuote] = useState(null);
  const [selectedDate, setSelectedDate] = useState();

  const [quote, setQuote] = useState({});

  const { swrData, isLoading, refreshData } = useGetSchedules(user_id);
  const savedForm = useSelector((state) => state.virtualJourney.welcomeForm);

  const onSubmit = (values) => {
    setFetching(true);
    const payload = {
      member_id: user_id,
      phone_number_user: savedForm?.phone_number,
      appointment_type_id: values.appointment_type_id,
      date: selectedDate,
      hour: values.hour,
    };
    postQuote(payload, userId)
      .then(({ data }) => {
        if (data.status === "success") {
          refreshData();
          enqueueSnackbar(mapErrors(data), successToast);
        } else {
          enqueueSnackbar(mapErrors(data), errorToast);
        }
      })
      .catch((err) => enqueueSnackbar(mapErrors(err), errorToast))
      .finally(() => setFetching(false));
  };

  const handleClickHistoryCallsQuote = (id) => {
    setPhoneCallModalState(true);
    setIdQuote(id);
  };

  const handleClickQuote = ({ data }) => {
    setQuote({
      idQuote: data.id,
      medicalProfessionalId: data.medical_professional_id,
      userId: data.user_id,
      phoneNumberUser: 343243330,
    });
    setIsOpenDetailQuote(true);
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex justify-content-between mb-3">
            <Typography variant="body1">
              <b>{t("BoxItems.ModuleVirtualJourneySchedule")}</b>
            </Typography>
            <BoxItems />
          </div>
          <Typography variant="body1" className="mb-3">
            {t("BoxItems.ModuleVirtualJourneyScheduleSelect")}
          </Typography>
          <ScheduleForm
            control={control}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            errors={errors}
            fetching={fetching}
            getValues={getValues}
            setValue={setValue}
            setSelectedDate={setSelectedDate}
          />
          <div className="mt-4">
            {swrData &&
              swrData.length > 0 &&
              swrData?.map((scheduleItem) => (
                <ScheduleCardItem
                  isFrom360={isFrom360}
                  key={scheduleItem.id}
                  handleClickHistoryCallsQuote={handleClickHistoryCallsQuote}
                  handleClickQuote={handleClickQuote}
                  {...scheduleItem}
                />
              ))}
          </div>
        </>
      )}

      <ShardComponentModal
        {...modalProps}
        body={
          <PhoneCallModal
            setIsOpen={setPhoneCallModalState}
            idQuote={idQuote}
            setOptionSelection={setOptionSelection}
          />
        }
        style={{ padding: 20 }}
        isOpen={phoneCallModalState}
      />

      <ShardComponentModal
        fullWidth
        {...modalPropsReassing}
        body={
          <DetailQuote
            quote={quote}
            handleClose={() => {
              refreshData();
              setIsOpenDetailQuote(false);
              history.goBack();
            }}
            setIsOpen={setIsOpenDetailQuote}
            shouldInitQuote
            initQuote={false}
          />
        }
        isOpen={isOpenDetailQuote}
      />
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  userId: auth.userId,
});

export default connect(mapStateToProps)(Schedule);
