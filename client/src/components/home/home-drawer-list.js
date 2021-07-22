import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import data from '../../data.json';

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

const useStyles = makeStyles({
    listIcon: {
        minWidth: 40,
    },
    externalLinksTitle: {
        textAlign: 'center',
        marginTop: '1rem',
    },
});

const HomeDrawerList = () => {
    const classes = useStyles();
    const calendarUrl = process.env.NODE_ENV !== 'production' ? data.addStagingCalendar : data.addCalendar;
    return (
        <React.Fragment>
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
                <ListItem button component="a" href={calendarUrl}>
                    <ListItemIcon className={classes.listIcon}>
                        <EventAvailableRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add to Google Calendar!" />
                </ListItem>
            </List>
        </React.Fragment>
    );
};

export default HomeDrawerList;
