import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Button, Toolbar } from '@material-ui/core';

const drawerWidth = 280;

const createStyles = makeStyles((theme) => ({
    root: {
        width: drawerWidth,
    },
    spacer: {
        margin: '0.5rem',
        marginBottom: '0',
    },
    drawerContent: {
        width: drawerWidth,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        width: drawerWidth - 50,
        marginTop: '1rem',
        color: theme.palette.grey[700],
    },
    buttonActive: {
        color: theme.palette.primary.main,
        backgroundColor: '#eee',
        '&:hover': {
            backgroundColor: '#eee',
        },
    },
}));

const HomeDrawer = (props) => {
    const classes = createStyles();

    const switchView = (schedule = true) => {
        props.setScheduleView(schedule);
    };
    return (
        <Drawer variant="permanent" className={classes.root}>
            <Toolbar className={classes.spacer} />
            <div className={classes.drawerContent}>
                <Button
                    className={`${classes.button} ${props.scheduleView ? classes.buttonActive : ''}`}
                    onClick={switchView}
                >
                    Schedule View
                </Button>
                <Button
                    className={`${classes.button} ${!props.scheduleView ? classes.buttonActive : ''}`}
                    onClick={switchView.bind(this, false)}
                >
                    Calendar View
                </Button>
            </div>
        </Drawer>
    );
};

export default HomeDrawer;
