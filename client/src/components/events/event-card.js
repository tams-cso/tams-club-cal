import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Paragraph from '../shared/paragraph';

import { Event } from '../../functions/entries';
import { darkSwitch, formatEventDate, formatEventTime } from '../../functions/util';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: '50%',
    },
    gridRoot: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    gridSide: {
        width: '50%',
        textAlign: 'left',
    },
    gridLeft: {
        padding: 8,
    },
    gridRight: {
        marginLeft: 12,
        padding: '8px 0',
    },
    eventClub: {
        marginBottom: 16,
        color: darkSwitch(theme, theme.palette.grey[600], theme.palette.grey[400]),
    },
    eventType: {
        color: darkSwitch(theme, theme.palette.grey[600], theme.palette.secondary.main),
    },
    buttonCenter: {
        margin: 'auto',
    },
}));

/**
 * An event entry on the home page events list
 *
 * @param {object} props The react properties
 * @param {Event} props.event The events object
 */
const EventCard = (props) => {
    const classes = useStyles();
    return (
        <Container className={classes.root}>
            <Card>
                <CardContent>
                    <Box className={classes.gridRoot}>
                        <Box className={`${classes.gridSide} ${classes.gridLeft}`}>
                            <Typography className={classes.eventType}>{capitalize(props.event.type)}</Typography>
                            <Typography variant="h2" component="h1">
                                {props.event.name}
                            </Typography>
                            <Typography variant="subtitle1" component="p" className={classes.eventClub}>
                                {props.event.club}
                            </Typography>
                            <Typography variant="h3" gutterBottom>
                                {formatEventDate(props.event)}
                            </Typography>
                            <Typography variant="h3">{formatEventTime(props.event)}</Typography>
                        </Box>
                        <Divider orientation="vertical" flexItem />
                        <Paragraph
                            text={props.event.description}
                            className={`${classes.gridSide} ${classes.gridRight}`}
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Button size="medium" className={classes.buttonCenter}>Edit</Button>
                </CardActions>
            </Card>
        </Container>
    );
};

export default EventCard;
