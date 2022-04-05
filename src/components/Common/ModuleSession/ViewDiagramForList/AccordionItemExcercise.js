import React from 'react';
import { useTranslation } from 'react-i18next';
//UI
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import FramePreviewVideo from 'components/Shared/PreviewVideo/FramePreviewVideo'
import Typography from '@material-ui/core/Typography'

//utils
import { useStyles } from 'utils/useStyles'

const AccordionItemExcercise = ({ key, exercise }) => {

    const classes = useStyles()
    const { t } = useTranslation()

    const labelTypeTimeRepeat = (' en ' + (exercise && exercise.type_time_apply === 1 ? 'Minutos' : 'Segundos') + ':');

    return (
        <div className='mb-3'>
            <Accordion className={classes.accordionShadow} key={key}>
                <AccordionSummary>
                    <div className='col-12 d-flex justify-content-around align-items-center'>
                        <FramePreviewVideo
                            thumbnailImageSrc={process.env.REACT_APP_IMAGES_EXERCICES + exercise.image_desktop}
                            videoSrc={process.env.REACT_APP_VIDEOS_EXERCICES + 'Verticales/' + exercise.video_url}
                        />
                        <Typography style={{ width: 130 }} variant='body2' className='ms-2'>{exercise.name}</Typography>
                        <Typography style={{ width: 90 }} className={classes.fontGray}>{exercise.time_apply ? t('Label.Time') + labelTypeTimeRepeat  : t('Repetitions.title')}</Typography>
                        <Typography style={{ width: 20 }} variant='body2'>{exercise.time_apply ? exercise.numberDurationApply : exercise.number_repetitions}</Typography>
                    </div>
                </AccordionSummary>
                <AccordionDetails className="d-flex flex-column">
                    <Typography variant="body2" className={classes.fontGray}>{t('ModuleSession.ExcerciseDescription')}</Typography>
                    <Typography variant="body2">   {exercise.description}</Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default AccordionItemExcercise;