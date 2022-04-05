import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
    },
}))(LinearProgress);
    

const useStyles = makeStyles({
    root: {
    flexGrow: 1,
    },
});

export default function CustomizedProgressBars({ color }) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <BorderLinearProgress color={color} />
        </div>
    );
}