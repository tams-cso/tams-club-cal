import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { getSavedVolunteeringList } from '../../redux/selectors';
import { getVolunteering } from '../../functions/api';
import { darkSwitchGrey, getParams } from '../../functions/util';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Loading from '../shared/loading';
import FilterList from './filter-list';
import Paragraph from '../shared/paragraph';
import AddButton from '../shared/add-button';
import Title from '../shared/title';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
        [theme.breakpoints.down(1500)]: {
            maxWidth: '75%',
        },
        [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
        },
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        [theme.breakpoints.down('sm')]: {
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
                                <Hidden smDown>
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
