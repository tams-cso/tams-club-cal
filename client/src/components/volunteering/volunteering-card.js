import React from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { darkSwitchGrey } from '../../functions/util';
import { Volunteering } from '../../functions/entries';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FilterList from './filter-list';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    actionArea: {
        display: 'block',
    },
    navLink: {
        textDecoration: 'none',
        color: 'unset',
    },
    image: {
        top: 0,
    },
    text: {
        height: 350,
        padding: 16,
        paddingTop: 12,
    },
    open: {
        fontSize: '1.1rem',
        color: theme.palette.primary.main,
    },
    closed: {
        color: theme.palette.error.main,
    },
    name: {
        overflow: 'hidden',
        display: '-webkit-box !important',
        ['-webkit-box-orient']: 'vertical',
        ['-webkit-line-clamp']: 2,
        fontSize: '1.5rem',
    },
    club: {
        color: darkSwitchGrey(theme),
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    description: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
}));

/**
 * A card displaying the image and basic info for a club
 *
 * @param {object} props React props object
 * @param {Volunteering} props.volunteering Volunteering object
 */
const VolunteeringCard = (props) => {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardActionArea className={classes.actionArea}>
                <NavLink
                    to={`/volunteering?id=${props.volunteering.id}`}
                    className={`${classes.actionArea} ${classes.navLink}`}
                >
                    <CardContent className={classes.text}>
                        <Typography
                            variant="subtitle2"
                            className={`${classes.open} ${props.volunteering.filters.open ? '' : classes.closed}`}
                        >
                            {props.volunteering.filters.open ? 'Open' : 'Closed'}
                        </Typography>
                        <Typography variant="h6" component="h2" className={classes.name}>
                            {props.volunteering.name}
                        </Typography>
                        <Typography variant="subtitle1" className={classes.club}>
                            {props.volunteering.club}
                        </Typography>
                        <Typography className={classes.description}>{props.volunteering.description}</Typography>
                        <FilterList filters={props.volunteering.filters} />
                    </CardContent>
                </NavLink>
            </CardActionArea>
        </Card>
    );
};

export default VolunteeringCard;
