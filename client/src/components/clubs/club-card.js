import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import { darkSwitchGrey } from '../../functions/util';
import { Club } from '../../functions/entries';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Image from '../shared/image';

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
        height: 250,
        padding: 16,
        paddingTop: 12,
    },
    advised: {
        color: theme.palette.primary.main,
    },
    independent: {
        color: theme.palette.secondary.main,
    },
    title: {
        overflow: 'hidden',
        display: '-webkit-box !important',
        ['-webkit-box-orient']: 'vertical',
        ['-webkit-line-clamp']: 2,
    },
    description: {
        flexShrink: 1,
        height: 'initial',
        marginTop: 8,
        overflow: 'hidden',
        display: '-webkit-box !important',
        ['-webkit-box-orient']: 'vertical',
        ['-webkit-line-clamp']: 5,
        color: darkSwitchGrey(theme),
    },
}));

/**
 * A card displaying the image and basic info for a club
 *
 * @param {object} props React props object
 * @param {Club} props.club Club object
 */
const ClubCard = (props) => {
    const classes = useStyles();
    const description = useRef();

    return (
        <Card className={classes.root}>
            <CardActionArea className={classes.actionArea}>
                <NavLink to={`/clubs?id=${props.club.id}`} className={`${classes.actionArea} ${classes.navLink}`}>
                    <CardMedia>
                        <Image
                            className={classes.image}
                            src={props.club.coverImgThumbnail}
                            default="/default-cover.webp"
                        />
                    </CardMedia>
                    <CardContent className={classes.text}>
                        <Typography
                            variant="subtitle2"
                            className={props.club.advised ? classes.advised : classes.independent}
                        >
                            {props.club.advised ? 'Advised' : 'Independent'}
                        </Typography>
                        <Typography variant="h6" component="h2" className={classes.title}>
                            {props.club.name}
                        </Typography>
                        <Typography className={`${classes.description}`}>{props.club.description}</Typography>
                    </CardContent>
                </NavLink>
            </CardActionArea>
        </Card>
    );
};

export default ClubCard;
