import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getSavedVolunteeringList } from '../../redux/selectors';
import { getVolunteering } from '../../functions/api';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Loading from '../shared/loading';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
        },
    },
    gridRoot: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    buttonCenter: {
        margin: 'auto',
    },
}));

/**
 * Displays a single event.
 * This component takes in the event ID as a parameter.
 *
 * @param {object} props React props object
 * @param {string} props.id ID of the event
 */
const EventDisplay = (props) => {
    const [volunteering, setVolunteering] = useState(null);
    const [error, setError] = useState(null);
    const volunteeringList = useSelector(getSavedVolunteeringList);
    const classes = useStyles();

    useEffect(async () => {
        if (props.id === null) return;

        // Check if the event list exists to pull from
        // If not, then pull the event from the backend
        let volunteering = null;
        if (volunteeringList === null) {
            const res = await getVolunteering(props.id);
            if (res.status === 200) volunteering = res.data;
        } else {
            const foundEvent = volunteeringList.find((e) => e.id === props.id);
            if (foundEvent !== undefined) volunteering = foundEvent;
        }

        // Save the event or set an error if invalid ID
        if (volunteering === null) {
            setError(
                <Loading error>
                    Invalid volunteering ID. Please return to the volunteering list page to refresh the content
                </Loading>
            );
        } else setVolunteering(volunteering);
    }, [props.id]);

    return (
        <React.Fragment>
            {error}
            {volunteering === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container className={classes.root}>
                    <Card>
                        <CardContent>
                            <Box className={classes.gridRoot}>
                                <Typography>{volunteering.name}</Typography>
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button size="medium" className={classes.buttonCenter}>
                                Edit
                            </Button>
                        </CardActions>
                    </Card>
                </Container>
            )}
        </React.Fragment>
    );
};

export default EventDisplay;
