import React from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import EmojiPeopleRoundedIcon from '@mui/icons-material/EmojiPeopleRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

import data from '../../data.json';

// Style the ListItemIcon components
const iconStyle = { minWidth: 40 };

/**
 * Shows a list of external links on the home page
 * This component is only a list of links as it will be
 * placed in two different drawers depending on if the page
 * is in mobile or not.
 */
const HomeDrawerList = () => {
    const calendarUrl = process.env.NODE_ENV !== 'production' ? data.addStagingCalendar : data.addCalendar;
    return (
        <React.Fragment>
            <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
                External Links
            </Typography>
            <List>
                <ListItemButton component="a" href={data.examCalendar} target="_blank">
                    <ListItemIcon sx={iconStyle}>
                        <EventRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Exam Calendar" />
                </ListItemButton>
                <ListItemButton component="a" href={data.academicsGuide} target="_blank">
                    <ListItemIcon sx={iconStyle}>
                        <CreateRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Academics Guide" />
                </ListItemButton>
                <ListItemButton component="a" href={data.clubLeaderResources} target="_blank">
                    <ListItemIcon sx={iconStyle}>
                        <EmojiPeopleRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Club Leader Resources" />
                </ListItemButton>
                <ListItemButton component="a" href={data.tamsWiki} target="_blank">
                    <ListItemIcon sx={iconStyle}>
                        <PublicRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="TAMS Wiki" />
                </ListItemButton>
                <ListItemButton component="a" href={calendarUrl} target="_blank">
                    <ListItemIcon sx={iconStyle}>
                        <EventAvailableRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add to Google Calendar!" />
                </ListItemButton>
            </List>
        </React.Fragment>
    );
};

export default HomeDrawerList;
