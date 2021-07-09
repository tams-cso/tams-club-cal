import React, { useEffect, useRef, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Club } from '../../functions/entries';
import { darkSwitch } from '../../functions/util';

import Image from '../shared/image';
import { makeStyles } from '@material-ui/core';

const dims = {
    width: 360,
    height: 400,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: dims.width,
        height: dims.height,
        margin: 'auto',
        [theme.breakpoints.down('xs')]: {
            width: 320,
        }
    },
    actionArea: {
        width: dims.width,
        height: dims.height,
        [theme.breakpoints.down('xs')]: {
            width: 320,
        }
    },
    image: {
        width: dims.width,
        height: 150,
        top: 0,
        [theme.breakpoints.down('xs')]: {
            width: 320,
            height: 130
        }
    },
    text: {
        position: 'absolute',
        top: 150,
        padding: 20,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.down('xs')]: {
            top: 130,
            height: 270,
        }
    },
    advised: {
        color: theme.palette.primary.main,
    },
    independent: {
        color: theme.palette.secondary.main,
    },
    description: {
        flexShrink: 1,
        overflow: 'hidden',
        height: 'initial',
        display: '-webkit-box !important',
        ['-webkit-box-orient']: 'vertical',
        color: darkSwitch(theme, theme.palette.grey[600], theme.palette.grey[400]),
        marginTop: 8,
    },
    descXL: {
        ['-webkit-line-clamp']: 7,
    },
    descL: {
        ['-webkit-line-clamp']: 6,
    },
    descM: {
        ['-webkit-line-clamp']: 5,
    },
    descS: {
        ['-webkit-line-clamp']: 3,
    },
    descXS: {
        ['-webkit-line-clamp']: 1,
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
    const [descHeight, setDescHeight] = useState(null);

    useEffect(() => {
        if (descHeight !== null) return;
        // Use the height (initial) of the remaining flexbox
        // to determine how many lines of the description to show
        const h = description.current.clientHeight;
        console.log(h);
        if (h >= 160) setDescHeight(classes.descXL);
        else if (h >= 144) setDescHeight(classes.descL);
        else if (h >= 114) setDescHeight(classes.descM);
        else if (h >= 70) setDescHeight(classes.descS);
        else setDescHeight(classes.descXS);
    }, []);

    return (
        <Card className={classes.root}>
            <CardActionArea className={classes.actionArea}>
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
                    <Typography variant="h6" component="h2">
                        {props.club.name}
                    </Typography>
                    <Typography className={`${classes.description} ${descHeight || ''}`} ref={description}>
                        {props.club.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ClubCard;
