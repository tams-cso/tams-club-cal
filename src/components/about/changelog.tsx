import React from 'react';
import { darkSwitchGrey } from '../../util';

import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import data from '../../data.json';

/**
 * Displays a simple changelog, with all the data pulled from the data.json file
 */
const Changelog = () => {
    return (
        <React.Fragment>
            {data.changelog.map((version) => (
                <React.Fragment>
                    <Typography variant="h3">{`${version.v} — ${version.date}`}</Typography>
                    <List sx={{ color: (theme) => darkSwitchGrey(theme) }}>
                        {version.changes.map((change) => (
                            <ListItem>
                                <ListItemText primary={change} />
                            </ListItem>
                        ))}
                    </List>
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export default Changelog;
