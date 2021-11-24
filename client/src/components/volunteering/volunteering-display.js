import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
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

    // TODO: Remove redux and instead fetch data from backend TT-TT
    // When the volunteering data is loaded, create the list of links
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

    // Return to the previous page, but preserve the view
    // that was paassed in the URL (ie. keep table view)
    const back = () => {
        const prevView = getParams('view');
        history.push(`/volunteering${prevView ? `?view=${prevView}` : ''}`);
    };

    return (
        <React.Fragment>
            {error}
            {volunteering === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container sx={{ maxWidth: { xl: '50%', md: '75%', xs: '100%' } }}>
                    <Title resource="volunteering" name={volunteering.name} />
                    <AddButton
                        color="secondary"
                        label="Volunteering"
                        path={`/edit/volunteering?id=${volunteering.id}`}
                        edit
                    />
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { lg: 'row', xs: 'column' },
                                }}
                            >
                                <Box
                                    sx={{
                                        flexBasis: '50%',
                                        flexShrink: 0,
                                        flexGrow: 1,
                                        paddingRight: 12,
                                    }}
                                >
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            fontSize: '1.1rem',
                                            color: volunteering.filters.open ? 'primary.main' : 'error.main',
                                        }}
                                    >
                                        {volunteering.filters.open ? 'Open' : 'Closed'}
                                    </Typography>
                                    <Typography variant="h2">{volunteering.name}</Typography>
                                    <Typography variant="subtitle1" sx={{ color: (theme) => darkSwitchGrey(theme) }}>
                                        {volunteering.club}
                                    </Typography>
                                    <Paragraph text={volunteering.description} />
                                </Box>
                                <Hidden mdDown>
                                    <Divider orientation="vertical" flexItem />
                                </Hidden>
                                <FilterList
                                    filters={volunteering.filters}
                                    sx={{
                                        flexBasis: '50%',
                                        flexShrink: 0,
                                        flexGrow: 1,
                                    }}
                                />
                            </Box>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={back} sx={{ margin: 'auto' }}>
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
