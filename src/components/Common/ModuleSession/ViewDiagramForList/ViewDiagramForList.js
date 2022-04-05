import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';

//UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton';

//components
import AccordionItemExcercise from './AccordionItemExcercise'

//utils
import { useStyles } from 'utils/useStyles'


const ViewDiagramForList = ({ training_step_name, dataResumeStep, handleClose }) => {

    const { t } = useTranslation()
    const classes = useStyles()

    const [value, setValue] = useState(0);


    //header tab panel
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`wrapped-tabpanel-${index}`}
                aria-labelledby={`wrapped-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `wrapped-tab-${index}`,
            'aria-controls': `wrapped-tabpanel-${index}`,
        };
    }

    const handleChange = (events, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='container'>
            <div className='row align-items-center'>
                <div className='col-11 d-flex align-items-center'>
                    <Typography variant='h5'>{t('ModuleSession.ResumeStep')}</Typography>
                </div>
                <div className='col-1'>
                    <IconButton onClick={() => handleClose()}><CloseIcon /></IconButton>
                </div>
                <Typography variant='body1'>{training_step_name}</Typography>
                {dataResumeStep.length === 0 && <Typography variant='body1'>{t('ModuleSession.ResumeStep.empty')}</Typography>}

            </div>
            <AppBar position="static" className={`${classes.appBar}`} >
                <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example" variant="scrollable" scrollButtons='auto' centered>
                    {dataResumeStep.map((item, index) =>
                        <Tab value={index} label={t('ModuleSession.Workout') + (index + 1)} {...a11yProps(index)} />
                    )}
                </Tabs>
            </AppBar>

            {dataResumeStep.map((item, index) =>
                <TabPanel value={value} index={index} key={`tab-indexdetailsession-` + index}>
                    <div className={classes.containerRepetitions}>
                        <Typography className={classes.fontGray}>{t('ModuleSession.Step')}</Typography>
                        <Typography variant='body1'>{item.number_series}</Typography>
                        <Typography className={classes.fontGray}>{t('ModuleSession.Break')}</Typography>
                        <Typography variant='body1'>00:00:{item.time_off}</Typography>
                    </div>

                    {item.exercises.map((exercise, index) =>
                        <AccordionItemExcercise
                            key={exercise.exercises_id + index}
                            exercise={exercise}
                        />
                    )}
                </TabPanel>
            )}



        </div>
    )
}

export default ViewDiagramForList
