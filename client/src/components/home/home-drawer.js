import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import EmojiPeopleRoundedIcon from '@material-ui/icons/EmojiPeopleRounded';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import EventAvailableRoundedIcon from '@material-ui/icons/EventAvailableRounded';

import { darkSwitch } from '../../functions/util';
import data from '../../files/data.json';

const drawerWidth = 280;

const createStyles = makeStyles((theme) => ({
    root: {
        width: drawerWidth,
    },
    spacer: {
        margin: '0.5rem',
        marginBottom: '0',
    },
    buttonContainer: {
        width: drawerWidth,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        width: drawerWidth - 50,
        marginTop: '1rem',
        color: darkSwitch(theme, theme.palette.grey[700], theme.palette.grey[500]),
    },
    buttonActive: {
        color: darkSwitch(theme, theme.palette.primary.main, theme.palette.primary.light),
        backgroundColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
        '&:hover': {
            backgroundColor: darkSwitch(theme, theme.palette.grey[200], theme.palette.grey[700]),
        },
    },
    divider: {
        marginTop: '1rem',
        marginBottom: '0.5rem',
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
            <div className={classes.buttonContainer}>
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
            <Divider variant="middle" className={classes.divider} />
            <List>
                <ListItem button component="a" href={data.examCalendar}>
                    <ListItemIcon>
                        <EventRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exam Calendar" />
                </ListItem>
                <ListItem button component="a" href={data.academicsGuide}>
                    <ListItemIcon>
                        <CreateRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Academics Guide" />
                </ListItem>
                <ListItem button component="a" href={data.clubLeaderResources}>
                    <ListItemIcon>
                        <EmojiPeopleRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Club Leader Resources" />
                </ListItem>
                <ListItem button component="a" href={data.tamsWiki}>
                    <ListItemIcon>
                        <PublicRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="TAMS Wiki" />
                </ListItem>
                {/* TODO: Check if staging and use data.addStagingCalendar */}
                <ListItem button component="a" href={data.addCalendar}>
                    <ListItemIcon>
                        <EventAvailableRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add this to your Calendar!" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default HomeDrawer;
