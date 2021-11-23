import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { getSavedVolunteeringList } from '../../redux/selectors';
import { getVolunteering } from '../../functions/api';
import { darkSwitchGrey, getParams } from '../../functions/util';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Hidden from '@mui/material/Hidden';
import Loading from '../shared/loading';
import FilterList from './filter-list';
import Paragraph from '../shared/paragraph';
import AddButton from '../shared/add-button';
import Title from '../shared/title';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        [theme.breakpoints.down(undefined)]: {
            maxWidth: '75%',
        },
        [theme.breakpoints.down('lg')]: {
            maxWidth: '100%',
        },
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
        },
    },
    side: {
        flexBasis: '50%',
        flexShrink: 0,
        flexGrow: 1,
    },
    left: {
        paddingRight: 12,
    },
    open: {
        fontSize: '1.1rem',
        color: theme.palette.primary.main,
    },
    closed: {
        color: theme.palette.error.main,
    },
    club: {
        color: darkSwitchGrey(theme),
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
    const history = useHistory();
    const classes = useStyles();

    const back = () => {
        const prevView = getParams('view');
        history.push(`/volunteering${prevView ? `?view=${prevView}` : ''}`);
    };

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
                    <Title resource="volunteering" name={volunteering.name} />
                    <AddButton
                        color="secondary"
                        label="Volunteering"
                        path={`/edit/volunteering?id=${volunteering.id}`}
                        edit
                    />
                    <Card>
                        <CardContent>
                            <Box className={classes.container}>
                                <Box className={`${classes.side} ${classes.left}`}>
                                    <Typography
                                        variant="subtitle2"
                                        className={`${classes.open} ${volunteering.filters.open ? '' : classes.closed}`}
                                    >
                                        {volunteering.filters.open ? 'Open' : 'Closed'}
                                    </Typography>
                                    <Typography variant="h2">{volunteering.name}</Typography>
                                    <Typography variant="subtitle1" className={classes.club}>
                                        {volunteering.club}
                                    </Typography>
                                    <Paragraph text={volunteering.description} />
                                </Box>
                                <Hidden mdDown>
                                    <Divider orientation="vertical" flexItem />
                                </Hidden>
                                <FilterList filters={volunteering.filters} className={classes.side} />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button size="small" className={classes.buttonCenter} onClick={back}>
                                Back
                            </Button>
                        </CardActions>
                    </Card>
                </Container>
            )}
        </React.Fragment>
    );
};

export default EventDisplay;
