import React, { useEffect } from 'react';
import { getParams } from '../../functions/util';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';

/**
 * Shows a button that will switch between a list view and grid view icon.
 * This component will set the listView prop to true if it is currently in
 * the list view, or else it will set the state to false. The displayed
 * icon will be opposite and have the tooltip "Switch to [list/grid] view".
 *
 * @param {object} props React props object
 * @param {boolean} props.listView List view state object
 * @param {Function} props.setListView Function to set the list view state object
 * @param {string} props.className React className prop
 */
const ViewSwitcher = (props) => {
    const toggleView = () => {
        props.setListView(!props.listView);
    };

    useEffect(() => {
        if (getParams('view') === 'list') props.setListView(true);
    }, []);

    return (
        <Tooltip title={`Switch to ${props.listView ? 'grid' : 'list'} view`} className={props.className || ''}>
            <IconButton onClick={toggleView} size="large">{props.listView ? <AppsRoundedIcon /> : <ListRoundedIcon />}</IconButton>
        </Tooltip>
    );
};

export default ViewSwitcher;
