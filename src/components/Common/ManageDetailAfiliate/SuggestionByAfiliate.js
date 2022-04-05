import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

//Components
import TimeLine from 'components/Shared/TimeLine/TimeLine';
import Loading from 'components/Shared/Loading/Loading';
import { MessageView } from 'components/Shared/MessageView/MessageView';

//service
import { getMedicalSuggestionByUserHistory } from 'services/affiliates';

import { errorToast, mapErrors } from 'utils/misc';

const SuggestionByAfiliate = ({ id }) => {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [fetchData, setFechData] = useState(false);

    useEffect(() => {
        setFechData(true);
        getMedicalSuggestionByUserHistory(id)
            .then(({ data }) => {
                setFechData(false);
                if (data.data && data.data.items && data.data.items.length > 0) {
                    setData(data.data.items);
                } else {
                    if (data.status === 'error') {
                        setData([])
                    }
                }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
            })
    }, [id, enqueueSnackbar])


    return (
        <React.Fragment>
            {fetchData && <Loading />}
            {data.length === 0 && !fetchData && <MessageView label={t('Message.EmptyData')} />}
            {data.map(item =>
                <TimeLine time={item.created_at} text={item.observation === null || '' ? t('Message.EmptyDataObservations') : item.observation} isSuggestion={true} isPhysical={false} idSuggestion={item.id} />
            )}
        </React.Fragment>
    )
}

export default SuggestionByAfiliate
