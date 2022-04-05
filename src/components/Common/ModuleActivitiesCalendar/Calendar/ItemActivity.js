import React, { Fragment } from 'react';

//UI
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';


const SmallAvatar = withStyles((theme) => ({
    root: {
        width: 22,
        height: 22,
        fontWeight: 'bold',
        border: `1px solid ${theme.palette.background.paper}`,
        // background: theme.palette.black.main,
        marginLeft: '20px',
        marginBottom: '15px',
        fontSize: 14
    },
}))(Avatar);

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
        margin: theme.spacing(1),
        },
    },
    small: {
        color: 'white',
        background: '#8D33D3',
        opacity: '0.5',
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
}));

export default function ItemDoctor({ data, totalQuotes }) {

    const classes = useStyles();

    return (
        <Fragment>
        <Badge
            overlap="circle"
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
            }}
            badgeContent={<SmallAvatar style={{backgroundColor: `#89128d`}}>{totalQuotes}</SmallAvatar>}
        >
            <Avatar src={data.photo} className={classes.small}>{`${data.name_activity.charAt(0)}`}</Avatar>
        </Badge>
        </Fragment>
    );
    }

