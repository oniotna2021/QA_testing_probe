import React, {useEffect} from 'react';

// UI
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Avatar from '@material-ui/core/Avatar'

// Components
import DropzoneImage from 'components/Shared/DropzoneImage/DropzoneImage';

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

export const AccordionWithImage = ({
    data, color = 'default',
    children, title_no_data = '', setExpanded, isEmployee,  marginSize = 10, mb = 'mb-1',
    expanded, isDetail = false, onDelete, isEdit, setIsEdit, files, setFiles }) => {

    const classes = useStyles();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setIsEdit(false);
    };

    const dataNames = (data?.venues && data.venues.map((item) => item.name).join(', '))

    useEffect(() => {
        if(data?.image || data?.url_image || data?.photo || data?.display_image) {
            setFiles([{ preview: data.image || data.url_image || data?.photo || data?.display_image }])
        }
    }, [setFiles, data])

    return (
        <div className={mb} style={{ width: '100%', margin: marginSize }}>
            <Accordion TransitionProps={{ unmountOnExit: true }} key={`panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`} expanded={expanded === `panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`} onChange={handleChange(`panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`)}>
                
                <AccordionSummary 
                    style={{ backgroundColor: !data && !isDetail ? '#F3F3F3' : expanded === `panel${data ? data.id : ''}` ? '#F3F3F3' : '' }}
                    expandIcon={
                        !onDelete &&
                        <IconButton color={color} variant="outlined" size="small">{data || isDetail ? <ExpandMoreIcon /> : <AddIcon />}</IconButton>
                    }
                    id={`panel${data ? data.id : ''}`}
                >
                    <div className="d-flex align-items-center" style={{width: '100%'}}>
                        <div className="row gx-2">
                            <div onClick={(event) => event.stopPropagation()} className="col-2">
                                { (data && isDetail && data.id) ?
                                    isEdit ? (
                                        <DropzoneImage isEdit={isEdit} files={files} setFiles={setFiles} />
                                    ) : (
                                        <Avatar className='ms-4' src={data?.image || data?.url_image || data?.photo || data?.display_image}></Avatar>
                                    )
                                    : ''
                                }
                            </div>

                            <div className={isDetail && 'col-4 d-flex align-items-center'}>
                                <Typography className={`${classes.heading} ${isDetail && classes.boldText}`}>{data ? data.name || `${data.first_name} ${data.last_name}` : title_no_data}</Typography>
                            </div>

                            {(dataNames) && (
                                <>
                                    {data?.venues.length > 0  && (
                                        <div className="col-3 d-flex align-items-center">
                                            <Typography className={`${classes.heading}`}>{dataNames}</Typography>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="col-3 d-flex align-items-center">   
                                <Typography className={`${classes.heading} ${classes.boldText}`}>{data?.profile_name}</Typography>
                            </div>

                        </div>
                    </div>
                </AccordionSummary>
    
                <AccordionDetails>
                    <div className="container-fluid p-3 pb-2">
                        {children}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}