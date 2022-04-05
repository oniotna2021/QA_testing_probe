import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

// UI
import Skeleton from "@material-ui/lab/Skeleton";

// Components
import FormReassingQuote from "./FormReassingQuote";
import FormDetailQuote from "./FormDetailQuote";

// Service
import { getQuoteById } from "services/MedicalSoftware/Quotes";

// Utils
import { errorToast, mapErrors } from "utils/misc";

const DetailQuote = ({
  isViewUserTowerControl,
  quote,
  handleClose,
  setCalendarReload,
  setIsOpen,
  shouldInitQuote = true,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [detailQuote, setDetailQuote] = useState({});
  const [isReasing, setIsReasing] = useState(false);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    if (quote.idQuote && reload) {
      getQuoteById(quote.idQuote)
        .then(({ data }) => {
          if (data.status === "success" && data.data) {
            setDetailQuote(data.data);
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
          setReload(false);
        });
    }
  }, [quote, reload, enqueueSnackbar]);

  return (
    <>
      {isReasing ? (
        <FormReassingQuote
          title="Reprogramar cita"
          handleClose={handleClose}
          setIsOpen={setIsOpen}
          detailQuote={detailQuote}
          setIsReasing={setIsReasing}
          idQuote={quote.idQuote}
        />
      ) : Object.keys(detailQuote).length > 0 ? (
        <FormDetailQuote
          isViewUserTowerControl={isViewUserTowerControl}
          setIsOpen={setIsOpen}
          detailQuote={detailQuote}
          setReload={setCalendarReload}
          setIsReasing={setIsReasing}
          quote={quote}
          shouldInitQuote={shouldInitQuote}
        />
      ) : (
        <div className="mt-4">
          <Skeleton animation="wave" width="100%" height={100} />
          <Skeleton animation="wave" width="100%" height={100} />
          <Skeleton animation="wave" width="100%" height={100} />
        </div>
      )}
    </>
  );
};

export default DetailQuote;
