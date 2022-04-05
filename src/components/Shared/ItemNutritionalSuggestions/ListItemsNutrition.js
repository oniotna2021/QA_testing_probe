import React from 'react';
import { useTranslation } from 'react-i18next';

//ui
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close'

//components
import ItemWeeklyNutrition from './ItemWeeklyNutrition';

const ListItemsNutrition = ({ setIsOpen, isWeekend, data, items }) => {
    const { t } = useTranslation()

    return ( 
        <div className='container'>
            <div className='d-flex justify-content-between'>
                <Typography variant='h5'>{t( isWeekend ? 'NutritionSuggestions.Weekend' :'NutritionSuggestions.Week')}</Typography>
                <CloseIcon onClick={() => setIsOpen(false)} className="pointer" />
            </div>
            <div className='row mt-3'>
                {isWeekend ? 
                <>
                    {data?.description_weekend_1 !== null && data?.name_weekend_1 !== null && data?.hour_weekend_1 !== null ? 
                    <ItemWeeklyNutrition
                        items={items}
                        hour={data?.hour_weekend_1 } 
                        description={data?.description_weekend_1} 
                        name={data?.name_weekend_1}
                    /> 
                    : null}
                    {data?.description_weekend_2 !== null && data?.name_weekend_2 !== null && data?.hour_weekend_2 !== null ? 
                    <ItemWeeklyNutrition
                        items={items} 
                        hour={data?.hour_weekend_2 } 
                        description={data?.description_weekend_2} 
                        name={data?.name_weekend_2}
                    /> 
                    : null}
                    {data?.description_weekend_3 !== null && data?.name_weekend_3 !== null && data?.hour_weekend_3 !== null ? 
                    <ItemWeeklyNutrition 
                        items={items}
                        hour={data?.hour_weekend_3 } 
                        description={data?.description_weekend_3} 
                        name={data?.name_weekend_3}
                    /> 
                    : null}
                    {data?.description_weekend_4 !== null && data?.name_weekend_4 !== null && data?.hour_weekend_4 !== null ? 
                    <ItemWeeklyNutrition 
                        items={items}
                        hour={data?.hour_weekend_4 } 
                        description={data?.description_weekend_4} 
                        name={data?.name_weekend_4}
                    /> 
                    : null}
                    {data?.description_weekend_5 !== null && data?.name_weekend_5 !== null && data?.hour_weekend_5 !== null ? 
                    <ItemWeeklyNutrition
                        items={items} 
                        hour={data?.hour_weekend_5 } 
                        description={data?.description_weekend_5} 
                        name={data?.name_weekend_5}
                    /> 
                    : null}
                    {data?.description_weekend_6 !== null && data?.name_weekend_6 !== null && data?.hour_weekend_6 !== null ? 
                    <ItemWeeklyNutrition
                        items={items}
                        hour={data?.hour_weekend_6 } 
                        description={data?.description_weekend_6} 
                        name={data?.name_weekend_6}
                    /> 
                    : null}
                    {data?.description_weekend_7 !== null && data?.name_weekend_7 !== null && data?.hour_weekend_7 !== null ? 
                    <ItemWeeklyNutrition
                        items={items} 
                        hour={data?.hour_weekend_7 } 
                        description={data?.description_weekend_7} 
                        name={data?.name_weekend_7}
                    /> 
                    : null}
                </>
                    :
                    <>
                        {data?.description_week_1 !== null && data?.name_week_1 !== null && data?.hour_week_1 !== null ? 
                        <ItemWeeklyNutrition
                            items={items}
                            hour={data?.hour_week_1 } 
                            description={data?.description_week_1} 
                            name={data?.name_week_1}
                        /> 
                        : null}
                        {data?.description_week_2 !== null && data?.name_week_2 !== null && data?.hour_week_2 !== null ? 
                        <ItemWeeklyNutrition
                            items={items} 
                            hour={data?.hour_week_2 } 
                            description={data?.description_week_2} 
                            name={data?.name_week_2}
                        /> 
                        : null}
                        {data?.description_week_3 !== null && data?.name_week_3 !== null && data?.hour_week_3 !== null ? 
                        <ItemWeeklyNutrition 
                            items={items}
                            hour={data?.hour_week_3 } 
                            description={data?.description_week_3} 
                            name={data?.name_week_3}
                        /> 
                        : null}
                        {data?.description_week_4 !== null && data?.name_week_4 !== null && data?.hour_week_4 !== null ? 
                        <ItemWeeklyNutrition 
                            items={items}
                            hour={data?.hour_week_4 } 
                            description={data?.description_week_4} 
                            name={data?.name_week_4}
                        /> 
                        : null}
                        {data?.description_week_5 !== null && data?.name_week_5 !== null && data?.hour_week_5 !== null ? 
                        <ItemWeeklyNutrition
                            items={items} 
                            hour={data?.hour_week_5 } 
                            description={data?.description_week_5} 
                            name={data?.name_week_5}
                        /> 
                        : null}
                        {data?.description_week_6 !== null && data?.name_week_6 !== null && data?.hour_week_6 !== null ? 
                        <ItemWeeklyNutrition
                            items={items}
                            hour={data?.hour_week_6 } 
                            description={data?.description_week_6} 
                            name={data?.name_week_6}
                        /> 
                        : null}
                        {data?.description_week_7 !== null && data?.name_week_7 !== null && data?.hour_week_7 !== null ? 
                        <ItemWeeklyNutrition
                            items={items} 
                            hour={data?.hour_week_7 } 
                            description={data?.description_week_7} 
                            name={data?.name_week_7}
                        /> 
                        : null}
                    </>
                }
            </div>
        </div>
     );
}
 
export default ListItemsNutrition;