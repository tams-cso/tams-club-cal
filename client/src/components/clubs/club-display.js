import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { getSavedClubList } from '../../redux/selectors';
import { getClub } from '../../functions/api';

import Loading from '../shared/loading';
import Image from '../shared/image';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
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
        padding: 16,
        paddingTop: 12,
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
    const clubList = useSelector(getSavedClubList);
    const classes = useStyles();

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
                <Loading error="true">
                    Invalid event ID. Please return to the events list page to refresh the content
                </Loading>
            );
        } else setClub(club);
    }, [props.id]);

    return (
        <React.Fragment>
            {error}
            {club === null ? (
                <Loading />
            ) : (
                <Container className={classes.root}>
                    <Card>
                        <CardMedia className={classes.imageWrapper}>
                            <Image className={classes.image} src={club.coverImg} default="/default-cover.webp" />
                        </CardMedia>
                        <CardContent className={classes.textWrapper}>
                            <Typography variant="h1">{club.name}</Typography>
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

export default ClubDisplay;
