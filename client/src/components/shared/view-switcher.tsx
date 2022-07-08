import React, { useEffect } from 'react';
import { getParams } from '../../util/miscUtil';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';

interface ViewSwitcherProps {
    /** Table view state variable -> if true, will show the table view */
    tableView: boolean;

    /** Function to set the table view state */
    setTableView: Function;

    /** Style the Tooltip component */
    sx?: object;
}

/**
 * Shows a button that will switch between a list view and grid view icon.
 * This component will set the tableView prop to true if it is currently in
 * the table view, or else it will set the state to false. The displayed
 * icon will be opposite and have the tooltip "Switch to [list/grid] view".
 */
const ViewSwitcher = (props: ViewSwitcherProps) => {
    // When the view toggle button is clicked, reverse the tableView value
    const toggleView = () => {
        props.setTableView(!props.tableView);
    };

    useEffect(() => {
        // If the URL contains the view query parameter, set the tableView state to that value
        if (getParams('view') === 'table') props.setTableView(true);
    }, []);

    return (
        <Tooltip title={`Switch to ${props.tableView ? 'grid' : 'table'} view`} sx={props.sx}>
            <IconButton onClick={toggleView} size="large">
                {props.tableView ? <AppsRoundedIcon /> : <ListRoundedIcon />}
            </IconButton>
        </Tooltip>
    );
};

export default ViewSwitcher;
