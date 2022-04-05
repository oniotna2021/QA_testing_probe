import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { connect } from "react-redux";

// UI
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { IconCalendarJourney } from "assets/icons/customize/config";

// Components
import { ShardComponentModal } from "components/Shared/Modal/Modal";

// Service
import { getQuotesByRangeDate } from "services/VirtualJourney/Quotes";

//Utils
import { useStyles } from "utils/useStyles";
import { errorToast, mapErrors } from "utils/misc";
// import ContainerTableCalendar from "./ContainerTableCalendar";
import CalendarContainer from "components/Shared/ScheduleCalendar/Calendar";
import FormQuote from "./FormQuote";
import DetailQuote from "./DetailQuote";

const modalProps = {
  backgroundColorButtonClose: "white",
  colorButtonClose: "#000",
  fullWidth: true,
  width: "xs",
  style: {
    padding: "20px 15px",
  },
};

const Calendar = ({
  userId,
  userProfileId,
  nextWeek,
  prevWeek,
  fetchReload,
  setFetchReload,
  dateInitEnd,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [dataQuotes, setDataQuotes] = useState([]);
  const [isOpenDetailQuote, setIsOpenDetailQuote] = useState(false);
  const [isOpenCreateQuote, setIsOpenCreateQuote] = useState(false);
  const [defaultDate, setDefaultDate] = useState(null);
  const [quote, setQuote] = useState({});

  useEffect(() => {
    if (Object.keys(dateInitEnd).length > 0 && fetchReload) {
      const listTypesQuotes = userProfileId === 29 ? "6,7,8" : "9,10,11";
      getQuotesByRangeDate(
        dateInitEnd.dateInit,
        dateInitEnd.dateEnd,
        listTypesQuotes,
        userId
      )
        .then(({ data }) => {
          if (
            data &&
            data.status === "success" &&
            data.data &&
            data.data.length > 0
          ) {
            setDataQuotes(data.data[0].activities);
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
          setFetchReload(false);
        });
    }
  }, [
    dateInitEnd,
    enqueueSnackbar,
    fetchReload,
    setFetchReload,
    userProfileId,
    userId,
  ]);

  const handleClickQuote = ({ data }) => {
    setQuote({
      idQuote: data.id,
      medicalProfessionalId: data.medical_professional_id,
      userId: data.user_id,
      phoneNumberUser: data.phone_number_user,
    });
    setIsOpenDetailQuote(true);
  };

  const handleClickNewQuote = ({ date }) => {
    setDefaultDate(date);
    setIsOpenCreateQuote(true);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <IconButton
            onClick={prevWeek}
            style={{ transform: "rotate(-180deg)" }}
            className={`me-4 ${classes.buttonArrowForward}`}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          <div className="d-flex align-items-center">
            <IconCalendarJourney color={"#3C3C3B"} width="24" height="24" />

            <Typography variant="p" className={`ms-2 ${classes.textBold}`}>
              Actividades
            </Typography>
          </div>
        </div>

        <div>
          <IconButton
            onClick={nextWeek}
            className={`ms-3 ${classes.buttonArrowForward}`}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      <div style={{ height: 350 }}>
        <CalendarContainer
          type="week"
          rangeDate={{ start: 4, end: 23 }}
          handleClickAvailableHour={handleClickNewQuote}
          handleClickEvent={handleClickQuote}
          dataEvents={dataQuotes}
          scrollToHourNow={true}
          businessHour={true}
          viewHeaderDate={false}
          stylesContainerCalendar={{ margin: "30px 10px" }}
        />
      </div>

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <FormQuote
            handleClose={() => {
              setFetchReload(true);
              setIsOpenCreateQuote(false);
            }}
            setIsOpen={setIsOpenCreateQuote}
            defaultDate={defaultDate}
          />
        }
        isOpen={isOpenCreateQuote}
      />

      <ShardComponentModal
        fullWidth
        {...modalProps}
        body={
          <DetailQuote
            quote={quote}
            handleClose={() => {
              setFetchReload(true);
              setIsOpenDetailQuote(false);
            }}
            setIsOpen={setIsOpenDetailQuote}
            shouldInitQuote
          />
        }
        isOpen={isOpenDetailQuote}
      />
    </>
  );
};

const mapStateToProps = ({ auth }) => ({
  userId: auth.userId,
  userProfileId: auth.userProfileId,
});

export default connect(mapStateToProps)(Calendar);
