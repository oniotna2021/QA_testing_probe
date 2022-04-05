import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'

// UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import FormBlockUser from './FormBlockUser';
import FormReasingActivity from './FormReasingActivity';
import ListReasingActivities from './ListReasingActivities';

function TabPanel(props) {

    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0}>
                    <Typography component={'span'} variant="body1">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const FormNovelty = ({ setFetchReload, handleClose, setIsOpen, userId }) => {
    
    const { t } = useTranslation();
    const [valueTab, setValueTab] = useState(0);
    const [isMedical, setIsMedical] = useState(false);
    const [activityData, setActivityData] = useState({});
    const [selectDate, setSelectDate] = useState({
        start_date: null,
        end_date: null,
        start_time: null,
        end_time: null
    })
    const [typeUnlock, setTypeUnlock] = useState('definitive');
    const [isRangeHours, setIsRangeHours] = useState(0);
    const [newsReasonId, setNewsReasoniD] = useState(0);
    
    const handleChangeDate = (value, name) => { 
        setSelectDate({
            ...selectDate,
            [name]: value
        })
    }

    return ( 
        <>
            <TabPanel value={valueTab} index={0}>
                <FormBlockUser handleClose={handleClose} newsReasonId={newsReasonId} setNewsReasoniD={setNewsReasoniD} typeUnlock={typeUnlock} setTypeUnlock={setTypeUnlock} title={t('FormNovelty.TitleNovelty')} userId={userId} setValueTab={setValueTab} setIsOpen={setIsOpen} selectDate={selectDate} handleChangeDate={handleChangeDate} setIsRangeHours={setIsRangeHours} isRangeHours={isRangeHours} />
            </TabPanel>
            <TabPanel value={valueTab} index={1}>
                <ListReasingActivities isMedical={isMedical} title={t('FormNovelty.TitleReasingActivities')} isRangeHours={isRangeHours} userId={userId} setValueTab={setValueTab} selectDate={selectDate} handleChangeDate={handleChangeDate} setIsOpen={setIsOpen} setActivityData={setActivityData} setIsMedical={setIsMedical} />
            </TabPanel>
            <TabPanel value={valueTab} index={2}>
                <FormReasingActivity title={t('FormNovelty.TitleReasingActivities')} setFetchReload={setFetchReload} isMedical={isMedical} activityData={activityData} userId={userId} setValueTab={setValueTab} selectDate={selectDate} handleChangeDate={handleChangeDate} setIsOpen={setIsOpen} />
            </TabPanel>
        </>
    );
}

export default FormNovelty;