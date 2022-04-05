import { Switch, withStyles } from "@material-ui/core";

import React from "react";

export const SwitchCustom = withStyles((theme) => ({
    root: {
        width: 38,
        height: 20,
        padding: 0,
    },
    thumb: {
        width: 16,
        height: 16,
    },
    track: {
        borderRadius: 16,
        backgroundColor: '#ECECEB',
        opacity: 1,
    },
    switchBase: {
        color: '#9D9D9D',
        padding: 2,
        "&$checked": {
            transform: "translateX(18px)",
            color: '#94C97A',
            "& + $track": {
                backgroundColor: '#ECECEB',
                opacity: 1,
            },
        },
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});