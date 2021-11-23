import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import data from '../../data.json';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

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
                <ListItem button component="a" href={data.examCalendar} target="_blank">
                    <ListItemIcon className={classes.listIcon}>
                        <EventRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exam Calendar" />
                </ListItem>
                <ListItem button component="a" href={data.academicsGuide} target="_blank">
                    <ListItemIcon className={classes.listIcon}>
                        <CreateRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Academics Guide" />
                </ListItem>
                <ListItem button component="a" href={data.clubLeaderResources} target="_blank">
                    <ListItemIcon className={classes.listIcon}>
                        <EmojiPeopleRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Club Leader Resources" />
                </ListItem>
                <ListItem button component="a" href={data.tamsWiki} target="_blank">
                    <ListItemIcon className={classes.listIcon}>
                        <PublicRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="TAMS Wiki" />
                </ListItem>
                <ListItem button component="a" href={calendarUrl} target="_blank">
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
