import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { getParams } from '../../functions/util';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
    },
}));

const EditEvents = () => {
    const [id, setId] = useState(null);
    const location = useLocation();
    const classes = useStyles();

    useEffect(() => {
        // Extract ID from url search params
        const id = getParams('id');

        // Set the ID state variable
        if (id === null) setId('');
        else setId(id);
    }, [location]);

    return (
        <React.Fragment>
            <Typography variant="h1" className={classes.title}>
                Edit Event
            </Typography>

        </React.Fragment>
    );
};

export default EditEvents;
