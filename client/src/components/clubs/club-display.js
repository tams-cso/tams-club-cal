import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { getSavedClubList } from '../../redux/selectors';
import { getClub } from '../../functions/api';
import { darkSwitchGrey, getParams } from '../../functions/util';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Loading from '../shared/loading';
import Image from '../shared/image';
import Paragraph from '../shared/paragraph';
import ExecCard from './exec-card';
import CommitteeCard from './committee-card';
import AddButton from '../shared/add-button';

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
    imageWrapper: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    image: {
        width: '100%',
        height: 'auto',
    },
    textWrapper: {
        padding: 20,
    },
    clubType: {
        color: theme.palette.primary.main,
    },
    independent: {
        color: theme.palette.secondary.main,
    },
    description: {
        marginTop: 12,
        color: darkSwitchGrey(theme),
    },
    links: {
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    tabs: {
        marginTop: 12,
    },
    tabPage: {
        paddingTop: 12,
    },
    hidden: {
        display: 'none',
    },
    empty: {
        textAlign: 'center',
        marginBottom: 12,
        color: darkSwitchGrey(theme),
    },
    buttonCenter: {
        margin: 'auto',
    },
}));

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
    const clubList = useSelector(getSavedClubList);
    const history = useHistory();
    const classes = useStyles();

    const back = () => {
        const prevView = getParams('view');
        history.push(`/clubs${prevView ? `?view=${prevView}` : ''}`);
    };

    useEffect(async () => {
        if (props.id === null) return;

        // Check if the event list exists to pull from
        // If not, then pull the event from the backend
        let club = null;
        if (clubList === null) {
            const res = await getClub(props.id);
            if (res.status === 200) club = res.data;
        } else {
            const foundEvent = clubList.find((e) => e.id === props.id);
            if (foundEvent !== undefined) club = foundEvent;
        }

        // Save the event or set an error if invalid ID
        if (club === null) {
            setError(
                <Loading error>Invalid event ID. Please return to the clubs list page to refresh the content</Loading>
            );
        } else setClub(club);
    }, [props.id]);

    useEffect(() => {
        if (club === null) return;
        setLinks(
            club.links.map((c) => (
                <Link href={c} variant="body1" className={classes.links} key={c}>
                    {c}
                </Link>
            ))
        );
    }, [club]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <React.Fragment>
            {error}
            {club === null ? (
                error ? null : (
                    <Loading />
                )
            ) : (
                <Container className={classes.root}>
                    <AddButton color="secondary" path={`/edit/clubs?id=${club.id}`} edit />
                    <Card>
                        <CardMedia className={classes.imageWrapper}>
                            <Image className={classes.image} src={club.coverImg} default="/default-cover.webp" />
                        </CardMedia>
                        <CardContent className={classes.textWrapper}>
                            <Typography className={`${classes.clubType} ${club.advised ? '' : classes.independent}`}>
                                {club.advised ? 'Advised' : 'Independent'}
                            </Typography>
                            <Typography variant="h1">{club.name}</Typography>
                            <Paragraph text={club.description} className={classes.description} />
                            <Typography variant="h6">Links</Typography>
                            {links}
                            <Tabs
                                centered
                                value={tabValue}
                                onChange={handleTabChange}
                                indicatorColor="secondary"
                                textColor="secondary"
                                aria-label="execs and committees tab"
                                className={classes.tabs}
                            >
                                <Tab label="Execs"></Tab>
                                <Tab label="Committees"></Tab>
                            </Tabs>
                            <Paper
                                elevation={0}
                                variant="outlined"
                                square
                                className={`${classes.tabPage} ${tabValue === 0 ? '' : classes.hidden}`}
                            >
                                {club.execs.length === 0 ? (
                                    <Typography className={classes.empty}>No execs...</Typography>
                                ) : (
                                    club.execs.map((e) => <ExecCard exec={e} key={e.name}></ExecCard>)
                                )}
                            </Paper>
                            <Paper
                                elevation={0}
                                variant="outlined"
                                square
                                className={`${classes.tabPage} ${tabValue === 1 ? '' : classes.hidden}`}
                            >
                                {club.committees.length === 0 ? (
                                    <Typography className={classes.empty}>No committees...</Typography>
                                ) : (
                                    club.committees.map((c) => (
                                        <CommitteeCard committee={c} key={c.name}></CommitteeCard>
                                    ))
                                )}
                            </Paper>
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

export default ClubDisplay;
