import React, {useEffect} from 'react';

// UI
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AddIcon from '@material-ui/icons/Add';

import { makeStyles } from '@material-ui/core/styles';

// Components
import DropzoneImage from 'components/Shared/DropzoneImage/DropzoneImage';

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
    },
    boldText: {
        fontWeight: 'bold',
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

const thumb = {
    borderRadius: '50%',
    marginBottom: 0,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    marginTop: '5px',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    objectFit: 'cover'
};

export const AccordionVenue = ({
    data, color = 'default',
    children, title_no_data = '', setExpanded, marginSize = 10, mb = 'mb-1',
    expanded, isDetail = false, isVenue=false, onDelete, isEdit, setIsEdit, files, setFiles }) => {

    const classes = useStyles();

    const handleChange = (panel) => (event, isExpanded) => {
        console.log("change")
        setExpanded(isExpanded ? panel : false);
        setIsEdit(false);
    };

    useEffect(() => {
        if(data?.image || data?.url_image) {
            setFiles([{ preview: data.image || data.url_image }])
        }
    }, [setFiles, data])

    return (
        <div className={mb} style={{ width: '100%', margin: marginSize }}>
            <Accordion TransitionProps={{ unmountOnExit: true }} key={`panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`} expanded={expanded === `panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`} onChange={handleChange(`panel${data && data.role_id ? data.role_id : data && data.id ? data.id : '' }`)}>
                {
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
                                            <div style={thumb}>
                                                <div style={thumbInner}>
                                                    <img
                                                        src={data.image || data.url_image}
                                                        style={img}
                                                        alt='img'
                                                    />
                                                </div>
                                            </div>
                                        )
                                        : ''
                                    }
                                </div>

                                <div className={isDetail && 'col-4 d-flex align-items-center'}>
                                    <Typography className={`${classes.heading} ${isDetail && classes.boldText}`}>{data ? data?.name : title_no_data}</Typography>
                                </div>

                                {(isVenue && isDetail) && (
                                    <>
                                        {/* <div className="col-4 d-flex align-items-center">
                                        <Typography className={`${classes.heading}`}>Bogotá-Colombia</Typography>
                                        </div> */}

                                        <div className="col d-flex justify-content-end align-items-center">
                                            <Typography className={`${classes.heading} ${classes.boldText}`}>{data?.name_category}</Typography>
                                        </div>
                                    </>
                                )}

                                { onDelete && 
                                    <div className="col-6">
                                        <ListItemSecondaryAction style={{ marginRight: 35 }}>
                                            <IconButton variant="outlined" size="small" onClick={onDelete}>
                                                <CloseIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </div>
                                }
                            </div>
                        </div>
                    </AccordionSummary>
                }
                <AccordionDetails>
                    <div className="container-fluid p-3 pb-2">
                        {children}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}