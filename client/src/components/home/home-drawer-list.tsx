import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import MaterialSymbol from './material-symbol';
import { getExternalLinks as getExternalLinks } from '../../api';
import Popup from '../shared/popup';
import { createPopupEvent } from '../../util/constructors';
import { darkSwitchGrey } from '../../util/cssUtil';

/**
 * Shows a list of external links on the home page
 * This component is only a list of links as it will be
 * placed in two different drawers depending on if the page
 * is in mobile or not.
 */
const HomeDrawerList = () => {
    const [links, setLinks] = useState<ExternalLink[]>([]);
    const [linkComponents, setLinkComponents] = useState([]);
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

    // Create link components once links are loaded
    useEffect(() => {
        setLinkComponents(
            links.map((link) => (
                <ListItemButton component="a" href={link.url} target="_blank">
                    <MaterialSymbol icon={link.icon} />
                    <ListItemText primary={link.name} />
                </ListItemButton>
            ))
        );
    }, [links]);

    return (
        <React.Fragment>
            <Popup event={popupEvent} />
            <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 4, marginBottom: 2 }}>
                External Links
            </Typography>
            {linkComponents.length === 0 ? (
                <Typography sx={{ color: (theme) => darkSwitchGrey(theme), textAlign: 'center' }}>
                    Loading...
                </Typography>
            ) : (
                <List>{linkComponents}</List>
            )}
        </React.Fragment>
    );
};

export default HomeDrawerList;
