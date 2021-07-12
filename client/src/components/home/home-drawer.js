import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { darkSwitch } from '../../functions/util';
import data from '../../files/data.json';

import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import EventRoundedIcon from '@material-ui/icons/EventRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import EmojiPeopleRoundedIcon from '@material-ui/icons/EmojiPeopleRounded';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import EventAvailableRoundedIcon from '@material-ui/icons/EventAvailableRounded';

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    root: {
        width: drawerWidth,
    },
    spacer: {
        width: drawerWidth,
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
    listIcon: {
        minWidth: '40px',
    },
    externalLinksTitle: {
        textAlign: 'center',
        marginTop: '1rem',
    },
}));

const HomeDrawer = () => {
    const classes = useStyles();
    return (
        <Drawer variant="permanent" className={classes.root}>
            <Toolbar className={classes.spacer} />
            <Typography variant="h3" className={classes.externalLinksTitle}>
                External Links
            </Typography>
            <List>
                <ListItem button component="a" href={data.examCalendar}>
                    <ListItemIcon className={classes.listIcon}>
                        <EventRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exam Calendar" />
                </ListItem>
                <ListItem button component="a" href={data.academicsGuide}>
                    <ListItemIcon className={classes.listIcon}>
                        <CreateRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Academics Guide" />
                </ListItem>
                <ListItem button component="a" href={data.clubLeaderResources}>
                    <ListItemIcon className={classes.listIcon}>
                        <EmojiPeopleRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Club Leader Resources" />
                </ListItem>
                <ListItem button component="a" href={data.tamsWiki}>
                    <ListItemIcon className={classes.listIcon}>
                        <PublicRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="TAMS Wiki" />
                </ListItem>
                {/* TODO: Check if staging and use data.addStagingCalendar */}
                <ListItem button component="a" href={data.addCalendar}>
                    <ListItemIcon className={classes.listIcon}>
                        <EventAvailableRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add to Google Calendar!" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default HomeDrawer;
