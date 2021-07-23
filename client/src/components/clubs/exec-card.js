import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { darkSwitchGrey } from '../../functions/util';
import { Exec } from '../../functions/entries';

import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import Image from '../shared/image';
import Paragraph from '../shared/paragraph';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: 12,
        paddingTop: 0,
        display: 'flex',
        flexDirection: 'row',
    },
    image: {
        marginRight: 12,
        flexBasis: '20%',
        flexShrink: 0,
        height: 'min-content',
    },
    name: {
        fontSize: '1.75rem',
        lineHeight: 1.1,
        [theme.breakpoints.down('sm')]: {
            fontSize: '1.1rem',
        },
    },
    position: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.85rem',
        },
    },
    description: {
        color: darkSwitchGrey(theme),
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.75rem',
        },
    },
    mobileDescription: {
        padding: '0 12px 12px',
    }
}));

/**
 * Displays the information for an exec of a club
 *
 * @param {object} props React props object
 * @param {Exec} props.exec The exec to display
 * @returns
 */
const ExecCard = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Box className={classes.root}>
                <Image
                    className={classes.image}
                    src={props.exec.img}
                    alt="profile pic"
                    default="/default-profile.webp"
                    raised
                ></Image>
                <Box className="exec-card-info">
                    <Typography variant="h2" className={classes.name}>
                        {props.exec.name}
                    </Typography>
                    <Typography variant="subtitle1" className={classes.position}>
                        {props.exec.position}
                    </Typography>
                    <Hidden smDown>
                        <Paragraph text={props.exec.description} className={classes.description} />
                    </Hidden>
                </Box>
            </Box>
            <Hidden mdUp>
                <Paragraph
                    text={props.exec.description}
                    className={`${classes.description} ${classes.mobileDescription}`}
                    fontSize="0.75rem"
                />
            </Hidden>
        </React.Fragment>
    );
};

export default ExecCard;
