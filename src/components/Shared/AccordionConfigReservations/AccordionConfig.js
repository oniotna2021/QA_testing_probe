import React from 'react';
import { Link } from "react-router-dom";

// UI
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ItemHeaderResumeSession from 'components/Common/ModuleSession/ItemContentResumeSession/ItemHeaderResumeSession';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    box: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boxItem: {
        width: '100px',
        borderRadius: '10px',
        padding: '5px',
        background: theme.themeColorSoft,
        textAlign: 'center'
    },
    iconDelete: {
        color: theme.palette.primary.light
    }
}));

export const CommonComponentAccordion = ({
    data, color = 'default',
    form, title_no_data = '',
    isDraggable=false,
    isPermission,
    isDetailPlan,
    titlePermission,
    isReserva = false, setExpanded, marginSize = 10, mb = 'mb-1',
    isSession, isExercise, isTraining,
    expanded, isDetail = false, onDelete }) => {
    const classes = useStyles();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={mb} style={{ width: '100%', margin: marginSize }}>
            <Accordion TransitionProps={{ unmountOnExit: true }} key={`panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`} expanded={expanded === `panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`} onChange={handleChange(`panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`)}>
                {isReserva ?
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <div className={classes.box}>
                            <Avatar>{`${data?.first_name.charAt(0)}${data?.last_name.charAt(0)}`}</Avatar>
                            <Typography variant="p" className="mx-5" style={{ width: 200 }}>{`${data?.first_name} ${data?.last_name}`}</Typography>
                            <Typography variant="p" className="mx-5" style={{ width: 50 }}>C.C.</Typography>
                            <Typography variant="p" className="mx-5" style={{ width: 100 }}>{data.document_number}</Typography>
                            <Typography variant="p" className="mx-5" style={{ width: 200 }}>{data.email}</Typography>
                            <Button component={Link}  to={`/create-plan-training-for-afiliate/${data.document_number}`} className={classes.boxItem}>Crear Plan</Button>
                        </div>
                    </AccordionSummary>
                    :
                    isSession || isExercise ?
                        <AccordionSummary 
                            expandIcon={
                                !onDelete ?
                                    <IconButton color={color} variant="outlined" size="small">{data || isDetail ? <ExpandMoreIcon /> : <AddIcon />}</IconButton>
                                    :
                                    <IconButton color={color} variant="outlined" size="small">{<ExpandMoreIcon />}</IconButton>
                            }
                        >
                            <ItemHeaderResumeSession data={data} isExercise={isExercise} onDelete={onDelete} isDetailPlan={isDetailPlan}/>
                        </AccordionSummary>
                        :
                        isPermission ?
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <Typography variant='h6'>{titlePermission}</Typography>
                            </AccordionSummary>
                        :
                        <AccordionSummary 
                            style={{ backgroundColor: !data && !isDetail ? '#F3F3F3' : expanded === `panel${data ? data.id : ''}` ? '#F3F3F3' : '' }}
                            expandIcon={
                                !onDelete &&
                                <IconButton color={color} variant="outlined" size="small">{data || isDetail ? <ExpandMoreIcon /> : <AddIcon />}</IconButton>
                            }
                            id={`panel${data ? data.id : ''}`}
                        >
                            <div className="d-flex align-items-center">
                                {data && !isDetail && data.id && 
                                <Button color="secondary" variant="contained" className="me-5" size="small">
                                    {data.id}
                                </Button>}

                                <Typography className={classes.heading}>{data ? data.name : title_no_data}</Typography>
                                {onDelete &&
                                    <ListItemSecondaryAction style={{ marginRight: 35 }}>
                                        <IconButton variant="outlined" size="small" onClick={onDelete}>
                                            <CloseIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                }
                            </div>
                        </AccordionSummary>
                }
                <AccordionDetails>
                    <div className="container-fluid p-3 pb-2">
                        {form}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}