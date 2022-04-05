import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

//Components
import TimeLine from "components/Shared/TimeLine/TimeLine";
import Loading from "components/Shared/Loading/Loading";
import { MessageView } from "components/Shared/MessageView/MessageView";

//service
import { getPhysicalByUserHistory } from "services/affiliates";

import { errorToast, mapErrors } from "utils/misc";

const SuggestionByAfiliate = ({ id }) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [fetchData, setFechData] = useState(false);

  useEffect(() => {
    setFechData(true);
    getPhysicalByUserHistory(id)
      .then(({ data }) => {
        setFechData(false);
        if (data.data && data.data.length > 0) {
          setData(data.data.reverse());
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        enqueueSnackbar(mapErrors(err), errorToast);
        setFechData(false);
      });
  }, [id, enqueueSnackbar]);

  return (
    <div style={{ overflowY: "scroll", height: "440px" }}>
      {fetchData && <Loading />}
      {data.length === 0 && !fetchData ? (
        <MessageView label={t("Message.EmptyData")} />
      ) : (
        data.map((item) => (
          <TimeLine
            time={item.created_at}
            text={item.observations}
            isPhysical={true}
            isSuggestion={false}
            dataPhysical={item}
          />
        ))
      )}
    </div>
  );
};

export default SuggestionByAfiliate;
