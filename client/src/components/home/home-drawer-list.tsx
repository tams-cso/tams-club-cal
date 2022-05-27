import React, { useEffect, useState } from 'react';

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
import { getExternalLinks as getExternalLinks } from '../../api';
import Popup from '../shared/popup';
import { createPopupEvent, darkSwitchGrey } from '../../util';

// Style the ListItemIcon components
const iconStyle = { minWidth: 40 };

/**
 * Shows a list of external links on the home page
 * This component is only a list of links as it will be
 * placed in two different drawers depending on if the page
 * is in mobile or not.
 */
const HomeDrawerList = () => {
    const [links, setLinks] = useState(null);
    const [popupEvent, setPopupEvent] = useState(null);

    // Get links on load
    useEffect(() => {
        (async () => {
            const linkRes = await getExternalLinks();
            if (linkRes.status === 200) {
                setLinks(linkRes.data);
            } else {
                setPopupEvent(createPopupEvent('Could not get external links', 4));
            }
        })();
    }, []);

    return (
        <React.Fragment>
            <Popup event={popupEvent} />
            <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
                External Links
            </Typography>
            {!links ? (
                <Typography sx={{ color: (theme) => darkSwitchGrey(theme), textAlign: 'center' }}>
                    Loading...
                </Typography>
            ) : (
                <List>
                    <ListItemButton component="a" href={links.examCalendar} target="_blank">
                        <ListItemIcon sx={iconStyle}>
                            <EventRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Exam Calendar" />
                    </ListItemButton>
                    <ListItemButton component="a" href={links.academicsGuide} target="_blank">
                        <ListItemIcon sx={iconStyle}>
                            <CreateRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Academics Guide" />
                    </ListItemButton>
                    <ListItemButton component="a" href={links.clubLeaderResources} target="_blank">
                        <ListItemIcon sx={iconStyle}>
                            <EmojiPeopleRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Club Leader Resources" />
                    </ListItemButton>
                    <ListItemButton component="a" href={links.tamsWiki} target="_blank">
                        <ListItemIcon sx={iconStyle}>
                            <PublicRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="TAMS Wiki" />
                    </ListItemButton>
                    <ListItemButton component="a" href={links.addCalendar} target="_blank">
                        <ListItemIcon sx={iconStyle}>
                            <EventAvailableRoundedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add to Google Calendar!" />
                    </ListItemButton>
                </List>
            )}
        </React.Fragment>
    );
};

export default HomeDrawerList;
