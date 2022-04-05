import React from 'react';
import { useTranslation } from 'react-i18next';

//UI
import Typography from '@material-ui/core/Typography';

//Components
import SearchExercises from 'components/Common/ModuleSession/SearchExercises/SearchExercises';

const SessionManageFilter = ({ nodes }) => {
    const { t } = useTranslation();



    return (
        <React.Fragment>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
                {t('Session.Title')}
            </Typography>

            <Typography component="body2" variant="body2" color="inherit" noWrap>
                {t('Session.Search')}
            </Typography>


            <div className="row m-0">
                <div className="col-12 p-0">
                    <SearchExercises
                        nodes={nodes}
                        label={'Buscador ejercicios'}
                    />
                </div>
            </div>

        </React.Fragment>
    )
}

export default SessionManageFilter