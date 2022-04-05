import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

//ui
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CloseIcon from '@material-ui/icons/Close'
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'

//components
import { ShardComponentModal } from '../Modal/Modal';
import ListItemsNutrition from './ListItemsNutrition';

//utils
import { useStyles } from 'utils/useStyles'

//icons
import { IconClock, IconCalendar } from 'assets/icons/customize/config'

//services
import { getNutritionSuggestionByUser } from 'services/MedicalSoftware/NutritionalPlan'
import { getDailyFood } from 'services/MedicalSoftware/DailyFood'

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

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `wrapped-tab-${index}`,
        'aria-controls': `wrapped-tabpanel-${index}`,
    };
}

const ItemNutritionalSuggestions = ({ userName, setIsOpen, userDocument, userId }) => {

    const classes = useStyles()
    const { t } = useTranslation()
    const theme = useTheme()

    const [isOpen, setIsOpenModal] = useState(false)
    const [value, setValue] = useState('one');
    const [data, setData] = useState([])
    const [isWeekend, setIsWeekend] = useState(false)
    const [items, setItems] = useState([])

    useEffect(()=>{
        getNutritionSuggestionByUser(userId).then(({ data }) => {
            if(data && data.data && data.status === 'success' ){
                setData(data.data)
            }else{
                setData([])
            }
        })
        getDailyFood().then(({ data }) =>{
            if(data && data.data && data.status === 'success'){
                setItems(data.data.items)
            }else{
                setItems([])
            }
        })
    },[userId])
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return ( 
        <div className='container'>
            <div className='row'>
                <div className='d-flex justify-content-between'>
                    <Typography variant='h5'>{t('NutritionSuggestions.Title')}</Typography>
                    <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
                </div>
                <div className='d-flex align-items-center'>
                    <Typography variant='h6'>{userName}</Typography>
                    <Typography className='ms-5' variant='body1'>{userDocument}</Typography>
                </div>
            </div>
            <AppBar position="static" className={`${classes.appBar}`}>
                <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example" variant="scrollable">
                    <Tab value="one" label={t('NutritionSuggestions.SectionOne')} {...a11yProps('one')} />
                    <Tab value="two" label={t('NutritionSuggestions.SectionTwo')} {...a11yProps('two')} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index="one">
                <div className='row mb-3'>
                    <div className='col-4'>
                        <Typography className={classes.fontObservation}>{t('NutritionSuggestions.ItemOne')}</Typography>
                        <div className={classes.itemNutrition}>
                            <Typography className={classes.textBreak} variant='body2'>{data.FoodBackground?.food_allergy}</Typography>
                        </div>
                    </div>
                    <div className='col-4'>
                        <Typography className={classes.fontObservation}>{t('NutritionSuggestions.ItemTwo')}</Typography>
                        <div className={classes.itemNutrition}>
                            <Typography style={{ wordWrap: 'break-word' }} variant='body2'>{data.FoodBackground?.rejected_food}</Typography>
                        </div>
                    </div>
                    <div className='col-4'>
                        <Typography className={classes.fontObservation}>{t('NutritionSuggestions.ItemThree')}</Typography>
                        <div className={classes.itemNutrition}>
                            <Typography style={{ wordWrap: 'break-word' }} variant='body2'>{data.FoodBackground?.favorite_food}</Typography>
                        </div>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className='col-4'>
                        <Typography className={classes.fontObservation}>{t('NutritionSuggestions.ItemFour')}</Typography>
                        <Typography variant='body2'>{data.FoodBackground?.supplements_name}</Typography>
                    </div>
                    <div className='col-4'>
                        <Typography className={classes.fontObservation}>{t('NutritionSuggestions.ItemFive')}</Typography>
                        <Typography variant='body2'>{data.FoodBackground?.sleep_patron_name}</Typography>
                    </div>
                    <div className='col-4'>
                        <Typography className={classes.fontObservation}>{t('NutritionSuggestions.ItemSix')}</Typography>
                        <div className='d-flex align-items-center'>
                            <IconClock color={theme.palette.black.main}/>
                            <Typography variant='body2' className='ms-2'>{`${data.FoodBackground?.date_wu}  -   ${data.FoodBackground?.date_sleep}`}</Typography>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className={classes.boxObservation}>
                        <Typography style={{ paddingLeft: 10 }} className={classes.fontObservation}>{t('DetailClinicHistory.Observations')}</Typography>
                        <Typography variant='body2' className='ms-2'>{data.FoodBackground?.observ_background}</Typography>
                    </div>
                </div>
            </TabPanel>
            <TabPanel value={value} index="two">
                <div className='row mb-3'>
                    <Typography style={{ paddingLeft: 10 }} className={classes.fontObservation}>{t('NutritionSuggestions.FoodTimes')}</Typography>
                    <div className='col-6 ps-0'>
                        <Button onClick={()=>{setIsOpenModal(true); setIsWeekend(false)}}  startIcon={<IconCalendar color={theme.palette.black.main}/>} className={classes.boxButtonTwo}>{t('NutritionSuggestions.Week')}</Button>
                    </div>
                    <div className='col-6 pe-0'>
                        <Button onClick={()=>{setIsOpenModal(true); setIsWeekend(true)}} startIcon={<IconCalendar color={theme.palette.black.main}/>} className={classes.boxButtonTwo}>{t('NutritionSuggestions.Weekend')}</Button>
                    </div>
                </div>
                <div className='row'>
                    <div className={classes.boxObservationTwo}>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-6'>
                                    <Typography className={classes.fontObservation}>{t('NutritionSuggestions.QuestionOne')}</Typography>
                                    <Typography variant='body2'>{data.WeeklyNutrition?.buy_food}</Typography>
                                </div>
                                <div className='col-6'>
                                    <Typography className={classes.fontObservation}>{t('NutritionSuggestions.QuestionTwo')}</Typography>
                                    <Typography variant='body2'>Caliente</Typography>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-6'>
                                    <Typography className={classes.fontObservation}>{t('NutritionSuggestions.QuestionThree')}</Typography>
                                    <Typography variant='body2'>{data.WeeklyNutrition?.prepare_food}</Typography>
                                </div>
                                <div className='col-6'>
                                    <Typography className={classes.fontObservation}>{t('NutritionSuggestions.QuestionFour')}</Typography>
                                    <Typography variant='body2'>{`${data.WeeklyNutrition?.glasses_water ? data.WeeklyNutrition?.glasses_water  : '-'} vasos`}</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </TabPanel>
            <ShardComponentModal fullWidth width='sm' body={<ListItemsNutrition setIsOpen={setIsOpenModal} isWeekend={isWeekend} data={data?.WeeklyNutrition} items={items}/>} isOpen={isOpen}/>
        </div> 
    );
}
 
export default ItemNutritionalSuggestions;