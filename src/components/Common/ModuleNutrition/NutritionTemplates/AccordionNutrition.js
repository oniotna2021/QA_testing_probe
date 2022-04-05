import React from 'react';

//UI
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

const AccordionNutrition = ({ data, key, expanded, setExpanded, content, title_no_data, isDetail, color = 'default', setIsEdit }) => {

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setIsEdit(false);
    };

    return ( 
        <div className='mb-3'>
            <Accordion TransitionProps={{ unmountOnExit: true }} key={`panel-${data?.id ? data?.id : ''}`} expanded={expanded === `panel-${data?.id ? data?.id : ''}`}  onChange={handleChange(`panel-${data?.id ? data?.id : ''}`)}>
                <AccordionSummary
                    style={{ backgroundColor: !data && !isDetail ? '#F0F0F0' : expanded === `panel${data ? data.id : ''}` ? '#F4F4F4' : '', borderRadius: 8 }}
                    expandIcon={
                        <IconButton color={color} variant="outlined" size="small">{data || isDetail ? <ExpandMoreIcon /> : <AddIcon />}</IconButton>
                    }
                >
                {!isDetail ? title_no_data : 
                    <div className='d-flex align-items-center col-12'>
                        <div className='row gx-2'>
                            <div className='d-flex justify-content-around align-items-center col-12'>
                                <Typography style={{fontWeight: 'bold', width: '50%'}}>{data.name}</Typography>
                                <Typography style={{width: '50%'}}>{`Objetivo/${data.goal_name}`}</Typography>
                            </div>
                        </div>
                    </div>
                }
                </AccordionSummary>
                <AccordionDetails>
                    {content}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default AccordionNutrition;