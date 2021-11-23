import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { getClub } from '../../functions/api';
import { darkSwitchGrey, getParams } from '../../functions/util';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Loading from '../shared/loading';
import Image from '../shared/image';
import Paragraph from '../shared/paragraph';
import ExecCard from './exec-card';
import CommitteeCard from './committee-card';
import AddButton from '../shared/add-button';
import Title from '../shared/title';

// Style for "No resource" text
const emptyTextStyle = {
    textAlign: 'center',
    marginBottom: 12,
    color: (theme) => darkSwitchGrey(theme),
};

/**
 * Displays a single club.
 * This component takes in the club ID as a parameter.
 *
 * @param {object} props React props object
 * @param {string} props.id ID of the club
 */
const ClubDisplay = (props) => {
    const [club, setClub] = useState(null);
    const [error, setError] = useState(null);
    const [links, setLinks] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const history = useHistory();

    // Get the club data from the API and set the state variable or error
    useEffect(async () => {
        // If the club ID is not in the URL, do nothing
        if (props.id === null) return;

        // GET the event from the backend by ID
        let club = null;
        const res = await getClub(props.id);
        if (res.status === 200) club = res.data;

        // Save the event or set an error if invalid ID
        // or the get request did not succeed
        if (club === null) {
            setError(
                <Loading error>Invalid event ID. Please return to the clubs list page to refresh the content</Loading>
            );
        } else setClub(club);
    }, [props.id]);

    // When the club data is loaded, create the list of links
    useEffect(() => {
        // If the club is not loaded, do nothing.
        if (club === null) return;

        // Map the links in a club to a link object.
        setLinks(
            club.links.map((link) => (
                <Link
                    href={link}
                    variant="body1"
                    key={link}
                    target="_blank"
                    sx={{
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {link}
                </Link>
            ))
        );
    }, [club]);

    // If the user changes to the committees or execs tab,
    // update the state value to match.
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Return to the previous page, but preserve the view
    // that was paassed in the URL (ie. keep table view)
    const back = () => {
        const prevView = getParams('view');
        history.push(`/clubs${prevView ? `?view=${prevView}` : ''}`);
    };

    return (
        <React.Fragment>
            {/* TODO: Make this "error" and "club === null" fragment more elegant somehow */}
            {error}
            {club === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container sx={{ maxWidth: { xl: '50%', md: '75%', xs: '100%' } }}>
                    <Title resource="clubs" name={club.name} />
                    <AddButton color="secondary" label="Club" path={`/edit/clubs?id=${club.id}`} edit />
                    <Card>
                        <CardMedia
                            sx={{
                                width: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        >
                            <Image
                                src={club.coverImg}
                                default="/default-cover.webp"
                                sx={{ width: '100%', height: 'auto' }}
                            />
                        </CardMedia>
                        <CardContent sx={{ padding: 3 }}>
                            <Typography sx={{ color: club.advised ? 'primary.main' : 'secondary.main' }}>
                                {club.advised ? 'Advised' : 'Independent'}
                            </Typography>
                            <Typography variant="h1">{club.name}</Typography>
                            <Paragraph
                                text={club.description}
                                sx={{ marginTop: 2, color: (theme) => darkSwitchGrey(theme) }}
                            />
                            <Typography variant="h6">Links</Typography>
                            {links}
                            <Tabs
                                centered
                                value={tabValue}
                                onChange={handleTabChange}
                                indicatorColor="secondary"
                                textColor="secondary"
                                aria-label="execs and committees tab"
                                sx={{ marginTop: 3 }}
                            >
                                <Tab label="Execs"></Tab>
                                <Tab label="Committees"></Tab>
                            </Tabs>
                            <Paper
                                elevation={0}
                                variant="outlined"
                                square
                                sx={{ paddingTop: 2, display: tabValue === 0 ? 'block' : 'none' }}
                            >
                                {club.execs.length === 0 ? (
                                    <Typography sx={emptyTextStyle}>No execs...</Typography>
                                ) : (
                                    club.execs.map((e) => <ExecCard exec={e} key={e.name}></ExecCard>)
                                )}
                            </Paper>
                            <Paper
                                elevation={0}
                                variant="outlined"
                                square
                                sx={{ paddingTop: 2, display: tabValue === 1 ? 'block' : 'none' }}
                            >
                                {club.committees.length === 0 ? (
                                    <Typography sx={emptyTextStyle}>No committees...</Typography>
                                ) : (
                                    club.committees.map((c) => (
                                        <CommitteeCard committee={c} key={c.name}></CommitteeCard>
                                    ))
                                )}
                            </Paper>
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

export default ClubDisplay;
