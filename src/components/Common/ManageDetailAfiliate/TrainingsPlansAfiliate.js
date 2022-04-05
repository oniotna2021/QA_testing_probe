import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

//Components
import CardItemTraining from 'components/Shared/CardItemTraining/CardItemTraining';
import Loading from 'components/Shared/Loading/Loading';
import { MessageView } from 'components/Shared/MessageView/MessageView';

//service
import { getTrainingsPlanHistoryForIdUser } from 'services/affiliates';

import { errorToast, mapErrors } from 'utils/misc';

const TrainingsPlansAfiliate = ({ id }) => {

    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [fetchData, setFechData] = useState(false);

    useEffect(() => {
        setFechData(true);
        getTrainingsPlanHistoryForIdUser(id)
            .then(({ data }) => {
                setFechData(false);
                if (data.data && (data.data.active || data.data.inactive)) {
                    setData(data.data.active.concat(data.data.inactive ? data.data.inactive.items : []));
                }else{
                    setData([])
                }
            }).catch((err) => {
                enqueueSnackbar(mapErrors(err), errorToast);
                setFechData(false);
            })
    }, [id, enqueueSnackbar])


    return (
        <React.Fragment>
            {fetchData && <Loading />}
            {data.length === 0 && !fetchData && <MessageView label={t('Message.EmptyData')} />}
            {data.map(item =>
                <CardItemTraining dataPlan={item} description={t('DescriptionCard.CustomPlan')} title_1={format(new Date(item.start_date), 'dd LLLL', { locale: es })} title_2={format(new Date(item.start_date), 'yyyy')} />
            )}
        </React.Fragment>
    )
}

export default TrainingsPlansAfiliate
