import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

//Components
import AppointmentInformation from "components/Shared/AppointmentInformation/AppointmentInformation";
import Loading from "components/Shared/Loading/Loading";
import { MessageView } from "components/Shared/MessageView/MessageView";

import { formatPMorAM, tConv24, errorToast, mapErrors } from "utils/misc";

//service
import { getQuotesByUserHistory } from "services/affiliates";

const AppointmentsByAfiliate = ({ id, userType }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [dataQuotes, setDataQuotes] = useState([]);
  const [fetchData, setFechData] = useState(false);

  useEffect(() => {
    setFechData(true);
    getQuotesByUserHistory(id)
      .then(({ data }) => {
        setFechData(false);
        if (data.data && data.data.items) {
          setDataQuotes(data.data.items);
        } else {
          setDataQuotes([]);
        }
      })
      .catch((err) => {
        setFechData(false);
        enqueueSnackbar(mapErrors(err), errorToast);
      });
  }, [id, enqueueSnackbar]);

  return (
    <div style={{ overflowY: "scroll", height: "440px" }}>
      {fetchData && <Loading />}
      {dataQuotes.length === 0 && !fetchData && (
        <MessageView label={t("Message.EmptyData")} />
      )}
      {dataQuotes.map((item) => (
        <AppointmentInformation
          userType={userType}
          id_quote={item.id}
          day={
            item.date &&
            format(addDays(new Date(item.date), 1), "dd", { locale: es })
          }
          hour={item.hour && tConv24(item.hour)}
          indicative={item.hour && formatPMorAM(item.hour)}
          site={
            item.modality_name === "virtual"
              ? t("Message.Virtual")
              : t("Message.Presencial")
          }
          branch={item.venue_name}
          title={t("Message.Presencial")}
          name={
            item.first_name_medicalProfessional +
            " " +
            item.las_tname_medicalProfessional
          }
          type={item.type_quote_name}
          status={item.status_quote}
          citaActual={item.is_finished === "0" ? true : false}
          month={
            item.date &&
            format(addDays(new Date(item.date), 1), "LLLL", {
              locale: es,
            })
          }
        />
      ))}
    </div>
  );
};

export default AppointmentsByAfiliate;
